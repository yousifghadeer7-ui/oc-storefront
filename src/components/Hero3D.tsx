"use client";

import dynamic from "next/dynamic";

// تحميل الـ 3D بدون SSR لمنع مشاكل البناء وللحفاظ على سرعة الموقع
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#f5f5f0] text-xs uppercase tracking-widest text-black/40">
      Loading 3D Experience...
    </div>
  ),
});

export function Hero3D() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] bg-[#f5f5f0] overflow-hidden flex items-center justify-center">
      {/* عنصر الـ 3D التفاعلي مع حركة الماوس */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        <Spline scene="https://prod.spline.design/kZ49Ch18MGoAUn24/scene.splinecode" />
      </div>

      {/* النصوص والأزرار فوق المجسم الـ 3D */}
      <div className="relative z-10 text-center px-6 pointer-events-none max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-black/60 mb-3 font-medium">
          OC — Considered Clothing
        </p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black mb-8 leading-tight">
          Autumn / Winter 2026
        </h1>
        <div className="pointer-events-auto">
          <a
            href="/shop"
            className="inline-block bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4 hover:bg-black/80 transition duration-300 shadow-lg"
          >
            Explore Collection
          </a>
        </div>
      </div>
    </section>
  );
}
