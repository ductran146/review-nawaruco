(async function () {
 const identity = await requireAuth('owner'); // redirects non-owners back to index.html
 if (!identity) return;
 renderIdentity(identity);

 const records = await loadComments();
 const pages = reviewPages();
 const scoped = pages.flatMap(p => pageRecords(records, p));
 const open = scoped.filter(c => c.status === 'open').length;

 $('totals').replaceChildren();
 for (const [label, value] of [['Đang mở', open], ['Đã giải quyết', scoped.length - open], ['Trang có phản hồi', pages.filter(p => pageRecords(records, p).length).length]]) {
  const tile = document.createElement('div'); tile.append(node('strong', String(value)), node('span', label)); $('totals').append(tile);
 }

 const pageStats = $('pageStats'); pageStats.replaceChildren();
 for (const p of pages) {
  const list = pageRecords(records, p), n = list.filter(c => c.status === 'open').length, r = list.length - n;
  const row = document.createElement('a'); row.className = 'page-row'; row.href = '../index.html?page=' + encodeURIComponent(p.path);
  const name = node('span'); name.append(iconEl('fileText'), node('span',undefined,'page-name-text')); name.querySelector('.page-name-text').append(node('strong', p.title), node('small', p.path));
  row.append(name, node('span', n + ' đang mở · ' + r + ' đã giải quyết', 'page-count'));
  pageStats.append(row);
 }

 const latest = $('latestComments'); latest.replaceChildren();
 const recent = [...scoped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
 for (const c of recent) {
  const p = pages.find(p => '/' + p.path === c.page);
  const row = document.createElement('a'); row.className = 'feedback-row';
  row.href = '../index.html?page=' + encodeURIComponent(p ? p.path : '') + '&comment=' + encodeURIComponent(c.id);
  row.append(node('small', (p ? p.title : c.page) + ' · ' + c.author + ' · ' + (c.status === 'open' ? 'Đang mở' : 'Đã giải quyết')), node('p', c.content), node('small', new Date(c.createdAt).toLocaleString('vi-VN')));
  latest.append(row);
 }
 if (!recent.length) latest.append(node('p', 'Chưa có phản hồi. Bình luận từ các trang sẽ xuất hiện ở đây.', 'empty'));

 // "Người có thể bình luận" — owner tự thêm khách hàng mới vào dự án này
 // (project_members) ngay tại đây, không cần mở lại tools/import.html hay
 // chạy SQL thủ công. RLS đã cho phép owner insert/update mọi dòng của
 // đúng project_id của mình (xem "owner can manage members" trong
 // supabase/schema.sql) nên không cần đổi gì ở backend.
 let members = [];
 async function loadMembers() {
  if (!SUPABASE_READY) return [];
  const { data, error } = await sb.from('project_members').select('email,role').eq('project_id', config.projectId).order('role');
  if (error) { console.error('loadMembers', error); return []; }
  return data || [];
 }
 async function renderMembers() {
  members = await loadMembers();
  const list = $('memberList'); list.replaceChildren();
  for (const m of members) {
   const row = node('div', undefined, 'member-row');
   row.append(node('span', m.email), node('small', m.role === 'owner' ? 'Owner' : 'Khách hàng'));
   list.append(row);
  }
  if (!members.length) list.append(node('p', 'Chưa có ai được cấp quyền.', 'empty'));
 }
 await renderMembers();

 $('addReviewerForm').onsubmit = async e => {
  e.preventDefault();
  const email = $('newReviewerEmail').value.trim().toLowerCase();
  const hint = $('addReviewerHint');
  hint.textContent = '';
  if (!SUPABASE_READY) { hint.textContent = 'Chế độ xem thử — chưa nối Supabase nên không lưu được.'; return; }
  const existing = members.find(m => m.email === email);
  if (existing && existing.role === 'owner') { hint.textContent = 'Email này đã là Owner của dự án, không cần thêm.'; return; }
  hint.textContent = 'Đang thêm…';
  const { error } = await sb.from('project_members').upsert({ project_id: config.projectId, email, role: 'reviewer' }, { onConflict: 'project_id,email' });
  if (error) { hint.textContent = 'Không thêm được: ' + error.message; return; }
  $('newReviewerEmail').value = '';
  hint.textContent = 'Đã thêm ' + email + ' — họ có thể đăng nhập bằng email này ở trang Website để bình luận.';
  renderMembers();
 };
})();
