import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-950" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative px-4 py-16 sm:py-24 lg:py-32 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <Link
          href="/product"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-card-sm hover:shadow-card hover:border-primary-300 dark:hover:border-primary-600 transition-all animate-fade-in-down"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
            <SparklesIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Hoàn tiền lên tới{" "}
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              20%
            </span>
          </span>
          <ArrowRightIcon className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Heading */}
        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
          <span className="text-secondary-900 dark:text-white">Cam kết hoàn lại </span>
          <span className="text-gradient bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-[length:200%_auto] animate-liquid-flow">
            tiền thật
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg sm:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Chia sẻ hoa hồng từ đối tác, giúp bạn nhận tiền{" "}
          <span className="text-secondary-900 dark:text-white font-medium">trực tiếp vào tài khoản ngân hàng</span>{" "}
          một cách minh bạch và an tâm.
        </p>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[
            { value: "500K+", label: "Người dùng" },
            { value: "10B+", label: "Đã hoàn tiền" },
            { value: "1000+", label: "Đối tác" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/product"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-primary hover:shadow-primary-lg hover:from-primary-600 hover:to-primary-700 transition-all hover:-translate-y-0.5"
          >
            <span>Bắt đầu mua sắm</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10" />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 text-secondary-700 dark:text-secondary-300 font-semibold shadow-card-sm hover:shadow-card hover:border-secondary-300 dark:hover:border-secondary-600 transition-all hover:-translate-y-0.5"
          >
            Tìm hiểu thêm
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary-400 font-medium">
            Đối tác tin cậy
          </p>
          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            {["Shopee", "Lazada", "Tiki", "Sendo"].map((brand, index) => (
              <span
                key={index}
                className="text-lg font-bold text-secondary-400"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
