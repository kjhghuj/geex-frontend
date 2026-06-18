"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, Search, ShoppingBag, X } from "lucide-react";
import { ARTICLES, HOME_CATEGORIES, TRENDING_SEARCHES } from "@/lib/constants";
import { searchProducts } from "@/lib/medusa";
import { Article, StoreProduct } from "@/lib/types";
import { brandFontStyle } from "@/lib/brand-style";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  regionId?: string;
}

export default function SearchOverlay({ isOpen, onClose, regionId }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [productResults, setProductResults] = useState<StoreProduct[]>([]);
  const [articleResults, setArticleResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setProductResults([]);
      setArticleResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const products = await searchProducts(searchQuery, regionId);
      setProductResults(products.slice(0, 3));

      const lowerQuery = searchQuery.toLowerCase();
      const filteredArticles = ARTICLES.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.category.toLowerCase().includes(lowerQuery)
      ).slice(0, 2);
      setArticleResults(filteredArticles);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [regionId]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLinkClick = (path: string) => {
    onClose();
    router.push(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-cool-white/95 backdrop-blur-md animate-fade-in">
      <div className="flex justify-end p-6 lg:p-10">
        <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-white" aria-label="Close search">
          <X size={32} strokeWidth={1.2} className="text-near-black transition-colors hover:text-blue-hover" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 lg:px-8">
        <form onSubmit={handleSearchSubmit} className="relative mb-12">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keyboards, earbuds, charging gear..."
            style={brandFontStyle}
            className="w-full border-b border-line-gray bg-transparent py-6 pr-14 text-3xl font-black uppercase text-near-black placeholder:text-gray-300 focus:border-blue-hover focus:outline-none lg:text-5xl"
          />
          <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-near-black transition-colors hover:text-blue-hover" aria-label="Search">
            <Search size={32} strokeWidth={1.5} />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {query.length < 2 && (
            <div className="animate-fade-in">
              <h4 style={brandFontStyle} className="mb-6 text-xs font-bold uppercase tracking-widest text-ink-muted">Trending searches</h4>
              <div className="mb-12 flex flex-wrap gap-3">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-line-gray bg-white px-5 py-2 text-sm text-near-black transition-all hover:border-blue-hover hover:text-blue-hover"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <h4 style={brandFontStyle} className="mb-6 text-xs font-bold uppercase tracking-widest text-ink-muted">Popular categories</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {HOME_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleLinkClick(cat.href)}
                    className="group relative aspect-square overflow-hidden border border-line-gray bg-white"
                  >
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-near-black/30 transition-colors group-hover:bg-blue-hover/30" />
                    <span style={brandFontStyle} className="absolute bottom-4 left-4 right-4 text-left text-sm font-black uppercase text-white">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && (
            <div className="grid grid-cols-1 gap-12 animate-fade-in lg:grid-cols-2">
              <div>
                <h4 style={brandFontStyle} className="mb-6 flex items-center gap-2 border-b border-line-gray pb-2 text-xs font-bold uppercase tracking-widest text-ink-muted">
                  <ShoppingBag size={14} /> Products
                </h4>
                {isSearching ? (
                  <p className="text-sm text-gray-400">Searching...</p>
                ) : productResults.length > 0 ? (
                  <div className="space-y-6">
                    {productResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleLinkClick(`/product/${product.handle}`)}
                        className="flex w-full cursor-pointer gap-4 text-left group"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-line-gray bg-white">
                          {product.thumbnail && <Image src={product.thumbnail} alt={product.title || "Product"} fill className="object-cover" />}
                        </div>
                        <div>
                          <h5 style={brandFontStyle} className="text-lg font-semibold text-near-black transition-colors group-hover:text-blue-hover">
                            {product.title}
                          </h5>
                        </div>
                      </button>
                    ))}
                    <button onClick={handleSearchSubmit} style={brandFontStyle} className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-hover hover:underline">
                      View all results
                    </button>
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No products found.</p>
                )}
              </div>

              <div>
                <h4 style={brandFontStyle} className="mb-6 flex items-center gap-2 border-b border-line-gray pb-2 text-xs font-bold uppercase tracking-widest text-ink-muted">
                  <FileText size={14} /> Guides
                </h4>
                {articleResults.length > 0 ? (
                  <div className="space-y-6">
                    {articleResults.map((article) => (
                      <button key={article.id} onClick={() => handleLinkClick(`/journal/${article.slug}`)} className="cursor-pointer text-left group">
                        <span className="mb-1 block text-[10px] uppercase text-gray-400">{article.category}</span>
                        <h5 style={brandFontStyle} className="mb-1 text-lg font-semibold leading-tight text-near-black transition-colors group-hover:text-blue-hover">
                          {article.title}
                        </h5>
                        <p className="line-clamp-1 text-xs text-ink-muted">{article.readTime}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No guides found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
