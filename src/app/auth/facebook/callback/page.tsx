"use client";

import { Loading } from "@/components/ui/Loading";
import { handleFacebookCallback } from "@/lib/facebookAuth";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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

          {/* Facebook Branding */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-[#1877F2] rounded-full p-2.5 shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Facebook"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Đăng nhập với Facebook
              </span>
            </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
            <Loading size="lg" className="relative text-cyan-500" />
          </div>
        </div>
      }
    >
      <FacebookCallbackInner />
    </Suspense>
  );
}
