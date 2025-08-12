import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function generateRobotsTxt() {
  const siteUrl = process.env.VITE_SITE_URL;
  if (!siteUrl) {
    console.warn('VITE_SITE_URL is not defined in your .env file. Skipping sitemap in robots.txt.');
    return;
  }

  const robotsContent = `
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
  `.trim();

  const publicDir = path.resolve(process.cwd(), 'public');
  await fs.writeFile(path.join(publicDir, 'robots.txt'), robotsContent);

  console.log('robots.txt generated successfully!');
}

generateRobotsTxt().catch(err => {
  console.error("Error generating robots.txt:", err);
  process.exit(1);
});