"use client";
import ShopCard from "@/components/card/shop-card";
import Slider from "@/components/slider/slider";
import Spinner from "@/components/spinner/spinner";
import useAuth from "@/hook/useAuth";
import Footer from "@/layout/app/footer";
import NavBar from "@/layout/app/navbar";
import { getShops, IShopArr, IShopQuery } from "@/ultils/api/shop";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ShopPage() {
  const { isAuthenticated } = useAuth(false);
  const [shop, setShop] = useState<IShopArr[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const query: IShopQuery = {
      page,
      limit: 20,
      searchTerm: search,
    };

    const data = await getShops(query);
    if (!data?.shops || data?.shops?.length < 20) {
      setHasMore(false);
    } else {
      setShop((prev) => [...prev, ...data.shops]);
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  }, [loading, hasMore, page, search]);

  useEffect(() => {
    setPage(1);
    setShop([]);
    setHasMore(true);
    fetchMoreProducts();
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading) {
          await fetchMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMoreProducts, loading]);

  const updateURLParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const slides = [
    <div
      className="bg-blue-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={0}
    >
      <img
        className="h-full object-cover w-full"
        src="/home_banner.jpg"
        alt=""
      />
    </div>,
    <div
      className="bg-green-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={1}
    >
      <img className="h-full object-cover w-full" src="/giay_dep.jpg" alt="" />
    </div>,
    <div
      className="bg-red-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={2}
    >
      <img className="h-full object-cover w-full" src="/my_pham.jpg" alt="" />
    </div>,
    <div
      className="bg-red-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={3}
    >
      <img
        className="h-full object-cover w-full"
        src="/home_banner1.jpg"
        alt=""
      />
    </div>,
  ];

  return (
    <div className="bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />
      <main className="flex-1 py-8 mt-[60px] px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Slider */}
          <div className="mb-8">
            <Slider slides={slides} loop={true} autoPlay={true} />
          </div>

          {/* Featured Shops */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Ưu đãi Hoàn Tiền nổi bật
            </h2>
            <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-4">
              {shop?.map((item, i) => {
                if (i < 5) {
                  return (
                    <ShopCard
                      key={i}
                      name={item.shop}
                      src={item.firstProductImg}
                      commission={item.firstProductCommission}
                      link={`/product?shopName=${item.shop}`}
                      buttonText="Xem"
                    />
                  );
                }
                return null;
              })}
            </div>
          </section>

          {/* Shop Grid */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Danh sách cửa hàng
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {!loading && shop?.length ? (
                shop?.map((item, i) => (
                  <ShopCard
                    key={i}
                    name={item.shop}
                    src={item.firstProductImg}
                    commission={item.firstProductCommission}
                    link={`/product?shopName=${item.shop}`}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10">
                  <Spinner />
                  <p className="text-center mt-2 text-secondary-500">Đang tải ...</p>
                </div>
              )}
            </div>
            <div ref={observerRef} className="h-10"></div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
