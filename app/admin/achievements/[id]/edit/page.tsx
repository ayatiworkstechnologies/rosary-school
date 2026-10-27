import AchievementForm from "@/components/admin/AchievementForm";
export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AchievementForm achievementId={Number(id)} />; }
