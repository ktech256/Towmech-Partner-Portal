"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { Plus, Ticket, UserCheck, Clock, XCircle, Search, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FleetDrivers() {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadCodes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/fleet-portal/driver-codes/usage");
      setCodes(res.data.codes);
    } catch (err) {
      toast.error("Failed to load codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await api.post("/api/fleet-portal/driver-codes", { count: 1, expiresInDays: 7 });
      toast.success("New verification code generated");
      loadCodes();
    } catch (err) {
      toast.error("Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this code? Drivers won't be able to use it.")) return;
    try {
      await api.patch(`/api/fleet-portal/driver-codes/${id}/revoke`);
      toast.success("Code revoked");
      loadCodes();
    } catch (err) {
      toast.error("Failed to revoke");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-slate-800">Driver Verification Codes</h2>
            <p className="text-sm text-slate-500 mt-1">Generate codes to link new drivers to your company.</p>
         </div>
         <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate New Code
          </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Verification Code</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Expires</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Linked Driver</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading...</td></tr>
               ) : codes.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">No codes found. Click "Generate" to start.</td></tr>
               ) : (
                  codes.map((c) => {
                     const isExpired = new Date(c.expiresAt) < new Date();
                     const isUsed = !!c.usedBy;
                     const isRevoked = c.isRevoked;

                     return (
                        <tr key={c._id} className="hover:bg-slate-50/50 transition">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="bg-slate-100 p-2 rounded-lg"><Ticket className="w-4 h-4 text-slate-600" /></div>
                                 <span className="font-mono font-bold text-slate-900 tracking-wider">{c.code}</span>
                                 <button onClick={() => { navigator.clipboard.writeText(c.code); toast.info("Copied to clipboard"); }} className="text-slate-400 hover:text-slate-600"><Copy className="w-3 h-3"/></button>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-sm font-medium text-slate-600">
                              {new Date(c.expiresAt).toLocaleDateString()}
                           </td>
                           <td className="px-8 py-5">
                              {isRevoked ? (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 uppercase">Revoked</span>
                              ) : isUsed ? (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 uppercase">Used</span>
                              ) : isExpired ? (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 uppercase">Expired</span>
                              ) : (
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">Active</span>
                              )}
                           </td>
                           <td className="px-8 py-5">
                              {c.usedBy ? (
                                 <div>
                                    <p className="text-sm font-bold text-slate-900">{c.usedBy.name}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{c.usedBy.phone}</p>
                                 </div>
                              ) : "—"}
                           </td>
                           <td className="px-8 py-5 text-right">
                              {!isUsed && !isRevoked && (
                                 <button onClick={() => handleRevoke(c._id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider underline">Revoke</button>
                              )}
                           </td>
                        </tr>
                     );
                  })
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
