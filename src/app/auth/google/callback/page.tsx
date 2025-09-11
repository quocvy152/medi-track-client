"use client";

import { handleGoogleCallback } from "@/lib/googleAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import toast from "react-hot-toast";

function GoogleCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  // const pathname = usePathname();

  useEffect(() => {
    const run = async () => {
      const code = params?.get("code");
      const error = params?.get("error");
      // const locale = pathname?.split("/")?.[1] || "en";

      if (error) {
        toast.error("Google sign-in was cancelled or failed");
        router.replace(`/vi/login`);
        return;
      }

      if (!code) {
        toast.error("Missing authorization code");
        router.replace(`/vi/login`);
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
          router.replace(`/vi/login`);
        }
      } catch {
        toast.error("Failed to sign in with Google");
        router.replace(`/vi/login`);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackInner />
    </Suspense>
  );
}
