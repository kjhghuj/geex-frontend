import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const heroSection = readFileSync("src/app/components/home/HeroSection.tsx", "utf8");
const heroConfigPath = "public/content/home-hero.json";

test("home hero uses three real carousel slides", () => {
  assert(
    heroSection.includes("const DEFAULT_HERO_SLIDES"),
    "HeroSection should keep default slide data as a safe fallback",
  );

  const defaultSlidesSource = heroSection.match(/const DEFAULT_HERO_SLIDES[\s\S]*?\n\];/)?.[0] ?? "";
  const slideMatches = defaultSlidesSource.match(/image:\s/g) || [];
  assert.equal(slideMatches.length, 3, "Hero carousel should expose exactly three slides");
});

test("home hero has an editable JSON slide config", () => {
  assert(existsSync(heroConfigPath), "Home hero JSON config should exist");

  const config = JSON.parse(readFileSync(heroConfigPath, "utf8"));
  assert(Array.isArray(config.slides), "Home hero JSON config should expose a slides array");
  assert.equal(config.slides.length, 3, "Home hero JSON config should start with three slides");

  for (const [index, slide] of config.slides.entries()) {
    assert.equal(typeof slide.eyebrow?.accent, "string", `Slide ${index + 1} should define eyebrow.accent`);
    assert.equal(typeof slide.eyebrow?.text, "string", `Slide ${index + 1} should define eyebrow.text`);
    assert(Array.isArray(slide.title), `Slide ${index + 1} should define title lines`);
    assert.equal(typeof slide.description, "string", `Slide ${index + 1} should define description`);
    assert.equal(typeof slide.image, "string", `Slide ${index + 1} should define image`);
    assert.equal(typeof slide.imageAlt, "string", `Slide ${index + 1} should define imageAlt`);
    assert.equal(typeof slide.primaryCta?.label, "string", `Slide ${index + 1} should define primaryCta.label`);
    assert.equal(typeof slide.primaryCta?.href, "string", `Slide ${index + 1} should define primaryCta.href`);
    assert.equal(typeof slide.secondaryCta?.label, "string", `Slide ${index + 1} should define secondaryCta.label`);
    assert.equal(typeof slide.secondaryCta?.href, "string", `Slide ${index + 1} should define secondaryCta.href`);
  }
});

test("home hero loads editable slides at runtime and falls back safely", () => {
  assert(
    heroSection.includes('fetch("/content/home-hero.json", { cache: "no-store" })'),
    "HeroSection should load the editable JSON config at runtime",
  );
  assert(
    heroSection.includes("getConfigurableHeroSlides"),
    "HeroSection should validate configured slides before rendering them",
  );
  assert(
    heroSection.includes("setSlides(DEFAULT_HERO_SLIDES)"),
    "HeroSection should fall back to default slides when the config cannot be used",
  );
});

test("home hero renders the active slide content", () => {
  for (const expectedSource of [
    "activeSlide.image",
    "activeSlide.imageAlt",
    "activeSlide.eyebrow",
    "activeSlide.title",
    "activeSlide.description",
    "activeSlide.primaryCta",
  ]) {
    assert(
      heroSection.includes(expectedSource),
      `HeroSection should render ${expectedSource}`,
    );
  }
});

test("home hero auto-advances and cleans up the carousel timer", () => {
  assert(heroSection.includes("useEffect"), "HeroSection should use an effect for autoplay");
  assert(heroSection.includes("setInterval"), "HeroSection should auto-advance slides");
  assert(heroSection.includes("clearInterval"), "HeroSection should clear the autoplay timer");
  assert(
    heroSection.includes("setActiveSlideIndex((current) =>"),
    "HeroSection autoplay should use a functional state update",
  );
});

test("home hero slide numbers are interactive controls", () => {
  assert(heroSection.includes("aria-label={`Show hero slide"), "Slide numbers should be labelled buttons");
  assert(heroSection.includes("aria-pressed={isActive}"), "Slide buttons should expose active state");
  assert(
    heroSection.includes("onClick={() => setActiveSlideIndex(index)}"),
    "Slide number buttons should switch to the selected slide",
  );
});
