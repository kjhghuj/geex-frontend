import { COMPANY_INFO } from "@/lib/constants";

export const metadata = { title: "Terms & Conditions | GEEX" };

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-black uppercase text-near-black">Terms & Conditions</h1>
        <div className="prose prose-lg text-ink-muted">
          <p className="text-sm text-gray-400">Last updated: January 2026</p>
          <h2>1. Introduction</h2>
          <p>Welcome to GEEX. By accessing our website or purchasing products, you agree to these terms.</p>
          <h2>2. Products</h2>
          <p>Product descriptions, images, compatibility notes, and specifications are provided for guidance. Please check device compatibility before purchase.</p>
          <h2>3. Pricing</h2>
          <p>Prices are shown in the active store currency and may change without notice. Taxes, duties, and delivery charges are shown where applicable at checkout.</p>
          <h2>4. Payment</h2>
          <p>Payments are processed through secure third-party payment providers. GEEX does not store full card numbers.</p>
          <h2>5. Intellectual Property</h2>
          <p>GEEX branding, imagery, copy, and design elements may not be used without permission.</p>
          <h2>6. Limitation of Liability</h2>
          <p>GEEX is not liable for indirect or consequential damages arising from product use, device incompatibility, or delayed delivery except where required by law.</p>
          <h2>7. Contact</h2>
          <p>For support, contact <a href={`mailto:${COMPANY_INFO.email}`} className="text-blue-hover">{COMPANY_INFO.email}</a>.</p>
          <p className="mt-8 text-sm text-gray-400">{COMPANY_INFO.legalName} | Reg: {COMPANY_INFO.regNo}</p>
        </div>
      </div>
    </div>
  );
}
