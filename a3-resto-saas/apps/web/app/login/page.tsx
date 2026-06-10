'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';
import { UtensilsCrossed, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleLogin = async () => {
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      login(data.access_token);
      
      const payload = decodeJwt(data.access_token);
      if (payload && payload.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="bg-slate-900/60 border border-slate-850 w-full max-w-md p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10 space-y-8">
        
        {/* LOGO */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/ak-resto-logo.png" alt="A.K Resto Logo" className="w-28 h-28 object-contain rounded-2xl shadow-lg shadow-rose-500/10 group-hover:scale-105 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent uppercase">
              A.K RESTO
            </h1>
            <p className="text-xs text-zinc-400 font-extrabold uppercase tracking-widest mt-1.5">
              Smart Restaurant Solutions
            </p>
          </div>
        </div>

        {/* DEMO CREDENTIALS TOOLTIP */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2.5 text-xs text-zinc-400">
          <p className="font-bold text-[10px] uppercase tracking-wider text-rose-400 text-center">
            Click to Auto-fill Demo Accounts (Password: 654321)
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => {
                setEmail('admin@restobill.com');
                setPassword('654321');
              }}
              className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-2.5 rounded-xl text-left transition active:scale-95 cursor-pointer"
            >
              <span className="font-bold text-white block">SaaS Super Admin</span>
              admin@restobill.com
            </button>
            <button
              onClick={() => {
                setEmail('owner@restobill.com');
                setPassword('654321');
              }}
              className="bg-slate-950 border border-slate-800 hover:border-orange-500/50 p-2.5 rounded-xl text-left transition active:scale-95 cursor-pointer"
            >
              <span className="font-bold text-white block">Restaurant Owner</span>
              owner@restobill.com
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* FORM FIELDS */}
        <div className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="email"
                placeholder="staff@restobill.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-2xl pl-12 pr-4 py-3.5 outline-none text-white focus:border-rose-500 transition shadow-inner placeholder:text-zinc-650"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-2xl pl-12 pr-4 py-3.5 outline-none text-white focus:border-rose-500 transition shadow-inner placeholder:text-zinc-650"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-rose-500/15 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Authenticating...
            </>
          ) : (
            'Access ERP Dashboard'
          )}
        </button>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-rose-400 font-bold transition">
            ← Return to Home Portals
          </Link>
        </div>
      </div>
    </div>
  );
}
