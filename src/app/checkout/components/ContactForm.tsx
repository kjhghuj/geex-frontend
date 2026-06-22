import type { Dispatch, SetStateAction } from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import type {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";
import { CountrySelect } from "./CountrySelect";

interface BillingData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CardData {
  name: string;
}

interface CountryOption {
  value: string;
  label: string;
}

interface ContactFormProps {
  billingData: BillingData;
  setBillingData: Dispatch<SetStateAction<BillingData>>;
  cardData: CardData;
  setCardData: Dispatch<SetStateAction<CardData>>;
  countryOptions: CountryOption[];
  onCardNumberChange: (event: StripeCardNumberElementChangeEvent) => void;
  onCardExpiryChange: (event: StripeCardExpiryElementChangeEvent) => void;
  onCardCvcChange: (event: StripeCardCvcElementChangeEvent) => void;
}

const stripeElementStyle = {
  base: {
    fontSize: "16px",
    color: "#2c2c2c",
    "::placeholder": { color: "#9ca3af" },
  },
};

const cardNumberOptions = {
  showIcon: true,
  style: stripeElementStyle,
};

const cardExpiryOptions = {
  style: stripeElementStyle,
};

const cardCvcOptions = {
  style: stripeElementStyle,
};

export function ContactForm({
  billingData,
  setBillingData,
  cardData,
  setCardData,
  countryOptions,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvcChange,
}: ContactFormProps) {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-xl text-near-black mb-4">Contact Information</h2>
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Name</label>
              <input
                type="text"
                value={billingData.name}
                onChange={(e) => setBillingData((current) => ({ ...current, name: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Phone Number</label>
              <input
                type="tel"
                value={billingData.phone}
                onChange={(e) => setBillingData((current) => ({ ...current, phone: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Email</label>
            <input
              type="email"
              value={billingData.email}
              onChange={(e) => setBillingData((current) => ({ ...current, email: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
              required
            />
          </div>
        </div>

        <h2 className="font-serif text-xl text-near-black mb-4">Shipping Address</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Address</label>
            <textarea
              value={billingData.address}
              onChange={(e) => setBillingData((current) => ({ ...current, address: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue min-h-[80px] rounded-lg"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">City</label>
              <input
                type="text"
                value={billingData.city}
                onChange={(e) => setBillingData((current) => ({ ...current, city: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Postal Code</label>
              <input
                type="text"
                value={billingData.postalCode}
                onChange={(e) => setBillingData((current) => ({ ...current, postalCode: e.target.value }))}
                className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Country</label>
            <CountrySelect
              value={billingData.country}
              onChange={(val) => setBillingData((current) => ({ ...current, country: val }))}
              options={countryOptions}
              required
            />
          </div>
        </div>

        <h2 className="font-serif text-xl text-near-black mb-4 mt-8">Payment Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Card Number</label>
            <div className="w-full border border-gray-200 px-4 py-3 focus-within:border-orbit-blue rounded-lg bg-white">
              <CardNumberElement onChange={onCardNumberChange} options={cardNumberOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Expiration Date</label>
              <div className="w-full border border-gray-200 px-4 py-3 focus-within:border-orbit-blue rounded-lg bg-white">
                <CardExpiryElement onChange={onCardExpiryChange} options={cardExpiryOptions} />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-near-black mb-2">CVC</label>
              <div className="w-full border border-gray-200 px-4 py-3 focus-within:border-orbit-blue rounded-lg bg-white">
                <CardCvcElement onChange={onCardCvcChange} options={cardCvcOptions} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-near-black mb-2">Cardholder Name</label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData((current) => ({ ...current, name: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-3 focus:outline-none focus:border-orbit-blue rounded-lg"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}
