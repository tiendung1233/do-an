"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ChartPieIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { viewAdmin } from "@/ultils/func/admin";
import BaseModal from "@/components/modals/base-modal";
import Cookies from "js-cookie";
import { logout } from "@/ultils/func/api";
import useAuth from "@/hook/useAuth";
import Spinner from "@/components/spinner/spinner";

const navigationList = [
  {
    name: "Dashboard",
    href: "#",
    icon: HomeIcon,
    current: true,
    type: "dashboard",
  },
  {
    name: "Người dùng",
    href: "#",
    icon: UsersIcon,
    current: false,
    type: "user",
  },
  {
    name: "Sản phẩm",
    href: "#",
    icon: FolderIcon,
    current: false,
    type: "product",
  },
  {
    name: "Đơn hàng",
    href: "#",
    icon: ShoppingCartIcon,
    current: false,
    type: "purchase",
  },
  {
    name: "Yêu cầu",
    href: "#",
    icon: DocumentDuplicateIcon,
    current: false,
    type: "requirement",
  },
  {
    name: "Báo cáo",
    href: "#",
    icon: ChartPieIcon,
    current: false,
    type: "report",
  },
  {
    name: "Chat hỗ trợ",
    href: "#",
    icon: ChatBubbleLeftRightIcon,
    current: false,
    type: "chat",
  },
  {
    name: "Thống kê",
    href: "#",
    icon: ChartBarIcon,
    current: false,
    type: "analytics",
  },
];

const teams = [
  {
    id: 1,
    name: "Thông tin",
    href: "/our",
    icon: InformationCircleIcon,
    current: false,
    type: "info",
  },
  {
    id: 2,
    name: "Hướng dẫn",
    href: "/policy",
    icon: BookOpenIcon,
    current: false,
    type: "",
  },
];

const userNavigation = [{ name: "Đăng xuất", icon: ArrowRightOnRectangleIcon }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Admin() {
  const { isAuthenticated, role } = useAuth(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typeAdmin, setTypeAdmin] = useState("dashboard");
  const [navigation, setNavigation] = useState(navigationList);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickNav = (type: string) => {
    setTypeAdmin(type);
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: item.type === type,
    }));

    setNavigation(updatedNavigation);
    setSidebarOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleConfirm = async () => {
    await logout();
    setIsModalOpen(false);
  };

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: item.type === typeAdmin,
    }));

    setNavigation(updatedNavigation);
  }, [typeAdmin]);

  if (role! < 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30 dark:from-secondary-900 dark:via-secondary-950 dark:to-primary-950/20">
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                  <span className="sr-only">Đóng sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Mobile Sidebar Content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 dark:bg-secondary-900/90 backdrop-blur-xl px-6 pb-4 border-r border-secondary-200/50 dark:border-secondary-700/50">
              <div className="flex h-16 shrink-0 items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-primary-sm">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  QuickBack Admin
                </span>
              </div>

              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  {/* Main Navigation */}
                  <li>
                    <div className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                      Menu chính
                    </div>
                    <ul role="list" className="space-y-1">
                      {navigation.map((item) => (
                        <li
                          className="cursor-pointer"
                          key={item.name}
                          onClick={() => handleClickNav(item.type)}
                        >
                          <div
                            className={classNames(
                              item.current
                                ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20"
                                : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 border-transparent",
                              "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all border"
                            )}
                          >
                            <div
                              className={classNames(
                                item.current
                                  ? "bg-primary-500 text-white shadow-primary-sm"
                                  : "bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700",
                                "flex size-9 shrink-0 items-center justify-center rounded-lg transition-all"
                              )}
                            >
                              <item.icon aria-hidden="true" className="size-5" />
                            </div>
                            {item.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Quick Links */}
                  <li>
                    <div className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                      Liên kết nhanh
                    </div>
                    <ul role="list" className="space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            target="_blank"
                            className="group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-all"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 transition-all">
                              <team.icon aria-hidden="true" className="size-5" />
                            </div>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Settings */}
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-all"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 transition-all">
                        <Cog6ToothIcon aria-hidden="true" className="size-5" />
                      </div>
                      Cài đặt
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/70 dark:bg-secondary-900/80 backdrop-blur-xl px-6 pb-4 border-r border-secondary-200/50 dark:border-secondary-700/50">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-primary-sm">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              QuickBack Admin
            </span>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {/* Main Navigation */}
              <li>
                <div className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                  Menu chính
                </div>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li
                      className="cursor-pointer"
                      key={item.name}
                      onClick={() => handleClickNav(item.type)}
                    >
                      <div
                        className={classNames(
                          item.current
                            ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20"
                            : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 border-transparent",
                          "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all border"
                        )}
                      >
                        <div
                          className={classNames(
                            item.current
                              ? "bg-primary-500 text-white shadow-primary-sm"
                              : "bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700",
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-all"
                          )}
                        >
                          <item.icon aria-hidden="true" className="size-5" />
                        </div>
                        {item.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Quick Links */}
              <li>
                <div className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                  Liên kết nhanh
                </div>
                <ul role="list" className="space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        target="_blank"
                        href={team.href}
                        className="group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-all"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 transition-all">
                          <team.icon aria-hidden="true" className="size-5" />
                        </div>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Settings */}
              <li className="mt-auto">
                <a
                  href="#"
                  className="group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800/50 transition-all"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-500 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-700 transition-all">
                    <Cog6ToothIcon aria-hidden="true" className="size-5" />
                  </div>
                  Cài đặt
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/70 dark:bg-secondary-900/80 backdrop-blur-xl border-b border-secondary-200/50 dark:border-secondary-700/50 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors lg:hidden"
          >
            <span className="sr-only">Mở sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          <div aria-hidden="true" className="h-6 w-px bg-secondary-200 dark:bg-secondary-700 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Search */}
            <form action="#" method="GET" className="relative flex flex-1 items-center">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 size-5 text-secondary-400"
              />
              <input
                name="search"
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
                className="h-10 w-full max-w-md rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50 border border-secondary-200/50 dark:border-secondary-700/50 pl-10 pr-4 text-sm text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="relative p-2 rounded-xl text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <span className="sr-only">Thông báo</span>
                <BellIcon aria-hidden="true" className="size-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full"></span>
              </button>

              <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200 dark:lg:bg-secondary-700" />

              {/* User Menu */}
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                  <span className="sr-only">Mở menu người dùng</span>
                  <div className="size-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-primary-sm">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                      Admin
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 size-5 text-secondary-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-secondary-800 py-2 shadow-lg ring-1 ring-secondary-200/50 dark:ring-secondary-700/50 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <div
                        onClick={() => {
                          handleOpenModal();
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 cursor-pointer transition-colors"
                      >
                        <item.icon className="size-5 text-secondary-400" />
                        {item.name}
                      </div>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
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
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </p>
          </BaseModal>
        )}

        {/* Main Content Area */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {navigation.find((item) => item.current)?.name || "Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-secondary-500">
                Quản lý và theo dõi hoạt động của hệ thống
              </p>
            </div>

            {/* Content */}
            <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl rounded-2xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-card p-6">
              {viewAdmin(typeAdmin, setTypeAdmin)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
