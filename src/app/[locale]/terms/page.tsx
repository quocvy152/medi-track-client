"use client";

import TermsAndPolicyPage from "@/components/TermsAndPolicyPage";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

function TermsInner() {
	const params = useParams<{ locale: string }>();
	const router = useRouter();
	const searchParams = useSearchParams();

	const isFirstVisit = (() => {
		const v = searchParams.get("firstVisit");
		return v === "1" || v === "true";
	})();

	const handleAgree = useCallback(() => {
		try {
			localStorage.setItem("termsAccepted", "true");
		} catch {}
		router.push(`/${params.locale}`);
	}, [params.locale, router]);

	return (
		<TermsAndPolicyPage
			isFirstVisit={isFirstVisit}
			onAgree={isFirstVisit ? handleAgree : undefined}
		/>
	);
}

export default function TermsPage() {
	return (
		<Suspense fallback={null}>
			<TermsInner />
		</Suspense>
	);
} 