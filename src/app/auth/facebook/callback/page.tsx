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
        toast.error("Facebook sign-in was cancelled or failed");
        router.replace(`/vi/login`);
        return;
      }

      if (!code) {
        toast.error("Missing authorization code");
        router.replace(`/vi/login`);
        return;
      }

      try {
        const response = await handleFacebookCallback(code);
        console.log("🚀 ~ run ~ response:", response)
        const { state } = response;

        if (state) {
          toast.success("Signed in with Facebook");
          router.replace(`/vi`);
        } else {
          toast.error("Failed to sign in with Facebook");
          router.replace(`/vi/login`);
        }
      } catch {
        toast.error("Failed to sign in with Facebook");
        router.replace(`/vi/login`);
      }
    };

    run();
  }, []);

  return null;
}

export default function FacebookCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacebookCallbackInner />
    </Suspense>
  );
}
