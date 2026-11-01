import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/layout/ToastProvider";

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Choose your workouts and track your daily fitness plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-[#0f1013] text-white antialiased">
        {/* Every page will show the same Navbar */}
        <Navbar />

        {children}

        <ToastProvider />

        {/* Every page will show the same Footer */}
        <Footer />
      </body>
    </html>
  );
}
