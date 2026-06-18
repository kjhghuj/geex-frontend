"use client";

import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useNewsletter } from "@/hooks/useNewsletter";

export default function Newsletter() {
  const {
    email,
    setEmail,
    isLoading,
    status,
    errorMessage,
    subscribe,
    turnstileRef,
    setTurnstileToken,
    setErrorMessage,
  } = useNewsletter();

  return (
    <div className="w-full">
      <h5 className="mb-6 text-xs font-bold uppercase tracking-widest text-blue-hover">
        Get 15% off your first setup upgrade
      </h5>
      <p className="mb-4 text-sm text-ink-muted">
        Join the GEEX list for new gear drops, desk setup ideas, and practical buying guides.
      </p>

      {status === "success" ? (
        <div className="rounded bg-green-50 p-4 text-sm text-green-800">Thank you for subscribing.</div>
      ) : (
        <form onSubmit={subscribe} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-line-gray bg-transparent py-3 text-sm placeholder-gray-400 transition-colors focus:border-blue-hover focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-near-black py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-hover disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Get My Code"}
          </button>

          {status === "error" && <p className="text-xs text-red-500">{errorMessage}</p>}

          <div className="mt-2 origin-top-left scale-85" style={{ height: "55px" }}>
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setErrorMessage("Security check failed. Please try again.")}
              onExpire={() => setTurnstileToken(null)}
              options={{ theme: "light", size: "normal" }}
            />
          </div>

          <p className="mt-1 text-[10px] text-gray-400">Product notes only. Unsubscribe anytime.</p>
        </form>
      )}
    </div>
  );
}
