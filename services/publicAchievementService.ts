const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";
export type PublicAchievementType = "PHOTO" | "VIDEO";
export interface PublicAchievement { id: number; achievement_type: PublicAchievementType; title: string; category: string; achievement_date: string; year: number; display_order: number; poster_image_url: string | null; video_source: "youtube" | "uploaded" | null; youtube_url: string | null; video_url: string | null; images: Array<{ id: number; image_url: string; alt_text: string; display_order: number }>; }
export async function getPublicAchievements() { const response = await fetch(`${API_BASE_URL}/api/v1/achievements`, { cache: "no-store" }); if (!response.ok) throw new Error("Unable to load achievements."); return response.json() as Promise<{ items: PublicAchievement[]; total: number }>; }
export function achievementPublicAssetUrl(url: string | null | undefined) { return !url ? "" : /^https?:\/\//.test(url) ? url : `${API_BASE_URL}${url}`; }
