"use client"

import type { PublicTracking } from "./types"

type TrackingTimelineProps = {
  tracking: PublicTracking
}

function formatTrackingDate(value: string | null) {
  if (!value) return "Update pending"
  const date = new Date(value.replace(" ", "T"))

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrackingTimeline({ tracking }: TrackingTimelineProps) {
  return (
    <section className="border border-line-gray bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orbit-blue">
          GEEX global fulfillment
        </p>
        <h3 className="font-display text-xl font-black uppercase text-near-black">
          Tracking updates
        </h3>
      </div>

      <div className="space-y-0">
        {tracking.events.map((event, index) => (
          <div key={event.id} className="grid grid-cols-[18px_1fr] gap-4">
            <div className="relative flex justify-center">
              <span className="mt-1 h-3.5 w-3.5 rounded-full border-2 border-near-black bg-orbit-blue" />
              {index < tracking.events.length - 1 && (
                <span className="absolute top-5 h-full w-px bg-line-gray" />
              )}
            </div>
            <div className="pb-6">
              <div className="border border-line-gray bg-cool-white p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h4 className="font-display text-sm font-black uppercase tracking-wide text-near-black">
                    {event.title}
                  </h4>
                  <span className="text-xs font-semibold text-ink-muted">
                    {formatTrackingDate(event.occurred_at)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{event.description}</p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  {event.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
