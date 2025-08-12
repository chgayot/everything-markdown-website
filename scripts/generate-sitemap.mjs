import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

async function getBlogPosts() {
  const contentDir = path.resolve(process.cwd(), 'src/content/blog');
  const files = await glob('**/*.md', { cwd: contentDir, ignore: '**/_template.md' });

  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const stats = await fs.stat(filePath);

      return {
        slug: file.replace(/\.md$/, ''),
        lastmod: data.date ? new Date(data.date).toISOString().split('T')[0] : stats.mtime.toISOString().split('T')[0],
      };
    })
  );
}

function generateSitemap(posts, staticPages) {
  const domain = process.env.VITE_SITE_URL || 'https://chgayot.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticPages.forEach(page => {
    xml += `
      <url>
        <loc>${domain}${page.path}</loc>
        <lastmod>${page.lastmod}</lastmod>
      </url>
    `;
  });

  posts.forEach(post => {
    xml += `
      <url>
        <loc>${domain}/blog/${post.slug}</loc>
        <lastmod>${post.lastmod}</lastmod>
      </url>
    `;
  });

  xml += `</urlset>`;
  return xml;
}

async function main() {
  const staticPages = [
    { path: '/', lastmod: new Date().toISOString().split('T')[0] },
    { path: '/blog', lastmod: new Date().toISOString().split('T')[0] },
  ];

  const posts = await getBlogPosts();
  const sitemap = generateSitemap(posts, staticPages);

  await fs.writeFile(path.resolve(process.cwd(), 'public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

main().catch(err => {
    console.error("Error generating sitemap:", err);
    process.exit(1);
});