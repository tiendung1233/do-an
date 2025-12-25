"use client";

import CashbackCard from "@/components/card/cash-card";
import HelpCard from "@/components/card/help-card";
import Slider from "@/components/slider/slider";
import useAuth from "@/hook/useAuth";
import NavBar from "@/layout/app/navbar";
import { getProfile, IProfileResponse } from "@/ultils/api/profile";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import MembershipCard from "@/components/membership/MembershipCard";

export default function EventPage() {
  const { isAuthenticated } = useAuth(false);
  const [profile, setProfile] = useState<IProfileResponse | null>(null);
  const slides = [
    <div
      className="bg-blue-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={0}
    >
      Slide 1
    </div>,
    <div
      className="bg-green-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={1}
    >
      Slide 2
    </div>,
    <div
      className="bg-red-500 h-[200px] sm:h-[400px] flex items-center justify-center text-white"
      key={2}
    >
      Slide 3
    </div>,
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("authToken");
      if (token) {
        try {
          const profileData = await getProfile(token);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    if (!!isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <div className=" ">
      <NavBar isAuthenticated={isAuthenticated} />
      <div className="py-6 px-4 bg-gray-100 h-full min-h-screen overflow-hidden overflow-y-scroll mt-[120px]">
        <CashbackCard
          totalCashback={profile?.total?.toString()!}
          availableBalance={profile?.money?.toString()!}
          onWithdraw={() => { }}
          userId={profile?._id!}
        />

        {/* Membership Card */}
        <div className="mt-4 w-full">
          <MembershipCard userId={profile?._id} />
        </div>

        <div className="mt-4 w-full">
          <HelpCard
            title="Vòng Quay May Mắn"
            imgContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-7 h-7 text-yellow-500 mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                <path d="M8 4.5a.5.5 0 0 1 .5.5v2.5H11a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V8.5H5a.5.5 0 0 1 0-1h2.5V5a.5.5 0 0 1 .5-.5" />
              </svg>
            }
            description="Hoàn thành đơn hàng để nhận lượt quay miễn phí! Trúng tiền mặt và voucher giảm giá!"
            guidelineLink="/spin-wheel"
            btnContent="Quay ngay"
          />
        </div>
        <div className="mt-4 w-full">
          <HelpCard
            title="Mời bạn nhận quà khủng"
            imgContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-link-45deg w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
            }
            description="Mời bạn bè tham gia ngay để nhận quà tặng hấp dẫn trị giá lên đến 140k!"
            guidelineLink={`/event/${profile?._id}/referral`}
            btnContent="Mời ngay"
          />
        </div>
        <div className="mt-4 w-full">
          <HelpCard
            title="Điểm danh nhận Voucher"
            imgContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
              </svg>
            }
            description="Điểm danh mỗi ngày để nhận voucher cashback từ 1% đến 7%!"
            guidelineLink={`/event/${profile?._id}/checkin`}
            btnContent="Điểm danh"
          />
        </div>
        <div className="mt-4 w-full">
          <HelpCard
            title="Kho Voucher"
            imgContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13Z" />
              </svg>
            }
            description="Quản lý và sử dụng voucher của bạn để nhận thêm cashback!"
            guidelineLink={`/event/${profile?._id}/voucher`}
            btnContent="Xem voucher"
          />
        </div>
        <div className="mt-4 w-full">
          <HelpCard
            title="Áp dụng Voucher"
            imgContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
                viewBox="0 0 16 16"
              >
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
            }
            description="Nhập mã voucher vào đơn hàng đã duyệt để nhận thêm cashback!"
            guidelineLink={`/event/${profile?._id}/apply-voucher`}
            btnContent="Áp dụng ngay"
          />
        </div>
        <div className="mt-4 w-full">
          <Slider slides={slides} loop={true} autoPlay={true} />
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
                alt=""
              />
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
                alt=""
              />
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
