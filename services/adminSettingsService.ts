const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export interface MailSettings {
  contact_to: string;
  contact_cc: string;
  contact_bcc: string;
  contact_reply_to: string;
  contact_ack_enabled: boolean;
  admission_to: string;
  admission_cc: string;
  admission_bcc: string;
  admission_reply_to: string;
  admission_ack_enabled: boolean;
  admission_registration_prefix: string;
  newsletter_to: string;
  newsletter_cc: string;
  newsletter_bcc: string;
  newsletter_reply_to: string;
  newsletter_ack_enabled: boolean;
  backend_public_url: string;
}

async function request(init?: RequestInit): Promise<MailSettings> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/settings/mail`, {
    ...init,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    let message = "Unable to load mail settings.";
    try { const data = await response.json(); message = data.detail || message; } catch { /* fallback */ }
    throw new Error(message);
  }
  return response.json();
}

export function getMailSettings() { return request(); }
export function saveMailSettings(payload: MailSettings) {
  return request({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}
