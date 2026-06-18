"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CreditCard } from "lucide-react";
import { BRAND_ASSETS, COMPANY_INFO, FOOTER_LINKS } from "@/lib/constants";
import Newsletter from "./Newsletter";

interface MobileAccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function MobileAccordionItem({ title, children, isOpen, onToggle }: MobileAccordionItemProps) {
  return (
    <div className="border-b border-line-gray lg:border-none">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left lg:block lg:cursor-default lg:py-0"
      >
        <h5 className="text-xs font-bold uppercase tracking-widest text-blue-hover lg:mb-6">
          {title}
        </h5>
        <ChevronDown
          size={16}
          className={`text-ink-muted transition-transform lg:hidden ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 lg:block lg:h-auto ${
          isOpen ? "mb-4 max-h-64" : "max-h-0 lg:max-h-none"
        }`}
      >
        <ul className="space-y-3 text-sm text-ink-muted">{children}</ul>
      </div>
    </div>
  );
}

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="border-t border-line-gray bg-white pt-16 pb-8">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="mb-6 block w-44" aria-label="GEEX home">
              <Image
                src={BRAND_ASSETS.logoLockup}
                alt="GEEX"
                width={220}
                height={70}
                className="h-auto w-full object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Curated keyboards, peripherals, mobile accessories, and audio gear for cleaner everyday setups.
              <br />
              <br />
              Workspaces, gaming stations, and mobile kits.
            </p>
          </div>

          <MobileAccordionItem title="Shop" isOpen={openSection === "Shop"} onToggle={() => toggleSection("Shop")}>
            {FOOTER_LINKS.shop.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-blue-hover">
                  {link.name}
                </Link>
              </li>
            ))}
          </MobileAccordionItem>

          <MobileAccordionItem title="Support" isOpen={openSection === "Support"} onToggle={() => toggleSection("Support")}>
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-blue-hover">
                  {link.name}
                </Link>
              </li>
            ))}
          </MobileAccordionItem>

          <MobileAccordionItem title="Legal" isOpen={openSection === "Legal"} onToggle={() => toggleSection("Legal")}>
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-blue-hover">
                  {link.name}
                </Link>
              </li>
            ))}
          </MobileAccordionItem>

          <div className="col-span-1">
            <Newsletter />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-gray pt-8 text-[10px] uppercase tracking-wider text-gray-400 lg:flex-row">
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.legalName}. All rights reserved.</p>
            <p className="hidden lg:block">|</p>
            <p>Reg: {COMPANY_INFO.regNo}</p>
          </div>
          <div className="flex gap-3 text-gray-300">
            <CreditCard size={20} />
            {[
              "VISA",
              "MC",
              "AMEX",
            ].map((label) => (
              <div key={label} className="flex h-5 w-8 items-center justify-center rounded bg-gray-100 text-[8px] font-bold text-gray-400">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
