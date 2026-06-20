"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { Ticket, ClipboardList, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

export default function InsuranceDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/api/insurance-portal/metrics");
        setMetrics(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading...</div>;

  const stats = [
    { label: "Total Codes", value: metrics.totalCodes, icon: Ticket, color: "blue" },
    { label: "Codes Used", value: metrics.usedCodes, icon: Users, color: "green" },
    { label: "Active Claims", value: metrics.activeJobs, icon: ClipboardList, color: "orange" },
    { label: "Completed Jobs", value: metrics.completedJobs, icon: CheckCircle2, color: "emerald" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
         <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Utilization Overview
         </h4>
         <div className="h-80 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
            Utilization chart will show code usage vs total generated.
         </div>
      </div>
    </div>
  );
}
