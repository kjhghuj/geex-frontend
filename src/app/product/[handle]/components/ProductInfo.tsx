"use client";

import { useState } from "react";
import { StoreProduct } from "@/lib/types";

interface ProductInfoProps {
  product: StoreProduct;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line-gray">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-near-black">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-4 w-4 text-ink-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
      </div>
    </div>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const hasMaterial = !!product.material;
  const hasWeight = !!product.weight;
  const hasDimensions = product.length || product.width || product.height;

  return (
    <div className="border-t border-line-gray pt-6">
      {(hasMaterial || hasWeight || hasDimensions) && (
        <AccordionItem title="Specs & Materials" defaultOpen>
          <div className="space-y-3">
            {hasMaterial && (
              <div className="flex justify-between gap-4">
                <span className="text-ink-muted">Material</span>
                <span className="text-right text-near-black">{product.material}</span>
              </div>
            )}
            {hasWeight && (
              <div className="flex justify-between gap-4">
                <span className="text-ink-muted">Weight</span>
                <span className="text-near-black">{product.weight}g</span>
              </div>
            )}
            {hasDimensions && (
              <div className="flex justify-between gap-4">
                <span className="text-ink-muted">Dimensions</span>
                <span className="text-near-black">
                  {[product.length, product.width, product.height].filter(Boolean).join(" x ")} mm
                </span>
              </div>
            )}
          </div>
        </AccordionItem>
      )}

      <AccordionItem title="Compatibility & Setup">
        <div className="space-y-2">
          <p>Check connector type, Bluetooth support, operating system notes, and device size before ordering.</p>
          <p>For keyboards and peripherals, confirm layout, switch preference, charging method, and desk space.</p>
          <p>For mobile and tablet gear, confirm model size, case thickness, and charging port access.</p>
        </div>
      </AccordionItem>

      <AccordionItem title="Shipping & Delivery">
        <div className="space-y-2">
          <p><strong>Standard delivery:</strong> estimated delivery dates appear at checkout.</p>
          <p><strong>Order tracking:</strong> tracking details are sent after fulfillment.</p>
          <p className="mt-3 border-t border-line-gray pt-3">
            Orders are packed securely to protect electronics and accessories in transit.
          </p>
        </div>
      </AccordionItem>

      <AccordionItem title="Returns & Warranty">
        <div className="space-y-2">
          <p>Unused items in original condition can be returned within the posted returns window.</p>
          <p>If an item arrives damaged or faulty, contact support within 48 hours with your order number and photos.</p>
          <p className="mt-2">
            <a href="/returns" className="text-blue-hover hover:underline">View full returns policy</a>
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}
