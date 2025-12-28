import Link from "next/link";

export default function Footer() {
  const footerNavigation = {
    main: [
      { name: "Trang chủ", href: "/" },
      { name: "Sản phẩm", href: "/product" },
      { name: "Shop", href: "/shop" },
      { name: "Hỗ trợ", href: "/support" },
      { name: "Cá nhân", href: "/profile" },
    ],
    categories: [
      { name: "Thời trang", href: "/shop?category=fashion" },
      { name: "Gia dụng", href: "/shop?category=home" },
      { name: "Mẹ và bé", href: "/shop?category=baby" },
      { name: "Làm đẹp", href: "/shop?category=beauty" },
    ],
    support: [
      { name: "Hướng dẫn mua hàng", href: "/support#guide" },
      { name: "Chính sách hoàn tiền", href: "/policy" },
      { name: "Điều khoản sử dụng", href: "/policy#terms" },
      { name: "Liên hệ", href: "/support#contact" },
    ],
    social: [
      {
        name: "Facebook",
        href: "https://www.facebook.com/ducdung.tranquang",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Instagram",
        href: "https://www.instagram.com/dev_dermot/",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "X",
        href: "https://x.com/dermot_tran",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
          </svg>
        ),
      },
      {
        name: "GitHub",
        href: "https://github.com/ducdungtranquang",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "YouTube",
        href: "https://www.youtube.com/channel/UC-8WkWbG3EbB0HIfvVsvlaw",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-50/50 to-secondary-100/80 dark:from-transparent dark:via-secondary-900/50 dark:to-secondary-950/80" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="relative">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
          {/* Top Section - Logo & Newsletter */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 pb-12 border-b border-secondary-200/50 dark:border-secondary-700/50">
            {/* Brand Section */}
            <div className="max-w-sm">
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-2 shadow-primary-sm">
                    <img
                      src="/logo_img.png"
                      alt="SmartCash"
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-secondary-900 dark:text-white">
                    SmartCash
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary-400">
                    shopping studio
                  </p>
                </div>
              </Link>
              <p className="mt-6 text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Nền tảng mua sắm hoàn tiền hàng đầu Việt Nam. Cam kết chia sẻ hoa hồng
                minh bạch và rút tiền nhanh chóng về tài khoản ngân hàng.
              </p>

              {/* App Store Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-900 text-white text-xs font-medium dark:bg-white dark:text-secondary-900">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-900 text-white text-xs font-medium dark:bg-white dark:text-secondary-900">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  Google Play
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="max-w-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-secondary-900 dark:text-white">
                Đăng ký nhận ưu đãi
              </h3>
              <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                Nhận thông tin về khuyến mãi và mã giảm giá độc quyền.
              </p>
              <form className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-900 dark:text-white mb-4">
                Truy cập nhanh
              </h3>
              <ul className="space-y-3">
                {footerNavigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-900 dark:text-white mb-4">
                Danh mục
              </h3>
              <ul className="space-y-3">
                {footerNavigation.categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-900 dark:text-white mb-4">
                Hỗ trợ
              </h3>
              <ul className="space-y-3">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-900 dark:text-white mb-4">
                Liên hệ
              </h3>
              <ul className="space-y-3 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@SmartCash.vn
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  1900 1234 56
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Hà Nội, Việt Nam
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-secondary-200/50 dark:border-secondary-700/50">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-100/80 dark:bg-secondary-800/80 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-900/30 transition-all"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
              &copy; {new Date().getFullYear()} SmartCash. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-400 mr-2">Thanh toán:</span>
              <div className="flex items-center gap-1">
                {["Visa", "MC", "JCB", "Momo"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 rounded-md bg-white dark:bg-secondary-800 text-2xs font-medium text-secondary-600 dark:text-secondary-400 border border-secondary-200/50 dark:border-secondary-700/50"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
