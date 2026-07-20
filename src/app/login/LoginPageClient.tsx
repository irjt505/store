"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPageClient() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "بيانات الدخول غير صحيحة"
        : "حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("الرجاء إدخال البريد الإلكتروني أولاً");
      return;
    }
    setLoading(true);
    setError(null);
    setResetMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=password_reset`,
    });

    if (resetError) {
      setError("حدث خطأ أثناء إرسال رمز إعادة التعيين");
      setLoading(false);
      return;
    }

    setResetMessage("تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-bold gradient-text">متجر</span>
          </div>
          <h1 className="text-2xl font-bold text-white">لوحة تحكم المتجر</h1>
          <p className="text-white/70 mt-2">إدارة متجرك الإلكتروني</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-2">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-sm text-[#DC2626] animate-fade-in">
                {error}
              </div>
            )}

            {resetMessage && (
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-sm text-[#059669] animate-fade-in">
                {resetMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-[#9CA3AF] text-white font-medium rounded-xl transition-colors btn-press focus-ring text-sm"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="text-sm text-[#6366F1] hover:text-[#4F46E5] transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2024 متجر - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
