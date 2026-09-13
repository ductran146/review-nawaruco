(async function () {
 const identity = await requireAuth(); // any signed-in reviewer/owner can browse pages
 if (!identity) return;
 renderIdentity(identity);
 $('overviewLink').hidden = identity.role !== 'owner';

 const records = await loadComments();
 const pages = reviewPages();
 $('pagesSummary').textContent = identity.role === 'owner'
  ? pages.length + ' trang HTML · ' + records.filter(c=>c.status==='open').length + ' bình luận đang mở'
  : pages.length + ' trang HTML để review';

 const list = $('pagesList');
 list.replaceChildren();
 for (const p of pages) {
  const pageRecs = pageRecords(records, p);
  const open = pageRecs.filter(c=>c.status==='open').length, resolved = pageRecs.length - open;
  const row = document.createElement('a');
  row.className = 'page-row'; row.href = 'index.html?page=' + encodeURIComponent(p.path);
  const name = node('span'); name.append(iconEl('fileText'), node('span',undefined,'page-name-text')); name.querySelector('.page-name-text').append(node('strong', p.title), node('small', p.path));
  row.append(name);
  if (identity.role === 'owner') row.append(node('span', open + ' đang mở · ' + resolved + ' đã giải quyết', 'page-count'));
  list.append(row);
 }
 if (!pages.length) list.append(node('p', 'Chưa có trang nào được import.', 'empty'));
})();
