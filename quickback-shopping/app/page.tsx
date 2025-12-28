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
import Cookies from "js-cookie";
import {
  ShieldCheckIcon,
  BanknotesIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import MembershipCard from "@/components/membership/MembershipCard";

const features = [
  {
    icon: BanknotesIcon,
    title: "Hoàn tiền thật",
    description:
      "Nhận tiền hoàn trực tiếp vào tài khoản ngân hàng của bạn, không phải điểm thưởng.",
    color: "from-primary-500 to-primary-600",
  },
  {
    icon: ShieldCheckIcon,
    title: "An toàn & Bảo mật",
    description:
      "Giao dịch được mã hóa và bảo vệ theo tiêu chuẩn bảo mật cao nhất.",
    color: "from-success-500 to-success-600",
  },
  {
    icon: BoltIcon,
    title: "Rút tiền nhanh",
    description:
      "Rút tiền trong vòng 24h sau khi đơn hàng được xác nhận thành công.",
    color: "from-accent-500 to-accent-600",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth(false);
  const userId = Cookies.get("id");
  const slides = [
    <div
      className="relative h-[220px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card"
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
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent" />
    </div>,
    <div
      className="relative h-[220px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card"
      key={1}
    >
      <Image
        src="/home_banner1.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent" />
    </div>,
    <div
      className="relative h-[220px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card"
      key={2}
    >
      <Image
        src="/my_pham.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent" />
    </div>,
    <div
      className="relative h-[220px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card"
      key={3}
    >
      <Image
        src="/slider_4.jpg"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent" />
    </div>,
  ];

  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Membership Card Section - Only for logged in users */}
        {isAuthenticated && userId && (
          <section className="relative py-8 lg:py-12">
            <div className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
              <div className="max-w-md mx-auto lg:max-w-lg">
                <MembershipCard userId={userId} />
              </div>
            </div>
          </section>
        )}

        {/* Slider Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-float" />
            <div
              className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-300/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "-3s" }}
            />
          </div>

          <div className="relative px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                <SparklesIcon className="w-4 h-4" />
                Xu hướng tuần này
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white">
                Khám phá ưu đãi
              </h2>
            </div>

            {/* Slider Container */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8">
              <Slider slides={slides} loop={true} autoPlay={true} />

              {/* Status Indicators */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-500 dark:text-secondary-400">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                  </span>
                  Auto play
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Vuốt để xem thêm
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 lg:py-24 bg-white dark:bg-secondary-800">
          <div className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 text-sm font-medium mb-4">
                Tại sao chọn chúng tôi
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                Lợi ích vượt trội
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                SmartCash Shopping mang đến trải nghiệm mua sắm thông minh với
                những ưu đãi hoàn tiền hấp dẫn nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-secondary-50 dark:bg-secondary-900 rounded-2xl p-6 lg:p-8 border border-secondary-200/50 dark:border-secondary-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg mb-6`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900" />

          <div className="relative px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                Brands
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                Thương hiệu nổi bật
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
                Khám phá các thương hiệu mỹ phẩm cao cấp được lựa chọn kỹ lưỡng,
                phù hợp với nhiều phong cách và nhu cầu chăm sóc da khác nhau.
              </p>
            </div>

            {/* Gallery Container */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 mb-8">
              <Gallery />
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link href="/shop">
                <BasicButton variant="secondary" size="lg">
                  <span>Xem tất cả thương hiệu</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </BasicButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="relative py-16 lg:py-24 bg-white dark:bg-secondary-800">
          <div className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 text-sm font-medium mb-4">
                  Featured
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl">
                  Bộ sưu tập những sản phẩm bán chạy và được yêu thích nhất tuần,
                  giúp bạn dễ dàng bắt kịp xu hướng làm đẹp hiện đại.
                </p>
              </div>
              <Link href="/product" className="flex-shrink-0">
                <BasicButton variant="primary" size="lg">
                  <span>Xem tất cả</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </BasicButton>
              </Link>
            </div>

            {/* Products Grid */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8">
              <GridGallery />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "-2s" }}
          />

          <div className="relative px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Bắt đầu tiết kiệm ngay hôm nay
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Đăng ký miễn phí và nhận ngay ưu đãi hoàn tiền cho đơn hàng đầu
              tiên của bạn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <span>Đăng ký ngay</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/support">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all">
                  Tìm hiểu thêm
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
