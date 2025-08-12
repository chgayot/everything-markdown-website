import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BlogPostSummary } from "@/lib/blog";
import { format } from "date-fns";

export function BlogCard({ post }: { post: BlogPostSummary }) {
  const dateLabel = (() => {
    try {
      return format(new Date(post.date), "MMM d, yyyy");
    } catch {
      return post.date;
    }
  })();

  return (
    <Link to={post.url} className="block group">
      <article className="border-l-4 border-primary/30 pl-6 py-4 hover:border-primary/60 transition-colors bg-gradient-to-r from-background to-background/50 hover:from-primary/5 hover:to-primary/10 rounded-r-lg">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
          <time className="text-sm text-muted-foreground">{dateLabel}</time>
        </div>
        <h3 className="font-codex text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {post.description}
        </p>
      </article>
    </Link>
  );
}

export default BlogCard;
