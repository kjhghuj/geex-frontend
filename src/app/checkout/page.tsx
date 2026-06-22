"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart, useRegion } from "@/lib/providers";
import { CheckoutError } from "./components/CheckoutError";
import { ContactForm } from "./components/ContactForm";
import { SubmitButton } from "./components/SubmitButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

type StripeFieldState = {
  complete: boolean;
  empty: boolean;
  error: string | null;
};

type CardState = {
  number: StripeFieldState;
  expiry: StripeFieldState;
  cvc: StripeFieldState;
};

type BillingData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type CardData = {
  name: string;
};

type CountryOption = {
  value: string;
  label: string;
};

const emptyStripeFieldState: StripeFieldState = {
  complete: false,
  empty: true,
  error: null,
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

function getStripeFieldValidationError(
  fieldState: StripeFieldState,
  emptyMessage: string,
  incompleteMessage: string,
) {
  if (fieldState.error) {
    return fieldState.error;
  }

  if (fieldState.empty) {
    return emptyMessage;
  }

  if (!fieldState.complete) {
    return incompleteMessage;
  }

  return null;
}

function getCheckoutValidationError(
  billingData: BillingData,
  cardData: CardData,
  cardState: CardState,
) {
  if (!billingData.name.trim()) return "Enter your name.";
  if (!billingData.phone.trim()) return "Enter your phone number.";
  if (!billingData.email.trim()) return "Enter your email address.";
  if (!isValidEmail(billingData.email.trim())) return "Enter a valid email address.";
  if (!billingData.address.trim()) return "Enter your shipping address.";
  if (!billingData.city.trim()) return "Enter your city.";
  if (!billingData.postalCode.trim()) return "Enter your postal code.";
  if (!billingData.country.trim()) return "Select your country.";

  const cardNumberError = getStripeFieldValidationError(
    cardState.number,
    "Enter your card number.",
    "Enter a valid card number.",
  );
  if (cardNumberError) return cardNumberError;

  const cardExpiryError = getStripeFieldValidationError(
    cardState.expiry,
    "Enter your card expiration date.",
    "Enter a valid card expiration date.",
  );
  if (cardExpiryError) return cardExpiryError;

  const cardCvcError = getStripeFieldValidationError(
    cardState.cvc,
    "Enter your card CVC.",
    "Enter a valid card CVC.",
  );
  if (cardCvcError) return cardCvcError;

  if (!cardData.name.trim()) return "Enter the cardholder name.";

  return null;
}

function getCountryOptions(cartRegion: any, fallbackRegion: any): CountryOption[] {
  const countries = cartRegion?.countries?.length ? cartRegion.countries : fallbackRegion?.countries || [];

  return countries
    .map((country: any) => ({
      value: country.iso_2,
      label: country.display_name || country.name || country.iso_2?.toUpperCase(),
    }))
    .filter((country: CountryOption) => country.value && country.label)
    .sort((a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label));
}

function CheckoutForm() {
  const { cart, refreshCart } = useCart();
  const { region } = useRegion();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const countryOptions = useMemo(() => getCountryOptions(cart?.region, region), [cart?.region, region]);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardState, setCardState] = useState<CardState>({
    number: emptyStripeFieldState,
    expiry: emptyStripeFieldState,
    cvc: emptyStripeFieldState,
  });

  const [cardData, setCardData] = useState<CardData>({
    name: "",
  });

  const [billingData, setBillingData] = useState<BillingData>({
    name: "", // Combined name
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const validationError = getCheckoutValidationError(billingData, cardData, cardState);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Redirect if cart is invalid OR already completed
    if (!cart?.id || cart.items?.length === 0 || cart.completed_at) {
      if (cart?.completed_at) {
        // If completed, trigger a refresh to clear it and create new one
        refreshCart();
        router.push("/cart"); // or /account
        return;
      }
      setError("Your cart is empty or invalid");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    setProcessing(true);
    setError(null);

    try {
      // Split name into first and last
      const nameParts = billingData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // 0.1 Update Cart with Email and Address (CRITICAL STEP)
      const updateCartResponse = await fetch(`/api/medusa/store/carts/${cart.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          email: billingData.email,
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            phone: billingData.phone,
            address_1: billingData.address,
            city: billingData.city,
            country_code: billingData.country,
            postal_code: billingData.postalCode,
          },
          billing_address: {
            first_name: firstName,
            last_name: lastName,
            phone: billingData.phone,
            address_1: billingData.address,
            city: billingData.city,
            country_code: billingData.country,
            postal_code: billingData.postalCode,
          }
        }),
      });

      if (!updateCartResponse.ok) {
        console.warn("[Checkout] Failed to update cart contact info", await updateCartResponse.json());
        // We might want to throw here, but maybe let it proceed? 
        // Better to throw because order will be anon/empty address otherwise.
        throw new Error("Failed to save shipping information.");
      }

      // 0.2 Auto-select Default Shipping Method
      const shippingOptionsResponse = await fetch(`/api/medusa/store/shipping-options?cart_id=${cart.id}`, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        }
      });

      if (shippingOptionsResponse.ok) {
        const { shipping_options } = await shippingOptionsResponse.json();
        if (shipping_options && shipping_options.length > 0) {
          const defaultOption = shipping_options[0];

          await fetch(`/api/medusa/store/carts/${cart.id}/shipping-methods`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
            body: JSON.stringify({ option_id: defaultOption.id }),
          });
        }
      }

      // 1. Create Payment Session & Get Client Secret
      const response = await fetch(`/api/checkout/${cart.id}/payment-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: "pp_stripe_stripe"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initialize payment");
      }

      const data = await response.json();
      const clientSecret = data.client_secret;

      if (!clientSecret) {
        throw new Error("Failed to get payment client secret");
      }

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        return_url: `${window.location.origin}/order/confirmed`,
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardData.name,
            email: billingData.email,
            phone: billingData.phone,
            address: {
              line1: billingData.address,
              city: billingData.city,
              postal_code: billingData.postalCode,
              country: billingData.country,
            },
          },
        },
      });

      if (result.error) {
        console.error("[Checkout] Stripe error:", result.error);
        throw new Error(result.error.message);
      }

      // 3. Complete Cart (Place Order)
      // Using proxy to backend: /api/medusa/store/carts/{id}/complete
      const completeResponse = await fetch(`/api/medusa/store/carts/${cart.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        // If 404/500, it might be the proxy failing. But let's assume it works or we'll debug.
        throw new Error(errorData.message || "Failed to complete order");
      }

      const completeData = await completeResponse.json();

      // Support both Medusa v1 ({ type: "order", data: ... }) and v2/direct ({ order: ... }) response formats
      const orderData = completeData.order || (completeData.type === "order" ? completeData.data : null);

      if (orderData) {
        // Success!
        // Redirect FIRST, then refresh cart to avoid re-rendering issues causing navigation aborts
        // Re-derive names for redirect
        const namePartsRedirect = billingData.name.trim().split(" ");
        const firstNameRedirect = namePartsRedirect[0] || "";
        const lastNameRedirect = namePartsRedirect.length > 1 ? namePartsRedirect.slice(1).join(" ") : "";

        const redirectUrl = `/order/confirmed?success=true&order=${orderData.id}&email=${encodeURIComponent(billingData.email)}&first_name=${encodeURIComponent(firstNameRedirect)}&last_name=${encodeURIComponent(lastNameRedirect)}`;
        router.push(redirectUrl);

        // Refresh cart afterwards (no await needed for navigation)
        refreshCart().catch(err => console.error("Background cart refresh failed:", err));
      } else if (completeData.type === "cart") {
        // Should not happen if payment succeeded, but Medusa flows can be complex.
        // If error, it usually throws.
        throw new Error("Cart completion returned cart status (payment failed?)");
      } else {
        console.warn("[Checkout] Unrecognized completion response, fallback redirect to Account:", completeData);
        // Fallback success check
        await refreshCart();
        router.push("/account"); // Fallback
      }

    } catch (error: any) {
      console.error("[Checkout] Error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <CheckoutError error={error} onClear={() => setError(null)} />
      <form onSubmit={handleSubmit} noValidate>
        <ContactForm
          billingData={billingData}
          setBillingData={setBillingData}
          cardData={cardData}
          setCardData={setCardData}
          countryOptions={countryOptions}
          onCardNumberChange={(event) =>
            setCardState((current) => ({
              ...current,
              number: {
                complete: event.complete,
                empty: event.empty,
                error: event.error?.message ?? null,
              },
            }))
          }
          onCardExpiryChange={(event) =>
            setCardState((current) => ({
              ...current,
              expiry: {
                complete: event.complete,
                empty: event.empty,
                error: event.error?.message ?? null,
              },
            }))
          }
          onCardCvcChange={(event) =>
            setCardState((current) => ({
              ...current,
              cvc: {
                complete: event.complete,
                empty: event.empty,
                error: event.error?.message ?? null,
              },
            }))
          }
        />
        <SubmitButton processing={processing} disabled={processing || !stripe || !elements} />
      </form>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-cool-white">
      <div className="max-w-[800px] mx-auto px-6">
        <Link href="/cart" className="inline-block mb-6 text-ink-muted hover:text-orbit-blue">
          &larr; Back to Cart
        </Link>
        <h1 className="font-serif text-3xl text-near-black mb-8">Checkout</h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
