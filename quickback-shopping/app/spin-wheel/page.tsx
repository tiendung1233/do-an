"use client";

import useAuth from "@/hook/useAuth";
import NavBar from "@/layout/app/navbar";
import Footer from "@/layout/app/footer";
import SpinWheel from "@/components/spinWheel/SpinWheel";
import Spinner from "@/components/spinner/spinner";

export default function SpinWheelPage() {
  const { isAuthenticated, loading } = useAuth(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen flex flex-col">
      <NavBar isAuthenticated={isAuthenticated} />
      <main className="flex-1 py-8 mt-[60px] px-4 sm:px-8 lg:px-16">
        <div className="max-w-lg mx-auto">
          <SpinWheel />
        </div>
      </main>
      <Footer />
    </div>
  );
}
