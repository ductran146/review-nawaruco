// index.html only: the live website preview + comment sidebar (pin
// picking, composer, replies, resolve/reopen). Sign-in (email + OTP) lives
// here too, since pages.html / owner/overview.html redirect back to this
// screen instead of showing their own login form.
//
// Shared identity/data helpers ($, config, node, SUPABASE_READY, sb,
// loadComments, subscribeRealtime, reviewPages, pageRecords, resolveSession)
// come from shell-core.js, loaded before this file.
const frame = $('preview');
function projectPageUrl(relPath) { return new URL('project/' + relPath.replace(/^\/+/, ''), location.href).href; }
function goToPage(relPath) {
 const url = new URL(location.href);
 url.searchParams.set('page', relPath);
 history.pushState({}, '', url);
 frame.src = projectPageUrl(relPath);
}
window.addEventListener('popstate', () => {
 const p = new URLSearchParams(location.search).get('page');
 frame.src = p ? projectPageUrl(p) : config.entry;
});
let myEmail = '', myRole = null, viewRole = 'reviewer', identityPreview = false, pendingEmail = '';
let records = [], page = '', status = 'open', picking = false, pending = null, width = 1440, height = 900;
let floating = null, selectedId = null, replyTo = null;
function canComment() { return myRole === 'owner' || myRole === 'reviewer'; }
function canEditComment(c) { return canComment() && c.author === myEmail; }
async function saveCommentEdit(c, newContent) {
 newContent = newContent.trim();
 if (!newContent && !(c.attachments && c.attachments.length)) return false;
 if (!SUPABASE_READY) { $('hint').textContent = 'Chế độ xem thử — chưa nối Supabase nên không lưu được thay đổi thật.'; return false; }
 const { error } = await sb.from('comments').update({ content: newContent }).eq('id', c.id);
 if (error) { $('hint').textContent = 'Không lưu được: ' + error.message; return false; }
 c.content = newContent;
 return true;
}

// Shared "attach image" control reused by the 3 comment-entry surfaces
// (main composer, note-popup new comment, note-popup reply). Handles
// picking a file, pasting an image from the clipboard, a thumbnail strip
// with per-image remove, and compresses+uploads everything on submit.
function createAttachPicker(hintTarget, onChange) {
 const items = [];
 const strip = node('div', undefined, 'attach-strip'); strip.hidden = true;
 const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.multiple = true; fileInput.hidden = true;
 const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'attach-btn'; btn.append(iconEl('image'), document.createTextNode('Ảnh'));
 btn.setAttribute('aria-label', 'Đính kèm ảnh');
 function renderStrip() {
  strip.replaceChildren(); strip.hidden = !items.length;
  items.forEach((it, i) => {
   const thumb = node('span', undefined, 'attach-thumb');
   const im = document.createElement('img'); im.src = it.previewUrl; im.alt = '';
   const rm = document.createElement('button'); rm.type = 'button'; rm.setAttribute('aria-label', 'Bỏ ảnh này'); rm.append(iconEl('close'));
   rm.onclick = () => { items.splice(i, 1); renderStrip(); };
   thumb.append(im, rm); strip.append(thumb);
  });
  if (onChange) onChange();
 }
 function addFiles(fileList) {
  for (const file of fileList) {
   if (!file.type || !file.type.startsWith('image/')) continue;
   if (items.length >= MAX_ATTACHMENTS) { if (hintTarget) hintTarget.textContent = `Tối đa ${MAX_ATTACHMENTS} ảnh mỗi bình luận.`; break; }
   items.push({ file, previewUrl: URL.createObjectURL(file) });
  }
  renderStrip();
 }
 btn.onclick = () => fileInput.click();
 fileInput.onchange = () => { addFiles(fileInput.files); fileInput.value = ''; };
 function attachPasteTo(el) {
  el.addEventListener('paste', e => {
   const files = [...(e.clipboardData && e.clipboardData.items || [])].filter(i => i.kind === 'file' && i.type.startsWith('image/')).map(i => i.getAsFile()).filter(Boolean);
   if (files.length) addFiles(files);
  });
 }
 async function uploadAll() {
  const out = [];
  for (const it of items) out.push(await uploadCommentAttachment(it.file));
  return out;
 }
 function reset() { items.length = 0; renderStrip(); }
 function hasItems() { return items.length > 0; }
 return { btn, strip, fileInput, attachPasteTo, uploadAll, reset, hasItems };
}

// Small full-screen viewer for a clicked attachment thumbnail.
function renderAttachmentStrip(list) {
 const wrap = node('div', undefined, 'comment-attachments');
 list.forEach(a => {
  const img = document.createElement('img'); img.src = a.url; img.alt = a.name || ''; img.loading = 'lazy';
  img.onclick = e => { e.stopPropagation(); openLightbox(a.url); };
  wrap.append(img);
 });
 return wrap;
}
function openLightbox(url) {
 const overlay = node('div', undefined, 'image-lightbox');
 const img = document.createElement('img'); img.src = url; img.alt = '';
 overlay.append(img);
 overlay.onclick = () => overlay.remove();
 document.body.append(overlay);
}

const params = new URLSearchParams(location.search);
const initialPage = params.get('page');
let jumpCommentId = params.get('comment');
const nextParam = params.get('next');

async function refreshComments() { records = await loadComments(); render(); }

