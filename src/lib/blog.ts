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

// Eagerly import all markdown files' frontmatter at build time
const frontmatterModules = import.meta.glob("/src/content/blog/**/*.md", {
  as: "raw",
  eager: true,
});

// Lazily import the raw content for dynamic loading
const contentModules = import.meta.glob("/src/content/blog/**/*.md", {
  as: "raw",
  eager: false,
});

// Create a map from file path to post summary. This allows us to associate
// slugs with their original file paths, fixing the issue where slugs defined
// in frontmatter would not resolve to the correct file.
const pathToSummaryMap = new Map<string, BlogPostSummary>();

for (const [path, raw] of Object.entries(frontmatterModules)) {
  if (/\/_template\.md$/.test(path)) continue;

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
    description: attrs.description || "",
    date: attrs.date || new Date().toISOString(),
    category: capitalize(attrs.category || "general"),
    keywords,
    coverImage: attrs.coverImage,
    coverAlt: attrs.coverAlt,
  };
  pathToSummaryMap.set(path, summary);
}

const postSummaries: BlogPostSummary[] = Array.from(pathToSummaryMap.values())
  .sort((a, b) => (a.date < b.date ? 1 : -1));

// Create a reverse map from slug to path for efficient lookups in getPostWithContent.
const slugToPathMap = new Map<string, string>();
for (const [path, summary] of pathToSummaryMap.entries()) {
  slugToPathMap.set(summary.slug, path);
}

export async function getPostWithContent(slug: string): Promise<BlogPost | null> {
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
    // This should not happen if the maps are built correctly
    console.error(`[Blog] Summary not found for slug "${slug}", this is unexpected.`);
    return null;
  }

  return {
    ...summary,
    content,
  };
}

export function getAllPosts(): BlogPostSummary[] {
  return postSummaries;
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
