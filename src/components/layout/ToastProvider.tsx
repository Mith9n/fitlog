"use client";

import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      theme="dark"
      toastClassName="!border !border-[#353740] !bg-[#15161b] !text-white !shadow-xl"
      progressClassName="!bg-[#c8ff00]"
    />
  );
}
