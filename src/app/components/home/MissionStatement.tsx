import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

export function MissionStatement() {
  return (
    <section className="relative overflow-hidden bg-near-black py-24 text-white lg:py-32">
      <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full border border-orbit-blue/25" />
      <div className="absolute right-10 top-16 h-36 w-36 opacity-20">
        <Image src={BRAND_ASSETS.orbitMark} alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p style={brandFontStyle} className="text-[11px] font-bold uppercase tracking-[0.24em] text-orbit-blue">
            The GEEX point of view
          </p>
          <h2 style={brandFontStyle} className="font-display mt-5 text-4xl font-black uppercase leading-tight lg:text-6xl">
            Better gear should make your setup feel effortless.
          </h2>
        </div>
        <div className="grid gap-6 text-base leading-8 text-white/72 md:grid-cols-2">
          <p>
            GEEX is built for people who care about the tools around their screens:
            keyboards that feel right, audio that pairs quickly, stands that hold steady,
            and accessories that keep a desk clean.
          </p>
          <p>
            We keep the storefront focused on useful electronics, clear compatibility,
            secure checkout, and support that helps customers choose gear that fits their
            devices and everyday routines.
          </p>
        </div>
      </div>
    </section>
  );
}
