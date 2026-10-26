"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Printer, RefreshCw, Search, Trash2, X } from "lucide-react";
import AdminAuthGuard from "./AdminAuthGuard";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  deleteAdmission, deleteContact, getAdmissions, getContacts, resendAdmission, resendContact,
  updateAdmission, updateContact, type AdmissionApplication,
  type ContactEnquiry, type SubmissionStatus,
} from "@/services/adminSubmissionService";

const STATUSES: SubmissionStatus[] = ["NEW", "READ", "REPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "ADMITTED", "ARCHIVED"];
type Item = ContactEnquiry | AdmissionApplication;

function isAdmission(item: Item): item is AdmissionApplication { return "registration_no" in item; }
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "/backend").replace(/\/$/, "");
function imageUrl(value: string) { return value.startsWith("/uploads/") ? `${API_BASE_URL}${value}` : value; }
function fieldLabel(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase()); }

function AdmissionPrintSheet({ item }: { item: AdmissionApplication }) {
  return <section className="print-sheet hidden bg-white text-[#172B4D] print:block">
    <header className="border-b-2 border-[#0075FF] pb-4 text-center">
      <p className="text-xs font-bold tracking-[0.25em] text-[#0075FF]">ROSARY SCHOOL</p>
      <h1 className="mt-1 text-2xl font-bold">Rosary Matriculation Higher Secondary School</h1>
      <p className="mt-1 text-sm">LKG Admission Application · 2027–2028</p>
    </header>
    <div className="my-5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-5 py-3">
      <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registration number</p><p className="text-xl font-bold text-[#0755AD]">{item.registration_no}</p></div>
      <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Received</p><p className="text-sm font-semibold">{new Date(item.created_at).toLocaleString("en-IN")}</p></div>
    </div>
    <h2 className="mb-2 border-b border-blue-200 pb-2 text-base font-bold text-[#0755AD]">Application details</h2>
    <div className="grid grid-cols-2 border-l border-t border-slate-300">
      {Object.entries(item.form_data).map(([key, value]) => <div key={key} className="border-b border-r border-slate-300 p-2.5 break-inside-avoid"><p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{fieldLabel(key)}</p><p className="mt-1 text-xs">{value || "-"}</p></div>)}
    </div>
    <h2 className="mb-3 mt-5 border-b border-blue-200 pb-2 text-base font-bold text-[#0755AD]">Student photograph</h2>
    <div className="break-inside-avoid">
      <div className="max-w-48 text-center"><div className="flex h-32 items-center justify-center rounded border border-slate-300 p-2"><img src={imageUrl(item.student_photo_url)} alt="Student Photograph" className="max-h-full max-w-full object-contain"/></div><p className="mt-2 text-xs font-semibold">Student Photograph</p></div>
    </div>
    <footer className="mt-8 border-t border-slate-300 pt-3 text-center text-[10px] text-slate-500">Printed from the Rosary School admission administration portal.</footer>
  </section>;
}

