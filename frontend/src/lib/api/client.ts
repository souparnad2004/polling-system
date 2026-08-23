const API_URL=process.env.NEXT_PUBLIC_API_URL;
if(!API_URL) throw new Error("API_URL is not defined");

export async function apiFetch<T>(path: string, init?:RequestInit) {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        }
    });

    if(!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    
    return response.json() as Promise<T>;
}