"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_ASSETS } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line-gray bg-cool-white pt-[82px]">
      <div className="absolute left-[23%] top-28 hidden h-[230px] w-[470px] -rotate-12 rounded-[50%] border border-orbit-blue/35 lg:block" />
      <div className="absolute left-[27%] top-40 hidden h-[120px] w-[290px] -rotate-12 rounded-[50%] border border-orbit-blue/20 lg:block" />
      <div className="absolute left-8 top-28 hidden h-16 w-16 xl:block">
        <Image
          src={BRAND_ASSETS.orbitMark}
          alt=""
          fill
          className="object-contain opacity-20"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto grid max-w-[1536px] grid-cols-1 items-stretch lg:h-[332px] lg:grid-cols-[38%_62%] xl:h-[360px]">
        <div className="relative z-10 flex min-h-[390px] flex-col justify-center px-6 py-10 lg:min-h-0 lg:pl-[60px] lg:pr-4">
          <div style={brandFontStyle} className="mb-5 flex items-center gap-3 font-display text-[13px] font-extrabold uppercase italic tracking-[0.08em]">
            <span className="text-blue-hover">Premium Gear.</span>
            <span className="text-near-black">Better Everyday.</span>
          </div>
          <h1 style={brandFontStyle} className="font-display text-[39px] font-black uppercase leading-[0.98] tracking-[0.01em] text-near-black sm:text-[51px] lg:text-[46px] xl:text-[54px]">
            <span className="block whitespace-nowrap">GEAR UP YOUR</span>
            <span className="block whitespace-nowrap">EVERYDAY SETUP</span>
          </h1>
          <p className="mt-4 max-w-[410px] text-[14px] leading-6 text-near-black/78">
            High-performance keyboards, precision peripherals, and smart accessories
            designed to elevate your workflow and play.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              style={brandFontStyle}
              className="inline-flex items-center justify-center gap-3 bg-orbit-blue px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-blue-hover"
            >
              Shop Bestsellers <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop?category=desk-setups"
              style={brandFontStyle}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.08em] text-near-black transition-colors hover:text-blue-hover"
            >
              Explore Categories <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden lg:min-h-0">
          <div className="absolute -left-12 top-0 z-10 hidden h-full w-28 skew-x-[-17deg] border-x border-white/80 bg-cool-white lg:block" />
          <div className="relative h-full min-h-[340px] lg:min-h-0">
            <Image
              src="/brand/geex-hero-setup.png"
              alt="GEEX desk setup with keyboard, mouse, earbuds, phone stand, tablet, and charging accessories"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cool-white/10 via-transparent to-transparent" />
            <div style={brandFontStyle} className="absolute bottom-5 right-6 hidden items-center gap-5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white lg:flex">
              <span className="text-orbit-blue">01</span>
              <span>02</span>
              <span>03</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
