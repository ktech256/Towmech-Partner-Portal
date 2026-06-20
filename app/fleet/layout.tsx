"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Map, FileBarChart, LogOut, Building2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/fleet", icon: LayoutDashboard },
  { label: "Our Drivers", href: "/fleet/drivers", icon: Users },
  { label: "Live Map", href: "/fleet/map", icon: Map },
  { label: "Statements", href: "/fleet/statements", icon: FileBarChart },
];

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("partner_user");
    if (!savedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("partner_token");
    localStorage.removeItem("partner_user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
          <div>
             <h2 className="font-bold leading-none">TowMech</h2>
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fleet Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                  active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
             <p className="text-xs text-slate-500 font-bold uppercase mb-1">Logged in as</p>
             <p className="text-sm font-bold truncate">{user.name}</p>
             <p className="text-[10px] text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-bold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
           <h1 className="font-bold text-slate-800">
              {navItems.find(n => n.href === pathname)?.label || "Dashboard"}
           </h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[10px] text-slate-400 font-bold uppercase">Workspace</p>
                 <p className="text-sm font-bold text-slate-900">Standard Office</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center font-bold text-slate-500">
                 {user.name?.[0]}
              </div>
           </div>
        </header>
        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
