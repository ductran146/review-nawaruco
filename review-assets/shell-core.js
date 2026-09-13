// Shared across index.html / pages.html / owner/overview.html:
// Supabase client, session + role resolution, comment loading, and a
// couple of small render helpers every screen needs.
const $ = id => document.getElementById(id);
const config = window.REVIEW_CONFIG;
const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {};
const SUPABASE_READY = !!(window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.url.includes('YOUR-PROJECT'));
const sb = SUPABASE_READY ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey) : null;

function node(tag, text, cls) { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (cls) el.className = cls; return el; }

// Avatar helpers for author initials/colors — used by the comment popup
// (view.js) to visually distinguish who wrote what, matching the reviewer
// look requested for the "note-popup".
const AVATAR_COLORS = ['#f2994a','#27ae60','#9b51e0','#eb5757','#2f80ed','#c2942c','#2d9cdb','#bb6bd9'];
function avatarColor(text) { text = text || '?'; let h = 0; for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0; return AVATAR_COLORS[h % AVATAR_COLORS.length]; }
function avatarLetter(text) { text = (text || '?').trim(); return text ? text.charAt(0).toUpperCase() : '?'; }
function timeAgo(dateStr) {
 const diffMs = Date.now() - new Date(dateStr).getTime();
 const min = Math.floor(diffMs / 60000), hr = Math.floor(diffMs / 3600000), day = Math.floor(diffMs / 86400000);
 if (min < 1) return 'vừa xong';
 if (min < 60) return min + ' phút trước';
 if (hr < 24) return hr + ' giờ trước';
 if (day < 30) return day + ' ngày trước';
 return new Date(dateStr).toLocaleDateString('vi-VN');
}

// Image attachments: comments/replies can carry pasted/uploaded images,
// stored in Supabase Storage (bucket "comment-images", public read — see
// supabase/schema.sql for the bucket + policy migration this needs, which
// the project owner runs once in the Supabase SQL editor) and referenced
// from the "attachments" jsonb column as [{url, name}].
const ATTACH_BUCKET = 'comment-images';
const MAX_ATTACHMENTS = 4;
const MAX_ATTACHMENT_DIM = 1600;

// Downscales + re-encodes an image file client-side before upload (keeps
// pasted screenshots/photos from clients small) via an off-DOM canvas.
function compressImageFile(file, maxDim, quality) {
 maxDim = maxDim || MAX_ATTACHMENT_DIM; quality = quality || 0.82;
 return new Promise((resolve, reject) => {
  const img = new Image();
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Không đọc được ảnh'));
  reader.onload = () => {
   img.onerror = () => reject(new Error('Ảnh không hợp lệ'));
   img.onload = () => {
    let width = img.naturalWidth, height = img.naturalHeight;
    if (width > maxDim || height > maxDim) {
     const scale = maxDim / Math.max(width, height);
     width = Math.round(width * scale); height = Math.round(height * scale);
    }
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Nén ảnh thất bại')), 'image/jpeg', quality);
   };
   img.src = reader.result;
  };
  reader.readAsDataURL(file);
 });
}

