export type PublicTrackingEvent = {
  id: string
  occurred_at: string | null
  title: string
  description: string
  location: string
  milestone:
    | "processing"
    | "international_transit"
    | "arrived_us"
    | "local_carrier"
    | "out_for_delivery"
    | "delivered"
    | "exception"
}

export type PublicTrackingMapNode = {
  key: "fulfillment" | "international" | "us_carrier" | "delivery"
  label: string
  status: "completed" | "current" | "pending"
}

export type PublicTracking = {
  status:
    | "pending_tracking"
    | "processing"
    | "in_transit"
    | "arrived_us"
    | "out_for_delivery"
    | "delivered"
    | "exception"
  headline: string
  fulfillment_label: "GEEX global fulfillment"
  summary: string
  tracking_number: string | null
  carrier_name: string | null
  map: {
    label: "Estimated route"
    mode: "pending" | "international" | "united_states" | "delivered" | "exception"
    destination_country: "United States"
    current_public_location: string
    progress_percent: number
    nodes: PublicTrackingMapNode[]
  }
  events: PublicTrackingEvent[]
}

export type LookupOrderItem = {
  id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string | null
  variant_id?: string | null
  product_id?: string | null
}

export type LookupOrder = {
  id: string
  display_id?: string | number | null
  status: string
  fulfillment_status?: string | null
  payment_status?: string | null
  created_at: string
  total: number
  currency_code: string
  region_id?: string | null
  items?: LookupOrderItem[]
}
