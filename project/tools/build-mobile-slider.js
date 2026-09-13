const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'outputs', 'slider-mobile-3x4');
const webDir = path.join(root, 'screen', 'images', 'mobile');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(webDir, { recursive: true });

const slides = [
  {
    input: '/Users/tranduc/.codex/generated_images/01a07b33-78e2-71f0-8a26-197d0091cd42/exec-d3f207ef-b949-4584-9a91-baf9c1e8d44d.png',
    file: 'banner-1-gia-dinh-mobile.jpg',
    lines: [
      { text: 'Nước sạch hôm nay', y: 150, size: 62, weight: 700 },
      { text: 'VỮNG BỀN CUỘC SỐNG', y: 232, size: 55, weight: 800 },
      { text: 'MAI SAU', y: 300, size: 74, weight: 900 },
    ],
    fill: '#083B68',
  },
  {
    input: '/Users/tranduc/.codex/generated_images/01a07b33-78e2-71f0-8a26-197d0091cd42/exec-ae89113e-f6a4-4570-81b6-b9fe93690175.png',
    file: 'banner-2-tuong-lai-mobile.jpg',
    lines: [
      { text: 'NGUỒN NƯỚC TRONG LÀNH', y: 150, size: 54, weight: 800 },
      { text: 'ƯƠM MẦM TƯƠNG LAI', y: 224, size: 63, weight: 900 },
    ],
    fill: '#083B68',
  },
  {
    input: '/Users/tranduc/.codex/generated_images/01a07b33-78e2-71f0-8a26-197d0091cd42/exec-69b5c988-40c8-45ea-9c3f-c8fed536c7d8.png',
    file: 'banner-3-van-hanh-mobile.jpg',
    lines: [
      { text: 'VẬN HÀNH TẬN TÂM', y: 150, size: 62, weight: 900 },
      { text: 'CẤP NƯỚC AN TOÀN', y: 228, size: 65, weight: 900 },
    ],
    fill: '#083B68',
  },
];

function escapeXml(value) {
  return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);
}

function overlay(slide) {
  const text = slide.lines.map(line =>
    `<text x="540" y="${line.y}" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="${line.size}" font-weight="${line.weight}" letter-spacing="-1" fill="${slide.fill}">${escapeXml(line.text)}</text>`
  ).join('');
  return Buffer.from(`<svg width="1080" height="1440" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#ffffff" flood-opacity="0.70"/>
      </filter>
    </defs>
    <rect width="1080" height="390" fill="url(#topFade)"/>
    <g filter="url(#shadow)">${text}</g>
    <rect x="440" y="328" width="200" height="7" rx="3.5" fill="#00A8E8" opacity="0.9"/>
  </svg>`);
}

(async () => {
  for (const slide of slides) {
    const original = path.join(outDir, slide.file.replace('.jpg', '-khong-chu.png'));
    fs.copyFileSync(slide.input, original);
    const finalPath = path.join(outDir, slide.file);
    await sharp(slide.input)
      .resize(1080, 1440, { fit: 'cover', position: 'centre' })
      .composite([{ input: overlay(slide), top: 0, left: 0 }])
      .jpeg({ quality: 88, chromaSubsampling: '4:4:4', progressive: true })
      .toFile(finalPath);
    fs.copyFileSync(finalPath, path.join(webDir, slide.file));
  }
})();
