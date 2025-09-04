/*
  Generates public/robots.txt and public/sitemap.xml from package.json "homepage".
  Ensures a single source of truth for public URLs across deployments.
*/
const fs = require('fs');
const path = require('path');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function isValidUrl(u) {
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

const root = path.join(__dirname, '..');
const pkg = readJSON(path.join(root, 'package.json'));
const homepage = pkg.homepage || '';

if (!homepage || !isValidUrl(homepage)) {
  console.log('[generate-public-meta] No valid homepage in package.json; skipping updates.');
  process.exit(0);
}

const site = homepage.replace(/\/+$/, '');
const robotsPath = path.join(root, 'public', 'robots.txt');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;

const today = new Date().toISOString().split('T')[0];
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>\n`;

function writeIfChanged(targetPath, nextContent) {
  try {
    const prev = fs.readFileSync(targetPath, 'utf8');
    if (prev === nextContent) return;
  } catch (_) {}
  fs.writeFileSync(targetPath, nextContent, 'utf8');
}

writeIfChanged(robotsPath, robotsContent);
writeIfChanged(sitemapPath, sitemapContent);

console.log(`[generate-public-meta] Updated robots.txt and sitemap.xml for ${site}`);
