const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export type SubmissionStatus = "NEW" | "READ" | "REPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "REJECTED" | "ADMITTED" | "ARCHIVED";

export interface ContactEnquiry {
  id: number; name: string; email: string; phone: string; message: string;
  status: SubmissionStatus; admin_notes: string | null; email_status: string;
  email_error: string | null; created_at: string; updated_at: string;
}

export interface AdmissionApplication {
  id: number; registration_no: string; pupil_name: string; parent_email: string;
  phone_number: string; form_data: Record<string, string>;
  student_photo_url: string;
  status: SubmissionStatus; admin_notes: string | null; email_status: string;
  email_error: string | null; created_at: string; updated_at: string;
}

export interface SubmissionList<T> { items: T[]; total: number; page: number; limit: number }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, credentials: "include", cache: "no-store" });
  if (!response.ok) {
    let message = "Request failed.";
    try { const data = await response.json(); message = data.detail || data.message || message; } catch { /* use fallback */ }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export function getContacts(search = "") {
  return request<SubmissionList<ContactEnquiry>>(`/api/v1/admin/contact-enquiries?limit=100&search=${encodeURIComponent(search)}`);
}
export function updateContact(id: number, payload: { status?: SubmissionStatus; admin_notes?: string }) {
  return request<ContactEnquiry>(`/api/v1/admin/contact-enquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}
export function resendContact(id: number) { return request<ContactEnquiry>(`/api/v1/admin/contact-enquiries/${id}/resend-email`, { method: "POST" }); }
export function deleteContact(id: number) { return request<void>(`/api/v1/admin/contact-enquiries/${id}`, { method: "DELETE" }); }

export function getAdmissions(search = "") {
  return request<SubmissionList<AdmissionApplication>>(`/api/v1/admin/admission-applications?limit=100&search=${encodeURIComponent(search)}`);
}
export function updateAdmission(id: number, payload: { status?: SubmissionStatus; admin_notes?: string }) {
  return request<AdmissionApplication>(`/api/v1/admin/admission-applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}
export function resendAdmission(id: number) { return request<AdmissionApplication>(`/api/v1/admin/admission-applications/${id}/resend-email`, { method: "POST" }); }
export function deleteAdmission(id: number) { return request<void>(`/api/v1/admin/admission-applications/${id}`, { method: "DELETE" }); }
