"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getProductsWithVariantImages } from "@/lib/medusa"
import { FlightDeliveryAnimation } from "./components/FlightDeliveryAnimation"
import { OrderLookupForm } from "./components/OrderLookupForm"
import { OrderSummary } from "./components/OrderSummary"
import { TrackingMap } from "./components/TrackingMap"
import { TrackingStatusSummary } from "./components/TrackingStatusSummary"
import { TrackingTimeline } from "./components/TrackingTimeline"
import type { LookupOrder, PublicTracking } from "./components/types"

const ORDER_LOOKUP_SESSION_KEY = "geex:last-order-lookup"

type StoredLookup = {
  order: string
  email: string
}

function normalizeOrderId(orderId: string) {
  return orderId.startsWith("order_") ? orderId : `order_${orderId}`
}

function readStoredLookup(): StoredLookup | null {
  if (typeof window === "undefined") return null

  try {
    const storedLookup = window.sessionStorage.getItem(ORDER_LOOKUP_SESSION_KEY)
    if (!storedLookup) return null

    const parsedLookup = JSON.parse(storedLookup) as Partial<StoredLookup>
    if (
      typeof parsedLookup.order === "string" &&
      typeof parsedLookup.email === "string" &&
      parsedLookup.order.trim() &&
      parsedLookup.email.trim()
    ) {
      return {
        order: parsedLookup.order,
        email: parsedLookup.email,
      }
    }
  } catch (error) {
    console.error("Failed to restore order lookup:", error)
  }

  window.sessionStorage.removeItem(ORDER_LOOKUP_SESSION_KEY)
  return null
}

function persistLookup(order: string, email: string) {
  if (typeof window === "undefined") return

  const fullOrderId = normalizeOrderId(order.trim())
  const normalizedEmail = email.trim()
  const params = new URLSearchParams()

  params.set("order", fullOrderId)
  params.set("email", normalizedEmail)
  window.sessionStorage.setItem(
    ORDER_LOOKUP_SESSION_KEY,
    JSON.stringify({
      order: fullOrderId,
      email: normalizedEmail,
    })
  )
  window.history.replaceState(null, "", `/order/lookup?${params.toString()}`)
}

function clearPersistedLookup() {
  if (typeof window === "undefined") return

  window.sessionStorage.removeItem(ORDER_LOOKUP_SESSION_KEY)
  window.history.replaceState(null, "", "/order/lookup")
}

