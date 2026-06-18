
import { brandFontStyle } from "@/lib/brand-style";

export function ShopHeader({ category }: { category?: string }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <h1 style={brandFontStyle} className="font-display mb-4 text-4xl font-black uppercase text-near-black lg:text-5xl">
        {category
          ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
          : "Shop All"}
      </h1>
      <p className="text-ink-muted max-w-2xl">
        Explore keyboards, gaming peripherals, desk setup accessories, mobile add-ons,
        charging gear, and Bluetooth audio selected for everyday use.
      </p>
    </div>
  );
}
