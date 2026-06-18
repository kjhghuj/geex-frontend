// --- TYPES ---
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string;
  material: string;
  images: string[];
  videoUrl?: string;
  variants?: { id: string; name: string; colorCode: string }[];
  isBestSeller?: boolean;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface Testimonial {
  text: string;
  author: string;
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "image"; src: string; caption: string }
  | { type: "inline-product"; productId: string; context: string };

export interface Article {
  id: number;
  slug: string;
  category: string;
  title: string;
  author?: string;
  date?: string;
  excerpt: string;
  image: string;
  readTime: string;
  content?: ArticleBlock[];
  relatedArticleIds?: number[];
  featuredProductId?: string;
}

export const BRAND_ASSETS = {
  logoLockup: "/brand/geex-logo-lockup.png",
  orbitMark: "/brand/geex-orbit-mark.png",
};

export const COMPANY_INFO = {
  name: "GEEX",
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME || "GEEX ELECTRONICS LTD",
  regNo: process.env.NEXT_PUBLIC_COMPANY_REG_NO || "GEEX-0001",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Global electronics storefront",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@geexfans.com",
};

export const HOME_CATEGORIES = [
  {
    name: "Desk Setups",
    description: "Stands, hubs, lighting, charging, and tidy tools for sharper workspaces.",
    href: "/shop?category=desk-setups",
    image: "/brand/geex-hero-setup.png",
  },
  {
    name: "Office Keyboards",
    description: "Low-profile, mechanical, and quiet typing gear for daily focus.",
    href: "/shop?category=keyboards",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200",
  },
  {
    name: "Gaming Peripherals",
    description: "Responsive mice, pads, controllers, and headset-ready accessories.",
    href: "/shop?category=gaming",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=90&w=1200",
  },
  {
    name: "Mobile & Tablet",
    description: "Protective cases, stands, cables, chargers, and travel-ready add-ons.",
    href: "/shop?category=mobile-tablet",
    image: "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&q=90&w=1200",
  },
  {
    name: "Bluetooth Audio",
    description: "Earbuds, desktop speakers, and wireless audio picks for any setup.",
    href: "/shop?category=audio",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=1200",
  },
];

export const GEEX_USPS = [
  "Fast global shipping",
  "Curated electronics",
  "Secure checkout",
  "Setup support",
];

