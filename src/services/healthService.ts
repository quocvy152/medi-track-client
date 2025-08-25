import { apiClient } from "@/services/apiClient";

export async function fetchHealth(): Promise<{ status: string }> {
	const { data } = await apiClient.get<{ status: string }>("/health");
	return data;
} 