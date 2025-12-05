"use client";

import { CartProvider } from "@/context/cartContext";
import { ToastProvider } from "@/context/toastContext";
import ChatWrapper from "@/components/chat/chat-wrapper";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
        <ChatWrapper />
      </CartProvider>
    </ToastProvider>
  );
}
