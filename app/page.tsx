"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import { Building2, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email/Pass, 2: OTP
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/partner-auth/login", {
        email: formData.email,
        password: formData.password
      });
      toast.success(res.data.message);
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/partner-auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });
      localStorage.setItem("partner_token", res.data.token);
      localStorage.setItem("partner_user", JSON.stringify(res.data.user));

      toast.success("Welcome to TowMech Partner Portal");

      const role = res.data.user.role;
      if (role === "PartnerAdmin" || role === "PartnerOperator") {
         router.push("/fleet");
      } else {
         router.push("/insurance");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <h1 className="text-2xl font-bold">Partner Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Access your self-management ecosystem</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">Enter the 6-digit code sent to your email</p>
                <p className="text-xs font-bold text-slate-900 mt-1">{formData.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full text-center text-2xl tracking-widest py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition"
                  placeholder="000000"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              <button
                type="submit"
                disabled={loading || formData.otp.length < 6}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Access Dashboard"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
