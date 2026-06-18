"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreProduct } from "@/lib/types";
import { formatPrice } from "@/lib/medusa";
import { brandFontStyle } from "@/lib/brand-style";

const FALLBACK_IMAGES = {
  keyboard: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=90&w=900",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=90&w=900",
  audio: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=90&w=900",
  mobile: "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&q=90&w=900",
  cable: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=90&w=900",
  desk: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=90&w=900",
  generic: "/products/generic.svg",
};

function getFallbackImage(product: StoreProduct): string {
  const text = `${product.title || ""} ${product.categories?.[0]?.name || ""}`.toLowerCase();
  if (text.includes("keyboard") || text.includes("keycap")) return FALLBACK_IMAGES.keyboard;
  if (text.includes("mouse") || text.includes("gaming")) return FALLBACK_IMAGES.mouse;
  if (text.includes("earbud") || text.includes("audio") || text.includes("bluetooth")) return FALLBACK_IMAGES.audio;
  if (text.includes("phone") || text.includes("tablet") || text.includes("stand")) return FALLBACK_IMAGES.mobile;
  if (text.includes("cable") || text.includes("charging") || text.includes("usb")) return FALLBACK_IMAGES.cable;
  if (text.includes("desk") || text.includes("mat") || text.includes("hub")) return FALLBACK_IMAGES.desk;
  return FALLBACK_IMAGES.generic;
}

interface ProductCardProps {
  product: StoreProduct;
  regionCurrency?: string;
}

export default function ProductCard({ product, regionCurrency = "GBP" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get product images
  const images = product.images || [];
  const fallbackImage = getFallbackImage(product);
  const mainImage = images[0]?.url && !imageError ? images[0].url : fallbackImage;
  const secondaryImage = images[1]?.url || mainImage;

  // Get the cheapest variant price
  const price = product.variants?.[0]?.calculated_price?.calculated_amount;
  const compareAtPrice = product.variants?.[0]?.calculated_price?.original_amount;

  // Check if product has a "best seller" tag or collection
  const isBestSeller = product.tags?.some(
    (tag) => tag.value?.toLowerCase() === "best seller" || tag.value?.toLowerCase() === "bestseller"
  );

  // Get category from product's first category
  const category = product.categories?.[0]?.name || "Electronics";

  return (
    <div className="group relative">
      <Link href={`/product/${product.handle}`} className="block">
        <div
          className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 mb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image */}
          <Image
            src={mainImage}
            alt={product.title || "Product"}
            fill
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
          {/* Secondary "Lifestyle" Image */}
          <Image
            src={secondaryImage}
            alt={`${product.title} lifestyle`}
            fill
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />

          {isBestSeller && (
            <span style={brandFontStyle} className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-near-black text-[10px] uppercase tracking-widest px-3 py-1">
              Best Seller
            </span>
          )}

          {compareAtPrice && compareAtPrice > (price || 0) && (
            <span style={brandFontStyle} className="absolute top-4 right-4 bg-orbit-blue text-near-black text-[10px] uppercase tracking-widest px-3 py-1">
              Sale
            </span>
          )}
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h3 style={brandFontStyle} className="font-display text-base font-bold text-near-black transition-colors group-hover:text-blue-hover">
              {product.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
              {category}
            </p>
          </div>
          <div className="text-right">
            <span className="text-near-black font-semibold">
              {formatPrice(price, regionCurrency)}
            </span>
            {compareAtPrice && compareAtPrice > (price || 0) && (
              <span className="block text-xs text-gray-400 line-through">
                {formatPrice(compareAtPrice, regionCurrency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