function OrderLookupContent() {
  const searchParams = useSearchParams()
  const restoredLookupRef = useRef<string | null>(null)
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<LookupOrder | null>(null)
  const [trackingData, setTrackingData] = useState<PublicTracking | null>(null)
  const [variantImageMap, setVariantImageMap] = useState<Record<string, string>>({})

  useEffect(() => {
    async function resolveVariantImages() {
      if (!orderData?.items?.length) return

      const productIds = new Set<string>()

      orderData.items.forEach((item) => {
        if (item.variant_id && item.product_id) {
          productIds.add(item.product_id)
        }
      })

      if (productIds.size === 0) return

      try {
        const products = await getProductsWithVariantImages(Array.from(productIds), orderData.region_id || undefined)
        const nextVariantImages: Record<string, string> = {}

        products.forEach((product: any) => {
          const productImage = product.thumbnail || product.images?.[0]?.url

          product.variants?.forEach((variant: any) => {
            if (!variant.id) return

            if (variant.thumbnail) {
              nextVariantImages[variant.id] = variant.thumbnail
              return
            }

            if (variant.images?.length) {
              const sorted = [...variant.images].sort((a: any, b: any) => (a.rank ?? 999) - (b.rank ?? 999))
              nextVariantImages[variant.id] = sorted[0].url
              return
            }

            if (productImage) {
              nextVariantImages[variant.id] = productImage
            }
          })
        })

        if (Object.keys(nextVariantImages).length > 0) {
          setVariantImageMap((current) => ({ ...current, ...nextVariantImages }))
        }
      } catch (error) {
        console.error("Failed to fetch variant images:", error)
      }
    }

    resolveVariantImages()
  }, [orderData])

  const lookupOrder = useCallback(async (id: string, mail: string, options: { persist?: boolean } = {}) => {
    const normalizedOrder = id.trim()
    const normalizedEmail = mail.trim()

    if (!normalizedOrder || !normalizedEmail) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    setError(null)
    setOrderData(null)
    setTrackingData(null)
    setVariantImageMap({})

    try {
      const fullOrderId = normalizeOrderId(normalizedOrder)
      const response = await fetch(`/api/medusa/store/orders/${fullOrderId}/lookup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found with provided details.")
        }

        const data = await response.json().catch(() => null)
        throw new Error(data?.message || "Could not retrieve order details.")
      }

      const data = await response.json()
      setOrderData(data.order)
      setTrackingData(data.tracking)

      if (options.persist) {
        persistLookup(fullOrderId, normalizedEmail)
        setOrderId(fullOrderId)
        setEmail(normalizedEmail)
      }
    } catch (err: any) {
      console.error("Lookup error:", err)
      setError(err.message || "We couldn't find an order confirming those details. Please check and try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLookup = async (event: React.FormEvent) => {
    event.preventDefault()
    await lookupOrder(orderId, email, { persist: true })
  }

  useEffect(() => {
    const urlOrder = searchParams.get("order")
    const urlEmail = searchParams.get("email")
    const storedLookup = !urlOrder || !urlEmail ? readStoredLookup() : null
    const nextOrder = urlOrder && urlEmail ? urlOrder : storedLookup?.order
    const nextEmail = urlOrder && urlEmail ? urlEmail : storedLookup?.email

    if (!nextOrder || !nextEmail) return

    const lookupKey = `${nextOrder}:${nextEmail}`
    if (restoredLookupRef.current === lookupKey) return

    restoredLookupRef.current = lookupKey
    setOrderId(nextOrder)
    setEmail(nextEmail)
    lookupOrder(nextOrder, nextEmail)
  }, [lookupOrder, searchParams])

  return (
    <div className="min-h-screen bg-cool-white pt-24 pb-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orbit-blue">
            GEEX global fulfillment
          </p>
          <h1 className="font-display text-4xl font-black uppercase leading-tight text-near-black sm:text-5xl">
            Track Your Order
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink-muted sm:text-base">
            Enter your order ID and checkout email to view customer-safe delivery progress, carrier updates, and estimated route status.
          </p>
        </div>

        {!orderData || !trackingData ? (
          <div className="mx-auto max-w-xl">
            <OrderLookupForm
              orderId={orderId}
              email={email}
              loading={loading}
              error={error}
              onOrderIdChange={setOrderId}
              onEmailChange={setEmail}
              onSubmit={handleLookup}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <TrackingStatusSummary tracking={trackingData} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
              <div className="space-y-6">
                <FlightDeliveryAnimation tracking={trackingData} />
                <TrackingTimeline tracking={trackingData} />
              </div>
              <div className="space-y-6">
                <TrackingMap tracking={trackingData} />
                <OrderSummary order={orderData} variantImageMap={variantImageMap} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/shop"
                className="block bg-near-black px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-hover"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  clearPersistedLookup()
                  restoredLookupRef.current = null
                  setOrderId("")
                  setEmail("")
                  setError(null)
                  setOrderData(null)
                  setTrackingData(null)
                  setVariantImageMap({})
                }}
                className="border border-line-gray bg-white px-6 py-4 text-xs font-bold uppercase tracking-widest text-near-black transition-colors hover:border-near-black"
              >
                Search another order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrderLookupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-cool-white"><div className="h-6 w-6 rounded-full border-2 border-orbit-blue border-t-transparent animate-spin" /></div>}>
      <OrderLookupContent />
    </Suspense>
  )
}
