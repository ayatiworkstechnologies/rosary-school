const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export interface NewsletterSubscription {
  id: number; email: string; is_active: boolean; email_status: string;
  email_error: string | null; subscribed_at: string; updated_at: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, credentials: "include", cache: "no-store" });
  if (!response.ok) {
    let message = "Unable to process newsletter request.";
    try { const data = await response.json(); message = data.detail || message; } catch { /* fallback */ }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export function getNewsletterSubscriptions(search = "", page = 1, limit = 10) {
  return request<{ items: NewsletterSubscription[]; total: number; page: number; limit: number }>(`/api/v1/admin/newsletter-subscriptions?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
}
export function updateNewsletterSubscription(id: number, is_active: boolean) {
  return request<NewsletterSubscription>(`/api/v1/admin/newsletter-subscriptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active }) });
}
export function deleteNewsletterSubscription(id: number) {
  return request<void>(`/api/v1/admin/newsletter-subscriptions/${id}`, { method: "DELETE" });
}
