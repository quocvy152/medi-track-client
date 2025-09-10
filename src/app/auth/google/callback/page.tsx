"use client";

import { handleGoogleCallback } from "@/lib/googleAuth";
import { authService } from "@/services/authService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const run = async () => {
      const code = params?.get("code");
      const error = params?.get("error");
      const locale = pathname?.split("/")?.[1] || "en";

      if (error) {
        toast.error("Google sign-in was cancelled or failed");
        router.replace(`/${locale}/login`);
        return;
      }

      if (!code) {
        toast.error("Missing authorization code");
        router.replace(`/${locale}/login`);
        return;
      }

      try {
        const response = await handleGoogleCallback(code);
        const { state } = response;

        if (state) {
          toast.success("Signed in with Google");
          router.replace(`/vi`);
        } else {
          toast.error("Failed to sign in with Google");
          router.replace(`/${locale}/login`);
        }
      } catch (e) {
        toast.error("Failed to sign in with Google");
        router.replace(`/${locale}/login`);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
