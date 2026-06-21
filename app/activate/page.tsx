"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import { Building2, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";


function ActivationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Activation token is missing. Please request a new invitation.");
      setValidating(false);
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await api.post("/api/partner-auth/activate/validate", { token });
        setPartner(res.data.partner);
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or expired activation link.");
      } finally {
        setValidating(false);
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/partner-auth/activate", {
        token,
        password: passwords.password
      });
      toast.success("Account activated successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Activation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {error ? (
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Activation Error</h2>
          <p className="text-sm text-slate-500">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="text-orange-600 font-bold hover:underline"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleActivate} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Activating Partner</div>
            <div className="text-sm font-bold text-slate-900">{partner?.name}</div>
            <div className="text-xs text-slate-500">{partner?.email}</div>
            <div className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-black uppercase">
               {partner?.type} Partner
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Create Password</label>
            <PasswordInput
              required
              minLength={6}
              placeholder="••••••••"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
            <PasswordInput
              required
              minLength={6}
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Activation ✅"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ActivatePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <h1 className="text-2xl font-bold">Partner Activation</h1>
          <p className="text-slate-400 text-sm mt-2">Set up your secure portal access</p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        }>
          <ActivationForm />
        </Suspense>
      </div>
    </main>
  );
}
