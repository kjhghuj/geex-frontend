"use client"

import { PlaneTakeoff } from "lucide-react"
import type { PublicTracking } from "./types"

type FlightDeliveryAnimationProps = {
  tracking: PublicTracking
}

export function FlightDeliveryAnimation({ tracking }: FlightDeliveryAnimationProps) {
  return (
    <section className="relative overflow-hidden border border-line-gray bg-near-black p-6 text-white shadow-sm sm:p-8">
      <div className="relative z-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orbit-blue">
          {tracking.fulfillment_label}
        </p>
        <h3 className="font-display text-xl font-black uppercase text-white sm:text-2xl">
          Your gear is on the way
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
          In transit to the United States with carrier scan updates powering the estimated route.
        </p>
      </div>

      <div className="relative mt-8 h-28 overflow-hidden border border-white/10 bg-white/[0.03]">
        <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-orbit-blue/70" />
        <div className="geex-flight-plane absolute top-1/2 text-orbit-blue">
          <PlaneTakeoff className="h-14 w-14" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="absolute bottom-4 left-6 text-[10px] font-bold uppercase tracking-widest text-white/50">
          GEEX global fulfillment
        </div>
        <div className="absolute bottom-4 right-6 text-[10px] font-bold uppercase tracking-widest text-white/50">
          United States
        </div>
      </div>

      <style>{`
        @keyframes geex-flight {
          0% { transform: translate(-85%, -50%) rotate(-3deg); opacity: 0; }
          12% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translate(calc(100vw + 20px), -50%) rotate(2deg); opacity: 0; }
        }

        .geex-flight-plane {
          animation: geex-flight 4.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          filter: drop-shadow(0 0 12px rgba(130, 200, 222, 0.65));
        }
      `}</style>
    </section>
  )
}
