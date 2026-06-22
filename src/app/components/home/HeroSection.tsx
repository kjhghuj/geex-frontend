"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_ASSETS } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

const HERO_AUTOPLAY_MS = 5200;

type HeroCta = {
  label: string;
  href: string;
};

type HeroSlide = {
  eyebrow: {
    accent: string;
    text: string;
  };
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: {
      accent: "Premium Gear.",
      text: "Better Everyday.",
    },
    title: ["GEAR UP YOUR", "EVERYDAY SETUP"],
    description:
      "High-performance keyboards, precision peripherals, and smart accessories designed to elevate your workflow and play.",
    image: "/brand/geex-hero-setup.png",
    imageAlt:
      "GEEX desk setup with keyboard, mouse, earbuds, phone stand, tablet, and charging accessories",
    primaryCta: {
      label: "Shop Bestsellers",
      href: "/shop",
    },
    secondaryCta: {
      label: "Explore Categories",
      href: "/shop?category=desk-setups",
    },
  },
  {
    eyebrow: {
      accent: "Low-Profile Control.",
      text: "Quiet Daily Typing.",
    },
    title: ["TYPE CLEAN.", "WORK FASTER."],
    description:
      "Compact keyboards, desk mats, and focus-friendly tools that keep your setup sharp without adding clutter.",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=90&w=1400",
    imageAlt: "Low-profile mechanical keyboard in a clean desktop setup",
    primaryCta: {
      label: "Shop Keyboards",
      href: "/shop?category=keyboards",
    },
    secondaryCta: {
      label: "Build a Desk Setup",
      href: "/shop?category=desk-setups",
    },
  },
  {
    eyebrow: {
      accent: "Gaming Ready.",
      text: "Wireless Focus.",
    },
    title: ["PLAY SHARP.", "STAY LOCKED IN."],
    description:
      "Responsive mice, wireless audio, and low-latency accessories built for play, calls, and everyday switching.",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=90&w=1400",
    imageAlt: "Gaming keyboard and mouse accessories on a desktop",
    primaryCta: {
      label: "Shop Gaming",
      href: "/shop?category=gaming",
    },
    secondaryCta: {
      label: "Browse Audio",
      href: "/shop?category=audio",
    },
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCta(value: unknown): value is HeroCta {
  return isRecord(value) && isString(value.label) && isString(value.href);
}

function isHeroSlide(value: unknown): value is HeroSlide {
  if (!isRecord(value) || !isRecord(value.eyebrow)) {
    return false;
  }

  return (
    isString(value.eyebrow.accent) &&
    isString(value.eyebrow.text) &&
    Array.isArray(value.title) &&
    value.title.length > 0 &&
    value.title.every(isString) &&
    isString(value.description) &&
    isString(value.image) &&
    isString(value.imageAlt) &&
    isCta(value.primaryCta) &&
    isCta(value.secondaryCta)
  );
}

function getConfigurableHeroSlides(config: unknown): HeroSlide[] {
  if (!isRecord(config) || !Array.isArray(config.slides)) {
    return DEFAULT_HERO_SLIDES;
  }

  const configuredSlides = config.slides.filter(isHeroSlide);
  return configuredSlides.length > 0 ? configuredSlides : DEFAULT_HERO_SLIDES;
}

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex] ?? DEFAULT_HERO_SLIDES[0];

  useEffect(() => {
    let isMounted = true;

    fetch("/content/home-hero.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Home hero config request failed");
        }

        return response.json();
      })
      .then((config) => {
        if (!isMounted) {
          return;
        }

        setSlides(getConfigurableHeroSlides(config));
        setActiveSlideIndex(0);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setSlides(DEFAULT_HERO_SLIDES);
        setActiveSlideIndex(0);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % slides.length);
    }, HERO_AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

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
            <span className="text-blue-hover">{activeSlide.eyebrow.accent}</span>
            <span className="text-near-black">{activeSlide.eyebrow.text}</span>
          </div>
          <h1 style={brandFontStyle} className="font-display text-[39px] font-black uppercase leading-[0.98] tracking-[0.01em] text-near-black sm:text-[51px] lg:text-[46px] xl:text-[54px]">
            {activeSlide.title.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-[410px] text-[14px] leading-6 text-near-black/78">
            {activeSlide.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={activeSlide.primaryCta.href}
              style={brandFontStyle}
              className="inline-flex items-center justify-center gap-3 bg-orbit-blue px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-blue-hover"
            >
              {activeSlide.primaryCta.label} <ArrowRight size={16} />
            </Link>
            <Link
              href={activeSlide.secondaryCta.href}
              style={brandFontStyle}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.08em] text-near-black transition-colors hover:text-blue-hover"
            >
              {activeSlide.secondaryCta.label} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden lg:min-h-0">
          <div className="absolute -left-12 top-0 z-10 hidden h-full w-28 skew-x-[-17deg] border-x border-white/80 bg-cool-white lg:block" />
          <div className="relative h-full min-h-[340px] lg:min-h-0">
            <Image
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.imageAlt}
              fill
              priority={activeSlideIndex === 0}
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cool-white/20 via-near-black/5 to-near-black/20" />
            <div style={brandFontStyle} className="absolute bottom-5 right-6 flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              {slides.map((slide, index) => {
                const isActive = index === activeSlideIndex;

                return (
                  <button
                    key={slide.title.join(" ")}
                    type="button"
                    aria-label={`Show hero slide ${index + 1}: ${slide.title.join(" ")}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveSlideIndex(index)}
                    className={`flex h-8 min-w-8 items-center justify-center border border-white/35 px-2 transition-colors hover:border-orbit-blue hover:text-orbit-blue ${
                      isActive ? "border-orbit-blue bg-near-black/55 text-orbit-blue" : "bg-near-black/20 text-white"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Show next hero slide"
                onClick={() => setActiveSlideIndex((current) => (current + 1) % slides.length)}
                className="flex h-8 w-8 items-center justify-center bg-orbit-blue text-white transition-colors hover:bg-blue-hover"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
