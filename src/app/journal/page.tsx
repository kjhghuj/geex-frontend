import { Metadata } from "next";
import { getArticles, getFeaturedArticle, Article } from "@/lib/cms";
import JournalHero from "@/components/journal/JournalHero";
import JournalContent from "@/components/journal/JournalContent";
import NewsletterSection from "@/components/journal/NewsletterSection";

// Disable caching for this page (instant Strapi content updates)
export const dynamic = 'force-dynamic';

// SEO Metadata
export const metadata: Metadata = {
  title: "Journal | GEEX - Electronics Guides",
  description:
    "Explore GEEX guides for setup gear, keyboards, audio, and accessories. Practical notes for better everyday tech.",
  openGraph: {
    title: "Journal | GEEX - Electronics Guides| GEEX|Journal | GEEX - Electronics Guides| GEEX",
    description:
      "Explore GEEX guides for setup gear, keyboards, audio, and accessories.",
    type: "website",
  },
};

const CATEGORIES = [
  "All Stories",
  "Setup Guides",
  "Buying Advice",
  "Guides",
  "Desk Ideas",
];

export default async function JournalPage() {
  // Fetch articles and featured article from Strapi CMS
  const [articles, featuredArticle] = await Promise.all([
    getArticles(),
    getFeaturedArticle(),
  ]);

  // Filter out the featured article from the grid (if it exists)
  const gridArticles = featuredArticle
    ? articles.filter((a: Article) => a.id !== featuredArticle.id)
    : articles;

  return (
    <div className="bg-cool-white min-h-screen pt-[72px] lg:pt-[88px]">
      {/* 1. HERO SECTION - Now uses featured article from Strapi */}
      <JournalHero featuredArticle={featuredArticle} />

      {/* 2. FILTER BAR + ARTICLE GRID */}
      <JournalContent
        articles={gridArticles}
        focusArticle={undefined}
        categories={CATEGORIES}
      />

      {/* 3. NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
