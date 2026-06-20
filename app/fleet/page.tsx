"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Users, Truck, Clock, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function FleetDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await api.get("/api/fleet-portal/metrics");
      setMetrics(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) return <div>Loading...</div>;

  const stats = [
    { label: "Total Drivers", value: metrics.totalDrivers, icon: Users, color: "blue" },
    { label: "Active Drivers", value: metrics.onlineDrivers, icon: Clock, color: "green" },
    { label: "Busy Drivers", value: metrics.busyDrivers, icon: AlertCircle, color: "orange" },
    { label: "Active Jobs", value: metrics.activeJobs, icon: Truck, color: "purple" },
    { label: "Completed Jobs", value: metrics.completedJobs, icon: CheckCircle2, color: "emerald" },
    { label: "Today's Earnings", value: `R${metrics.todayRevenue}`, icon: TrendingUp, color: "slate" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-orange-500" />
               Recent Active Jobs
            </h4>
            <div className="space-y-4">
               {/* Placeholder for real job list */}
               <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center py-10 text-slate-400 text-sm">
                  Live active job monitoring list will appear here.
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-emerald-500" />
               Performance Summary
            </h4>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
               Chart showing job volume trends.
            </div>
         </div>
      </div>
    </div>
  );
}
