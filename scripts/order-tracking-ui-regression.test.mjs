import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), "utf8")
const exists = (file) => fs.existsSync(path.join(root, file))

const packageJson = JSON.parse(read("package.json"))

assert.equal(
  Boolean(packageJson.dependencies?.["maplibre-gl"]),
  true,
  "maplibre-gl dependency should be installed for the tracking map"
)

assert.equal(
  exists("src/app/order/lookup/components/TrackingMap.tsx"),
  true,
  "TrackingMap component should exist"
)

assert.equal(
  exists("src/app/order/lookup/components/FlightDeliveryAnimation.tsx"),
  true,
  "FlightDeliveryAnimation component should exist"
)

const page = read("src/app/order/lookup/page.tsx")
const trackingMap = read("src/app/order/lookup/components/TrackingMap.tsx")
const flightAnimation = read("src/app/order/lookup/components/FlightDeliveryAnimation.tsx")
const trackingTimeline = read("src/app/order/lookup/components/TrackingTimeline.tsx")
const orderSummary = read("src/app/order/lookup/components/OrderSummary.tsx")
const trackingTypes = read("src/app/order/lookup/components/types.ts")

assert.match(page, /\/store\/orders\/\$\{fullOrderId\}\/lookup/, "order lookup should use the backend lookup route")
assert.match(page, /method:\s*"POST"/, "order lookup should POST the customer email to the backend")
assert.doesNotMatch(page, /order\.email\.toLowerCase\(\)\s*!==/, "email authorization must not be performed in the browser")
assert.match(page, /TrackingStatusSummary/, "order page should render tracking status")
assert.match(page, /TrackingMap/, "order page should render the map panel")
assert.match(page, /TrackingTimeline/, "order page should render the text timeline")
assert.match(page, /ORDER_LOOKUP_SESSION_KEY/, "order lookup should define a stable session storage key")
assert.match(page, /sessionStorage\.setItem/, "successful order lookup should persist the query in session storage")
assert.match(page, /sessionStorage\.getItem/, "order lookup page should restore the last query from session storage")
assert.match(page, /history\.replaceState/, "successful order lookup should update the current URL for refresh persistence")
assert.match(page, /sessionStorage\.removeItem/, "searching another order should clear the persisted lookup")
assert.match(trackingTypes, /fulfillment_status\?:\s*string/, "lookup order type should include Medusa fulfillment status")
assert.match(orderSummary, /order\.fulfillment_status\s*\|\|\s*order\.status/, "order summary should prefer fulfillment status over base order status")
assert.match(orderSummary, /orderStatusLabels/, "order summary should map raw order statuses to customer-friendly labels")
assert.match(orderSummary, /not_fulfilled/, "order summary status labels should include not_fulfilled")
assert.match(orderSummary, /partially_fulfilled/, "order summary status labels should include partially_fulfilled")
assert.match(orderSummary, /fulfilled/, "order summary status labels should include fulfilled")
assert.match(orderSummary, /partially_shipped/, "order summary status labels should include partially_shipped")
assert.match(orderSummary, /shipped/, "order summary status labels should include shipped")
assert.match(orderSummary, /partially_delivered/, "order summary status labels should include partially_delivered")
assert.match(orderSummary, /delivered/, "order summary status labels should include delivered")
assert.match(orderSummary, /canceled/, "order summary status labels should include canceled")
assert.match(orderSummary, /pending/, "order summary status labels should include pending")
assert.match(orderSummary, /completed/, "order summary status labels should include completed")

assert.match(trackingMap, /import\("maplibre-gl"\)/, "TrackingMap should lazy-load MapLibre GL JS")
assert.match(trackingMap, /Estimated route/, "TrackingMap should label the map as an estimated route")
assert.match(trackingMap, /GEEX global fulfillment/, "TrackingMap should use the public fulfillment wording")
assert.match(trackingMap, /tracking\.map\.nodes/, "TrackingMap should render backend-provided public route nodes")
assert.match(trackingMap, /progress_percent/, "TrackingMap should render backend-provided route progress")
assert.match(trackingMap, /current_public_location/, "TrackingMap should show the current public location")
assert.match(
  trackingMap,
  /Route visualization is based on carrier scan updates and may be approximate\./,
  "TrackingMap should explain that the map is an estimated visualization"
)
assert.doesNotMatch(trackingMap, /Ships from USA|Ships from UK|China, Shenzhen/i, "map copy must not imply a fake origin")

assert.match(flightAnimation, /Your gear is on the way/, "flight animation should carry the delivery message")
assert.match(flightAnimation, /GEEX global fulfillment/, "flight animation should use the public fulfillment wording")
assert.match(flightAnimation, /PlaneTakeoff/, "flight animation should use the standard aircraft icon")
assert.doesNotMatch(flightAnimation, /M3 20L70 3L54 20L70 35L3 20Z/, "flight animation must not use the old paper-plane path")
assert.match(trackingTimeline, /GEEX global fulfillment/, "timeline should use the public fulfillment wording")

console.log("Order tracking UI regression checks passed.")
