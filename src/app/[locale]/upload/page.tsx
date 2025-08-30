"use client";

import UploadAndAnalysisPage from "@/components/UploadAndAnalysisPage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("isLoggedIn");
      if (!token) {
        router.replace(`/${params?.locale}/login`);
        return;
      }
      setAllowed(true);
    } catch {
      router.replace(`/${params?.locale}/login`);
    }
  }, [params?.locale, router]);

  if (!allowed) return null;

  return <UploadAndAnalysisPage />;
} 