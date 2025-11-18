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

  return (
    <div className="sticky top-0 z-[99999] w-full bg-white/95 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800 backdrop-blur-xl shadow-sm">
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-[999999] lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2 z-1">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {NAVIGATION_LIST.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
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
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <img
                              alt={item.imageAlt || "alt"}
                              src={item.imageSrc}
                              className="object-cover object-center"
                            />
                          </div>
                          <a
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Mua ngay
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-gray-900"
                        >
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {NAVIGATION_LIST.pages.map((page) => {
                if (page.name !== "Trang chủ") {
                  return (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </a>
                    </div>
                  );
                }
              })}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {isAuthenticated ? (
                <div
                  onClick={() => {
                    handleOpenModal();
                    setOpen(false);
                  }}
                  className="cursor-pointer font-medium text-gray-700 hover:text-gray-800"
                >
                  Đăng xuất
                </div>
              ) : (
                <>
                  <div className="flow-root">
                    <Link
                      href="/login"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      href="/register"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-transparent">
        <div className="w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white">
          <div className="mx-auto flex items-center justify-between gap-4 px-4 py-2 text-sm font-medium sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-white/90">
              <SparklesIcon className="h-5 w-5" aria-hidden="true" />
              <p className="text-left">
                <span className="hidden sm:inline">
                  Hoàn tiền không giới hạn & ưu đãi độc quyền mỗi tuần
                </span>
                <span className="sm:hidden">Ưu đãi hấp dẫn tại QuickBack</span>
              </p>
            </div>
            <Link
              href="/collections/highlight"
              className="flex items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
            >
              Khám phá ngay
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <nav
          aria-label="Top"
          className="mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="py-4">
            <div className="space-y-3 rounded-2xl border border-gray-200/70 bg-white/90 px-3 py-4 shadow-xl shadow-gray-900/5 backdrop-blur-xl dark:border-gray-700/60 dark:bg-gray-900/60 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 lg:hidden">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <span className="sr-only">Trang chủ</span>
                      <HomeIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(!open)}
                      className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <span className="sr-only">Mở menu</span>
                      <Bars3Icon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                  <Link
                    href="/"
                    className="group flex items-center gap-3 rounded-full bg-white/80 px-2 py-1 transition hover:bg-white dark:bg-gray-900/70"
                  >
                    <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-1 shadow-lg shadow-primary-500/30">
                      <img
                        src="/logo_img.png"
                        alt="QuickBack"
                        className="h-9 w-9 rounded-xl border border-white/40 object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 transition group-hover:text-primary-600 dark:text-gray-100">
                        QuickBack
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                        shopping studio
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 lg:flex">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    Trải nghiệm mới
                  </span>
                  <span className="hidden xl:flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500/60" />
                    Hỗ trợ 24/7
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Flyout menus */}
                <PopoverGroup className="hidden flex-1 items-center gap-6 lg:flex">
                  {NAVIGATION_LIST.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="text-sm font-medium text-gray-600 transition hover:text-gray-900 hover:underline hover:underline-offset-8 dark:text-gray-300"
                    >
                      {page.name}
                    </Link>
                  ))}
                  {NAVIGATION_LIST.categories.map((category) => (
                    <Popover key={category.name} className="relative flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center gap-1 border-b-2 border-transparent pb-2 text-sm font-medium text-gray-700 transition hover:border-primary-500 hover:text-primary-600 dark:text-gray-200">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-gray-600 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div className="absolute inset-0 top-1/2 bg-white shadow-lg shadow-gray-900/5 dark:bg-gray-900" />

                        <div className="relative bg-white dark:bg-gray-900">
                          <div className="mx-auto px-8">
                            <div className="grid grid-cols-2 gap-x-10 gap-y-12 py-14">
                              <div className="col-start-2 grid grid-cols-2 gap-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-2xl bg-gray-100 shadow-inner ring-1 ring-inset ring-gray-200 transition group-hover:scale-[1.01] group-hover:ring-primary-200">
                                      <img
                                        alt={item.imageAlt || item.name}
                                        src={item.imageSrc}
                                        className="object-cover object-center"
                                      />
                                    </div>
                                    <a
                                      href={item.href}
                                      className="mt-6 block font-semibold text-gray-900 transition group-hover:text-primary-600 dark:text-gray-100"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </a>
                                    <p
                                      aria-hidden="true"
                                      className="mt-1 text-xs uppercase tracking-[0.3em] text-gray-400"
                                    >
                                      Mua ngay
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-5 space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <a
                                            href={item.href}
                                            className="text-gray-700 transition hover:text-primary-600 dark:text-gray-300"
                                          >
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                </PopoverGroup>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleOpenModal}
                        className="text-gray-600 transition hover:text-primary-600 dark:text-gray-300"
                      >
                        Đăng xuất
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="text-gray-600 transition hover:text-primary-600 dark:text-gray-300"
                        >
                          {isAuthenticated === null ? "" : "Đăng nhập"}
                        </Link>
                        <span
                          aria-hidden="true"
                          className="h-4 w-px bg-gray-200 dark:bg-gray-700"
                        />
                        <Link
                          href="/register"
                          className="text-gray-600 transition hover:text-primary-600 dark:text-gray-300"
                        >
                          {isAuthenticated === null ? "" : "Đăng ký"}
                        </Link>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSearch(!showSearch)}
                    className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  >
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="hidden md:inline">Tìm kiếm</span>
                  </button>

                  <Link
                    href={`${isAuthenticated ? "/profile" : "/login"}`}
                    className="group flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  >
                    <UserIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400 transition group-hover:text-primary-500"
                    />
                    <span className="hidden md:inline">
                      {isAuthenticated ? "Tài khoản" : "Đăng nhập"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/history/${cart?.[0]?.userId}?activeId=cart`);
                    }}
                    className="group relative flex items-center gap-2 rounded-full bg-primary-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-600"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-white"
                    />
                    <span className="hidden sm:inline">Giỏ hàng</span>
                    <span className="rounded-full bg-white/20 px-2 text-xs font-bold tracking-wider">
                      {total}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>

            {isModalOpen ? (
              <BaseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Đăng xuất"
                onConfirm={handleConfirm}
              >
                <p>Bạn có chắc chắn muốn đăng xuất</p>
              </BaseModal>
            ) : null}
          </div>
        </nav>
      </header>
      <div
        className={`${showSearch ? "nav-enter" : "nav-exit h-0 hidden"
          } bg-transparent`}
      >
        <AutoCompleteSearch
          categories={CATEGORIES}
          styles={
            {
              top: 0,
              width: "auto",
            } as HTMLAttributes<HTMLDivElement>
          }
        />
      </div>
    </div>
  );
}
