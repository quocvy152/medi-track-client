"use client";

import { handleFacebookCallback } from "@/lib/facebookAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import toast from "react-hot-toast";

function FacebookCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = params?.get("code");
      const error = params?.get("error");

      if (error) {
        toast.error("Đăng nhập bằng Facebook thất bại!");
        router.replace(`/vi/login`);
        return;
      }

      if (!code) {
        toast.error("Thiếu mã xác thực!");
        router.replace(`/vi/login`);
        return;
      }

      try {
        const response = await handleFacebookCallback(code);
        const { success } = response;

        if (success) {
          toast.success("Đăng nhập bằng Facebook thành công!");
          router.replace(`/vi`);
        } else {
          toast.error("Đăng nhập bằng Facebook thất bại!");
          router.replace(`/vi/login`);
        }
      } catch {
        toast.error("Đăng nhập bằng Facebook thất bại!");
        router.replace(`/vi/login`);
      }
    };

    run();
  }, [params, router]);

  return null;
}

export default function FacebookCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacebookCallbackInner />
    </Suspense>
  );
}
