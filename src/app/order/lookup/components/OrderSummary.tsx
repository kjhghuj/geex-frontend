"use client"

import type { LookupOrder } from "./types"

type OrderSummaryProps = {
  order: LookupOrder
  variantImageMap: Record<string, string>
}

const orderStatusLabels: Record<string, string> = {
  not_fulfilled: "Preparing",
  partially_fulfilled: "Partially fulfilled",
  fulfilled: "Fulfilled",
  partially_shipped: "Partially shipped",
  shipped: "Shipped",
  partially_delivered: "Partially delivered",
  delivered: "Delivered",
  pending: "Pending",
  completed: "Completed",
  draft: "Draft",
  archived: "Archived",
  canceled: "Canceled",
  requires_action: "Needs attention",
}

function formatPrice(amount: number, currencyCode: string) {
  return (amount / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  })
}

export function OrderSummary({ order, variantImageMap }: OrderSummaryProps) {
  const displayedStatus = order.fulfillment_status || order.status
  const displayedStatusLabel = orderStatusLabels[displayedStatus] || displayedStatus.replace(/_/g, " ")

  return (
    <section className="border border-line-gray bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-line-gray pb-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">Status</p>
          <span className="inline-flex border border-orbit-blue/30 bg-orbit-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-near-black">
            {displayedStatusLabel}
          </span>
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">Date</p>
          <p className="text-sm font-semibold text-near-black">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        {order.items?.map((item) => {
          const variantImage = item.variant_id ? variantImageMap[item.variant_id] : null
          const imageUrl = variantImage || item.thumbnail

          return (
            <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden border border-line-gray bg-cool-white">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-near-black">{item.title}</p>
                  <p className="text-sm text-ink-muted">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="flex-shrink-0 font-semibold text-near-black">
                {formatPrice(item.unit_price, order.currency_code)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-line-gray pt-6">
        <span className="font-display text-lg font-black uppercase text-near-black">Total</span>
        <span className="font-display text-xl font-black text-near-black">
          {formatPrice(order.total, order.currency_code)}
        </span>
      </div>
    </section>
  )
}
