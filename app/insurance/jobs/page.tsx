"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Search, ExternalLink, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function InsuranceJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/insurance-portal/jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
         <h2 className="text-xl font-bold text-slate-800">Active Claims & Services</h2>
         <p className="text-sm text-slate-500 mt-1">Monitor all service requests being handled under your insurance coverage.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Claim/Job ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Provider</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading claims...</td></tr>
               ) : jobs.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">No insurance claims found.</td></tr>
               ) : (
                  jobs.map((j) => (
                     <tr key={j._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5">
                           <p className="text-sm font-bold text-slate-900 font-mono">#{j._id.slice(-8).toUpperCase()}</p>
                           <p className="text-[10px] text-slate-400 font-medium">Code: {j.insurance?.code}</p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-sm font-bold text-slate-800">{j.customer?.name}</p>
                           <p className="text-[10px] text-slate-400">{j.customer?.phone}</p>
                        </td>
                        <td className="px-8 py-5">
                           {j.assignedTo ? (
                              <>
                                 <p className="text-sm font-bold text-slate-800">{j.assignedTo.name}</p>
                                 <p className="text-[10px] text-slate-400">{j.assignedTo.phone}</p>
                              </>
                           ) : <span className="text-xs text-slate-300 italic">Not Assigned</span>}
                        </td>
                        <td className="px-8 py-5">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              j.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                              j.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                              'bg-blue-50 text-blue-700'
                           }`}>
                              {j.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-blue-600 hover:text-blue-800"><ExternalLink className="w-4 h-4" /></button>
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
