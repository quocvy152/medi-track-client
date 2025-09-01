/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import UploadAndAnalysisPage from "@/components/UploadAndAnalysisPage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [allowed, setAllowed] = useState(false);

  // Function to check authentication status
  const checkAuthStatus = () => {
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
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen for authentication state changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [params?.locale, router]);

  if (!allowed) return null;

  return <UploadAndAnalysisPage />;
} 