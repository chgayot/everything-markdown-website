import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { getPostBySlug, getPostWithContent, BlogPost } from "@/lib/blog";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const site = import.meta.env.VITE_SITE_URL;

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2 h-8 w-8 p-0 bg-muted/50 hover:bg-muted"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
};

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#f8f4e6',
            primaryTextColor: '#2c2416',
            primaryBorderColor: '#8b7355',
            lineColor: '#8b7355',
            secondaryColor: '#e8dcc6',
            tertiaryColor: '#d4c5a9'
          }
        });
        const id = `mermaid-${Math.random().toString(36).substring(7)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setSvg('<p class="text-red-500">Failed to render diagram</p>');
      }
    };

    renderMermaid();
  }, [chart]);

  return svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="p-4">Rendering diagram...</div>;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      const fullPost = await getPostWithContent(slug);
      setPost(fullPost);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className="container mx-auto py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-48 bg-muted rounded w-full mt-6"></div>
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container mx-auto py-16">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground mt-2">The article you are looking for does not exist.</p>
      </main>
    );
  }

  const dateLabel = (() => {
    try {
      return format(new Date(post.date), "MMM d, yyyy");
    } catch {
      return post.date;
    }
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: import.meta.env.VITE_SEO_AUTHOR },
    keywords: post.keywords,
    image: post.coverImage,
    mainEntityOfPage: `${site}${post.url}`,
  };

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_SEO_AUTHOR} — ${post.title}`}
        description={post.description}
        canonical={`${site}${post.url}`}
        type="article"
        image={post.coverImage}
        keywords={post.keywords}
        jsonLd={jsonLd}
      />

      <main className="py-10 bg-gradient-to-b from-secondary to-background">
        <article className="container mx-auto max-w-3xl">
          <header className="mb-6">
            <div className="flex items-center gap-x-4 justify-center md:justify-start">
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="font-codex text-3xl font-bold tracking-tight">{post.title}</h1>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground justify-center md:justify-start">
              <Badge variant="secondary">{post.category}</Badge>
              <time dateTime={post.date}>{dateLabel}</time>
            </div>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                className="w-full h-64 object-cover rounded-md border mt-6"
                loading="eager"
              />
            )}
            {post.description && (
              <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
            )}
          </header>

          <section className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-codex prose-img:rounded-lg prose-img:shadow-md">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ node, src, alt, ...props }) => (
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    <img
                      {...props}
                      src={src}
                      alt={alt}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-md border border-border/60"
                      loading="lazy"
                    />
                  </a>
                ),
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeString = String(children).replace(/\n$/, '');

                  if (!className) { // Inline code
                    return (
                      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }

                  if (language === 'mermaid') {
                    return <Mermaid chart={codeString} />;
                  }

                  if (language) {
                    return (
                      <Highlight
                        theme={themes.oneLight}
                        code={codeString}
                        language={language}
                      >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                          <div className="relative group w-full">
                            <div className="absolute top-0 left-0 bg-muted px-2 py-1 text-xs font-mono text-muted-foreground rounded-br z-10">
                              {language}
                            </div>
                            <CopyButton text={codeString} />
                            <pre className={className} style={{...style, margin: 0, width: '100%', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'hsl(var(--secondary))', padding: '1.5rem 1rem 1rem 1rem'}}>
                              {tokens.map((line, i) => (
                                <div {...getLineProps({ line, key: i })}>
                                  {line.map((token, key) => (
                                    <span {...getTokenProps({ token, key })} />
                                  ))}
                                </div>
                              ))}
                            </pre>
                          </div>
                        )}
                      </Highlight>
                    );
                  }
                  
                  // Fallback for code blocks without a language
                  return (
                    <div className="relative group">
                      <CopyButton text={codeString} />
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </section>
          <div className="mt-8 text-center">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
