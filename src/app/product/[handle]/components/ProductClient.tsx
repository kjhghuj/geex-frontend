"use client";

import { useCallback, useState } from "react";
import { Headphones, Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import { formatPrice } from "@/lib/medusa";
import { StoreProduct, StoreProductCategory, StoreProductVariant } from "@/lib/types";
import { brandFontStyle } from "@/lib/brand-style";

interface ProductImage {
  url?: string;
}

interface ProductClientProps {
  product: StoreProduct;
  images: ProductImage[];
  thumbnail?: string | null;
  category?: StoreProductCategory | null;
  regionId?: string;
  currencyCode: string;
  price?: number;
  originalPrice?: number;
  isBestSeller: boolean;
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage: number;
}

export default function ProductClient({
  product,
  images,
  thumbnail,
  category,
  regionId,
  currencyCode,
  price,
  originalPrice,
  isBestSeller,
  isNew,
  isOnSale,
  discountPercentage,
}: ProductClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant | null>(null);

  const handleVariantChange = useCallback((variant: StoreProductVariant | null) => {
    setSelectedVariant(variant);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <ProductGallery
        images={images}
        thumbnail={thumbnail}
        title={product.title || "Product"}
        selectedVariant={selectedVariant}
        isBestSeller={isBestSeller}
        isNew={isNew}
        isOnSale={isOnSale}
        discountPercentage={discountPercentage}
      />

      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        {category && (
          <a
            href={`/shop?category=${category.handle}`}
            style={brandFontStyle}
            className="inline-block text-xs font-bold uppercase tracking-widest text-blue-hover transition-colors hover:text-near-black"
          >
            {category.name}
          </a>
        )}

        <h1 style={brandFontStyle} className="font-display text-3xl font-black uppercase leading-tight text-near-black sm:text-4xl lg:text-5xl">
          {product.title}
        </h1>

        {product.subtitle && <p className="text-lg text-ink-muted">{product.subtitle}</p>}

        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-semibold text-near-black sm:text-3xl">
            {formatPrice(price, currencyCode)}
          </p>
          {isOnSale && originalPrice && (
            <>
              <p className="text-lg text-ink-muted line-through">{formatPrice(originalPrice, currencyCode)}</p>
              <span className="rounded bg-orbit-blue/15 px-2 py-1 text-sm font-semibold text-near-black">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>

        {product.description && (
          <div className="prose prose-sm max-w-none text-ink-muted">
            <p className="leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="pt-4">
          <ProductActions product={product} regionId={regionId} onVariantChange={handleVariantChange} />
        </div>

        <ProductInfo product={product} />

        <div className="border-t border-line-gray pt-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Package size={16} />, text: "Secure Packaging" },
              { icon: <Truck size={16} />, text: "Tracked Shipping" },
              { icon: <RotateCcw size={16} />, text: "30-Day Returns" },
              { icon: <ShieldCheck size={16} />, text: "Secure Checkout" },
              { icon: <Headphones size={16} />, text: "Setup Support" },
            ].map((usp) => (
              <div
                key={usp.text}
                className="flex items-center gap-2 rounded-sm border border-line-gray bg-cool-white p-3 transition-colors hover:border-orbit-blue/60"
              >
                <span className="flex-shrink-0 text-blue-hover">{usp.icon}</span>
                <span style={brandFontStyle} className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-ink-muted">
                  {usp.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