export default function SubmissionManager({ kind }: { kind: "contact" | "admission" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = kind === "contact" ? await getContacts(search) : await getAdmissions(search);
      setItems(result.items);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load submissions."); }
    finally { setLoading(false); }
  }, [kind, search]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(timer); }, [load]);

  async function save(patch: { status?: SubmissionStatus; admin_notes?: string }) {
    if (!selected) return;
    setBusy(true); setError("");
    try {
      const updated = kind === "contact" ? await updateContact(selected.id, patch) : await updateAdmission(selected.id, patch);
      setSelected(updated); setItems(previous => previous.map(item => item.id === updated.id ? updated : item));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to update submission."); }
    finally { setBusy(false); }
  }

  async function resend() {
    if (!selected) return;
    setBusy(true); setError("");
    try {
      const updated = kind === "contact" ? await resendContact(selected.id) : await resendAdmission(selected.id);
      setSelected(updated); setItems(previous => previous.map(item => item.id === updated.id ? updated : item));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to resend email."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected) return;
    const label = isAdmission(selected) ? `admission application ${selected.registration_no}` : `enquiry ENQ-${selected.id.toString().padStart(6, "0")}`;
    if (!window.confirm(`Permanently delete ${label}? This action cannot be undone.`)) return;
    setBusy(true); setError("");
    try {
      if (isAdmission(selected)) await deleteAdmission(selected.id); else await deleteContact(selected.id);
      setItems(previous => previous.filter(item => item.id !== selected.id));
      setSelected(null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to delete submission."); }
    finally { setBusy(false); }
  }

  const title = kind === "contact" ? "Contact Enquiries" : "Admission Applications";
  return <AdminAuthGuard><div className="min-h-screen bg-[#F7F9FC]">
    <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    <div className="min-h-screen lg:pl-[250px]"><AdminHeader onMenuClick={() => setMobileOpen(true)} />
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6"><h1 className="text-2xl font-bold text-[#10284D]">{title}</h1><p className="mt-1 text-sm text-slate-500">Review website submissions and email delivery.</p></div>
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Search size={18} className="text-slate-400"/><input className="w-full outline-none" placeholder="Search by name, email, phone or registration number" value={search} onChange={event => setSearch(event.target.value)} /></div>
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? <div className="p-10 text-center text-slate-500">Loading…</div> : items.length === 0 ? <div className="p-10 text-center text-slate-500">No submissions found.</div> :
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Received</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer hover:bg-blue-50/50"><td className="px-5 py-4 font-semibold text-[#0075FF]">{isAdmission(item) ? item.registration_no : `ENQ-${item.id}`}</td><td className="px-5 py-4 font-medium text-[#10284D]">{isAdmission(item) ? item.pupil_name : item.name}</td><td className="px-5 py-4 text-slate-600">{isAdmission(item) ? item.parent_email : item.email}<br/>{isAdmission(item) ? item.phone_number : item.phone}</td><td className="px-5 py-4">{item.status.replaceAll("_", " ")}</td><td className="px-5 py-4">{item.email_status}</td><td className="px-5 py-4 text-slate-500">{new Date(item.created_at).toLocaleString("en-IN")}</td></tr>)}</tbody></table></div>}
        </div>
      </main>
    </div>
    {selected && <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/40" onMouseDown={() => setSelected(null)}><aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl" onMouseDown={event => event.stopPropagation()}>
      <div className="mb-6 flex items-start justify-between"><div><h2 className="text-xl font-bold text-[#10284D]">{isAdmission(selected) ? selected.registration_no : `Enquiry #${selected.id}`}</h2><p className="text-sm text-slate-500">{new Date(selected.created_at).toLocaleString("en-IN")}</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-slate-100"><X/></button></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Status<select disabled={busy} value={selected.status} onChange={event => void save({ status: event.target.value as SubmissionStatus })} className="mt-1 w-full rounded-lg border border-slate-200 p-3 font-normal">{STATUSES.map(value => <option key={value}>{value}</option>)}</select></label><div className="text-sm font-semibold text-slate-700">Email delivery<div className="mt-1 rounded-lg border border-slate-200 p-3 font-normal">{selected.email_status}</div></div></div>
      {selected.email_error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{selected.email_error}</p>}
      <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={() => void resend()} className="inline-flex items-center gap-2 rounded-lg bg-[#0075FF] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? <RefreshCw className="animate-spin" size={16}/> : <Mail size={16}/>} Resend email</button>{isAdmission(selected) && <button disabled={busy} onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#10284D] hover:bg-slate-50 disabled:opacity-50"><Printer size={16}/> Print application</button>}<button disabled={busy} onClick={() => void remove()} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16}/> Delete</button></div>
      <div className="mt-6 space-y-3">{isAdmission(selected) ? <>
        {Object.entries(selected.form_data).map(([key, value]) => <div key={key} className="rounded-lg border border-slate-100 p-3"><p className="text-xs font-bold uppercase text-slate-400">{key.replaceAll("_", " ")}</p><p className="mt-1 break-words text-sm text-slate-700">{value || "-"}</p></div>)}
        <div className="max-w-48"><a href={imageUrl(selected.student_photo_url)} target="_blank" rel="noreferrer"><img src={imageUrl(selected.student_photo_url)} alt="Student photograph" className="aspect-square w-full rounded-lg border object-contain"/><span className="mt-1 block text-xs text-slate-500">Student photograph</span></a></div>
      </> : <><div><b>Name:</b> {selected.name}</div><div><b>Email:</b> <a className="text-blue-600" href={`mailto:${selected.email}`}>{selected.email}</a></div><div><b>Phone:</b> <a className="text-blue-600" href={`tel:${selected.phone}`}>{selected.phone}</a></div><div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4">{selected.message}</div></>}
      </div>
      <label className="mt-6 block text-sm font-semibold text-slate-700">Admin notes<textarea defaultValue={selected.admin_notes || ""} onBlur={event => void save({ admin_notes: event.target.value })} className="mt-1 min-h-28 w-full rounded-lg border border-slate-200 p-3 font-normal" placeholder="Private notes for administrators"/></label>
    </aside>{isAdmission(selected) && <AdmissionPrintSheet item={selected}/>}</div>}
    <style jsx global>{`@media print { @page { size: A4; margin: 12mm; } body { background: white !important; } body * { visibility: hidden !important; } .print-sheet, .print-sheet * { visibility: visible !important; } .print-sheet { display: block !important; position: absolute; inset: 0; width: 100%; } }`}</style>
  </div></AdminAuthGuard>;
}
