import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const checkoutPage = readFileSync("src/app/checkout/page.tsx", "utf8");
const contactForm = readFileSync("src/app/checkout/components/ContactForm.tsx", "utf8");
const countrySelect = readFileSync("src/app/checkout/components/CountrySelect.tsx", "utf8");

test("checkout back link is encoded safely", () => {
  assert(!checkoutPage.includes("鈫?"), "Back to Cart link should not contain mojibake");
  assert(!checkoutPage.includes("閳?"), "Back to Cart link should not contain mojibake");
  assert(
    checkoutPage.includes("&larr; Back to Cart"),
    "Back to Cart link should use an ASCII-safe arrow entity",
  );
});

test("checkout validates every required field before saving cart shipping data", () => {
  const fieldValidationIndex = checkoutPage.indexOf("const validationError = getCheckoutValidationError(");
  const cartInvalidIndex = checkoutPage.indexOf('setError("Your cart is empty or invalid")');
  const updateCartIndex = checkoutPage.indexOf("fetch(`/api/medusa/store/carts/${cart.id}`");

  assert(updateCartIndex > -1, "cart update request should still exist");
  assert(fieldValidationIndex > -1, "checkout should run field validation before network writes");
  assert(cartInvalidIndex > -1, "cart invalid branch should still exist");
  assert(
    fieldValidationIndex < cartInvalidIndex,
    "field validation should run before cart invalid errors",
  );
  assert(
    fieldValidationIndex < updateCartIndex,
    "field validation should run before saving shipping information",
  );
});

test("Stripe card fields are tracked separately", () => {
  for (const elementName of ["CardNumberElement", "CardExpiryElement", "CardCvcElement"]) {
    assert(contactForm.includes(elementName), `ContactForm should render ${elementName}`);
  }

  for (const handlerName of ["onCardNumberChange", "onCardExpiryChange", "onCardCvcChange"]) {
    assert(contactForm.includes(handlerName), `ContactForm should wire ${handlerName}`);
  }
});

test("checkout has clear validation copy for each blank field", () => {
  const expectedMessages = [
    "Enter your name.",
    "Enter your phone number.",
    "Enter your email address.",
    "Enter your shipping address.",
    "Enter your city.",
    "Enter your postal code.",
    "Select your country.",
    "Enter your card number.",
    "Enter your card expiration date.",
    "Enter your card CVC.",
    "Enter the cardholder name.",
  ];

  for (const message of expectedMessages) {
    assert(checkoutPage.includes(message), `Missing validation copy: ${message}`);
  }
});

test("checkout inputs use functional state updates so rapid filling does not drop fields", () => {
  assert(
    contactForm.includes("setBillingData((current) =>"),
    "billing fields should use functional setState updates",
  );
  assert(
    contactForm.includes("setCardData((current) =>"),
    "cardholder field should use functional setState updates",
  );
});

test("country choices come from the active cart region instead of hard-coded countries", () => {
  assert(
    checkoutPage.includes("const countryOptions = useMemo(() => getCountryOptions("),
    "checkout page should derive country options from cart/region data",
  );
  assert(
    checkoutPage.includes("countryOptions={countryOptions}"),
    "ContactForm should pass region-derived country options to CountrySelect",
  );
  assert(
    !countrySelect.includes('value: "us"'),
    "CountrySelect should not hard-code United States when the active region may not support it",
  );
});
