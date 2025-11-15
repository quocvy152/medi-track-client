"use client";

import { Loading } from "@/components/ui/Loading";
import { handleGoogleCallback } from "@/lib/googleAuth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function GoogleCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const run = async () => {
      const code = params?.get("code");
      const error = params?.get("error");

      if (error) {
        setStatus("error");
        toast.error("Đăng nhập bằng Google thất bại!");
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
        const response = await handleGoogleCallback(code);
        const { success } = response;

        if (success) {
          setStatus("success");
          toast.success("Đăng nhập bằng Google thành công!");
          setTimeout(() => router.replace(`/vi`), 1000);
        } else {
          setStatus("error");
          toast.error("Đăng nhập bằng Google thất bại!");
          setTimeout(() => router.replace(`/vi/login`), 1500);
        }
      } catch {
        setStatus("error");
        toast.error("Đăng nhập bằng Google thất bại!");
        setTimeout(() => router.replace(`/vi/login`), 1500);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Google Icon */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-full p-3">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <Loading size="lg" />
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
