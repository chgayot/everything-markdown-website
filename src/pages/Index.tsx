import SEO from "@/components/SEO";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategory,
  searchPosts,
} from "@/lib/blog";
import { useMemo, useState, lazy, Suspense, useEffect } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import BlogList from "@/components/BlogList";
import { SearchBar } from "@/components/SearchBar";

// Lazy load components for better performance
const LazyProjectsCarousel = lazy(() => import("@/components/ProjectsCarousel"));

const site = import.meta.env.VITE_SITE_URL;

export default function Index() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof getAllPosts>>>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getAllPosts().then(loadedPosts => {
      setPosts(loadedPosts);
      const loadedCategories = Array.from(new Set(loadedPosts.map(p => p.category))).sort();
      setCategories(loadedCategories);
    });
  }, []);

  const filtered = useMemo(() => {
    const byCategory = posts.filter(p => activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase());
    return searchPosts(byCategory, searchQuery);
  }, [activeCategory, searchQuery, posts]);

  return (
    <>
      <SEO
        title={import.meta.env.VITE_SEO_TITLE}
        description={import.meta.env.VITE_SEO_DESCRIPTION}
        canonical={`${site}/`}
        keywords={(import.meta.env.VITE_SEO_KEYWORDS || "").split(",")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: import.meta.env.VITE_SEO_AUTHOR,
          url: site,
        }}
      />

      <main>
        <section className="relative py-12 sm:py-16 bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto">
            <header className="mb-8 sm:mb-10 text-center">
              <h1 className="font-codex text-4xl sm:text-6xl font-bold text-primary mb-4 transform -rotate-1">
                Charles Henri Gayot
              </h1>
              <p className="font-codex text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
                A codex - engineering notes, discoveries, observations, opinions and experiments.
              </p>
            </header>

            <div className="text-center mb-8">
              <h2 className="font-codex text-3xl font-bold text-primary mb-2 transform -rotate-1">About</h2>
              <div className="w-24 h-0.5 bg-primary/30 mx-auto"></div>
            </div>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Multidisciplinary Engineer at heart - passionate about hardware and software. Firm believer that the world does not need more software - it needs more hardware, but building it should be as easy and fast as software. Serial entrepreneur - having raised 750k€ so far.
              </p>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-codex text-3xl font-bold text-primary mb-2 transform rotate-1">Projects</h2>
              <div className="w-24 h-0.5 bg-primary/30 mx-auto"></div>
            </div>
            <Suspense fallback={<div className="h-48 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading projects...</div>
            </div>}>
              <LazyProjectsCarousel />
            </Suspense>
          </div>
        </section>

        <section className="py-12 border-t border-primary/20">
          <div className="container mx-auto space-y-8">
            <div className="text-center">
              <h2 className="font-codex text-3xl font-bold text-primary mb-2 transform rotate-1">Recent Articles</h2>
              <div className="w-24 h-0.5 bg-primary/30 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="md:col-span-2">
                <CategoryFilter
                  categories={categories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
              </div>
              <div>
                <SearchBar query={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
            <BlogList posts={filtered} />
          </div>
        </section>

        <section className="py-12 border-t border-primary/20">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="font-codex text-2xl font-bold text-primary mb-6 transform -rotate-1">Contact Me</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://linkedin.com/in/gayot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-card/70 backdrop-blur border border-border/60 rounded-lg px-6 py-4 hover:shadow-lg transition-shadow text-muted-foreground hover:text-primary"
                >
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary/80 to-accent/70 shadow-md grid place-items-center text-primary-foreground font-semibold">
                    in
                  </div>
                  <span>Connect on LinkedIn</span>
                </a>
                <a
                  href="mailto:charles@stepupsolutions.dk"
                  className="inline-flex items-center gap-3 bg-card/70 backdrop-blur border border-border/60 rounded-lg px-6 py-4 hover:shadow-lg transition-shadow text-muted-foreground hover:text-primary"
                >
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary/80 to-accent/70 shadow-md grid place-items-center text-primary-foreground font-semibold">
                    @
                  </div>
                  <span>Email Me</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
