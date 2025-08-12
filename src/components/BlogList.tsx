import { useMemo, useState } from "react";
import { BlogPostSummary } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export function BlogList({ posts, pageSize = 6 }: { posts: BlogPostSummary[]; pageSize?: number }) {
  const [visible, setVisible] = useState(pageSize);
  const visiblePosts = useMemo(() => posts.slice(0, visible), [posts, visible]);
  const hasMore = visible < posts.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {visiblePosts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisible((v) => v + pageSize)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors shadow-lg"
          >
            Reveal More Entries
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogList;
