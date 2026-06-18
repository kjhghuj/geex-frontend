import { COMPANY_INFO } from "@/lib/constants";

export const metadata = { title: "Privacy Policy | GEEX" };

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-black uppercase text-near-black">Privacy Policy</h1>
        <div className="prose prose-lg text-ink-muted">
          <p className="text-sm text-gray-400">Last updated: January 2026</p>
          <h2>Your Privacy Matters</h2>
          <p>GEEX collects only the information needed to process orders, provide support, improve the storefront, and send marketing when you opt in.</p>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, email, phone, and delivery details for order handling</li>
            <li>Payment status from secure third-party processors</li>
            <li>Account, cart, and support request information</li>
            <li>Marketing preferences when you subscribe</li>
          </ul>
          <h2>How We Use Data</h2>
          <p>We use customer data for checkout, shipping updates, customer support, fraud prevention, analytics, and optional marketing.</p>
          <h2>Data Security</h2>
          <p>We use encrypted connections and trusted service providers to protect order and account information.</p>
          <h2>Your Rights</h2>
          <p>You may request access, correction, deletion, or marketing opt-out where available under applicable law.</p>
          <h2>Contact</h2>
          <p>For privacy questions, contact <a href={`mailto:${COMPANY_INFO.email}`} className="text-blue-hover">{COMPANY_INFO.email}</a>.</p>
          <p className="mt-8 text-sm text-gray-400">{COMPANY_INFO.legalName} | {COMPANY_INFO.address}</p>
        </div>
      </div>
    </div>
  );
}