async function applyIdentity(identity, justSignedIn) {
 myEmail = identity.email; myRole = identity.role; identityPreview = !!identity.preview;
 viewRole = myRole === 'owner' ? 'owner' : 'reviewer';
 // Owner mặc định luôn thấy panel "Các trang" ngay khi vào — không cần
 // bấm mở. Reviewer vẫn giữ hành vi cũ (panel đóng, tự bấm mở khi cần).
 if (viewRole === 'owner') pagesPanelOpen(true);
 $('overviewLink').hidden = viewRole !== 'owner';
 $('emailForm').hidden = true; $('otpForm').hidden = true;
 $('identity').hidden = false; $('signedEmail').textContent = myEmail + (identityPreview ? ' (xem thử)' : '');
 cancel();
 $('hint').textContent = !SUPABASE_READY ? 'Chế độ xem thử — chưa nối Supabase nên bình luận sẽ không được lưu thật.'
  : canComment() ? 'Bạn có thể viết góp ý chung hoặc chọn một vị trí cụ thể.'
  : 'Email này chưa được cấp quyền bình luận cho dự án này. Liên hệ chủ dự án.';
 records = await loadComments(); render();
 subscribeRealtime(refreshComments);
 if (nextParam) {
  const wantsOwner = nextParam.startsWith('owner/');
  // Must actually have SOME role (owner or reviewer) to go anywhere via
  // ?next= — not just be signed in. A signed-in email with no row in
  // project_members resolves to role: null; earlier this still passed
  // through for non-owner destinations (e.g. "pages.html"), which pages.js
  // 's own requireAuth() then rejected (no role at all) and bounced back
  // here with the same ?next=, looping forever between the two pages.
  const authorized = !!myRole && (!wantsOwner || myRole === 'owner');
  if (authorized) { location.href = nextParam; return; }
  // Not privileged enough for the page that sent us here — drop the
  // stale ?next= so this doesn't redirect again on every reload and
  // bounce forever between the two pages.
  history.replaceState(null, '', location.pathname);
 } else if (justSignedIn && myRole === 'owner') {
  // Owner's first landing after entering the code: take them straight to
  // the dashboard. Only on this one transition — not on every later
  // reload/visit — so the "Website" nav link can still bring them back
  // here afterwards (e.g. to pin a comment) without being bounced away
  // again.
  location.href = rootPath('owner/overview.html');
  return;
 }
}
$('emailForm').onsubmit = async e => {
 e.preventDefault(); const email = $('email').value.trim().toLowerCase();
 if (!SUPABASE_READY) { $('emailHint').textContent = 'Chưa cấu hình Supabase — xem supabase/SETUP.md. (Thêm ?preview=owner hoặc ?preview=reviewer vào địa chỉ để xem thử giao diện.)'; return; }
 $('emailHint').textContent = 'Đang gửi mã…';
 const { error } = await sb.auth.signInWithOtp({ email });
 if (error) { $('emailHint').textContent = 'Không gửi được mã: ' + error.message; return; }
 pendingEmail = email; $('emailForm').hidden = true; $('otpForm').hidden = false; $('otpEmail').textContent = email; $('otpCode').value = ''; $('otpHint').textContent = ''; $('otpCode').focus();
};
$('otpBack').onclick = () => { $('otpForm').hidden = true; $('emailForm').hidden = false; $('emailHint').textContent = ''; };
$('otpForm').onsubmit = async e => {
 e.preventDefault(); const token = $('otpCode').value.trim();
 $('otpHint').textContent = 'Đang xác nhận…';
 const { error } = await sb.auth.verifyOtp({ email: pendingEmail, token, type: 'email' });
 if (error) { $('otpHint').textContent = 'Mã không đúng hoặc đã hết hạn: ' + error.message; return; }
 await applyIdentity(await resolveSession(), true);
};
$('changeEmail').onclick = async () => {
 if (SUPABASE_READY && !identityPreview) await sb.auth.signOut();
 myEmail = ''; myRole = null; identityPreview = false; cancel(); $('content').value = ''; resizeContent();
 $('identity').hidden = true; $('emailForm').hidden = false; $('otpForm').hidden = true; $('email').value = ''; $('emailHint').textContent = '';
 $('composer').hidden = true; $('overviewLink').hidden = true;
 records = []; render(); $('email').focus();
};

