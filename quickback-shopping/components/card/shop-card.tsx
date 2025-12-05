/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRightIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

interface IShopCardProps {
  name: string;
  commission: number;
  src: string;
  link: string;
  buttonText?: string;
}

export default function ShopCard(props: IShopCardProps) {
  return (
    <div className="group w-full max-w-[400px] sm:w-[200px] sm:max-w-[250px] bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden border border-secondary-200/50 dark:border-secondary-700/50 shadow-card-sm hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image Container */}
      <Link href={props.link || "#"} className="block relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={props.src || "/img_no_img.jpg"}
            alt={props.name}
          />
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Commission Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Hoàn {props.commission}%
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Shop Icon & Name */}
          <Link href={props.link || "#"} className="block group/name">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <BuildingStorefrontIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <h5 className="font-semibold text-secondary-900 dark:text-white group-hover/name:text-primary-600 dark:group-hover/name:text-primary-400 transition-colors line-clamp-1">
                {props.name}
              </h5>
            </div>
          </Link>

          {/* Commission Info */}
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Hoàn tiền đến{" "}
            <span className="font-semibold text-success-600 dark:text-success-400">
              {props.commission}%
            </span>
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={props.link || "#"}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all group/btn"
        >
          <span>{props.buttonText || "Xem chi tiết"}</span>
          <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
