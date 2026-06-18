"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HOME_CATEGORIES } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

export function CategoryGrid() {
  return (
    <section className="bg-cool-white py-5 lg:py-6">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p style={brandFontStyle} className="font-display text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-hover">
              Shop by setup
            </p>
            <h2 style={brandFontStyle} className="mt-2 font-display text-2xl uppercase tracking-[0.02em] text-near-black lg:text-[28px]">
              Build around how you work and play
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink-muted">
            Pick a route into the catalog: clean desk gear, daily typing,
            gaming accessories, mobile add-ons, or wireless audio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden border border-line-gray bg-white"
            >
              <div className="relative h-[150px] lg:h-[168px]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/55 via-near-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="mb-3 ml-auto flex h-8 w-8 items-center justify-center bg-orbit-blue text-white">
                    <ArrowUpRight size={18} />
                  </div>
                  <h3 style={brandFontStyle} className="font-display text-[17px] font-black uppercase leading-5 tracking-[0.04em] text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/85">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
