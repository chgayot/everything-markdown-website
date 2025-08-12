import SEO from "@/components/SEO";
import { getAllCategories, getAllPosts, getPostsByCategory } from "@/lib/blog";
import { useMemo, useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import BlogList from "@/components/BlogList";

const site = import.meta.env.VITE_SITE_URL;

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState("all");
  const posts = getAllPosts();
  const categories = getAllCategories();
  const filtered = useMemo(() => getPostsByCategory(activeCategory), [activeCategory]);

  return (
    <>
      <SEO
        title={`Blog — ${import.meta.env.VITE_SEO_AUTHOR}`}
        description={import.meta.env.VITE_SEO_DESCRIPTION}
        canonical={`${site}/blog`}
        keywords={[import.meta.env.VITE_SEO_AUTHOR, "blog", ...categories]}
      />
      <main className="py-10">
        <div className="container mx-auto space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          <BlogList posts={filtered} />
        </div>
      </main>
    </>
  );
}
