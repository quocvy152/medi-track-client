import { config } from "@/lib/config";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export function createApiClient(): AxiosInstance {
	const instance = axios.create({
		baseURL: config.apiBaseUrl,
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});

	instance.interceptors.response.use(
		(response: AxiosResponse) => response,
		(error: AxiosError) => {
			return Promise.reject(error);
		}
	);

	return instance;
}

export const apiClient = createApiClient(); 