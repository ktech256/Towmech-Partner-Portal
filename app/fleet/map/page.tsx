"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api/axios";
import { Search, Info, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function FleetMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMap = useCallback(async () => {
    try {
      const res = await api.get("/api/fleet-portal/live-map");
      setMarkers(res.data.markers);
    } catch (err) {
      toast.error("Failed to load map data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMap();
    const interval = setInterval(fetchMap, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [fetchMap]);

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-slate-800">Fleet Live Map</h2>
             <p className="text-sm text-slate-500 mt-1">Real-time tracking of your active and idle drivers.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Online
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div> Busy
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Offline
             </div>
          </div>
       </div>

       <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
          {/* Integration Note: In a real environment, we'd use Google Maps or Mapbox here */}
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
             <div className="text-center max-w-md p-8">
                <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h4 className="font-bold text-slate-400">Interactive Map Interface</h4>
                <p className="text-sm text-slate-400 mt-2">Displaying {markers.length} fleet vehicles based on their last reported GPS coordinates.</p>

                <div className="mt-8 space-y-3">
                   {markers.map(m => (
                      <div key={m._id} className="bg-white p-3 rounded-xl border text-left flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full ${m.isBusy ? 'bg-green-500 animate-pulse' : m.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                         <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800">{m.name}</p>
                            <p className="text-[10px] text-slate-400">Lat: {m.location?.coordinates[1]}, Lng: {m.location?.coordinates[0]}</p>
                         </div>
                         <span className="text-[9px] font-black text-slate-300 uppercase">{m.isBusy ? 'Busy' : m.isOnline ? 'Idle' : 'Offline'}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
