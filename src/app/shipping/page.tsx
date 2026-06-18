import { COMPANY_INFO } from "@/lib/constants";

export const metadata = { title: "Shipping & Delivery | GEEX" };

export default function ShippingPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-black uppercase text-near-black">Shipping & Delivery</h1>
        <div className="prose prose-lg text-ink-muted">
          <h2>Delivery Times</h2>
          <p>Delivery estimates depend on destination, stock status, and carrier availability. Available options appear during checkout.</p>
          <ul>
            <li><strong>Standard:</strong> economical tracked delivery where available</li>
            <li><strong>Express:</strong> faster delivery for selected regions</li>
            <li><strong>International:</strong> destination duties and taxes may apply</li>
          </ul>
          <h2>Secure Packaging</h2>
          <p>Electronics and accessories are packed to reduce transit movement and protect product boxes where practical.</p>
          <h2>Tracking</h2>
          <p>When a carrier supports tracking, details are sent after fulfillment and may also appear in your account.</p>
          <h2>Contact</h2>
          <p>For shipping questions, contact <a href={`mailto:${COMPANY_INFO.email}`} className="text-blue-hover">{COMPANY_INFO.email}</a>.</p>
          <p className="mt-8 text-sm text-gray-400">{COMPANY_INFO.name}</p>
        </div>
      </div>
    </div>
  );
}
