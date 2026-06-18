"use client";

import { Headphones, Lock, PackageCheck, Truck } from "lucide-react";

const usps = [
  { icon: <Truck size={17} />, text: "Fast global shipping" },
  { icon: <PackageCheck size={17} />, text: "Curated electronics" },
  { icon: <Lock size={17} />, text: "Secure checkout" },
  { icon: <Headphones size={17} />, text: "Setup support" },
];

export default function HomeUSPBar() {
  return (
    <section className="border-y border-line-gray bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-line-gray px-0 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted md:grid-cols-4 md:divide-y-0">
        {usps.map((usp) => (
          <div key={usp.text} className="flex items-center justify-center gap-3 px-4 py-4">
            <span className="text-blue-hover">{usp.icon}</span>
            <span>{usp.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
