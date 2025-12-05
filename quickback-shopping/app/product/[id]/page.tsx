"use client";
import Spinner from "@/components/spinner/spinner";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/context/toastContext";
import useAuth from "@/hook/useAuth";
import Footer from "@/layout/app/footer";
import NavBar from "@/layout/app/navbar";
import { CartItem } from "@/ultils/api/cart";
import { getProductById, IProduct } from "@/ultils/api/product";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingBagIcon,
  HeartIcon,
  BuildingStorefrontIcon,
  TagIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

/* eslint-disable @next/next/no-img-element */
export default function ProductPage() {
  const { isAuthenticated } = useAuth(false);
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { id } = useParams();
  const { addToast } = useToast();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const data: CartItem = {
      productId: id as string,
      price: product?.price as string,
      productName: product?.name as string,
      productLink: product?.link as string,
      quantity: 1,
      cashbackPercentage: Number(product?.commission),
    };

    try {
      await addItem(data);
      addToast("Đã thêm vào giỏ hàng!", "success");
    } catch (error) {
      addToast("Thêm sản phẩm vào giỏ hàng thất bại.", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price?.replace(/[^\d]/g, "") || "0");
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const calculateCashback = () => {
    const num = parseInt(product?.price?.replace(/[^\d]/g, "") || "0");
    if (isNaN(num)) return "0";
    return formatPrice(
      String(Math.round(num * Number(product?.commission) / 100))
    );
  };

  useEffect(() => {
    const fetchProductById = async () => {
      setLoading(true);
      const data = await getProductById(id as string);
      setProduct(data);
      setLoading(false);
    };

    fetchProductById();
  }, [id]);

  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />
      {loading || !product ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Spinner />
          <p className="text-center mt-4 text-secondary-500">
            Đang tải, chờ xíu nhé ...
          </p>
        </div>
      ) : (
        <main className="flex-1 py-8 mt-[60px] px-4 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-secondary-800 border border-secondary-200/50 dark:border-secondary-700/50 shadow-card">
                  <img
                    className="w-full h-full object-cover"
                    src={product?.img || "/img_no_img.jpg"}
                    alt={product?.name}
                  />
                  {/* Cashback Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-500/90 backdrop-blur-sm text-white text-sm font-semibold shadow-lg">
                      <BanknotesIcon className="w-4 h-4" />
                      Hoàn {product?.commission}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="flex gap-3 lg:hidden">
                  <Link
                    href={`${product?.link}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all">
                      <ShoppingBagIcon className="w-5 h-5" />
                      Mua ngay
                    </button>
                  </Link>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors disabled:opacity-50"
                  >
                    {isAddingToCart ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    Lưu
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Shop Name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {product?.shop}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">
                  {product?.name}
                </h1>

                {/* Price Section */}
                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200/50 dark:border-secondary-700/50 shadow-card-sm">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-sm text-secondary-500 mb-1">Giá bán</p>
                      <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                        {formatPrice(product?.price || "0")}
                        <span className="text-lg font-medium text-secondary-500 ml-1">
                          đ
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary-500 mb-1">
                        Hoàn tiền
                      </p>
                      <p className="text-xl font-bold text-success-600 dark:text-success-400">
                        ~{calculateCashback()}đ
                      </p>
                    </div>
                  </div>

                  {/* Cashback Info */}
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                    <BanknotesIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
                    <span className="text-sm font-medium text-success-700 dark:text-success-300">
                      Bạn sẽ nhận lại {product?.commission}% khi mua sản phẩm
                      này
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-secondary-400" />
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    Danh mục: Mỹ phẩm
                  </span>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="hidden lg:flex gap-3">
                  <Link href={`${product?.link}`} target="_blank" className="flex-1">
                    <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-primary-sm hover:shadow-primary hover:from-primary-600 hover:to-primary-700 transition-all">
                      <ShoppingBagIcon className="w-5 h-5" />
                      Mua ngay
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors disabled:opacity-50"
                  >
                    {isAddingToCart ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    Lưu vào giỏ hàng
                  </button>
                </div>

                {/* Notice Section */}
                <div className="bg-warning-50 dark:bg-warning-900/20 rounded-2xl p-6 border border-warning-200 dark:border-warning-800">
                  <div className="flex items-center gap-2 mb-4">
                    <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                    <h3 className="font-semibold text-warning-800 dark:text-warning-200">
                      Lưu ý quan trọng
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-warning-700 dark:text-warning-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 flex-shrink-0"></span>
                      <span>
                        Các đơn vị bị hủy/đổi trả/hoàn đơn hoặc đặt tại Shopee
                        Livestream/Video sẽ không được hoàn tiền
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 flex-shrink-0"></span>
                      <span>
                        Giao dịch sử dụng thẻ quà tặng hoặc Giftcard không được
                        áp dụng
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 flex-shrink-0"></span>
                      <span>
                        Dán link cửa hàng (shop) không được áp dụng hoàn tiền ưu
                        đãi
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 flex-shrink-0"></span>
                      <span>
                        Tiền sẽ về ví bạn từ 5-7 ngày sau khi hoàn tất đơn hàng
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