// widthMode tracks which device tab is active — a number (1440/768/390)
// for the fixed-size presets, or the string 'fullwidth' for the mode that
// fills the whole stage (site is responsive, so no fixed px makes sense).
let widthMode = 1440;
let fullwidthRestoreSidebar = false, fullwidthRestorePages = false;
function isMobileChromeless() { return window.innerWidth <= 800; }
function viewport() {
 const stage = $('stage');
 if (isMobileChromeless()) {
  // Mobile viewers get no review-shell chrome at all (header/sidebar are
  // hidden via CSS) -- the frame fills #stage exactly with no gap/shadow/
  // radius so it reads as the real site's own mobile view, not a "preview
  // inside a tool".
  width = stage.clientWidth;
  height = stage.clientHeight;
  $('frameBox').style.cssText = `width:${width}px;height:${height}px;transform:scale(1)`;
 } else if (widthMode === 'fullwidth') {
  width = Math.max(320, stage.clientWidth - 8);
  height = Math.max(320, stage.clientHeight - 8);
  $('frameBox').style.cssText = `width:${width}px;height:${height}px;transform:scale(1)`;
 } else {
  const scale = Math.min(1, (stage.clientWidth - 8) / width);
  if (widthMode === 1440) {
   // Desktop fills the stage's full height. NOTE: transform:scale() is
   // purely visual and does not affect layout/overflow math, so we must
   // NOT divide by scale here -- doing so inflates the pre-transform
   // (layout) height whenever scale < 1, which is what was causing the
   // phantom vertical scrollbar on #stage. Use the plain stage height.
   height = Math.max(320, stage.clientHeight - 8);
  }
  $('frameBox').style.cssText = `width:${width}px;height:${height}px;transform:scale(${scale})`;
 }
 document.querySelectorAll('[data-width]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.width === String(widthMode))));
}
function sidebar(open) { $('sidebar').hidden = !open; $('toggle').setAttribute('aria-expanded', String(open)); if (!open) cancel(); }
$('toggle').onclick = () => sidebar($('sidebar').hidden);
$('close').onclick = () => sidebar(false);
// Fullwidth ẩn cả 2 panel (không cần thiết khi đang xem site tràn hết
// chiều rộng) và nhớ lại trạng thái cũ để mở lại đúng như trước khi rời
// khỏi Fullwidth. Việc tự tay ẩn panel ở Desktop/Tablet/Mobile không kéo
// theo đổi sang Fullwidth — 2 việc độc lập với nhau.
document.querySelectorAll('[data-width]').forEach(b => b.onclick = () => {
 const dw = b.dataset.width;
 if (dw === 'fullwidth') {
  if (widthMode === 'fullwidth') return;
  fullwidthRestoreSidebar = !$('sidebar').hidden;
  fullwidthRestorePages = !$('pagesPanel').hidden;
  sidebar(false); pagesPanelOpen(false);
  widthMode = 'fullwidth';
 } else {
  if (widthMode === 'fullwidth') {
   if (fullwidthRestoreSidebar) sidebar(true);
   if (fullwidthRestorePages) pagesPanelOpen(true);
  }
  widthMode = +dw; width = widthMode; height = width === 390 ? 844 : width === 768 ? 1024 : 900;
 }
 viewport();
});
window.addEventListener('resize', viewport);

// Lines up the header's "Các trang" icon with the collapse icon inside
// the panel it opens — the panel itself stays put (that position is the
// standard one); it's the header icon that needs to move to match it.
// Measured, not guessed, since the icon's real x depends on the
// logo/title's width. Skipped on the mobile layout, where the header
// wraps onto its own row and this alignment doesn't apply.
function alignPagesToggle() {
 const toggle = $('pagesToggle'), closeBtn = $('pagesPanelClose'), panel = $('pagesPanel');
 if (!toggle || toggle.hidden || window.innerWidth <= 800) return;
 // The panel (and its collapse icon) is only laid out while visible —
 // when it's currently closed, briefly reveal it to measure, then hide
 // it straight back before the browser ever paints that frame, so
 // nothing flashes on screen.
 const wasHidden = panel.hidden;
 if (wasHidden) panel.hidden = false;
 toggle.style.marginLeft = '';
 const toggleRect = toggle.getBoundingClientRect();
 const closeRect = closeBtn.getBoundingClientRect();
 if (wasHidden) panel.hidden = true;
 if (!closeRect.width) return; // still nothing to measure — bail out rather than guess
 const delta = (closeRect.left + closeRect.width / 2) - (toggleRect.left + toggleRect.width / 2);
 toggle.style.marginLeft = delta + 'px';
}
window.addEventListener('resize', alignPagesToggle);

function pagesPanelOpen(open) { $('pagesPanel').hidden = !open; }
$('pagesToggle').onclick = () => pagesPanelOpen($('pagesPanel').hidden);
$('pagesPanelClose').onclick = () => pagesPanelOpen(false);
// Shift+A toggles the left pages panel, Shift+C toggles the right
// comments panel — both no-ops while typing in a field, and both need a
// resolved role first (nothing to toggle before that).
window.addEventListener('keydown', e => {
 if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
 const key = e.key.toLowerCase();
 if (key !== 'a' && key !== 'c') return;
 const t = document.activeElement;
 if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
 if (!myRole) return;
 e.preventDefault();
 if (key === 'a') pagesPanelOpen($('pagesPanel').hidden);
 else sidebar($('sidebar').hidden);
});
function renderPagesPanel() {
 const btn = $('pagesToggle');
 btn.hidden = !myRole;
 if (!myRole) { pagesPanelOpen(false); return; }
 alignPagesToggle();
 const isOwner = viewRole === 'owner';
 // Owner thấy toàn bộ trang (kể cả trang chưa ai bình luận). Reviewer chỉ
 // thấy những trang ĐÃ có bình luận — vừa cho họ cái nhìn tổng quan đã
 // comment gì/ở đâu, vừa không lộ danh sách đầy đủ các file HTML nội bộ
 // (component/partial...) mà chưa ai bình luận tới thì sẽ không xuất hiện.
 const allPages = reviewPages();
 const pages = isOwner ? allPages : allPages.filter(p => pageRecords(records, p).length > 0);
 $('pagesPanelTitle').textContent = isOwner ? 'Các trang' : 'Trang đã bình luận';
 // Chỉ owner mới cần thấy dòng thống kê (số trang/số bình luận) — khách
 // hàng (reviewer) chỉ cần danh sách trang, không cần số liệu tổng quan.
 $('pagesPanelSummary').hidden = !isOwner;
 $('pagesPanelSummary').textContent = isOwner
  ? pages.length + ' trang HTML · ' + records.filter(c => c.status === 'open').length + ' bình luận đang mở'
  : '';
 const list = $('pagesPanelList'); list.replaceChildren();
 for (const p of pages) {
  const row = document.createElement('button'); row.type = 'button';
  row.className = 'page-row' + ('/' + p.path === page ? ' current' : '');
  const name = node('span'); name.append(iconEl('fileText'), node('strong', p.path));
  row.append(name);
  const count = isOwner ? pageRecords(records, p).filter(c => c.status === 'open').length : pageRecords(records, p).length;
  row.append(node('span', String(count), 'page-badge'));
  row.onclick = () => { goToPage(p.path); renderPagesPanel(); };
  list.append(row);
 }
 if (!pages.length) list.append(node('p', isOwner ? 'Chưa có trang nào được import.' : 'Bạn chưa bình luận trang nào.', 'empty'));
}

let pickerUI = null;
function clearPicker() {
 if (pickerUI?.overlay) pickerUI.overlay.remove();
 if (pickerUI) { pickerUI.box.remove(); pickerUI.dot.remove(); pickerUI.style.remove(); pickerUI = null; }
}
function reportPreviewError(error) {
 console.error('Review position picker:', error);
 if (location.protocol === 'file:') {
   $('hint').textContent='Bạn đang mở trực tiếp file HTML. Hãy mở bản xem thử qua địa chỉ bên dưới để chọn vị trí.';
   const link=document.createElement('a');link.href='http://localhost:4173/';link.textContent='Mở Review System tại localhost:4173';link.style.display='block';$('hint').append(link);
 } else if (!frame.contentDocument) {
   $('hint').textContent='Không truy cập được nội dung website. Trang preview cần cùng địa chỉ gốc với Review System.';
 } else if (!frame.contentDocument.body) {
   $('hint').textContent='Website chưa tải xong. Chờ trang hiển thị rồi chọn vị trí lại.';
 } else {
   $('hint').textContent='Lỗi chọn vị trí: '+error.message;
 }
}
function startPicker() {
 const doc = frame.contentDocument;
 const style = doc.createElement('style');
 style.textContent = 'html, html * { cursor: crosshair !important; }';
 const box = doc.createElement('div'), dot = doc.createElement('div');
 box.dataset.reviewPicker = ''; dot.dataset.reviewPicker = '';
 box.style.cssText = 'all:initial;position:fixed;pointer-events:none;z-index:2147483646;border:2px solid #3155df;background:#3155df12;box-sizing:border-box;display:none;';
 dot.style.cssText = 'all:initial;position:fixed;pointer-events:none;z-index:2147483647;width:28px;height:28px;border:2px solid white;border-radius:50%;background:#3155df;color:white;text-align:center;font:600 20px/28px system-ui;box-shadow:0 2px 10px #0004;display:none;';
 dot.textContent = '+';
 doc.head.append(style); doc.body.append(box, dot);
 const overlay = document.createElement('div');
 overlay.className='pick-surface'; overlay.setAttribute('aria-label','Bấm trên website để đặt bình luận');
 document.body.append(overlay); pickerUI = {box, dot, style, overlay};
 function targetAt(e) {
   const bounds=frame.getBoundingClientRect(), scale=bounds.width/frame.contentWindow.innerWidth;
   const x=(e.clientX-bounds.left)/scale, y=(e.clientY-bounds.top)/scale;
   return {target:doc.elementFromPoint(x,y),clientX:x,clientY:y,preventDefault:()=>e.preventDefault(),stopImmediatePropagation:()=>e.stopImmediatePropagation()};
 }
 overlay.addEventListener('pointermove',e=>{const point=targetAt(e);if(point.target)hoverPicker(point);});
 overlay.addEventListener('pointerleave',hideHover);
 overlay.addEventListener('click',e=>{const point=targetAt(e);if(point.target)select(point);});
 overlay.addEventListener('wheel',e=>{e.preventDefault();frame.contentWindow.scrollBy(e.deltaX,e.deltaY);hideHover();},{passive:false});
 positionPicker();
}
function hoverPicker(e) {
 if (!picking || !pickerUI) return;
 const rect = e.target.getBoundingClientRect();
 Object.assign(pickerUI.box.style, {display:'block',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
 Object.assign(pickerUI.dot.style, {display:'block',left:(e.clientX-14)+'px',top:(e.clientY-14)+'px'});
}
function positionPicker() {
 if(!pickerUI?.overlay)return;
 const r=frame.getBoundingClientRect(),stage=$('stage').getBoundingClientRect();
 const left=Math.max(r.left,stage.left),top=Math.max(r.top,stage.top),right=Math.min(r.right,stage.right,innerWidth),bottom=Math.min(r.bottom,stage.bottom,innerHeight);
 Object.assign(pickerUI.overlay.style,{left:left+'px',top:top+'px',width:Math.max(0,right-left)+'px',height:Math.max(0,bottom-top)+'px'});
}
function hideHover() { if (pickerUI) { pickerUI.box.style.display='none'; pickerUI.dot.style.display='none'; } }
function renderDraftPin() {
 const doc = frame.contentDocument;
 doc.querySelectorAll('[data-review-draft]').forEach(el=>el.remove());
 if (!pending) return;
 const pin = doc.createElement('div'); pin.dataset.reviewDraft=''; pin.textContent='+';
 pin.style.cssText='all:initial;position:fixed;pointer-events:none;z-index:2147483647;width:28px;height:28px;border:2px solid white;border-radius:50%;background:#3155df;color:white;text-align:center;font:600 20px/28px system-ui;box-shadow:0 0 0 5px #3155df33,0 2px 10px #0004;';
 doc.body.append(pin); positionPins();
}
function cancel() { resetReply(); closeFloating(); picking = false; pending = null; clearPicker(); composerAttach.reset(); try { frame.contentDocument.querySelectorAll('[data-review-draft]').forEach(el=>el.remove()); } catch {} $('composer').hidden = !canComment(); $('selection').hidden = true; $('cancel').hidden=true; $('pinLabel').textContent = 'Chọn vị trí trên website'; try { frame.contentDocument.documentElement.style.cursor = ''; } catch {} $('hint').textContent = ''; $('content').value = ''; resizeContent(); }
$('cancel').onclick = () => { cancel(); sidebar(true); };
$('pin').onclick = () => { if (!canComment()) return; cancel(); selectedId=null; sidebar(true); try { frame.contentDocument.documentElement.style.cursor = 'crosshair'; picking = true; $('cancel').hidden=false; startPicker(); $('pinLabel').textContent = 'Đang chọn vị trí…'; $('hint').textContent = 'Bấm vào phần tử muốn góp ý. Nhấn Esc để hủy chọn vị trí.'; } catch (error) { picking=false; clearPicker(); $('pinLabel').textContent='Chọn vị trí trên website'; reportPreviewError(error); } };
window.addEventListener('keydown', e => { if (e.key === 'Escape') { cancel(); sidebar(true); } });
document.querySelectorAll('[data-status]').forEach(b => b.onclick = () => { status = b.dataset.status; render(); });
function selectorFor(el) { if (el.id) return '#' + CSS.escape(el.id); const parts = []; while (el && el.tagName !== 'HTML') { const tag = el.tagName.toLowerCase(); const siblings = [...el.parentElement.children].filter(x => x.tagName === el.tagName); parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(el)+1})`); el = el.parentElement; } return parts.join(' > '); }
function getPage() { const url = new URL(frame.contentWindow.location.href); const root = new URL('project/', location.href).pathname; return url.pathname.startsWith(root) ? '/' + url.pathname.slice(root.length) + (config.queryScope ? url.search : '') : url.pathname; }
function select(e) {
 if (!picking || e.target.closest('[data-review-pin]')) return;
 e.preventDefault(); e.stopImmediatePropagation();
 const el = e.target, rect = el.getBoundingClientRect(), doc = frame.contentDocument, win = frame.contentWindow;
 pending = { selector: selectorFor(el), elementText: el.textContent.trim().slice(0,180), offsetX: (e.clientX-rect.left)/Math.max(rect.width,1), offsetY: (e.clientY-rect.top)/Math.max(rect.height,1), x: (e.clientX+win.scrollX)/doc.documentElement.scrollWidth, y: (e.clientY+win.scrollY)/doc.documentElement.scrollHeight, viewport: {width:win.innerWidth,height:win.innerHeight}, device:width<600?'mobile':width<1000?'tablet':'desktop' };
 picking = false; clearPicker(); renderDraftPin(); doc.documentElement.style.cursor = '';
 $('selection').hidden = false; $('cancel').hidden=false; $('selection').textContent = 'Vị trí: ' + (pending.elementText.slice(0,70) || pending.selector);
 $('pinLabel').textContent = 'Chọn lại vị trí'; openFloating(pending);
}
async function submitComment(content, attachments) {
 attachments = attachments || [];
 content=content.trim(); if(!canComment() || (!content && !attachments.length) || picking)return false;
 if(!SUPABASE_READY){cancel();sidebar(true);render();$('hint').textContent='Chế độ xem thử — chưa nối Supabase nên không lưu được bình luận thật.';return false;}
 const payload={project_id:config.projectId,version:config.version,page,author_email:myEmail,content,status:'open',
  selector:pending?.selector||null,element_text:pending?.elementText||null,offset_x:pending?.offsetX??null,offset_y:pending?.offsetY??null,
  pos_x:pending?.x??null,pos_y:pending?.y??null,viewport_width:width,viewport_height:height,device:width<600?'mobile':width<1000?'tablet':'desktop',
  attachments};
 const {data,error}=await sb.from('comments').insert(payload).select('*, comment_replies(*)').single();
 if(error){$('hint').textContent='Không gửi được bình luận: '+error.message;return false;}
 records.push(fromRow(data));
 $('content').value=''; resizeContent(); status='open'; cancel(); sidebar(true); selectedId=data.id; render();
 $('hint').textContent='Đã gửi bình luận. Bấm bình luận trong danh sách để xem lại vị trí.';
 return true;
}
function resetReply(){replyTo=null;$('replyContext').hidden=true;$('pin').hidden=false;$('content').placeholder='Viết bình luận cho trang này…';}
function startReply(c){cancel();replyTo=c.id;selectedId=c.id;sidebar(true);$('replyContext').hidden=false;$('replyLabel').textContent='Trả lời '+c.author;$('pin').hidden=true;$('content').value='';resizeContent();$('content').placeholder='Viết trả lời…';render();$('content').focus();}
$('cancelReply').onclick=()=>{resetReply();$('content').value='';resizeContent();$('content').focus();};
const composerAttach = createAttachPicker($('hint'));
$('composerAttachTools').append(composerAttach.btn, composerAttach.fileInput);
$('composerAttachTools').insertAdjacentElement('beforebegin', composerAttach.strip);
composerAttach.attachPasteTo($('content'));
$('composer').onsubmit=async e=>{
 e.preventDefault();
 const content=$('content').value.trim();
 if(!canComment()||(!content&&!composerAttach.hasItems()))return;
 $('sendComment').disabled=true;
 try{
  let attachments=[];
  if(composerAttach.hasItems()){$('hint').textContent='Đang tải ảnh lên…';attachments=await composerAttach.uploadAll();}
  if(replyTo){
   if(!SUPABASE_READY){$('hint').textContent='Chế độ xem thử — chưa nối Supabase nên không lưu được trả lời thật.';return;}
   const c=records.find(item=>item.id===replyTo&&item.page===page);if(!c)return;
   const {data,error}=await sb.from('comment_replies').insert({comment_id:c.id,author_email:myEmail,content,attachments}).select().single();
   if(error){$('hint').textContent='Không gửi được trả lời: '+error.message;return;}
   c.replies.push({author:myEmail,content,createdAt:data.created_at,attachments});
   resetReply();$('content').value='';resizeContent();composerAttach.reset();render();
   $('comments').querySelector('[data-comment-id="'+c.id+'"]')?.scrollIntoView({block:'nearest'});
  }else if(await submitComment(content,attachments)){
   composerAttach.reset();
   $('comments').scrollTop=$('comments').scrollHeight;
  }
 }catch(err){$('hint').textContent='Không tải được ảnh: '+err.message;}
 finally{$('sendComment').disabled=false;}
};
function resizeContent(){$('content').style.height='auto';$('content').style.height=$('content').scrollHeight+'px';}
$('content').addEventListener('input',resizeContent);
$('content').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&!e.isComposing){e.preventDefault();$('composer').requestSubmit();}});
function closeFloating(){if(floating){floating.panel.remove();floating=null;}}
function anchorPoint(c){
 const doc=frame.contentDocument,win=frame.contentWindow;let el;try{el=doc.querySelector(c.selector);}catch{}
 if(el){const r=el.getBoundingClientRect();return {x:r.left+r.width*c.offsetX,y:r.top+r.height*c.offsetY};}
 return {x:c.x*doc.documentElement.scrollWidth-win.scrollX,y:c.y*doc.documentElement.scrollHeight-win.scrollY};
}
function positionFloating(){
 if(!floating)return;
 const point=anchorPoint(floating.anchor),r=frame.getBoundingClientRect(),scale=r.width/frame.contentWindow.innerWidth;
 const x=r.left+point.x*scale,y=r.top+point.y*scale,panel=floating.panel;
 const side=$('sidebar');const limit=!side.hidden && innerWidth>800?side.getBoundingClientRect().left-12:innerWidth-12;
 const panelWidth=Math.min(360,innerWidth-24);panel.style.width=panelWidth+'px';
 let left=x+20;if(left+panelWidth>limit)left=x-panelWidth-20;
 panel.style.left=Math.max(12,Math.min(left,innerWidth-panelWidth-12))+'px';
 panel.style.top=Math.max(12,Math.min(y+18,innerHeight-panel.offsetHeight-12))+'px';
}
function openFloating(anchor,record=null){
 closeFloating();const panel=node('section',undefined,'note-popup');panel.setAttribute('role','dialog');panel.setAttribute('aria-label',record?'Chi tiết bình luận':'Bình luận tại vị trí đã chọn');
 const head=node('div',undefined,'note-head'),title=node('strong',record?'Bình luận':'Bình luận tại đây'),close=document.createElement('button');close.className='icon-only';close.append(iconEl('closeX'));close.type='button';close.setAttribute('aria-label','Đóng ô bình luận');
 close.onclick=()=>{if(record)closeFloating();else{cancel();sidebar(true);}};
 if(record){
  const actions=node('div',undefined,'note-head-actions');
  if(viewRole==='owner'){
   const resolveBtn=document.createElement('button');resolveBtn.type='button';resolveBtn.className='icon-only';
   const label=record.status==='open'?'Đã giải quyết':'Mở lại';
   resolveBtn.setAttribute('aria-label',label);resolveBtn.title=label;resolveBtn.append(iconEl(record.status==='open'?'check':'restart'));
   resolveBtn.onclick=async()=>{
    if(!SUPABASE_READY){$('hint').textContent='Chế độ xem thử — chưa nối Supabase nên không lưu được trạng thái thật.';return;}
    const next=record.status==='open'?'resolved':'open';
    const patch=next==='resolved'?{status:'resolved',resolved_at:new Date().toISOString(),resolved_by:myEmail}:{status:'open',resolved_at:null,resolved_by:null};
    const {error}=await sb.from('comments').update(patch).eq('id',record.id);
    if(error){$('hint').textContent='Không cập nhật được: '+error.message;return;}
    record.status=next;render();openFloating(record,record);
   };
   actions.append(resolveBtn);
  }
  actions.append(close);head.append(title,actions);
 } else { head.append(title,close); }
 panel.append(head);
 let renderPopupBody=()=>{}, startPopupEdit=()=>{};
 if(record){
  const authorRow=node('div',undefined,'note-author-row');
  const avatar=node('span',avatarLetter(record.author),'avatar');avatar.style.background=avatarColor(record.author);
  const infoCol=node('div',undefined,'note-author-info');
  infoCol.append(node('strong',record.author),node('span',timeAgo(record.createdAt),'note-time'));
  authorRow.append(avatar,infoCol);
  if(canEditComment(record)){
   const editBtn=document.createElement('button');editBtn.type='button';editBtn.className='note-edit-btn';editBtn.setAttribute('aria-label','Sửa bình luận');editBtn.title='Sửa bình luận';editBtn.append(iconEl('edit'));
   editBtn.onclick=()=>startPopupEdit();
   authorRow.append(editBtn);
  }
  panel.append(authorRow);
  const bodyWrap=node('div',undefined,'note-body-wrap');
  renderPopupBody=()=>{
   bodyWrap.replaceChildren();
   if(record.content)bodyWrap.append(node('p',record.content,'body compact'));
   if(record.attachments&&record.attachments.length)bodyWrap.append(renderAttachmentStrip(record.attachments));
  };
  startPopupEdit=()=>{
   bodyWrap.replaceChildren();
   const form=node('form',undefined,'edit-comment-form');
   const ta=document.createElement('textarea');ta.value=record.content;ta.maxLength=4000;
   const actionsRow=node('div',undefined,'edit-comment-actions');
   const cancelBtn=document.createElement('button');cancelBtn.type='button';cancelBtn.textContent='Hủy';
   const saveBtn=node('button','Lưu','primary');saveBtn.type='submit';
   actionsRow.append(cancelBtn,saveBtn);form.append(ta,actionsRow);bodyWrap.append(form);
   ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);
   cancelBtn.onclick=()=>renderPopupBody();
   form.onsubmit=async ev=>{
    ev.preventDefault();saveBtn.disabled=true;
    const ok=await saveCommentEdit(record,ta.value);
    saveBtn.disabled=false;
    if(ok){render();openFloating(record,record);}else renderPopupBody();
   };
  };
  renderPopupBody();panel.append(bodyWrap);
  for(const r of record.replies){
   const row=node('div',undefined,'note-author-row reply-row');
   const av=node('span',avatarLetter(r.author),'avatar');av.style.background=avatarColor(r.author);
   const info=node('span',undefined,'reply-info');info.append(node('strong',r.author),node('span',timeAgo(r.createdAt),'note-time'));
   row.append(av,info);panel.append(row);
   if(r.content)panel.append(node('p',r.content,'body compact reply-body'));
   if(r.attachments&&r.attachments.length)panel.append(renderAttachmentStrip(r.attachments));
  }
  if(canComment()){
   const replyForm=node('form',undefined,'note-reply-form');
   const box=node('div',undefined,'composer-box');
      const replyInput=document.createElement('textarea');replyInput.rows=1;replyInput.placeholder='Trả lời…';replyInput.setAttribute('aria-label','Trả lời bình luận');replyInput.maxLength=4000;
   const sendBtn=document.createElement('button');sendBtn.type='submit';sendBtn.className='send-btn icon-only';sendBtn.disabled=true;sendBtn.setAttribute('aria-label','Gửi trả lời');sendBtn.append(iconEl('arrowLeft'));
   const replyAttach=createAttachPicker(null,()=>{sendBtn.disabled=!replyInput.value.trim()&&!replyAttach.hasItems();});
   // Auto-grow the field's height as the reply wraps onto more lines,
   // instead of scrolling inside a fixed-size box.
   function resizeReplyInput(){replyInput.style.height='auto';replyInput.style.height=replyInput.scrollHeight+'px';}
   replyInput.addEventListener('input',()=>{sendBtn.disabled=!replyInput.value.trim()&&!replyAttach.hasItems();resizeReplyInput();});
   replyInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();replyForm.requestSubmit();}});
   const toolsRow=node('div',undefined,'composer-box-tools');
   toolsRow.append(replyAttach.btn,replyAttach.fileInput,sendBtn);
   box.append(replyAttach.strip,replyInput,toolsRow);
   replyForm.append(box);
   replyAttach.attachPasteTo(replyInput);
   replyForm.onsubmit=async e=>{
    e.preventDefault();const content=replyInput.value.trim();if(!content&&!replyAttach.hasItems())return;
    if(!SUPABASE_READY){$('hint').textContent='Chế độ xem thử — chưa nối Supabase nên không lưu được trả lời thật.';return;}
    sendBtn.disabled=true;
    try{
     let attachments=[];
     if(replyAttach.hasItems())attachments=await replyAttach.uploadAll();
     const {data,error}=await sb.from('comment_replies').insert({comment_id:record.id,author_email:myEmail,content,attachments}).select().single();
     if(error){$('hint').textContent='Không gửi được trả lời: '+error.message;return;}
     record.replies.push({author:myEmail,content,createdAt:data.created_at,attachments});
     replyInput.value='';resizeReplyInput();replyAttach.reset();render();openFloating(record,record);
    }catch(err){$('hint').textContent='Không tải được ảnh: '+err.message;}
    finally{sendBtn.disabled=false;}
   };
   panel.append(replyForm);
  }
 } else {
  const form=node('form'),input=node('textarea');input.setAttribute('aria-label','Nội dung tại vị trí');input.placeholder='Viết góp ý tại vị trí này…';input.maxLength=4000;input.value=$('content').value;
  const help=node('p','Enter để gửi · Shift + Enter xuống dòng','note-help');
  const error=node('p','','note-error');error.setAttribute('role','status');
  const box=node('div',undefined,'composer-box');
  const send=document.createElement('button');send.type='submit';send.className='send-btn icon-only';send.setAttribute('aria-label','Gửi bình luận');send.append(iconEl('arrowLeft'));
  const noteAttach=createAttachPicker(error);
  const toolsRow=node('div',undefined,'composer-box-tools');toolsRow.append(noteAttach.btn,noteAttach.fileInput,send);
  box.append(noteAttach.strip,input,toolsRow);
  form.append(box,help,error);panel.append(form);
  noteAttach.attachPasteTo(input);
  form.onsubmit=async e=>{
   e.preventDefault();
   if(!input.value.trim()&&!noteAttach.hasItems()){error.textContent='Nhập nội dung hoặc đính kèm ảnh.';return;}
   send.disabled=true;
   try{
    let attachments=[];
    if(noteAttach.hasItems()){error.textContent='Đang tải ảnh lên…';attachments=await noteAttach.uploadAll();}
    if(!(await submitComment(input.value,attachments)))error.textContent='Chưa gửi được. Kiểm tra nội dung và thử lại.';
   }catch(err){error.textContent='Không tải được ảnh: '+err.message;}
   finally{send.disabled=false;}
  };
  input.addEventListener('input',()=>{$('content').value=input.value;resizeContent();});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();form.requestSubmit();}if(e.key==='Escape'){e.preventDefault();cancel();sidebar(true);}});
 }
 document.body.append(panel);floating={panel,anchor};positionFloating();if(!record)panel.querySelector('textarea').focus();
}
function focusRecord(c) { selectedId=c.id; render(); if (!c.selector) {closeFloating();return;} openFloating(c,c); const doc=frame.contentDocument; let el; try { el=doc.querySelector(c.selector); } catch {} if (el) el.scrollIntoView({block:'center',behavior:'smooth'}); else frame.contentWindow.scrollTo({top:c.y*doc.documentElement.scrollHeight-height/2,behavior:'smooth'}); }
function finishJump(){
 if(!jumpCommentId)return;
 const c=records.find(r=>r.id===jumpCommentId && r.page===page);
 if(!c)return; // wait for matching page/comments to finish loading
 jumpCommentId=null; status=c.status; render(); focusRecord(c);
 $('comments').querySelector('[data-comment-id="'+c.id+'"]')?.scrollIntoView({block:'nearest'});
}
function render() {
 const all=records.filter(c=>c.page===page); $('count').textContent=all.filter(c=>c.status==='open').length;
 document.querySelectorAll('[data-status]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.status===status)); b.innerHTML=(b.dataset.status==='open'?icon('unresolved'):icon('check'))+`${b.dataset.status==='open'?'Đang mở':'Đã giải quyết'} (${all.filter(c=>c.status===b.dataset.status).length})`;});
 $('comments').replaceChildren();
 all.filter(c=>c.status===status).forEach(c=>{
 const card=node('article',undefined,'card'), top=node('div',undefined,'card-top'), pin=node('button',String(records.indexOf(c)+1),'number'); pin.onclick=()=>focusRecord(c);card.dataset.commentId=c.id;card.classList.toggle('selected',selectedId===c.id);card.addEventListener('click',e=>{if(!e.target.closest('button,input,textarea,form'))focusRecord(c);}); if (!c.selector) { pin.textContent='—'; pin.title='Bình luận chung cho trang'; }
 top.append(pin,node('strong',c.author));
 const meta=node('div',undefined,'meta');
 const deviceLabel=c.device?c.device.charAt(0).toUpperCase()+c.device.slice(1):'';
 if(deviceLabel)meta.append(node('span',deviceLabel,'device-chip'));
 meta.append(document.createTextNode(new Date(c.createdAt).toLocaleDateString('vi-VN')));
 card.append(top,meta);
 const bodyWrap=node('div',undefined,'card-body-wrap');
 function renderCardBody(){
  bodyWrap.replaceChildren();
  if(c.content)bodyWrap.append(node('p',c.content,'body'));
  if(c.attachments&&c.attachments.length)bodyWrap.append(renderAttachmentStrip(c.attachments));
 }
 renderCardBody();card.append(bodyWrap);
 // Vị trí kỹ thuật (selector/element text) không hiển thị nữa — bấm vào
 // thẻ bình luận đã tự nhảy đến đúng vị trí (focusRecord), hiển thị lại là
 // thừa. Vẫn giữ dòng phân biệt "bình luận chung" cho trường hợp không ghim.
 if(!c.selector) card.append(node('div','Bình luận chung cho trang','meta'));
 const resolve=document.createElement('button'); resolve.append(iconEl(c.status==='open'?'check':'restart'),document.createTextNode(c.status==='open'?'Đã giải quyết':'Mở lại')); resolve.onclick=async()=>{if(viewRole!=='owner'||!canComment())return;if(!SUPABASE_READY){$('hint').textContent='Chế độ xem thử — chưa nối Supabase nên không lưu được trạng thái thật.';return;}const old=c.status;const next=old==='open'?'resolved':'open';const patch=next==='resolved'?{status:'resolved',resolved_at:new Date().toISOString(),resolved_by:myEmail}:{status:'open',resolved_at:null,resolved_by:null};const {error}=await sb.from('comments').update(patch).eq('id',c.id);if(error){$('hint').textContent='Không cập nhật được: '+error.message;return;}c.status=next;render();}; resolve.hidden=viewRole!=='owner'; resolve.disabled = !canComment(); card.append(resolve);
 const editBtn=document.createElement('button'); editBtn.append(iconEl('edit'),document.createTextNode('Sửa')); editBtn.setAttribute('aria-label','Sửa bình luận'); editBtn.hidden=!canEditComment(c);
 editBtn.onclick=e=>{
  e.stopPropagation();
  bodyWrap.replaceChildren();
  const form=node('form',undefined,'edit-comment-form');
  const ta=document.createElement('textarea');ta.value=c.content;ta.maxLength=4000;
  const actionsRow=node('div',undefined,'edit-comment-actions');
  const cancelBtn=document.createElement('button');cancelBtn.type='button';cancelBtn.textContent='Hủy';
  const saveBtn=node('button','Lưu','primary');saveBtn.type='submit';
  actionsRow.append(cancelBtn,saveBtn);form.append(ta,actionsRow);bodyWrap.append(form);
  ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);
  cancelBtn.onclick=e2=>{e2.stopPropagation();renderCardBody();};
  form.onsubmit=async ev=>{
   ev.preventDefault();ev.stopPropagation();saveBtn.disabled=true;
   const ok=await saveCommentEdit(c,ta.value);
   saveBtn.disabled=false;
   if(ok)render();else renderCardBody();
  };
 };
 card.append(editBtn);
 c.replies.forEach(r=>{const reply=node('div',undefined,'reply');reply.append(node('strong',r.author));if(r.content)reply.append(node('p',r.content));if(r.attachments&&r.attachments.length)reply.append(renderAttachmentStrip(r.attachments));card.append(reply);});
 const replyButton=document.createElement('button'); replyButton.className='reply-action'; replyButton.append(iconEl('reply'),document.createTextNode('Trả lời')); replyButton.hidden=!canComment(); replyButton.onclick=()=>startReply(c);card.append(replyButton);$('comments').append(card);
 });
 if(!$('comments').children.length)$('comments').append(node('p',status==='open'?'Chưa có bình luận đang mở.':'Chưa có bình luận đã giải quyết.','empty'));
 renderPins();
 renderPagesPanel();
 finishJump();
}
function renderPins() {
 let doc; try { doc=frame.contentDocument; if(!doc?.body)return; } catch{return;}
 doc.querySelectorAll('[data-review-pin]').forEach(p=>p.remove());
 if (isMobileChromeless()) return;
 records.filter(c=>c.page===page&&c.status===status&&c.selector).forEach(c=>{
 const pin=doc.createElement('button');pin.dataset.reviewPin=c.id;pin.textContent=records.indexOf(c)+1;pin.title=c.content;pin.setAttribute('aria-label',`Bình luận ${pin.textContent}: ${c.content}`);pin.style.cssText='position:fixed;z-index:2147483647;width:28px;height:28px;border:2px solid white;border-radius:50%;background:#3155df;color:white;font:600 13px system-ui;box-shadow:0 2px 8px #0003;cursor:pointer;padding:0;';
 if(c.id===selectedId){pin.style.background='#e45123';pin.style.boxShadow='0 0 0 7px #e4512333,0 2px 8px #0003';}
 pin.onclick=e=>{e.preventDefault();e.stopPropagation();sidebar(true);focusRecord(c);};doc.body.append(pin);
 }); positionPins();
}
function positionPins(){try{const doc=frame.contentDocument,win=frame.contentWindow;doc.querySelectorAll('[data-review-pin], [data-review-draft]').forEach(pin=>{const c=pin.hasAttribute('data-review-draft')?pending:records.find(r=>r.id===pin.dataset.reviewPin);if(!c)return;let el;try{el=doc.querySelector(c.selector);}catch{}let x,y;if(el){const r=el.getBoundingClientRect();if(!r.width&&!r.height){pin.hidden=true;return;}x=r.left+r.width*c.offsetX;y=r.top+r.height*c.offsetY;}else{x=c.x*doc.documentElement.scrollWidth-win.scrollX;y=c.y*doc.documentElement.scrollHeight-win.scrollY;}pin.hidden=x<0||y<0||x>win.innerWidth||y>win.innerHeight;pin.style.left=`${x-14}px`;pin.style.top=`${y-14}px`;});}catch{}}
frame.addEventListener('load',()=>{cancel();try{page=getPage();const doc=frame.contentDocument;try{const sb=doc.createElement('style');sb.textContent='html{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;width:0;height:0}';(doc.head||doc.documentElement).appendChild(sb);}catch{}doc.addEventListener('click',select,true);doc.addEventListener('pointermove',hoverPicker,true);doc.addEventListener('pointerleave',hideHover);doc.addEventListener('scroll',hideHover,true);doc.addEventListener('keydown',e=>{if(e.key==='Escape')cancel();});render();}catch(error){reportPreviewError(error);}});
setInterval(()=>{try{const next=getPage();if(next!==page){page=next;cancel();render();}positionPins();positionPicker();positionFloating();}catch{}},80);

frame.src = initialPage ? projectPageUrl(initialPage) : config.entry;
viewport();
if(location.protocol==='file:')reportPreviewError(new Error('Local file cannot provide same-origin iframe access'));
(async function initAuth(){
 const identity = await resolveSession();
 if (identity.signedIn) { await applyIdentity(identity); return; }
 if (!SUPABASE_READY) $('emailHint').textContent='Chưa cấu hình Supabase — xem supabase/SETUP.md. (Thêm ?preview=owner hoặc ?preview=reviewer vào địa chỉ để xem thử giao diện.)';
})();
