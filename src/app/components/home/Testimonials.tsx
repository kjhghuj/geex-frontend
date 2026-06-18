import { TESTIMONIALS } from "@/lib/constants";
import { brandFontStyle } from "@/lib/brand-style";

export function Testimonials() {
  return (
    <section className="bg-cool-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p style={brandFontStyle} className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-hover">
            Customer notes
          </p>
          <h2 style={brandFontStyle} className="font-display mt-3 text-3xl font-black uppercase text-near-black">
            Gear that earns a permanent spot
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="border border-line-gray bg-white p-8 text-center">
              <div className="mb-4 flex justify-center gap-1 text-xs text-blue-hover">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>*</span>
                ))}
              </div>
              <p className="mb-6 text-lg font-medium leading-8 text-near-black">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-gray-400">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
