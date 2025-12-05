"use client";

import { usePathname } from "next/navigation";
import useAuth from "@/hook/useAuth";
import ChatPopup from "./chat-popup";

export default function ChatWrapper() {
  const { isAuthenticated } = useAuth(false);
  const pathname = usePathname();

  // Don't show chat on admin pages, login, register pages
  const hiddenPaths = ["/admin", "/login", "/register"];
  const shouldHide = hiddenPaths.some((path) => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <ChatPopup isAuthenticated={isAuthenticated} />;
}
