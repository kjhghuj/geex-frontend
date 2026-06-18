import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle, getProducts, getRegion } from "@/lib/medusa";
import ProductClient from "./components/ProductClient";
import { Breadcrumb } from "./components/Breadcrumb";
import ProductStory, { StorySection } from "./components/ProductStory";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

/**
 * 瀹夊叏瑙ｆ瀽 metadata.story_sections 涓?StorySection[]
 * Medusa 鐨?metadata 鏄?unknown 绫诲瀷锛岄渶瑕佸畨鍏ㄥ湴绫诲瀷鏂█
 */
function parseStorySections(metadata: Record<string, unknown> | undefined): StorySection[] {
  if (!metadata?.story_sections) {
    return [];
  }

  try {
    // 濡傛灉宸茬粡鏄暟缁勶紝鐩存帴浣跨敤锛涘鏋滄槸瀛楃涓诧紝灏濊瘯瑙ｆ瀽
    const sections = Array.isArray(metadata.story_sections)
      ? metadata.story_sections
      : JSON.parse(metadata.story_sections as string);

    // 杩囨护骞堕獙璇佹瘡涓?section 鐨勫熀鏈瓧娈?
    return sections.filter((section: unknown): section is StorySection => {
      if (typeof section !== 'object' || section === null) return false;
      const s = section as Record<string, unknown>;
      return typeof s.id === 'string' && typeof s.title === 'string';
    });
  } catch (e) {
    console.error('[ProductPage] Failed to parse story_sections:', e);
    return [];
  }
}

// Generate static paths for products
export async function generateStaticParams() {
  try {
    const region = await getRegion("gb");
    const { products } = await getProducts(region?.id, 100);
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch {
    return [];
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const region = await getRegion("gb");
  const product = await getProductByHandle(handle, region?.id);

  if (!product) {
    return {
      title: "Product Not Found | GEEX",
      description: "The product you are looking for could not be found.",
    };
  }

  const price = product.variants?.[0]?.calculated_price?.calculated_amount;
  const currencyCode = region?.currency_code?.toUpperCase() || "GBP";

  return {
    title: `${product.title} | GEEX`,
    description: product.description || `Shop ${product.title} at GEEX - curated electronics and setup gear.`,
    openGraph: {
      title: product.title || "GEEX Product",
      description: product.description || "Curated electronics product",
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
    other: {
      "product:price:amount": price ? String(price / 100) : "",
      "product:price:currency": currencyCode,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const region = await getRegion("gb");
  const product = await getProductByHandle(handle, region?.id);

  if (!product) {
    notFound();
  }

  const images = product.images || [];
  const thumbnail = product.thumbnail;  // 鍟嗗搧绾у埆缂╃暐鍥句綔涓哄洖閫€
  const category = product.categories?.[0];
  const price = product.variants?.[0]?.calculated_price?.calculated_amount;
  const originalPrice = product.variants?.[0]?.calculated_price?.original_amount;
  const currencyCode = region?.currency_code?.toUpperCase() || "GBP";

  // Determine if product is on sale
  const isOnSale = !!(originalPrice && price && originalPrice > price);
  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Check for product tags/badges
  const tags = product.tags || [];
  const isBestSeller = tags.some(t => t.value?.toLowerCase().includes("best") || t.value?.toLowerCase().includes("popular"));
  const isNew = tags.some(t => t.value?.toLowerCase().includes("new"));

  // 浠?metadata 涓В鏋愪骇鍝佹晠浜嬫暟鎹?
  const storySections = parseStorySections(product.metadata as Record<string, unknown> | undefined);

  return (
    <>
      <div className="pt-24 pb-16 bg-white min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb product={product} category={category} />
          <ProductClient
            product={product}
            images={images}
            thumbnail={thumbnail}
            category={category}
            regionId={region?.id}
            currencyCode={currencyCode}
            price={price ?? undefined}
            originalPrice={originalPrice ?? undefined}
            isBestSeller={isBestSeller}
            isNew={isNew}
            isOnSale={isOnSale}
            discountPercentage={discountPercentage}
          />
        </div>
      </div>

      {/* Product Story Section - Full-width with constrained content */}
      <ProductStory sections={storySections} />

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: images.map((img) => img.url),
            sku: product.variants?.[0]?.sku || product.handle,
            brand: {
              "@type": "Brand",
              name: "GEEX",
            },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.geexfans.com"}/product/${product.handle}`,
              priceCurrency: currencyCode,
              price: price ? price / 100 : undefined,
              availability: product.variants?.[0]?.inventory_quantity && product.variants[0].inventory_quantity > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </>
  );
}

