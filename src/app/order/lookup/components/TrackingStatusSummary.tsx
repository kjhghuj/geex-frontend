"use client"

import type { PublicTracking } from "./types"

type TrackingStatusSummaryProps = {
  tracking: PublicTracking
}

const statusLabels: Record<PublicTracking["status"], string> = {
  pending_tracking: "Pending tracking",
  processing: "Processing",
  in_transit: "In transit",
  arrived_us: "Arrived in the United States",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Needs attention",
}

export function TrackingStatusSummary({ tracking }: TrackingStatusSummaryProps) {
  return (
    <section className="border border-line-gray bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orbit-blue">
            {tracking.fulfillment_label}
          </p>
          <h2 className="font-display text-2xl font-black uppercase leading-tight text-near-black sm:text-3xl">
            {tracking.headline}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            {tracking.summary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="border border-line-gray bg-cool-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Status</p>
            <p className="mt-1 text-sm font-bold text-near-black">{statusLabels[tracking.status]}</p>
          </div>
          <div className="border border-line-gray bg-cool-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Carrier</p>
            <p className="mt-1 text-sm font-bold text-near-black">{tracking.carrier_name || "Carrier syncing"}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
