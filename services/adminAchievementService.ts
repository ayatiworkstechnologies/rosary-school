const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export type AchievementType = "PHOTO" | "VIDEO";
export type VideoSource = "youtube" | "uploaded";

export interface AchievementImage {
  id: number;
  achievement_id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminAchievement {
  id: number; achievement_type: AchievementType; title: string; category: string;
  achievement_date: string; year: number; is_active: boolean; display_order: number;
  poster_image_url: string | null; video_source: VideoSource | null;
  youtube_url: string | null; video_url: string | null; created_by_id: number | null;
  created_at: string; updated_at: string; images: AchievementImage[];
}

export interface AchievementPayload {
  achievement_type: AchievementType; title: string; category: string; achievement_date: string;
  year: number; is_active: boolean; display_order: number; poster_image_url: string | null;
  video_source: VideoSource | null; youtube_url: string | null; video_url: string | null;
  images: Array<{ image_url: string; alt_text: string; display_order: number }>;
}

async function errorMessage(response: Response) {
  try { const data = await response.json(); return typeof data.detail === "string" ? data.detail : "Request failed."; } catch { return `Request failed with status ${response.status}`; }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, { credentials: "include", cache: "no-store", ...init });
  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}

export function getAdminAchievements(params: { page?: number; limit?: number; search?: string; year?: number; achievement_type?: AchievementType; is_active?: boolean } = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, String(value)); });
  return request<{ items: AdminAchievement[]; total: number; page: number; limit: number }>(`/api/v1/admin/achievements${query.size ? `?${query}` : ""}`);
}
export const getAdminAchievement = (id: number) => request<AdminAchievement>(`/api/v1/admin/achievements/${id}`);
export const createAdminAchievement = (payload: AchievementPayload) => request<AdminAchievement>("/api/v1/admin/achievements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const updateAdminAchievement = (id: number, payload: AchievementPayload) => request<AdminAchievement>(`/api/v1/admin/achievements/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const deleteAdminAchievement = (id: number) => request<{ message: string }>(`/api/v1/admin/achievements/${id}`, { method: "DELETE" });

export async function uploadAchievementFile(file: File, kind: "photos" | "posters" | "videos") {
  const formData = new FormData(); formData.append("file", file);
  return request<{ url: string; file_name: string; original_name: string; size: number }>(`/api/v1/admin/uploads/achievements/${kind}`, { method: "POST", body: formData });
}
export function achievementAssetUrl(url: string | null | undefined) { return !url ? "" : /^https?:\/\//.test(url) ? url : `${API_BASE_URL}${url}`; }