// Compresses + uploads one image file to the comment-images bucket, under
// a folder named after the project id (that folder name is what the
// storage RLS policy checks against project_role()), and returns its
// public URL for storing in the comment/reply row.
async function uploadCommentAttachment(file) {
 if (!SUPABASE_READY) throw new Error('Chưa nối Supabase');
 const blob = await compressImageFile(file);
 const path = `${config.projectId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
 const { error } = await sb.storage.from(ATTACH_BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
 if (error) throw error;
 const { data } = sb.storage.from(ATTACH_BUCKET).getPublicUrl(path);
 return { url: data.publicUrl, name: file.name || 'image.jpg' };
}

function fromRow(row) {
 return { id: row.id, page: row.page, author: row.author_email, content: row.content, status: row.status,
  createdAt: row.created_at, replies: (row.comment_replies||[]).slice().sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(r=>({author:r.author_email, content:r.content, createdAt:r.created_at, attachments: Array.isArray(r.attachments) ? r.attachments : []})),
  viewport: {width: row.viewport_width, height: row.viewport_height}, device: row.device,
  selector: row.selector || undefined, elementText: row.element_text || '',
  offsetX: row.offset_x, offsetY: row.offset_y, x: row.pos_x, y: row.pos_y,
  attachments: Array.isArray(row.attachments) ? row.attachments : [] };
}

async function loadComments() {
 if (!SUPABASE_READY) return [];
 const { data, error } = await sb.from('comments').select('*, comment_replies(*)').eq('project_id', config.projectId).order('created_at', {ascending:true});
 if (error) { console.error('loadComments', error); return []; }
 return (data||[]).map(fromRow);
}

function subscribeRealtime(onChange) {
 if (!SUPABASE_READY) return null;
 return sb.channel('comments-'+config.projectId)
  .on('postgres_changes', {event:'*', schema:'public', table:'comments', filter:`project_id=eq.${config.projectId}`}, onChange)
  .on('postgres_changes', {event:'*', schema:'public', table:'comment_replies'}, onChange)
  .subscribe();
}

// Pages configured for review, excluding anything that looks like a
// reusable partial/component folder (importer already filters most of
// this at import time; this is a defensive second pass).
function reviewPages() {
 return (config.pages||[]).filter(p=>/\.html?$/i.test(p.path)&&!p.path.split('/').some(part=>['components','partials','includes','assets','css','js','images'].includes(part.toLowerCase())));
}
function pageRecords(records, p) { return records.filter(c=>c.page==='/'+p.path); }

// Resolve the caller's identity once per page load: session (if any) and
// their real role from project_members. Every screen calls this before
// rendering anything that depends on who's asking.
async function resolveSession() {
 // ?preview=owner|reviewer simulates an identity without a real session —
 // useful for trying the UI before Supabase is configured, or for testing
 // either role without switching accounts. Checked first so it works
 // regardless of SUPABASE_READY.
 const preview = new URLSearchParams(location.search).get('preview');
 if (preview === 'owner' || preview === 'reviewer') {
  return { signedIn:true, email: preview==='owner' ? 'owner-preview@local' : 'reviewer-preview@local', role: preview, preview:true };
 }
 if (!SUPABASE_READY) return { signedIn:false, email:'', role:null };
 const { data } = await sb.auth.getSession();
 if (!data.session) return { signedIn:false, email:'', role:null };
 const email = (data.session.user.email||'').toLowerCase();
 const { data: memberRow } = await sb.from('project_members').select('role').eq('project_id', config.projectId).eq('email', email).maybeSingle();
 return { signedIn:true, email, role: memberRow ? memberRow.role : null };
}

// Called by pages.html and owner/overview.html (index.html handles its
// own sign-in form instead of redirecting). Sends the visitor back to the
// viewer — with ?next= so index.html can bounce them back here — when
// they're not signed in, or not privileged enough for this screen.
async function requireAuth(minRole) {
 const identity = await resolveSession();
 if (!identity.signedIn || !identity.role || (minRole === 'owner' && identity.role !== 'owner')) {
  // Keep the "owner/" prefix so index.html can send the visitor back to
  // the exact screen (owner/overview.html, not a nonexistent root file).
  const file = location.pathname.split('/').pop();
  const back = location.pathname.includes('/owner/') ? 'owner/' + file : file;
  location.href = rootPath('index.html') + '?next=' + encodeURIComponent(back);
  return null;
 }
 return identity;
}

// owner/overview.html is one folder deeper than index.html/pages.html —
// this keeps links correct regardless of which screen is calling it.
function rootPath(file) { return (location.pathname.includes('/owner/') ? '../' : '') + file; }

function renderIdentity(identity) {
 const box = $('identityBox'); if (!box) return;
 box.hidden = false;
 box.textContent = '';
 box.append(node('span', identity.email + (identity.preview ? ' (xem thử)' : ''), 'identity-email'));
 const out = document.createElement('button'); out.className = 'identity-signout'; out.append(iconEl('logout'), document.createTextNode('Đăng xuất'));
 out.type = 'button';
 out.onclick = async () => { if (SUPABASE_READY && !identity.preview) await sb.auth.signOut(); location.href = rootPath('index.html'); };
 box.append(out);
}