export const TRENDING_SEARCHES = ["Keyboard", "Mouse", "Earbuds", "Tablet Stand", "Charging"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "OrbitKeys Low Profile",
    subtitle: "Compact wireless keyboard for clean desk setups.",
    category: "Office Keyboards",
    price: 89.0,
    rating: 4.8,
    reviewCount: 146,
    description:
      "A slim wireless keyboard with quiet switches, long battery life, and a compact layout built for focused work.",
    details: "Wireless | USB-C charging | Hotkey row | Multi-device pairing",
    material: "Aluminum top plate and PBT keycaps",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200",
    ],
    variants: [
      { id: "v1", name: "Graphite", colorCode: "#111418" },
      { id: "v2", name: "Ice", colorCode: "#EAF4F8" },
      { id: "v3", name: "Orbit Blue", colorCode: "#82C8DE" },
    ],
    isBestSeller: true,
  },
  {
    id: "p2",
    name: "PulseBuds Mini",
    subtitle: "Bluetooth earbuds with compact case and low-latency mode.",
    category: "Bluetooth Audio",
    price: 59.0,
    rating: 4.7,
    reviewCount: 98,
    description:
      "Lightweight earbuds tuned for calls, commute, and desktop focus with reliable Bluetooth pairing.",
    details: "Bluetooth 5.3 | USB-C case | Low-latency mode | Touch controls",
    material: "Matte ABS shell",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1200",
    ],
    variants: [
      { id: "v1", name: "Black", colorCode: "#050607" },
      { id: "v2", name: "White", colorCode: "#F6FBFD" },
    ],
  },
];

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "build-a-clean-desk-setup",
    category: "Setup Guide",
    title: "How to Build a Clean Desk Setup Without Buying the Wrong Gear",
    author: "GEEX Editorial",
    date: "Jun 9, 2026",
    excerpt:
      "Start with the keyboard, monitor height, charging layout, and cable paths that make a desk easier to use every day.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    readTime: "5 min read",
    featuredProductId: "p1",
    relatedArticleIds: [2, 3],
    content: [
      {
        type: "paragraph",
        text: "A good setup starts with the tools you touch most: keyboard, mouse, screen height, charging access, and the small accessories that keep everything in reach.",
      },
      {
        type: "blockquote",
        text: "The best desk gear disappears into the workflow and makes every repeated action easier.",
      },
      {
        type: "inline-product",
        productId: "p1",
        context: "Start with a keyboard that matches your typing style and desk width.",
      },
    ],
  },
  {
    id: 2,
    slug: "keyboard-switch-guide",
    category: "Buying Guide",
    title: "Keyboard Switches: Quiet, Tactile, or Fast?",
    excerpt: "A practical guide to choosing switches for office work, gaming, and shared spaces.",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200",
    readTime: "6 min read",
  },
  {
    id: 3,
    slug: "bluetooth-audio-latency",
    category: "Audio",
    title: "What Low-Latency Bluetooth Means for Calls and Games",
    excerpt: "Understand pairing, codecs, and why latency matters when audio needs to stay in sync.",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1200",
    readTime: "4 min read",
  },
  {
    id: 4,
    slug: "tablet-stand-ergonomics",
    category: "Mobile",
    title: "Why a Better Tablet Stand Changes Your Desk",
    excerpt: "Small angle and height changes can make tablets easier to use for calls, notes, and second screens.",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200",
    readTime: "3 min read",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: "The keyboard and stand bundle cleaned up my whole desk. Everything feels sharper now.",
    author: "Maya, Singapore",
  },
  {
    text: "GEEX made it easy to pick accessories that actually work together instead of guessing from random listings.",
    author: "Jon, Austin",
  },
  {
    text: "Fast delivery, clean packaging, and the earbuds paired instantly with my laptop and tablet.",
    author: "Nina, Berlin",
  },
];

export const GEMINI_SYSTEM_INSTRUCTION = `
You are the GEEX Setup Assistant, a concise and practical shopping guide for an electronics storefront.
GEEX sells desk setup accessories, office keyboards, gaming peripherals, phone and tablet accessories, Bluetooth earbuds, charging gear, and everyday tech add-ons.

Brand values: clean setups, reliable gear, practical recommendations, crisp technology, and helpful support.

Guidelines:
- Keep responses under 80 words unless the customer asks for detail.
- Ask one useful question when a recommendation depends on device type, budget, workspace, or gaming/work use.
- Recommend categories and benefits, not unsupported technical claims.
- For shipping, mention secure checkout, order tracking, and support instead of making region-specific promises unless the user provides a destination.
- Be friendly, direct, and product-focused.
`;

export const NAV_LINKS = [
  { name: "Shop", path: "/shop" },
  { name: "Keyboards", path: "/shop?category=keyboards" },
  { name: "Gaming", path: "/shop?category=gaming" },
  { name: "Mobile", path: "/shop?category=mobile-tablet" },
  { name: "Audio", path: "/shop?category=audio" },
  { name: "Support", path: "/shipping" },
];

export const FOOTER_LINKS = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Desk Setups", href: "/shop?category=desk-setups" },
    { name: "Office Keyboards", href: "/shop?category=keyboards" },
    { name: "Gaming Peripherals", href: "/shop?category=gaming" },
    { name: "Mobile & Tablet", href: "/shop?category=mobile-tablet" },
    { name: "Bluetooth Audio", href: "/shop?category=audio" },
  ],
  company: [
    { name: "About GEEX", href: "/about" },
    { name: "Journal", href: "/journal" },
    { name: "Contact", href: `mailto:${COMPANY_INFO.email}` },
  ],
  support: [
    { name: "Track My Order", href: "/order/lookup" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Account", href: "/account" },
  ],
  legal: [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};
