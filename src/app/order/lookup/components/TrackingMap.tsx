"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, CircleDot, MapPin } from "lucide-react"
import type { StyleSpecification } from "maplibre-gl"
import type { PublicTracking, PublicTrackingMapNode } from "./types"

type TrackingMapProps = {
  tracking: PublicTracking
}

type RouteNodeKey = PublicTrackingMapNode["key"]

const routeNodeLabels: Record<RouteNodeKey, string> = {
  fulfillment: "GEEX global fulfillment",
  international: "International transit",
  us_carrier: "United States carrier network",
  delivery: "Local delivery",
}

const routeNodeOrder: RouteNodeKey[] = ["fulfillment", "international", "us_carrier", "delivery"]

const routeCoordinates: [number, number][] = [
  [-147, 36],
  [-128, 39],
  [-111, 38],
  [-96, 39],
  [-83, 38],
]

const routeNodeCoordinates: Record<RouteNodeKey, [number, number]> = {
  fulfillment: [-147, 36],
  international: [-128, 39],
  us_carrier: [-96, 39],
  delivery: [-83, 38],
}

const routeNodeLayout: Record<RouteNodeKey, { left: string; top: string }> = {
  fulfillment: { left: "8%", top: "54%" },
  international: { left: "34%", top: "42%" },
  us_carrier: { left: "66%", top: "50%" },
  delivery: { left: "92%", top: "38%" },
}

const destinationZone: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-124, 32],
        [-123, 47],
        [-96, 49],
        [-72, 45],
        [-67, 41],
        [-74, 34],
        [-81, 26],
        [-98, 26],
        [-114, 32],
        [-124, 32],
      ],
    ],
  },
}

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    "destination-zone": {
      type: "geojson",
      data: destinationZone,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#F8FBFD",
      },
    },
    {
      id: "destination-zone-fill",
      type: "fill",
      source: "destination-zone",
      paint: {
        "fill-color": "#EAF6FA",
        "fill-opacity": 0.86,
      },
    },
    {
      id: "destination-zone-line",
      type: "line",
      source: "destination-zone",
      paint: {
        "line-color": "#82C8DE",
        "line-width": 1.5,
        "line-opacity": 0.55,
      },
    },
  ],
}

function clampProgress(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

function routeNodeFromMode(mode: PublicTracking["map"]["mode"]): RouteNodeKey {
  if (mode === "delivered") return "delivery"
  if (mode === "united_states" || mode === "exception") return "us_carrier"
  if (mode === "international") return "international"
  return "fulfillment"
}

function fallbackNodesFromMode(mode: PublicTracking["map"]["mode"]): PublicTrackingMapNode[] {
  const currentNode = routeNodeFromMode(mode)
  const currentIndex = routeNodeOrder.indexOf(currentNode)

  return routeNodeOrder.map((key, index) => ({
    key,
    label: routeNodeLabels[key],
    status: index < currentIndex ? "completed" : index === currentIndex ? "current" : "pending",
  }))
}

function fallbackProgressFromMode(mode: PublicTracking["map"]["mode"]) {
  if (mode === "delivered") return 100
  if (mode === "united_states") return 68
  if (mode === "international") return 45
  if (mode === "exception") return 55
  return 8
}

function buildProgressRoute(progressPercent: number) {
  if (progressPercent >= 100) return routeCoordinates

  const segmentCount = routeCoordinates.length - 1
  const scaledProgress = (progressPercent / 100) * segmentCount
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1)
  const segmentProgress = scaledProgress - segmentIndex
  const start = routeCoordinates[segmentIndex]
  const end = routeCoordinates[segmentIndex + 1]
  const interpolated: [number, number] = [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ]

  return [...routeCoordinates.slice(0, segmentIndex + 1), interpolated]
}

function markerClassName(status: PublicTrackingMapNode["status"]) {
  if (status === "completed") {
    return "border-orbit-blue bg-orbit-blue text-near-black shadow-[0_0_0_10px_rgba(130,200,222,0.16)]"
  }

  if (status === "current") {
    return "border-white bg-near-black text-white shadow-[0_0_0_14px_rgba(130,200,222,0.26),0_0_22px_rgba(130,200,222,0.6)]"
  }

  return "border-line-gray bg-white text-ink-muted"
}

function stageClassName(status: PublicTrackingMapNode["status"]) {
  if (status === "current") return "border-orbit-blue bg-orbit-blue/10"
  if (status === "completed") return "border-line-gray bg-cool-white"
  return "border-line-gray bg-white"
}

