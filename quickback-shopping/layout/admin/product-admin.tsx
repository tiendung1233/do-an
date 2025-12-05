import {
  ArrowTopRightOnSquareIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import ProductTable from "./product-table";

const projects = [
  {
    name: "Sản phẩm",
    initials: "SP",
    href: "https://docs.google.com/spreadsheets/d/1OpWGJl7Kf67_XDQZtU20MaT9TJEs7noAju5oiYX7nE0/edit?gid=0#gid=0",
    icon: ShoppingBagIcon,
    color: "primary",
  },
  {
    name: "Cửa hàng",
    initials: "Shop",
    href: "https://docs.google.com/spreadsheets/d/1OpWGJl7Kf67_XDQZtU20MaT9TJEs7noAju5oiYX7nE0/edit?gid=0#gid=0",
    icon: BuildingStorefrontIcon,
    color: "success",
  },
  {
    name: "Website",
    initials: "WEB",
    href: "#",
    icon: GlobeAltIcon,
    color: "warning",
  },
  {
    name: "Khác",
    initials: "O",
    href: "#",
    icon: EllipsisHorizontalIcon,
    color: "secondary",
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return {
        bg: "bg-gradient-to-br from-primary-500 to-primary-600",
        bgLight: "bg-primary-50 dark:bg-primary-900/20",
        text: "text-primary-600 dark:text-primary-400",
        border: "border-primary-200 dark:border-primary-800",
        shadow: "shadow-primary-sm",
      };
    case "success":
      return {
        bg: "bg-gradient-to-br from-success-500 to-success-600",
        bgLight: "bg-success-50 dark:bg-success-900/20",
        text: "text-success-600 dark:text-success-400",
        border: "border-success-200 dark:border-success-800",
        shadow: "shadow-lg",
      };
    case "warning":
      return {
        bg: "bg-gradient-to-br from-warning-500 to-warning-600",
        bgLight: "bg-warning-50 dark:bg-warning-900/20",
        text: "text-warning-600 dark:text-warning-400",
        border: "border-warning-200 dark:border-warning-800",
        shadow: "shadow-lg",
      };
    default:
      return {
        bg: "bg-gradient-to-br from-secondary-500 to-secondary-600",
        bgLight: "bg-secondary-50 dark:bg-secondary-800/50",
        text: "text-secondary-600 dark:text-secondary-400",
        border: "border-secondary-200 dark:border-secondary-700",
        shadow: "shadow-lg",
      };
  }
};

export default function ProductAdmin() {
  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => {
          const colors = getColorClasses(project.color);
          return (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.shadow}`}
                >
                  <project.icon className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-secondary-900 dark:text-white truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-secondary-500 truncate">
                    Nhấn để xem chi tiết
                  </p>
                </div>
                <ArrowTopRightOnSquareIcon className="size-5 text-secondary-400 group-hover:text-primary-500 transition-colors" />
              </div>

              {/* Decorative gradient */}
              <div
                className={`absolute -top-8 -right-8 size-16 rounded-full ${colors.bg} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`}
              />
            </a>
          );
        })}
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-white/60 dark:bg-secondary-800/60 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-secondary-200/50 dark:border-secondary-700/50">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-sm">
            <ShoppingBagIcon className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Danh sách sản phẩm
            </h2>
            <p className="text-sm text-secondary-500">
              Quản lý tất cả sản phẩm trong hệ thống
            </p>
          </div>
        </div>
        <div className="p-6">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
