import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  const all = ["All", ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={cn(
            "rounded-full px-3 py-1 text-sm border transition-colors",
            active.toLowerCase() === c.toLowerCase()
              ? "bg-primary text-primary-foreground border-transparent"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          aria-pressed={active.toLowerCase() === c.toLowerCase()}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
