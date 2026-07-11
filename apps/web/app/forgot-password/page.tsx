'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthBackground from '@/components/auth/AuthBackground';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, Key, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

  // Countdown timer for OTP resend option
  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    
    setLoading(true);
    // Simulate sending recovery email OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setResendTimer(30);
    }, 1200);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpValues];
    newOtp[index] = val.slice(-1);
    setOtpValues(newOtp);

    // Focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const code = otpValues.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter the complete 6-digit passcode.');
      return;
    }

    setLoading(true);
    // Simulate verifying code
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Passwords must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate database update
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtpValues(Array(6).fill(''));
    // Trigger mock resend action
  };

  return (
    <main className="min-h-screen relative w-full overflow-hidden flex items-center justify-center p-6 sm:p-12">
      {/* 3D Aurora Mesh Backdrop */}
      <AuthBackground />

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-[440px] glass-premium rounded-3xl p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl text-left backdrop-blur-xl">
        
        {/* Error alert */}
        {errorMsg && (
          <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendEmail} className="space-y-5">
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-4">
                <Key size={22} />
              </span>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Recover Password</h2>
              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Enter your corporate email address to receive an authorization code.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-300 mb-1.5">Registered Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@akresto.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : 'Send Reset Code'}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline">
                <ArrowLeft size={13} />
                Return to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-4">
                <Mail size={22} className="animate-pulse" />
              </span>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Verify Passcode</h2>
              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                We sent a 6-digit confirmation code to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.
              </p>
            </div>

            <div className="flex justify-between gap-2.5 my-6">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-12 text-center rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : 'Confirm Code'}
            </button>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 hover:text-slate-700"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`font-black uppercase tracking-wider ${
                  resendTimer > 0 ? 'text-slate-400 cursor-default' : 'text-blue-600 dark:text-cyan-400 hover:underline'
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-4">
                <Lock size={22} />
              </span>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Secure Passcode</h2>
              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Configure your new secure admin workspace passcode.</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">New Passcode</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-350 mb-1.5">Confirm New Passcode</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : 'Update Passcode'}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center py-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 scale-up">
              <CheckCircle size={32} />
            </span>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Passcode Reset!</h2>
            <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Your recovery was successful. Redirecting back to the login portal...
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
