"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Download, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function InsuranceStatements() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const loadStatements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/insurance-portal/statements", { params: filters });
      setData(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load statements");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStatements();
  }, [loadStatements]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h2 className="text-xl font-bold text-slate-800">Utilization & Statements</h2>
            <p className="text-sm text-slate-500 mt-1">Export detailed reports of all insurance-backed services (Max 12 months).</p>
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border rounded-xl px-4 py-2">
               <Calendar className="w-4 h-4 text-slate-400" />
               <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters({...filters, from: e.target.value})}
                  className="bg-transparent text-sm font-bold outline-none"
               />
               <span className="text-slate-300 font-bold px-1">to</span>
               <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters({...filters, to: e.target.value})}
                  className="bg-transparent text-sm font-bold outline-none"
               />
            </div>
            <button
               onClick={loadStatements}
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Filter"}
            </button>
         </div>
      </div>

      {data && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Volume</p>
               <h3 className="text-3xl font-black">R{data.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Service Count</p>
               <h3 className="text-3xl font-black text-slate-800">{data.utilization}</h3>
            </div>
         </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <div className="px-8 py-4 border-b bg-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-700 text-sm">Detailed Utilization Log</h4>
            <div className="flex gap-2">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition"><Download className="w-3 h-3"/> PDF</button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition"><Download className="w-3 h-3"/> Excel</button>
            </div>
         </div>
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Claim ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Service</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Total</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">Loading utilization data...</td></tr>
               ) : !data || data.jobs.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">No utilization data found for this period.</td></tr>
               ) : (
                  data.jobs.map((j: any) => (
                     <tr key={j._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 text-sm font-medium text-slate-600">
                           {new Date(j.completedAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-900 font-mono">
                           #{j._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-800">
                           {j.roleNeeded}
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-sm font-black text-slate-900">R{j.pricing?.estimatedTotal?.toFixed(2) || "0.00"}</span>
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
