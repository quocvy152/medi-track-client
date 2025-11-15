"use client";

import { Loading } from "@/components/ui/Loading";
import { handleFacebookCallback } from "@/lib/facebookAuth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function FacebookCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const run = async () => {
      const code = params?.get("code");
      const error = params?.get("error");

      if (error) {
        setStatus("error");
        toast.error("Đăng nhập bằng Facebook thất bại!");
        setTimeout(() => router.replace(`/vi/login`), 1500);
        return;
      }

      if (!code) {
        setStatus("error");
        toast.error("Thiếu mã xác thực!");
        setTimeout(() => router.replace(`/vi/login`), 1500);
        return;
      }

      try {
        const response = await handleFacebookCallback(code);
        const { success } = response;

        if (success) {
          setStatus("success");
          toast.success("Đăng nhập bằng Facebook thành công!");
          setTimeout(() => router.replace(`/vi`), 1000);
        } else {
          setStatus("error");
          toast.error("Đăng nhập bằng Facebook thất bại!");
          setTimeout(() => router.replace(`/vi/login`), 1500);
        }
      } catch {
        setStatus("error");
        toast.error("Đăng nhập bằng Facebook thất bại!");
        setTimeout(() => router.replace(`/vi/login`), 1500);
      }
    };

    run();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-12 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/medi_track_logo.png"
            alt="MediTrack Logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <Loading size="lg" className="text-blue-500" />
        </div>

        {/* Status Messages */}
        {status === "processing" && (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              Đang xử lý đăng nhập...
            </h2>
            <p className="text-gray-400">
              Vui lòng đợi trong giây lát
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Đăng nhập thành công!
            </h2>
            <p className="text-gray-400">
              Đang chuyển hướng...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Đăng nhập thất bại
            </h2>
            <p className="text-gray-400">
              Đang chuyển về trang đăng nhập...
            </p>
          </>
        )}

        {/* Facebook Icon */}
        <div className="mt-8 flex justify-center">
          <div className="bg-blue-600 rounded-full p-3">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FacebookCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <Loading size="lg" />
        </div>
      }
    >
      <FacebookCallbackInner />
    </Suspense>
  );
}
