"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { brandFontStyle } from "@/lib/brand-style";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("geex_exit_popup_seen");
    if (hasSeenPopup) {
      hasShownRef.current = true;
      return;
    }

    const timer = setTimeout(() => {
      triggerPopup();
    }, 10000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) triggerPopup();
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const triggerPopup = () => {
    if (hasShownRef.current) return;
    setIsVisible(true);
    hasShownRef.current = true;
    localStorage.setItem("geex_exit_popup_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({ email, turnstile_token: turnstileToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setStatus("success");
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error: any) {
      console.error("Popup subscription error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to subscribe");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-line-gray bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300 md:p-12">
        <button onClick={() => setIsVisible(false)} className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-near-black" aria-label="Close offer">
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center">
            <h3 style={brandFontStyle} className="font-display mb-4 text-2xl font-black uppercase text-near-black">You're on the list.</h3>
            <p className="text-ink-muted">Check your inbox for your GEEX code.</p>
          </div>
        ) : (
          <div className="text-center">
            <h2 style={brandFontStyle} className="font-display mb-3 text-3xl font-black uppercase text-near-black">Upgrade before you go.</h2>
            <p className="mb-8 text-sm leading-relaxed text-ink-muted">
              Take <span className="font-semibold text-blue-hover">15% off</span> your first GEEX order and get setup notes for new gear drops.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line-gray px-4 py-3 text-center text-sm placeholder-gray-400 transition-all focus:border-blue-hover focus:outline-none focus:ring-1 focus:ring-orbit-blue"
                required
              />

              {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

              <div className="flex justify-center" style={{ minHeight: "65px" }}>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setErrorMessage("Security check failed.")}
                  onExpire={() => setTurnstileToken(null)}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 bg-near-black py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-blue-hover disabled:opacity-70"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Unlock 15% Off
              </button>
            </form>

            <button
              onClick={() => setIsVisible(false)}
              className="mt-4 border-b border-transparent pb-0.5 text-[10px] uppercase tracking-widest text-gray-400 transition-colors hover:border-near-black hover:text-near-black"
            >
              No thanks, continue browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
