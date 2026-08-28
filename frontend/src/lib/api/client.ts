const API_URL=process.env.NEXT_PUBLIC_API_URL;
if(!API_URL) throw new Error("API_URL is not defined");

export async function apiFetch<T>(path: string, init?:RequestInit) {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        }
    });

    if(!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    if(response.status === 204) return undefined as T;
    
    return response.json() as Promise<T>;
}