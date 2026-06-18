"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { BRAND_ASSETS, NAV_LINKS } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

interface NavbarProps {
  cartCount: number;
  onSearchClick: () => void;
  topOffset?: number;
}

export default function Navbar({ cartCount, onSearchClick, topOffset = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        style={{ top: `${topOffset}px` }}
        className={`fixed w-full z-40 transition-all duration-300 ${scrolled || isOpen
          ? "bg-white/95 backdrop-blur-md border-b border-line-gray py-0"
          : "bg-white border-b border-line-gray py-0"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[82px]">
            {/* LEFT: Mobile Menu / PC Logo */}
            <div className="flex-1 flex items-center justify-start">
              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-near-black p-2 -ml-2 hover:text-orbit-blue transition-colors"
                >
                  {isOpen ? (
                    <X size={24} strokeWidth={1} />
                  ) : (
                    <Menu size={24} strokeWidth={1} />
                  )}
                </button>
              </div>

              {/* PC Logo */}
              <div className="hidden lg:block">
                <Link
                  href="/"
                  className="block hover:opacity-80 transition-opacity"
                  aria-label="GEEX home"
                >
                  <Image
                    src={BRAND_ASSETS.logoLockup}
                    alt="GEEX"
                    width={190}
                    height={60}
                    priority
                    className="h-12 w-auto object-contain"
                  />
                </Link>
              </div>
            </div>

            {/* CENTER: Mobile Logo / PC Menu */}
            <div className="flex-1 flex items-center justify-center">
              {/* Mobile Logo */}
              <div className="lg:hidden">
                <Link
                  href="/"
                  className="block"
                  aria-label="GEEX home"
                >
                  <Image
                    src={BRAND_ASSETS.orbitMark}
                    alt="GEEX"
                    width={52}
                    height={52}
                    priority
                    className="h-11 w-11 object-contain"
                  />
                </Link>
              </div>

              {/* PC Menu */}
              <div className="hidden lg:flex space-x-10">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    style={brandFontStyle}
                    className="relative group font-display text-[12px] uppercase tracking-[0.08em] text-near-black py-2"
                  >
                    {link.name}
                    <span
                      className={`absolute left-0 bottom-0 h-[1px] bg-orbit-blue transition-all duration-300 ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    ></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: Icons */}
            <div className="flex-1 flex items-center justify-end space-x-5">
              <button
                onClick={onSearchClick}
              className="text-near-black hover:text-blue-hover transition-colors"
              aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link
                href="/account"
                className="hidden sm:block text-near-black hover:text-blue-hover transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                className="text-near-black hover:text-blue-hover transition-colors relative"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orbit-blue text-near-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{ paddingTop: `calc(6rem + ${topOffset}px)` }}
        className={`fixed inset-0 z-30 bg-cool-white px-6 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col space-y-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              style={brandFontStyle}
              className="text-xl font-semibold tracking-wide text-near-black hover:text-blue-hover transition-colors border-b border-line-gray pb-4"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-8">
            <h5 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Account
            </h5>
            <div className="flex flex-col space-y-4 text-sm text-near-black">
              <Link href="/account" onClick={() => setIsOpen(false)} className="text-left">
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
