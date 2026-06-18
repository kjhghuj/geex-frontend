import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components";
import { brandFontStyle } from "@/lib/brand-style";

const demoProducts = [
  {
    name: "GEEX A75 Mechanical Keyboard",
    price: "$89.99",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=90&w=900",
  },
  {
    name: "GEEX M2 Pro Wireless Mouse",
    price: "$59.99",
    badge: "New",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=90&w=900",
  },
  {
    name: "GEEX Pods X1",
    price: "$49.99",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=90&w=900",
  },
  {
    name: "GEEX Desk Mat Pro (XL)",
    price: "$19.99",
    badge: "New",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=90&w=900",
  },
  {
    name: "GEEX 100W USB-C Cable",
    price: "$12.99",
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=90&w=900",
  },
  {
    name: "GEEX Adjustable Stand",
    price: "$29.99",
    badge: "New",
    image: "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&q=90&w=900",
  },
];

export function FeaturedProducts({ products, region }: { products: any[]; region: any }) {
  return (
    <section className="border-y border-line-gray bg-white py-5">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-2 flex items-end justify-between px-6 lg:px-8">
          <div>
            <h2 style={brandFontStyle} className="font-display text-[20px] uppercase tracking-[0.03em] text-near-black">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            style={brandFontStyle}
            className="flex items-center gap-2 border-b border-near-black pb-1 font-display text-[11px] uppercase tracking-[0.08em] transition-colors hover:border-blue-hover hover:text-blue-hover"
          >
            View All
          </Link>
        </div>

        {/* Product Grid */}
        <div className="flex gap-3 overflow-x-auto px-6 pb-3 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-8 no-scrollbar snap-x snap-mandatory">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="min-w-[280px] lg:min-w-0 snap-center">
                <ProductCard
                  product={product}
                  regionCurrency={region?.currency_code?.toUpperCase() || "GBP"}
                />
              </div>
            ))
          ) : (
            demoProducts.map((product) => (
              <Link
                key={product.name}
                href="/shop"
                className="group min-w-[210px] overflow-hidden border border-line-gray bg-white transition-colors hover:border-orbit-blue lg:min-w-0"
              >
                <div className="relative h-[124px] bg-ice-gray">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 210px, 16vw"
                  />
                  <span style={brandFontStyle} className={`absolute left-2 top-2 px-2 py-1 font-display text-[8px] uppercase tracking-[0.06em] text-white ${product.badge === "Sale" ? "bg-red-500" : "bg-orbit-blue"}`}>
                    {product.badge}
                  </span>
                </div>
                <div className="grid min-h-[74px] grid-cols-[1fr_auto] gap-2 p-3">
                  <div>
                    <h3 style={brandFontStyle} className="line-clamp-2 text-[11px] font-bold leading-4 text-near-black">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-black text-near-black">{product.price}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center border border-line-gray text-near-black transition-colors group-hover:border-orbit-blue group-hover:bg-orbit-blue group-hover:text-white">
                    +
                  </span>
                </div>
              </Link>
            ))
          )}
          {/* Mobile Spacer */}
          <div className="min-w-[20px] lg:hidden"></div>
        </div>
      </div>
    </section>
  );
}
