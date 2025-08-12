import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  keywords?: string[];
  jsonLd?: Record<string, any>;
};

const setMeta = (name: string, content: string) => {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setProperty = (property: string, content: string) => {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export const SEO = ({ title, description, canonical, type = "website", image, keywords = [], jsonLd }: SEOProps) => {
  useEffect(() => {
    document.title = title.length > 60 ? `${title.slice(0, 57)}...` : title;

    if (description) setMeta("description", description.slice(0, 160));
    if (keywords.length) setMeta("keywords", keywords.join(", "));

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // OpenGraph / Twitter
    setProperty("og:title", title);
    if (description) setProperty("og:description", description);
    setProperty("og:type", type);
    if (canonical) setProperty("og:url", canonical);
    if (image) setProperty("og:image", image);

    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    if (description) setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    // JSON-LD
    const existing = document.getElementById("jsonld-primary");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "jsonld-primary";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, type, image, JSON.stringify(jsonLd)]);

  return null;
};

export default SEO;
