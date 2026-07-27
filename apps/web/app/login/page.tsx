'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginUser } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';
import AuthBackground from '@/components/auth/AuthBackground';
import Link from 'next/link';
import { useTheme as useNextTheme } from 'next-themes';
import {
  Lock,
  Mail,
  Loader2,
  Zap,
  TrendingUp,
  ShoppingBag,
  Users,
  Shield,
  Building,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Info,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const tickerFeatures = [
  '🚀 Multi-Tenant SaaS',
  '🤖 AI Assistant',
  '📊 Live Analytics',
  '💳 Smart POS',
  '📦 Inventory',
  '📱 QR Ordering',
  '🏨 Hotels',
  '🍽 Restaurants',
  '🛒 Retail',
  '🏥 Pharmacy',
  '💈 Salon',
  '🚚 Logistics',
  '☁ Cloud Native',
  '🔒 Enterprise Security',
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { resolvedTheme, setTheme } = useNextTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Live mockup states
  const [revenue, setRevenue] = useState(13396.82);
  const [orders, setOrders] = useState(177);

  const isDark = resolvedTheme === 'dark';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'owner@akresto.com',
      password: '654321',
      rememberMe: false,
    },
  });

  // Client mounting check to prevent hydration mismatch warnings
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ticker Auto-slide logic
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % tickerFeatures.length);
    }, 3000);

    // Live analytics mock updates
    const analyticsTimer = setInterval(() => {
      setRevenue((prev) => prev + parseFloat((Math.random() * 5).toFixed(2)));
      if (Math.random() > 0.7) {
        setOrders((prev) => prev + 1);
      }
    }, 2550);

    return () => {
      clearInterval(timer);
      clearInterval(analyticsTimer);
    };
  }, [mounted]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // Connect to real NestJS backend Auth API
      const data = await loginUser(values.email, values.password);
      
      // Store tokens and set rememberMe preference
      login(data.access_token, values.rememberMe);

      setSuccess(true);

      // Workspace loading animation delay for premium feel
      setTimeout(() => {
        const role = data.user.role;
        if (role === 'SUPER_ADMIN') {
          router.push('/super-admin');
        } else if (role === 'CASHIER') {
          router.push('/dashboard/pos');
        } else if (role === 'WAITER') {
          router.push('/dashboard/waiter');
        } else if (role === 'CHEF') {
          router.push('/dashboard/kitchen');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message;
      if (err.code === 'ERR_NETWORK') {
        setErrorMsg('Authentication server is offline or unreachable. Please verify backend status.');
      } else {
        setErrorMsg(message || 'Invalid email or password combination.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render a clean loading shell until mounted to eliminate SSR mismatch warnings
  if (!mounted) {
    return (
      <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0f] text-white">
        <div
          className="absolute rounded-full filter blur-[100px] pointer-events-none opacity-20"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(88, 50, 255, 0.35), transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-lg shadow-blue-500/25 text-white">
            <Zap size={26} className="animate-pulse" />
          </span>
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">AK Business OS</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Initializing Workspace
            </p>
          </div>
          <Loader2 size={24} className="animate-spin text-blue-500 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden flex flex-col justify-between bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white transition-colors duration-700 pb-16">
      
      {/* ─── Background Layers (Orbs + Particle Canvas) ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-transform duration-[12s] ease-in-out alternate infinite"
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse at 15% 50%, rgba(88, 50, 255, 0.15) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 30%, rgba(0, 200, 255, 0.12) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 80%, rgba(180, 50, 255, 0.08) 0%, transparent 50%)
            `
            : `
              radial-gradient(ellipse at 15% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 30%, rgba(168, 85, 247, 0.05) 0%, transparent 45%)
            `,
        }}
      />

      <div
        className="fixed rounded-full filter blur-[80px] pointer-events-none z-0 opacity-25 dark:opacity-35 animate-pulse"
        style={{
          width: '550px',
          height: '550px',
          background: isDark
            ? 'radial-gradient(circle, rgba(88, 50, 255, 0.35), transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)',
          top: '-180px',
          left: '-180px',
          animationDuration: '20s',
        }}
      />
      <div
        className="fixed rounded-full filter blur-[80px] pointer-events-none z-0 opacity-20 dark:opacity-25 animate-pulse"
        style={{
          width: '400px',
          height: '400px',
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 200, 255, 0.25), transparent 70%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.12), transparent 70%)',
          bottom: '-120px',
          right: '-120px',
          animationDuration: '24s',
          animationDelay: '4s',
        }}
      />

      <AuthBackground />

      {/* Floating Theme Toggle Header */}
      <div className="absolute top-6 right-8 z-30">
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-md text-xs font-bold">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              !isDark
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-450 dark:hover:text-white'
            }`}
          >
            <Sun size={13} />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              isDark
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-450 dark:hover:text-white'
            }`}
          >
            <Moon size={13} />
            Dark
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Split-Screen Login Container */}
      <div className="flex-1 w-[90vw] max-w-[1200px] mx-auto flex items-center justify-center py-10 relative z-10">
        <div className="w-full min-h-[660px] bg-white/80 dark:bg-slate-950/20 backdrop-blur-[28px] saturate-[1.3] rounded-[40px] border border-slate-200/80 dark:border-white/[0.06] shadow-2xl flex flex-col md:flex-row overflow-hidden transition-all duration-700">
          
          {/* ── LEFT PANEL: Brand & Live Analytics ── */}
          <div className="hidden md:flex md:w-[55%] p-8 lg:p-12 flex-col justify-between relative z-10 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-white/5">
            
            {/* Brand Top */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 shadow-lg shadow-blue-500/30 text-white text-lg font-black">
                  AK
                </span>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">AK Business OS</h1>
                  <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest mt-1 block">
                    Next-Gen Business Operating System
                  </span>
                </div>
              </div>

              {/* Hero Title */}
              <div className="space-y-3 pt-4">
                <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white">
                  Run Your Business.<br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                    Smarter. Faster. Better.
                  </span>
                </h2>
                <p className="text-slate-650 dark:text-slate-400 text-sm max-w-md leading-relaxed">
                  AK Business OS is an all-in-one platform to manage your operations, delight customers, and grow revenue — from anywhere.
                </p>
              </div>

              {/* Quick checks */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {['Real-time Analytics', 'Smart Orders', 'Team Management', 'Secure & Reliable'].map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-extrabold text-[10px]">
                      ✓
                    </span>
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics block */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 dark:border-white/5 pt-4 my-6">
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">↑14.2%</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-wider mt-1">Total Revenue</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {orders}
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">↑8.5%</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-wider mt-1">Live Orders</div>
              </div>
            </div>

            {/* Bottom highlights */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <div className="flex gap-2.5 items-center">
                <span className="text-lg bg-blue-500/10 p-1.5 rounded-lg">🛡️</span>
                <div>
                  <span className="block text-[11px] font-bold text-slate-900 dark:text-white leading-none">Enterprise Security</span>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-450 mt-1">Role-based controls</span>
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="text-lg bg-blue-500/10 p-1.5 rounded-lg">⚡</span>
                <div>
                  <span className="block text-[11px] font-bold text-slate-900 dark:text-white leading-none">High Performance</span>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-455 mt-1">Real-time sync cycles</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT PANEL: Secure Authentication form ── */}
          <div className="w-full md:w-[45%] p-8 lg:p-12 flex flex-col justify-center relative z-10 bg-white/20 dark:bg-white/[0.01]">
            
            <div className="space-y-6">
              
              {/* Header */}
              <div className="text-center md:text-left space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Sign in to manage your business</p>
              </div>

              {/* Secure Info Alert */}
              <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20 dark:border-blue-500/10 text-xs text-blue-800 dark:text-blue-300 font-bold leading-relaxed">
                <Shield size={15} className="shrink-0 mt-0.5 text-blue-605 dark:text-blue-400" />
                <div>
                  <span className="block font-black text-[12px] mb-0.5">Secure Session</span>
                  Enter credentials below to load permissions.
                </div>
              </div>

              {/* Custom Error Alerts */}
              {errorMsg && (
                <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-600 dark:text-rose-450 flex items-start gap-2.5 animate-bounce">
                  <Info size={14} className="shrink-0 mt-0.5 text-rose-550" />
                  <div className="flex-1">
                    <p>{errorMsg}</p>
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      className="mt-2 text-rose-700 dark:text-rose-350 underline font-black flex items-center gap-1 hover:opacity-85"
                    >
                      <RefreshCw size={10} />
                      Retry Connection
                    </button>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-650 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      {...register('email')}
                      style={{ paddingLeft: '2.5rem' }}
                      className="w-full pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/35 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-655 dark:text-slate-400">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                      <Lock size={14} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/35 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Remember Me checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      {...register('rememberMe')}
                      className="h-3.5 w-3.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-[11px] font-extrabold text-slate-700 dark:text-slate-350 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link href="/help" className="text-[10px] font-extrabold text-slate-500 hover:underline">
                    Need help?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-500/20 hover:opacity-95 transition disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={14} className="text-white animate-bounce" />
                      Loading Workspace...
                    </motion.div>
                  ) : loading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="space-y-3 pt-2">
                <div className="text-center text-xs text-slate-600 dark:text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline">
                    Start free trial
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* BUG #1 Fix: Fixed Bottom Ticker Footer */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/60 py-3.5 shadow-lg select-none">
        <div className="w-[90vw] max-w-[1200px] mx-auto flex items-center justify-between text-xs font-black text-slate-500 dark:text-slate-450">
          
          {/* Ticker dynamic active note indicator */}
          <div className="flex items-center gap-3 w-3/4 overflow-hidden">
            <span className="shrink-0 text-slate-400 dark:text-slate-650 tracking-widest uppercase text-[9px] border-r border-slate-300 dark:border-slate-800 pr-3 mr-1">
              Capabilities
            </span>
            <div className="relative flex-1 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={tickerOffset}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-0 text-slate-800 dark:text-slate-200 font-extrabold truncate"
                >
                  {tickerFeatures[tickerOffset]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="shrink-0 text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>© 2026 AK Business OS</span>
          </div>

        </div>
      </div>
    </div>
  );
}

