"use client";
import { useState } from "react";
import SubmissionManager from "@/components/admin/SubmissionManager";

export default function AdmissionsAdminPage() {
  const [module, setModule] = useState<"admission" | "ukg">("admission");
  const switcher = <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm"><button onClick={() => setModule("admission")} className={`rounded-md px-4 py-2 text-sm font-semibold ${module === "admission" ? "bg-[#0075FF] text-white" : "text-slate-600 hover:bg-slate-50"}`}>LKG Admission</button><button onClick={() => setModule("ukg")} className={`rounded-md px-4 py-2 text-sm font-semibold ${module === "ukg" ? "bg-[#0075FF] text-white" : "text-slate-600 hover:bg-slate-50"}`}>UKG to Std VIII</button></div>;
  return <SubmissionManager kind={module} admissionSwitcher={switcher} />;
}
