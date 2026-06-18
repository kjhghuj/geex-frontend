import { COMPANY_INFO } from "@/lib/constants";

export const metadata = { title: "Returns & Refunds | GEEX" };

export default function ReturnsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 text-4xl font-black uppercase text-near-black">Returns & Refunds</h1>
        <div className="prose prose-lg text-ink-muted">
          <h2>30-Day Returns</h2>
          <p>Unused electronics and accessories in original condition can be returned within 30 days unless a product page states a different policy.</p>
          <h2>How to Return</h2>
          <ol>
            <li>Contact {COMPANY_INFO.email} with your order number.</li>
            <li>Wait for return instructions before shipping items back.</li>
            <li>Pack the item securely with original accessories and packaging.</li>
            <li>Use a tracked service when returning higher-value electronics.</li>
          </ol>
          <h2>Refund Processing</h2>
          <p>After inspection, approved refunds are returned to the original payment method within the processor timeline.</p>
          <h2>Faulty Products</h2>
          <p>If an item arrives damaged or faulty, contact us within 48 hours with photos and your order number.</p>
          <h2>Warranty</h2>
          <p>Warranty coverage depends on the item and manufacturer. Product misuse, liquid damage, and normal wear are not covered unless required by law.</p>
          <p className="mt-8 text-sm text-gray-400">{COMPANY_INFO.name}</p>
        </div>
      </div>
    </div>
  );
}
