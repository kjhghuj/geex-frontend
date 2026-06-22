"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Rocket, X } from "lucide-react";
import { getStore } from "@/lib/medusa";
import { brandFontStyle } from "@/lib/brand-style";

// Type for announcement bar configuration  
interface AnnouncementBarConfig {
    enabled: boolean;
    message: string;
    message_zh?: string;
    messages?: Record<string, string | undefined>;
    link: string;
}

interface StoreMetadata {
    announcement_bar?: AnnouncementBarConfig;
}

export default function AnnouncementBar({ onHeightChange }: { onHeightChange?: (height: number) => void }) {
    const [config, setConfig] = useState<AnnouncementBarConfig | null>({
        enabled: true,
        message: "FREE SHIPPING WORLDWIDE ON ORDERS OVER $79",
        message_zh: "满 $79 全球免费配送",
        link: "/shipping",
    });
    const [locale, setLocale] = useState("en");
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const barRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const paramsLocale = new URLSearchParams(window.location.search).get("locale");
        const cookieLocale = document.cookie
            .split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith("NEXT_LOCALE=") || part.startsWith("locale="))
            ?.split("=")[1];
        const storedLocale =
            window.localStorage.getItem("geex_locale") ||
            window.localStorage.getItem("NEXT_LOCALE") ||
            window.localStorage.getItem("locale") ||
            window.localStorage.getItem("language");
        const detectedLocale =
            paramsLocale ||
            (cookieLocale ? decodeURIComponent(cookieLocale) : undefined) ||
            storedLocale ||
            document.documentElement.lang ||
            navigator.languages?.[0] ||
            navigator.language ||
            "en";

        setLocale(detectedLocale);
    }, []);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const store = await getStore();
                const metadata = store?.metadata as StoreMetadata | undefined;
                const announcementBar = metadata?.announcement_bar;

                if (announcementBar && announcementBar.enabled && announcementBar.message) {
                    setConfig(announcementBar);
                }
            } catch (error) {
                console.error("[AnnouncementBar] Failed to fetch config:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchConfig();
    }, []);

    const isChineseLocale = locale.toLowerCase().startsWith("zh");
    const message =
        (isChineseLocale &&
            (config?.messages?.[locale] ||
                config?.messages?.[locale.toLowerCase()] ||
                config?.messages?.["zh-CN"] ||
                config?.messages?.["zh-cn"] ||
                config?.messages?.zh ||
                config?.message_zh)) ||
        config?.message;

    // Check for text overflow - Improved logic
    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current && containerRef.current) {
                // Use scrollWidth vs clientWidth for more reliable detection
                // Add a small buffer (32px) to account for padding/close button
                const isOver = textRef.current.offsetWidth > (containerRef.current.offsetWidth - 40);
                setIsOverflowing(isOver);
            }
        };

        if (message && isVisible) {
            // Check immediately and after a short delay for font loading
            checkOverflow();
            const timer = setTimeout(checkOverflow, 200);
            window.addEventListener('resize', checkOverflow);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', checkOverflow);
            };
        }
    }, [message, isVisible]);

    // Measure height and report changes
    useEffect(() => {
        if (!barRef.current || !onHeightChange) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (isVisible && config) {
                    onHeightChange(entry.contentRect.height);
                } else {
                    onHeightChange(0);
                }
            }
        });

        observer.observe(barRef.current);
        return () => observer.disconnect();
    }, [isVisible, config, onHeightChange]);

    // Report 0 when hidden or not active
    useEffect(() => {
        if ((!isVisible || !config) && onHeightChange) {
            onHeightChange(0);
        }
    }, [isVisible, config, onHeightChange]);

    if (isLoading || !config || !message || !isVisible) {
        return null;
    }

    const content = (
        <span ref={textRef} style={brandFontStyle} className="inline-flex items-center gap-3 whitespace-nowrap px-1 font-display text-xs font-bold uppercase tracking-[0.08em] sm:text-sm">
            <Rocket data-announcement-icon size={14} strokeWidth={1.8} className="text-blue-hover" />
            {message}
            <ChevronRight size={15} strokeWidth={1.8} />
        </span>
    );

    // Inline style for marquee animation to ensure it works regardless of Tailwind config
    const marqueeStyle: React.CSSProperties = {
        animation: 'marquee 15s linear infinite',
        display: 'flex',
        gap: '3rem',
        paddingLeft: '1rem',
        whiteSpace: 'nowrap',
    };

    return (
        <div
            ref={barRef}
            className="fixed top-0 left-0 right-0 border-b border-line-gray bg-white text-near-black z-[100] transition-all duration-300 ease-in-out"
        >
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-center h-10 overflow-hidden relative" ref={containerRef}>

                    {config.link ? (
                        <Link
                            href={config.link}
                            className={`flex items-center transition-opacity hover:opacity-90 w-full ${!isOverflowing ? 'justify-center' : ''}`}
                        >
                            {isOverflowing ? (
                                <div style={marqueeStyle}>
                                    {content}
                                    {content}
                                    {content}
                                    {content}
                                </div>
                            ) : (
                                content
                            )}
                        </Link>
                    ) : (
                        <div className={`flex items-center w-full ${!isOverflowing ? 'justify-center' : ''}`}>
                            {isOverflowing ? (
                                <div style={marqueeStyle}>
                                    {content}
                                    {content}
                                    {content}
                                    {content}
                                </div>
                            ) : (
                                content
                            )}
                        </div>
                    )}

                    {/* Close Button - Always fixed right with background to cover text */}
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            if (onHeightChange) onHeightChange(0);
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 hover:bg-ice-gray transition-colors z-20 bg-white shadow-[-8px_0_12px_rgba(255,255,255,1)]"
                        aria-label={isChineseLocale ? "关闭公告" : "Close announcement"}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
