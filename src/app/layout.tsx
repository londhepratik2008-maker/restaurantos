import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "RestaurantOS - Smart Restaurant Management",
  description: "All-in-one restaurant management platform for menu, orders, inventory, staff, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
