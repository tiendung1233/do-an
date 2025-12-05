import { getCount } from "@/ultils/api/product";
import Cookies from "js-cookie";
import {
  CursorArrowRaysIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Dashboard(props: any) {
  const [stats, setStats] = useState([
    {
      id: 1,
      name: "Tổng số người dùng",
      stat: "...",
      icon: UsersIcon,
      type: "user",
      color: "primary",
      trend: "+12%",
    },
    {
      id: 2,
      name: "Cửa hàng",
      stat: "...",
      icon: BuildingStorefrontIcon,
      type: "product",
      color: "success",
      trend: "+8%",
    },
    {
      id: 3,
      name: "Số sản phẩm",
      stat: "...",
      icon: CursorArrowRaysIcon,
      type: "product",
      color: "warning",
      trend: "+24%",
    },
  ]);

  const token = Cookies.get("authToken");

  const fetchData = async () => {
    try {
      const data = await getCount(token!);
      setStats((prevStats) =>
        prevStats.map((item) =>
          item.id === 3
            ? { ...item, stat: data?.productCount || "255" }
            : item.id === 2
            ? { ...item, stat: data?.shopCount || "25" }
            : { ...item, stat: data?.userCount || "10" }
        )
      );
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary-500",
          bgLight: "bg-primary-50 dark:bg-primary-900/20",
          text: "text-primary-600 dark:text-primary-400",
          border: "border-primary-200 dark:border-primary-800",
        };
      case "success":
        return {
          bg: "bg-success-500",
          bgLight: "bg-success-50 dark:bg-success-900/20",
          text: "text-success-600 dark:text-success-400",
          border: "border-success-200 dark:border-success-800",
        };
      case "warning":
        return {
          bg: "bg-warning-500",
          bgLight: "bg-warning-50 dark:bg-warning-900/20",
          text: "text-warning-600 dark:text-warning-400",
          border: "border-warning-200 dark:border-warning-800",
        };
      default:
        return {
          bg: "bg-secondary-500",
          bgLight: "bg-secondary-50 dark:bg-secondary-900/20",
          text: "text-secondary-600 dark:text-secondary-400",
          border: "border-secondary-200 dark:border-secondary-800",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const colors = getColorClasses(item.color);
          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-12 items-center justify-center rounded-xl ${colors.bg} shadow-lg`}
                >
                  <item.icon aria-hidden="true" className="size-6 text-white" />
                </div>
                {/* Trend Badge */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${colors.bgLight} ${colors.text}`}
                >
                  <ArrowTrendingUpIcon className="size-4" />
                  <span className="text-xs font-semibold">{item.trend}</span>
                </div>
              </div>

              {/* Content */}
              <div className="mt-4">
                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                  {item.name}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                    {item.stat}
                  </p>
                </dd>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700/50">
                <button
                  onClick={() => props.setTypeAdmin(item.type)}
                  className={`flex items-center gap-2 text-sm font-medium ${colors.text} hover:gap-3 transition-all`}
                >
                  Xem chi tiết
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>

              {/* Decorative gradient */}
              <div
                className={`absolute -top-12 -right-12 size-24 rounded-full ${colors.bg} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
              />
            </div>
          );
        })}
      </dl>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-6 shadow-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Chào mừng đến trang quản trị
            </h3>
            <p className="mt-1 text-sm text-primary-100">
              Quản lý người dùng, sản phẩm và theo dõi hoạt động hệ thống
            </p>
          </div>
          <button
            onClick={() => props.setTypeAdmin("user")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors"
          >
            <UsersIcon className="size-5" />
            Quản lý người dùng
          </button>
        </div>
      </div>
    </div>
  );
}
