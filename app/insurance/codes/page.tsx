"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Plus, Ticket, Search, XCircle, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

export default function InsuranceCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/insurance/codes"); // Reusing admin route since partners are scoped
      setCodes(res.data.codes);
    } catch (err) {
      toast.error("Failed to load codes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await api.post("/api/insurance-portal/codes", { count: 10, length: 8, expiresInDays: 365, maxUses: 1, countryCode: "ZA" });
      toast.success("Batch of 10 codes generated");
      loadCodes();
    } catch (err) {
      toast.error("Failed to generate codes");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-slate-800">Policy Verification Codes</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and distribute codes for your policy holders.</p>
         </div>
         <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Batch (10)
          </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Policy Code</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Created</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Usage</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading...</td></tr>
               ) : codes.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">No codes generated yet.</td></tr>
               ) : (
                  codes.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/50 transition">
                           <td className="px-8 py-5">
                              <span className="font-mono font-bold text-blue-600 tracking-wider text-lg">{c.code}</span>
                           </td>
                           <td className="px-8 py-5 text-sm font-medium text-slate-600">
                              {new Date(c.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-8 py-5">
                              {c.isActive ? (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 uppercase">Active</span>
                              ) : (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 uppercase">Disabled</span>
                              )}
                           </td>
                           <td className="px-8 py-5 text-sm font-bold text-slate-900">
                              {c.usage.usedCount} / {c.usage.maxUses}
                           </td>
                           <td className="px-8 py-5 text-right">
                              {c.isActive && (
                                 <button className="text-red-500 hover:text-red-700 text-xs font-bold uppercase underline">Disable</button>
                              )}
                           </td>
                        </tr>
                     ))
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
