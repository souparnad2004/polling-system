const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: string;
  };
};

export class ApiError extends Error {
  constructor(
    readonly message: string,
    readonly status: number,
    readonly code?: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("Content-Type") ?? "";

  if (!contentType.includes("application/json")) return null;

  return response.json();
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = API_URL!.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = (data ?? null) as ApiErrorResponse | null;

    throw new ApiError(
      error?.error?.message || "Something went wrong",
      response.status,
      error?.error?.code,
      error?.error?.details,
    );
  }

  return data as T;
}
