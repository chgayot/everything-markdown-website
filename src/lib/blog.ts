import fm from "front-matter";

export type BlogFrontmatter = {
  title: string;
  slug?: string;
  description: string;
  date: string; // ISO or YYYY-MM-DD
  category: string; // unique per post
  keywords: string[] | string; // allow comma-separated string in md for convenience
  coverImage?: string;
  coverAlt?: string;
  draft?: boolean;
};

export type BlogPostSummary = {
  slug: string;
  url: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  coverImage?: string;
  coverAlt?: string;
};

export type BlogPost = BlogPostSummary & {
  content: string; // markdown
};

function normalizeKeywords(keywords: BlogFrontmatter["keywords"]): string[] {
  if (Array.isArray(keywords)) {
    return keywords.map(k => k.trim()).filter(Boolean);
  }
  if (typeof keywords === 'string') {
    return keywords.split(',').map(k => k.trim()).filter(Boolean);
  }
  return [];
}

function deriveSlug(path: string, fmSlug?: string) {
  if (fmSlug) return fmSlug;
  const file = path.split("/").pop() || "";
  return file.replace(/\.mdx?$/i, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Use a single dynamic import for all markdown files
const contentModules = import.meta.glob('/src/content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
});

let postSummaries: BlogPostSummary[] = [];
const slugToPathMap = new Map<string, string>();

async function initializePosts(): Promise<BlogPostSummary[]> {
  if (postSummaries.length > 0) {
    return postSummaries;
  }

  const pathToSummaryMap = new Map<string, BlogPostSummary>();

  for (const path in contentModules) {
    if (/\/_template\.md$/.test(path)) continue;

    const raw = await contentModules[path]();
    const parsed = fm<Partial<BlogFrontmatter>>(String(raw));
    const attrs = parsed.attributes || {};
    if (attrs.draft) continue;

    const slug = deriveSlug(path, attrs.slug);
    const url = `/blog/${slug}`;
    const keywords = normalizeKeywords(attrs.keywords || []);

    const summary: BlogPostSummary = {
      slug,
      url,
      title: attrs.title || slug,
      description: attrs.description || '',
      date: attrs.date || new Date().toISOString(),
      category: capitalize(attrs.category || 'general'),
      keywords,
      coverImage: attrs.coverImage,
      coverAlt: attrs.coverAlt,
    };
    pathToSummaryMap.set(path, summary);
    slugToPathMap.set(slug, path);
  }

  postSummaries = Array.from(pathToSummaryMap.values())
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return postSummaries;
}

export async function getPostWithContent(slug: string): Promise<BlogPost | null> {
  if (postSummaries.length === 0) {
    await initializePosts();
  }
  const path = slugToPathMap.get(slug);
  if (!path) {
    console.error(`[Blog] Post with slug "${slug}" not found.`);
    return null;
  }

  const loader = contentModules[path];
  if (!loader) {
    console.error(`[Blog] Content module not found for path: ${path}`);
    return null;
  }

  const raw = await loader();
  const parsed = fm<Partial<BlogFrontmatter>>(String(raw));
  const content = parsed.body || "";

  const summary = getPostBySlug(slug);
  if (!summary) {
    console.error(`[Blog] Summary not found for slug "${slug}", this is unexpected.`);
    return null;
  }

  return {
    ...summary,
    content,
  };
}

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  return initializePosts();
}

export function getPostBySlug(slug: string): BlogPostSummary | undefined {
  return postSummaries.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(postSummaries.map((p) => p.category))).sort();
}

export function getPostsByCategory(cat?: string): BlogPostSummary[] {
  if (!cat || cat.toLowerCase() === "all") return postSummaries;
  return postSummaries.filter(
    (p) => p.category.toLowerCase() === cat.toLowerCase()
  );
}

export function searchPosts(
  posts: BlogPostSummary[],
  query: string
): BlogPostSummary[] {
  if (!query) {
    return posts;
  }

  const lowerCaseQuery = query.toLowerCase();

  return posts.filter((post) => {
    const { title, description, keywords } = post;
    return (
      title.toLowerCase().includes(lowerCaseQuery) ||
      description.toLowerCase().includes(lowerCaseQuery) ||
      keywords.some((keyword) => keyword.toLowerCase().includes(lowerCaseQuery))
    );
  });
}
