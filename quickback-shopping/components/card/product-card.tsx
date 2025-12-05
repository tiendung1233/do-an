import { CartItem } from "@/ultils/api/cart";
import Link from "next/link";
import { removeHttps } from "@/ultils/func/helper";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/context/toastContext";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";

interface IProductCard {
  cost: string;
  name: string;
  shop: string;
  link: string;
  src: string;
  commission: string;
}

const ProductCard = (props: IProductCard) => {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    const data: CartItem = {
      productId: removeHttps(props.link),
      price: props.cost,
      productName: props.name,
      productLink: props.link,
      quantity: 1,
      cashbackPercentage: Number(props.commission),
    };

    try {
      await addItem(data);
      addToast("Sản phẩm đã được thêm vào giỏ hàng!", "success");
    } catch (error) {
      addToast("Thêm sản phẩm vào giỏ hàng thất bại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/[^\d]/g, ""));
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const calculateCashback = () => {
    const num = parseInt(props.cost.replace(/[^\d]/g, ""));
    if (isNaN(num)) return "0";
    return formatPrice(String(Math.round(num * Number(props.commission) / 100)));
  };

  return (
    <div className="group relative w-full bg-white dark:bg-secondary-800 rounded-xl sm:rounded-2xl overflow-hidden border border-secondary-200/50 dark:border-secondary-700/50 shadow-card-sm hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1">
      {/* Cashback Badge */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
        <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-success-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold shadow-lg">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Hoàn {props.commission}%
        </span>
      </div>

      {/* Wishlist Button - Always visible on mobile */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm border border-secondary-200/50 dark:border-secondary-700/50 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110"
      >
        {isWishlisted ? (
          <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
        ) : (
          <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 hover:text-accent-500 transition-colors" />
        )}
      </button>

      {/* Image Container */}
      <Link
        href={`/product/${removeHttps(props.link)}` || "#"}
        className="block relative aspect-square overflow-hidden bg-secondary-100 dark:bg-secondary-700"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={props.src}
          alt={props.name}
        />
        {/* Hover Overlay - Only on desktop */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Shop Name */}
        <p className="text-[10px] sm:text-xs font-medium text-primary-600 dark:text-primary-400 mb-0.5 sm:mb-1 truncate">
          {props.shop}
        </p>

        {/* Product Name */}
        <Link
          href={`/product/${removeHttps(props.link)}` || "#"}
          className="block"
        >
          <h3 className="text-xs sm:text-sm font-semibold text-secondary-900 dark:text-white line-clamp-2 min-h-[28px] sm:min-h-[40px] hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-tight">
            {props.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mt-1 sm:mt-3">
          <p className="text-sm sm:text-lg font-bold text-secondary-900 dark:text-white">
            {formatPrice(props.cost)}
            <span className="text-[10px] sm:text-sm font-medium text-secondary-500 ml-0.5">đ</span>
          </p>
          <p className="text-[10px] sm:text-xs text-success-600 dark:text-success-400 font-medium">
            Hoàn ~{calculateCashback()}đ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 text-[11px] sm:text-sm font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            )}
            <span className="truncate">Lưu</span>
          </button>
          <Link
            href={`/product/${removeHttps(props.link)}` || "#"}
            className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[11px] sm:text-sm font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            <ShoppingBagIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Mua</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
