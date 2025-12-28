/* eslint-disable @next/next/no-img-element */
import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import BaseModal from "@/components/modals/base-modal";
import { logout } from "@/ultils/func/api";
import { useRouter } from "next/navigation";
import AutoCompleteSearch from "@/components/search/autocomplete-search";
import { CATEGORIES, NAVIGATION_LIST } from "@/ultils/constant/constant";
import { useCart } from "@/context/cartContext";

interface IProps {
  isAuthenticated: boolean | null;
}

export default function NavBar({ isAuthenticated }: IProps) {
  const router = useRouter();
  const { cart, total, fetchCart } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirm = async () => {
    await logout();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(1);
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        sticky top-0 z-[99999] w-full
        transition-all duration-500 ease-out
        ${
          scrolled
            ? "bg-white/80 dark:bg-secondary-900/80 backdrop-blur-2xl shadow-glass border-b border-secondary-200/50 dark:border-secondary-700/50"
            : "bg-transparent"
        }
      `}
    >
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-[999999] lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl pb-12 shadow-glass-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-200/50 dark:border-secondary-700/50">
              <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-1.5 shadow-primary-sm">
                    <img
                      src="/logo_img.png"
                      alt="SmartCash"
                      className="h-8 w-8 rounded-xl object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold text-secondary-900 dark:text-white">
                    SmartCash
                  </p>
                  <p className="text-2xs uppercase tracking-[0.2em] text-secondary-400">
                    shopping studio
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation Tabs */}
            <TabGroup className="mt-4">
              <div className="px-4">
                <TabList className="flex gap-2 p-1 rounded-2xl bg-secondary-100/80 dark:bg-secondary-800/80">
                  {NAVIGATION_LIST.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-secondary-600
                        transition-all duration-200
                        data-[selected]:bg-white data-[selected]:text-primary-600 data-[selected]:shadow-card-sm
                        dark:text-secondary-400 dark:data-[selected]:bg-secondary-700 dark:data-[selected]:text-primary-400"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {NAVIGATION_LIST.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-6 px-4 pt-6 pb-8"
                  >
                    {/* Featured Items */}
                    <div className="grid grid-cols-2 gap-3">
                      {category.featured.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group relative rounded-2xl overflow-hidden bg-secondary-100 dark:bg-secondary-800 aspect-square"
                        >
                          <img
                            alt={item.imageAlt || "alt"}
                            src={item.imageSrc}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="font-semibold text-white text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">Mua ngay</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Category Sections */}
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-400 mb-3">
                          {section.name}
                        </p>
                        <ul className="space-y-1">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                              >
                                <span className="text-sm font-medium">{item.name}</span>
                                <ChevronRightIcon className="h-4 w-4 text-secondary-400" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* Pages Links */}
            <div className="mt-auto border-t border-secondary-200/50 dark:border-secondary-700/50 px-4 py-4">
              <div className="space-y-1">
                {NAVIGATION_LIST.pages.map((page) => {
                  if (page.name !== "Trang chủ") {
                    return (
                      <Link
                        key={page.name}
                        href={page.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-3 px-3 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                      >
                        <span className="font-medium">{page.name}</span>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Auth Section */}
            <div className="border-t border-secondary-200/50 dark:border-secondary-700/50 px-4 py-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleOpenModal();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-error-50 text-error-600 font-semibold hover:bg-error-100 transition-colors dark:bg-error-900/30 dark:text-error-400"
                >
                  Đăng xuất
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center font-semibold shadow-primary-sm hover:shadow-primary transition-shadow"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block w-full py-3 px-4 rounded-xl bg-secondary-100 text-secondary-700 text-center font-semibold hover:bg-secondary-200 transition-colors dark:bg-secondary-800 dark:text-secondary-300"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative">
        {/* Top Banner */}
        <div className="w-full bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white overflow-hidden">
          <div className="relative mx-auto flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-medium sm:px-6 lg:px-8">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />

            <div className="relative flex items-center gap-2 text-white/90">
              <SparklesIcon className="h-5 w-5 animate-pulse" aria-hidden="true" />
              <p className="text-left">
                <span className="hidden sm:inline">
                  Hoàn tiền không giới hạn & ưu đãi độc quyền mỗi tuần
                </span>
                <span className="sm:hidden">Ưu đãi hấp dẫn tại SmartCash</span>
              </p>
            </div>
            <Link
              href="/collections/highlight"
              className="relative group flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 transition-all hover:bg-white/20 hover:border-white/40"
            >
              Khám phá
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 lg:py-4">
            <div
              className={`
                rounded-2xl lg:rounded-3xl
                transition-all duration-500
                ${
                  scrolled
                    ? "bg-white/60 dark:bg-secondary-900/60 backdrop-blur-xl border border-secondary-200/30 dark:border-secondary-700/30 shadow-glass"
                    : "bg-white/90 dark:bg-secondary-900/90 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-card-lg"
                }
                px-4 py-3 sm:px-6
              `}
            >
              {/* Top Row - Logo & Status */}
              <div className="flex items-center justify-between gap-4">
                {/* Mobile Controls + Logo */}
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Toggle */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="rounded-xl p-2.5 text-secondary-500 bg-secondary-100/80 hover:bg-secondary-200 transition-colors dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-400"
                    >
                      <HomeIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(!open)}
                      className="rounded-xl p-2.5 text-secondary-500 bg-secondary-100/80 hover:bg-secondary-200 transition-colors dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-400"
                    >
                      <Bars3Icon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Logo */}
                  <Link
                    href="/"
                    className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-all hover:bg-secondary-100/50 dark:hover:bg-secondary-800/50"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-1.5 shadow-primary-sm group-hover:shadow-primary transition-shadow">
                        <img
                          src="/logo_img.png"
                          alt="SmartCash"
                          className="h-9 w-9 rounded-xl object-cover"
                        />
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors dark:text-white dark:group-hover:text-primary-400">
                        SmartCash
                      </p>
                      <p className="text-2xs uppercase tracking-[0.2em] text-secondary-400 dark:text-secondary-500">
                        shopping studio
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Status Badges - Desktop */}
                <div className="hidden lg:flex items-center gap-4">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                    </span>
                    Trải nghiệm mới
                  </span>
                  <span className="hidden xl:flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">
                    <span className="h-2 w-2 rounded-full bg-primary-500/60" />
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>

              {/* Bottom Row - Navigation & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-secondary-200/50 dark:border-secondary-700/50">
                {/* Desktop Navigation */}
                <PopoverGroup className="hidden lg:flex flex-1 items-center gap-1">
                  {NAVIGATION_LIST.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-950/50"
                    >
                      {page.name}
                    </Link>
                  ))}

                  {NAVIGATION_LIST.categories.map((category) => (
                    <Popover key={category.name} className="relative">
                      <PopoverButton className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-950/50 focus:outline-none">
                        {category.name}
                        <ChevronRightIcon className="h-4 w-4 rotate-90 transition-transform group-data-[open]:-rotate-90" />
                      </PopoverButton>

                      <PopoverPanel
                        transition
                        className="absolute left-0 top-full mt-2 w-[800px] rounded-3xl bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl shadow-glass-xl border border-secondary-200/50 dark:border-secondary-700/50 transition data-[closed]:opacity-0 data-[closed]:translate-y-2 data-[enter]:duration-200 data-[leave]:duration-150"
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-12 gap-8">
                            {/* Featured Section */}
                            <div className="col-span-5">
                              <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-400 mb-4">
                                Nổi bật
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                {category.featured.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-secondary-100 dark:bg-secondary-800"
                                  >
                                    <img
                                      alt={item.imageAlt || item.name}
                                      src={item.imageSrc}
                                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                      <p className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors">
                                        {item.name}
                                      </p>
                                      <p className="flex items-center gap-1 text-xs text-white/70 mt-0.5">
                                        Mua ngay
                                        <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Category Links */}
                            <div className="col-span-7 grid grid-cols-3 gap-6">
                              {category.sections.map((section) => (
                                <div key={section.name}>
                                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary-400 mb-3">
                                    {section.name}
                                  </p>
                                  <ul className="space-y-1">
                                    {section.items.map((item) => (
                                      <li key={item.name}>
                                        <Link
                                          href={item.href}
                                          className="block py-2 px-3 -mx-3 rounded-lg text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors dark:text-secondary-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/50"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                </PopoverGroup>

                {/* Right Actions */}
                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                  {/* Auth Links - Desktop */}
                  <div className="hidden lg:flex items-center gap-1 mr-2">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleOpenModal}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:text-error-600 hover:bg-error-50 transition-all dark:text-secondary-400 dark:hover:text-error-400 dark:hover:bg-error-950/50"
                      >
                        Đăng xuất
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all dark:text-secondary-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/50"
                        >
                          {isAuthenticated === null ? "" : "Đăng nhập"}
                        </Link>
                        <Link
                          href="/register"
                          className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all dark:text-secondary-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/50"
                        >
                          {isAuthenticated === null ? "" : "Đăng ký"}
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={() => setShowSearch(!showSearch)}
                    className={`
                      flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl
                      text-sm font-medium transition-all
                      ${
                        showSearch
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                          : "bg-secondary-100/80 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-400 dark:hover:bg-secondary-700"
                      }
                    `}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Tìm kiếm</span>
                  </button>

                  {/* Profile Button */}
                  <Link
                    href={`${isAuthenticated ? "/profile" : "/login"}`}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-secondary-100/80 text-secondary-600 hover:bg-secondary-200 transition-colors dark:bg-secondary-800 dark:text-secondary-400 dark:hover:bg-secondary-700"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline text-sm font-medium">
                      {isAuthenticated ? "Tài khoản" : "Đăng nhập"}
                    </span>
                  </Link>

                  {/* Cart Button */}
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/history/${cart?.[0]?.userId}?activeId=cart`);
                    }}
                    className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm">Giỏ hàng</span>
                    {total > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/20 text-xs font-bold">
                        {total}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Modal */}
            {isModalOpen && (
              <BaseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Đăng xuất"
                onConfirm={handleConfirm}
              >
                <p className="text-secondary-600 dark:text-secondary-400">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
                </p>
              </BaseModal>
            )}
          </div>
        </nav>
      </header>

      {/* Search Panel */}
      <div
        className={`
          ${showSearch ? "nav-enter" : "nav-exit h-0 hidden"}
          bg-white/80 dark:bg-secondary-900/80 backdrop-blur-xl border-t border-secondary-200/50 dark:border-secondary-700/50
        `}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <AutoCompleteSearch
            categories={CATEGORIES}
            styles={
              {
                top: 0,
                width: "100%",
              } as HTMLAttributes<HTMLDivElement>
            }
          />
        </div>
      </div>
    </div>
  );
}
