"use client";

import BasicButton from "@/components/button/basic-button";
import Gallery from "@/components/gallery/gallery";
import GridGallery from "@/components/gallery/grid-gallery";
import Hero from "@/components/hero/hero";
import Slider from "@/components/slider/slider";
import useAuth from "@/hook/useAuth";
import Footer from "@/layout/app/footer";
import NavBar from "@/layout/app/navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth(false);
  const slides = [
    <div
      className="relative bg-blue-500 h-[220px] sm:h-[380px] rounded-3xl overflow-hidden"
      key={0}
    >
      <Image
        src="/home_banner.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
        priority
      />
    </div>,
    <div
      className="relative bg-green-500 h-[220px] sm:h-[380px] rounded-3xl overflow-hidden"
      key={1}
    >
      <Image
        src="/home_banner1.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
    </div>,
    <div
      className="relative bg-red-500 h-[220px] sm:h-[380px] rounded-3xl overflow-hidden"
      key={2}
    >
      <Image
        src="/my_pham.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
    </div>,
    <div
      className="relative bg-red-500 h-[220px] sm:h-[380px] rounded-3xl overflow-hidden"
      key={3}
    >
      <Image
        src="/slider_4.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
    </div>,
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(226,232,240,0.8),_transparent)] animate-pulse" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(191,219,254,0.6),_transparent)] blur-3xl animate-[spin_30s_linear_infinite]" />
          <div className="absolute -left-16 top-12 w-48 h-48 bg-gradient-to-br from-blue-100 via-white to-pink-100 rounded-full blur-3xl opacity-70 animate-ping" />
          <div className="relative px-4 sm:px-8 lg:px-16 py-12 max-w-6xl mx-auto space-y-10">
            <div className="rounded-[32px] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/60 transition-transform duration-500 hover:-translate-y-1">
              <div className="px-6 py-10 sm:px-10">
                <Hero />
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-white via-blue-50/30 to-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-4">
                Xu hướng tuần này
              </div>
              <Slider slides={slides} loop={true} autoPlay={true} />
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-slate-400">
                <span className="flex items-center gap-2 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Auto play on
                </span>
                <span className="flex items-center gap-2 animate-bounce">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Vuốt để xem thêm
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16 py-16 space-y-16 bg-slate-50">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-blue-500 uppercase tracking-[0.4em]">
              Brands
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Thương hiệu nổi bật
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Khám phá các thương hiệu mỹ phẩm cao cấp được lựa chọn kỹ lưỡng,
              phù hợp với nhiều phong cách và nhu cầu chăm sóc da khác nhau.
            </p>
          </div>
          <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-rose-50 opacity-80 animate-pulse" />
            <div className="relative">
              <Gallery />
            </div>
          </div>
          <div className="text-center">
            <Link
              href={"/shop"}
              className="inline-flex items-center justify-center"
            >
              <BasicButton text="Xem thêm" variant="basic" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16 py-16 bg-white space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-rose-500 uppercase tracking-[0.4em]">
                Featured
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Sản phẩm nổi bật
              </h2>
              <p className="text-slate-500 max-w-2xl">
                Bộ sưu tập những sản phẩm bán chạy và được yêu thích nhất tuần,
                giúp bạn dễ dàng bắt kịp xu hướng làm đẹp hiện đại.
              </p>
            </div>
            <Link
              href={"/shop"}
              className="inline-flex items-center justify-center"
            >
              <BasicButton text="Xem thêm" variant="basic" />
            </Link>
          </div>

          <div className="rounded-[32px] border border-slate-100 bg-slate-50 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative overflow-hidden">
            <div className="absolute inset-y-0 -right-20 w-64 bg-gradient-to-b from-rose-100 via-transparent to-blue-100 opacity-70 blur-3xl animate-spin" />
            <div className="relative">
              <GridGallery />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
