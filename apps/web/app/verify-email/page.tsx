'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthBackground from '@/components/auth/AuthBackground';
import Link from 'next/link';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerify = () => {
    setLoading(true);
    // Simulate API link verification
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }, 1500);
  };

  const handleResend = () => {
    triggerToast('A new identity confirmation link has been sent to your inbox.');
  };

  return (
    <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center p-6 sm:p-12">
      {/* 3D Aurora Mesh Backdrop */}
      <AuthBackground />

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-[420px] glass-premium rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl text-center backdrop-blur-xl">
        
        {!success ? (
          <div className="space-y-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-6 scale-up">
              <Mail size={30} className="animate-bounce" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Verify Your Identity</h2>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                Click the confirmation button below or follow the link sent to your corporate email to activate your administrator dashboard.
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Verifying Link...
                </>
              ) : (
                <>
                  Verify Account Identity
                  <ArrowRight size={13} />
                </>
              )}
            </button>

            <div className="text-xs font-bold text-slate-650 dark:text-slate-450 border-t border-slate-200/30 dark:border-white/5 pt-5 flex items-center justify-between">
              <Link href="/login" className="hover:text-slate-900 dark:hover:text-white">
                Back to Sign In
              </Link>
              <button 
                onClick={handleResend}
                className="font-black text-blue-600 dark:text-cyan-400 hover:underline"
              >
                Resend Link
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 scale-up">
              <CheckCircle size={32} />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Account Activated!</h2>
              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Your email has been verified. Redirecting you to sign in to your workspace console...
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-2xl border border-white/10 slide-up">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}
    </main>
  );
}
