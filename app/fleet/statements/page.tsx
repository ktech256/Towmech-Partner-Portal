"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Download, FileText, Filter, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";


export default function FleetStatements() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const loadStatements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/fleet-portal/statements", { params: filters });
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
            <h2 className="text-xl font-bold text-slate-800">Financial Statements</h2>
            <p className="text-sm text-slate-500 mt-1">Review and export your company earnings history (Max 6 months).</p>
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border rounded-xl px-4 py-2">
               <Calendar className="w-4 h-4 text-slate-400" />
               <Input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters({...filters, from: e.target.value})}
                  className="bg-transparent border-none px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
               />
               <span className="text-slate-300 font-bold px-1">to</span>
               <Input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters({...filters, to: e.target.value})}
                  className="bg-transparent border-none px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
               />
            </div>
            <button
               onClick={loadStatements}
               disabled={loading}
               className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Filter"}
            </button>
         </div>
      </div>

      {data && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Payout</p>
               <h3 className="text-3xl font-black">R{data.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Jobs</p>
               <h3 className="text-3xl font-black text-slate-800">{data.jobs.length}</h3>
            </div>
         </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
         <div className="px-8 py-4 border-b bg-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-700 text-sm">Completed Job Logs</h4>
            <div className="flex gap-2">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition"><Download className="w-3 h-3"/> PDF</button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition"><Download className="w-3 h-3"/> Excel</button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-[10px] font-black uppercase hover:bg-slate-50 transition"><Download className="w-3 h-3"/> CSV</button>
            </div>
         </div>
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Job ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Driver</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Revenue</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading records...</td></tr>
               ) : !data || data.jobs.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400">No records found for this period.</td></tr>
               ) : (
                  data.jobs.map((j: any) => (
                     <tr key={j._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-5 text-sm font-medium text-slate-600">
                           {new Date(j.completedAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-900 font-mono">
                           #{j._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">{j.assignedTo?.name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-sm font-black text-slate-900">R{j.pricing?.providerAmountDue?.toFixed(2) || "0.00"}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase underline">Receipt</button>
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
