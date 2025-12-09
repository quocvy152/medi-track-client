"use client";

import { Loading } from "@/components/ui/Loading";
import { handleGoogleCallback } from "@/lib/googleAuth";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
              <div className="relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-xl">
                <Image
                  src="/images/medi_track_logo.png"
                  alt="MediTrack Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === "processing" && (
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
                <div className="relative">
                  <Loading size="lg" className="text-cyan-500" />
                </div>
              </div>
            )}
            {status === "success" && (
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse-slow" />
                <CheckCircleIcon className="relative w-20 h-20 text-green-500 transition-all duration-500 opacity-100 scale-100" />
              </div>
            )}
            {status === "error" && (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse-slow" />
                <XCircleIcon className="relative w-20 h-20 text-red-500 transition-all duration-500 opacity-100 scale-100" />
              </div>
            )}
          </div>

          {/* Status Messages */}
          {status === "processing" && (
            <div className="space-y-3 transition-all duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                Đang xử lý đăng nhập...
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-3 transition-all duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                Đăng nhập thành công!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base">
                Đang chuyển hướng...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3 transition-all duration-500">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                Đăng nhập thất bại
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base">
                Đang chuyển về trang đăng nhập...
              </p>
            </div>
          )}

          {/* Google Branding */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white rounded-full p-2.5 shadow-md border border-slate-200">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  aria-label="Google"
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
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Đăng nhập với Google
              </span>
            </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
            <Loading size="lg" className="relative text-cyan-500" />
          </div>
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