export function TrackingMap({ tracking }: TrackingMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const progressPercent = clampProgress(tracking.map.progress_percent ?? fallbackProgressFromMode(tracking.map.mode))
  const routeNodes = useMemo(
    () => (tracking.map.nodes?.length ? tracking.map.nodes : fallbackNodesFromMode(tracking.map.mode)),
    [tracking.map.mode, tracking.map.nodes]
  )
  const progressRouteCoordinates = useMemo(() => buildProgressRoute(progressPercent), [progressPercent])
  const pointFeatures = useMemo(
    () =>
      routeNodes.map((node) => ({
        type: "Feature" as const,
        properties: {
          label: node.label,
          status: node.status,
        },
        geometry: {
          type: "Point" as const,
          coordinates: routeNodeCoordinates[node.key],
        },
      })),
    [routeNodes]
  )
  const progressLabel = `${Math.round(progressPercent)}%`

  useEffect(() => {
    if (!containerRef.current) return

    let cancelled = false
    let map: any = null

    import("maplibre-gl")
      .then(({ default: maplibregl }) => {
        if (cancelled || !containerRef.current) return

        map = new maplibregl.Map({
          container: containerRef.current,
          style: mapStyle,
          center: [-103, 38],
          zoom: 2.4,
          interactive: false,
          attributionControl: false,
        })

        map.on("load", () => {
          if (cancelled) return

          map.addSource("estimated-route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates,
              },
            },
          })

          map.addSource("estimated-route-progress", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: progressRouteCoordinates,
              },
            },
          })

          map.addSource("route-points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: pointFeatures,
            },
          })

          map.addLayer({
            id: "estimated-route-line",
            type: "line",
            source: "estimated-route",
            paint: {
              "line-color": "#82C8DE",
              "line-width": 3,
              "line-dasharray": [1.7, 1.2],
              "line-opacity": 0.35,
            },
          })

          map.addLayer({
            id: "estimated-route-progress-line",
            type: "line",
            source: "estimated-route-progress",
            paint: {
              "line-color": "#82C8DE",
              "line-width": 5,
              "line-opacity": 0.9,
            },
          })

          map.addLayer({
            id: "route-point-halo",
            type: "circle",
            source: "route-points",
            paint: {
              "circle-radius": ["match", ["get", "status"], "current", 18, "completed", 13, 10],
              "circle-color": "#82C8DE",
              "circle-opacity": ["match", ["get", "status"], "current", 0.26, "completed", 0.18, 0.08],
            },
          })

          map.addLayer({
            id: "route-point-dot",
            type: "circle",
            source: "route-points",
            paint: {
              "circle-radius": ["match", ["get", "status"], "current", 6, "completed", 5, 4],
              "circle-color": ["match", ["get", "status"], "current", "#050607", "completed", "#48AFCF", "#FFFFFF"],
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 2,
            },
          })

          setMapReady(true)
        })
      })
      .catch(() => {
        setMapReady(false)
      })

    return () => {
      cancelled = true
      if (map) {
        map.remove()
      }
    }
  }, [pointFeatures, progressRouteCoordinates])

  return (
    <section className="overflow-hidden border border-line-gray bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-line-gray px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-muted">
            {tracking.map.label}
          </p>
          <h3 className="mt-1 font-display text-lg font-black uppercase text-near-black">
            In transit to the United States
          </h3>
          <p className="mt-2 text-xs font-semibold text-ink-muted">
            Current public update: {tracking.map.current_public_location}
          </p>
        </div>
        <div className="border border-orbit-blue/40 bg-orbit-blue/10 px-4 py-3 text-left sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Route progress</p>
          <p className="mt-1 font-display text-2xl font-black text-near-black">{progressLabel}</p>
        </div>
      </div>

      <div className="relative h-[320px] overflow-hidden bg-cool-white sm:h-[380px]">
        <div
          ref={containerRef}
          className={`absolute inset-0 transition-opacity duration-500 ${mapReady ? "opacity-70" : "opacity-0"}`}
          aria-label="Estimated route visualization map"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,251,253,0.85),rgba(248,251,253,0.32),rgba(248,251,253,0.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(130,200,222,0.2),transparent_24%),linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1))]" />
        {!mapReady && (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(130,200,222,0.08)_0_1px,transparent_1px_28px)]" />
        )}

        <div className="absolute left-4 top-4 max-w-[210px] border border-line-gray bg-white/95 p-3 shadow-sm backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Current update</p>
          <p className="mt-1 text-sm font-bold leading-5 text-near-black">{tracking.map.current_public_location}</p>
        </div>

        <div className="absolute right-4 top-4 hidden border border-line-gray bg-white/90 p-3 text-right backdrop-blur sm:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Destination</p>
          <p className="mt-1 text-sm font-bold text-near-black">{tracking.map.destination_country}</p>
        </div>

        <div className="absolute bottom-24 left-5 right-5 top-28 sm:bottom-28 sm:left-8 sm:right-8">
          <div className="absolute left-[8%] right-[8%] top-1/2 h-px border-t border-dashed border-orbit-blue/55" />
          <div
            className="absolute left-[8%] top-1/2 h-1 -translate-y-1/2 bg-orbit-blue shadow-[0_0_18px_rgba(130,200,222,0.55)]"
            style={{ width: `calc(${progressPercent}% * 0.84)` }}
          />

          {routeNodes.map((node, index) => (
            <div
              key={node.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={routeNodeLayout[node.key]}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center border-2 ${markerClassName(node.status)}`}
                aria-label={`${node.label}: ${node.status}`}
              >
                {node.status === "completed" ? (
                  <Check className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />
                ) : node.status === "current" ? (
                  <CircleDot className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                )}
              </div>
              <div className="mt-2 hidden min-w-[112px] border border-line-gray bg-white/90 px-2 py-1 text-center text-[9px] font-bold uppercase leading-4 tracking-widest text-near-black backdrop-blur sm:block">
                <span className="mr-1 text-orbit-blue">0{index + 1}</span>
                {node.label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 border border-line-gray bg-white/92 p-3 backdrop-blur">
          <div className="mb-2 h-1 bg-line-gray">
            <div className="h-full bg-orbit-blue" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            Route visualization is based on carrier scan updates and may be approximate.
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-ink-muted/80">
            Map style: GEEX public route view
          </p>
        </div>
      </div>

      <div className="grid border-t border-line-gray sm:grid-cols-4">
        {routeNodes.map((node, index) => (
          <div key={node.key} className={`border-line-gray p-4 sm:border-r sm:last:border-r-0 ${stageClassName(node.status)}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
              Step {index + 1}
            </p>
            <p className="mt-1 text-sm font-black uppercase leading-5 text-near-black">
              {node.label}
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
              {node.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
