"use client";

import Image from "next/image";
import { Keyboard, Mail, MapPin, MonitorSmartphone, ShieldCheck, Zap } from "lucide-react";
import { BRAND_ASSETS, COMPANY_INFO } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="w-full bg-cool-white pt-24">
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 pb-24 lg:grid-cols-2 lg:px-8">
        <div className="animate-fade-in-up">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-hover">About GEEX</p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-tight text-near-black lg:text-6xl">
            Gear for cleaner desks, faster sessions, and better everyday tech.
          </h1>
          <p className="mt-8 text-lg leading-8 text-ink-muted">
            GEEX curates practical electronics for workspaces, gaming stations, travel kits, and mobile devices. We focus on accessories that are easy to understand, easy to pair, and useful after the first week.
          </p>
        </div>
        <div className="relative h-[520px] overflow-hidden border border-line-gray bg-white">
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=90&w=1400"
            alt="Clean desk with electronics and accessories"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-line-gray bg-white py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: <Keyboard size={28} />, title: "Setup First", text: "Products are organized around real use: desk work, gaming, mobile charging, and Bluetooth audio." },
            { icon: <MonitorSmartphone size={28} />, title: "Compatibility Matters", text: "We keep product choices practical, with device fit, connector type, and everyday workflow in mind." },
            { icon: <ShieldCheck size={28} />, title: "Secure Commerce", text: "Checkout, account flows, order tracking, returns, and support stay clear and predictable." },
          ].map((item) => (
            <div key={item.title} className="border border-line-gray bg-cool-white p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-near-black text-orbit-blue">{item.icon}</div>
              <h3 className="mb-4 text-xl font-black uppercase text-near-black">{item.title}</h3>
              <p className="text-sm leading-7 text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-near-black py-24 text-white">
        <div className="absolute right-8 top-8 h-40 w-40 opacity-20">
          <Image src={BRAND_ASSETS.orbitMark} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Zap className="mx-auto mb-6 text-orbit-blue" size={34} />
          <h2 className="text-3xl font-black uppercase leading-tight lg:text-5xl">
            Small upgrades should make the whole setup feel sharper.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/70">
            That is the GEEX filter: if a keyboard, stand, hub, mouse, cable, or pair of earbuds does not make daily use easier, it does not belong in the storefront.
          </p>
        </div>
      </section>

      <section className="border-t border-line-gray bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-8 text-2xl font-black uppercase text-near-black">Get in touch</h2>
          <div className="flex flex-col items-center justify-center gap-6 border-y border-line-gray py-6 text-sm text-ink-muted md:flex-row">
            <div className="flex items-center gap-2"><Mail size={16} className="text-blue-hover" /> {COMPANY_INFO.email}</div>
            <div className="hidden h-4 w-px bg-line-gray md:block" />
            <div className="flex items-center gap-2"><MapPin size={16} className="text-blue-hover" /> {COMPANY_INFO.address}</div>
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-widest text-gray-400">Company Reg: {COMPANY_INFO.regNo}</p>
        </div>
      </section>
    </div>
  );
}
