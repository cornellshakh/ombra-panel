import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type ApiResponse<T> = T & { message?: string };
const API_URL = "http://localhost:5000";

interface ApiRequestType {
  method: Method;
  endpoint: string;
  body?: any;
  params?: Record<string, string>;
  credentials?: RequestCredentials;
}

export async function apiRequest<T>({
  method,
  endpoint,
  body,
  params,
  credentials = "same-origin",
}: ApiRequestType): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);

  if (params)
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  };

  // Debug logs for troubleshooting
  console.log(`API Request to ${endpoint}:`, { 
    method, 
    body: body ? JSON.stringify(body) : undefined,
    credentials 
  });

  try {
    const response = await fetch(url.toString(), options);
    
    // Debug response details
    console.log(`API Response from ${endpoint}:`, { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers])
    });
    
    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      // Try to parse error message from response if possible
      try {
        const errorData = await response.json();
        console.error('API Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      } catch (parseError) {
        // If parsing fails, throw a generic error with the status
        console.error('Failed to parse error response:', parseError);
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

export function useApi<T>(
  endpoint: string,
  triggerFetch?: boolean,
  params?: Record<string, string>
): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!triggerFetch) return;

      try {
        const result = await apiRequest<T[]>({
          method: "GET",
          endpoint,
          params,
        });

        setData(result);
      } catch (error: any) {
        toast.error("Failed to fetch data", { description: error.message });
      }
    }

    fetchData();
  }, [endpoint, triggerFetch, params]);

  return data;
}

export function useApi2<T>(
  endpoint: string,
  triggerFetch?: boolean,
  params?: Record<string, string>
): T {
  const [data, setData] = useState<T>({} as T);

  useEffect(() => {
    async function fetchData() {
      if (!triggerFetch) return;

      try {
        const result = await apiRequest<T>({
          method: "GET",
          endpoint,
          params,
        });

        setData(result);
      } catch (error: any) {
        toast.error("Failed to fetch data", { description: error.message });
      }
    }

    fetchData();
  }, [endpoint, triggerFetch, params]);

  return data;
}

export async function apiGet<T>(
  endpoint: string,
  credentials?: RequestCredentials
): Promise<T> {
  return apiRequest<T>({
    method: "GET",
    endpoint,
    credentials,
  });
}

export async function apiPost<T>(
  endpoint: string,
  body?: T | unknown,
  credentials?: RequestCredentials
): Promise<T> {
  return apiRequest<T>({
    method: "POST",
    endpoint,
    body,
    credentials,
  });
}

export async function apiPut<T>(
  endpoint: string,
  body?: T | unknown
): Promise<T> {
  return apiRequest<T>({
    method: "PUT",
    endpoint,
    body,
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>({
    method: "DELETE",
    endpoint,
  });
}

export async function handleApiCall(
  toggleFetch: () => void,
  successMessage: string,
  errorMessage: string,
  undoFunction?: () => void,
  onClose?: () => void,
  isUndo: boolean = false,
  response?: ApiResponse<any> | undefined
): Promise<void> {
  try {
    if (response && response.message) throw new Error(response.message);

    toggleFetch();

    if (undoFunction && !isUndo)
      toast.success(successMessage, {
        action: { label: "Undo", onClick: undoFunction },
      });
    else toast.success(successMessage);

    if (onClose) onClose();
  } catch (error: any) {
    const errorDetail = error?.message || "Unknown error occurred";
    toast.error(errorMessage, {
      description: errorDetail,
    });
  }
}

export async function handleAuthOperation(
  successMessage: string,
  errorMessage: string,
  response: ApiResponse<any> | undefined,
  navigate: Function,
  navigateTo: string,
  checkAuthStatus?: () => Promise<boolean>
) {
  try {
    if (response && response.message) {
      throw new Error(response.message);
    }

    if (checkAuthStatus) {
      const authStatus = await checkAuthStatus();
      if (!authStatus) {
        throw new Error("Authentication failed");
      }
    }

    toast.success(successMessage);
    navigate(navigateTo);
  } catch (error: any) {
    const errorDetail = error?.message || "Unknown error occurred";
    toast.error(errorMessage, {
      description: errorDetail
    });
  }
}
