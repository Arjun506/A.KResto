'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginUser } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme as useNextTheme } from 'next-themes';
import { Loader2, CheckCircle, Info, RefreshCw } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, setTheme } = useNextTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crystalFieldRef = useRef<HTMLDivElement>(null);

  const currentTheme = theme === 'system' ? 'dark' : (theme || 'dark');
  const isLight = currentTheme === 'light';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'owner@akresto.com',
      password: '654321',
      rememberMe: true,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync data-theme attribute on html element
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme, mounted]);

  // Floating crystal shards animation
  useEffect(() => {
    if (!mounted || !crystalFieldRef.current) return;
    const field = crystalFieldRef.current;
    field.innerHTML = '';
    const shardCount = window.innerWidth < 700 ? 10 : 18;
    
    for (let i = 0; i < shardCount; i++) {
      const s = document.createElement('div');
      s.className = 'shard';
      const size = 6 + Math.random() * 14;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + 'vw';
      const dur = 14 + Math.random() * 18;
      s.style.animationDuration = dur + 's, ' + (6 + Math.random() * 8) + 's';
      s.style.animationDelay = -Math.random() * dur + 's, ' + -Math.random() * 6 + 's';
      s.style.setProperty('--drift', Math.random() * 120 - 60 + 'px');
      s.style.opacity = String(0.25 + Math.random() * 0.5);
      field.appendChild(s);
    }
  }, [mounted]);

  // Twinkling starfield canvas
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Array<{ x: number; y: number; r: number; p: number; s: number; drift: number }> = [];
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 9500);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          p: Math.random() * Math.PI * 2,
          s: 0.01 + Math.random() * 0.02,
          drift: 0.05 + Math.random() * 0.15,
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      for (const st of stars) {
        st.p += st.s;
        const alpha = ((Math.sin(st.p) + 1) / 2) * 0.85 + 0.1;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = isLightTheme ? `rgba(70,90,180,${alpha * 0.6})` : `rgba(255,255,255,${alpha})`;
        ctx.fill();
        st.y -= st.drift;
        if (st.y < -5) {
          st.y = canvas.height + 5;
          st.x = Math.random() * canvas.width;
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // Real backend authentication
      const data = await loginUser(values.email, values.password);
      login(data.access_token, values.rememberMe);
      setSuccess(true);

      setTimeout(() => {
        const role = data.user?.role;
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
      }, 1000);
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

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #050810;
          --bg-2: #0a0f1f;
          --panel: rgba(15, 20, 38, 0.55);
          --panel-border: rgba(255, 255, 255, 0.08);
          --text: #f3f5fb;
          --text-dim: #9aa3c0;
          --text-dimmer: #6d7594;
          --accent-blue: #4f7bff;
          --accent-purple: #9b5cff;
          --accent-green: #33e6a6;
          --accent-cyan: #38d6ff;
          --input-bg: rgba(255, 255, 255, 0.04);
          --input-border: rgba(255, 255, 255, 0.1);
          --card-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
          --star-opacity: 1;
        }

        html[data-theme="light"], [data-theme="light"] {
          --bg: #eef1fb;
          --bg-2: #e3e8fb;
          --panel: rgba(255, 255, 255, 0.65);
          --panel-border: rgba(20, 25, 50, 0.08);
          --text: #141832;
          --text-dim: #4b5273;
          --text-dimmer: #767ea3;
          --input-bg: rgba(20, 25, 60, 0.04);
          --input-border: rgba(20, 25, 60, 0.12);
          --card-shadow: 0 30px 80px rgba(80, 90, 160, 0.18);
          --star-opacity: 0.35;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: radial-gradient(ellipse 120% 90% at 20% 0%, var(--bg-2), var(--bg) 60%);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          transition: background 0.5s ease, color 0.4s ease;
        }

        /* ---------- animated background layers ---------- */
        #bg-canvas {
          position: fixed; inset: 0; z-index: 0; width: 100%; height: 100%;
          opacity: var(--star-opacity);
          transition: opacity .5s ease;
          pointer-events: none;
        }

        .aurora {
          position: fixed; inset: -10%; z-index: 0; pointer-events: none;
          filter: blur(90px) saturate(140%);
          opacity: .55;
          mix-blend-mode: screen;
        }
        html[data-theme="light"] .aurora { opacity: .35; mix-blend-mode: multiply; filter: blur(90px) saturate(160%); }
        .aurora span {
          position: absolute; border-radius: 50%;
          animation: drift 22s ease-in-out infinite;
        }
        .aurora span:nth-child(1) { width: 38vw; height: 38vw; top: -8%; left: -6%; background: var(--accent-purple); animation-delay: 0s; }
        .aurora span:nth-child(2) { width: 32vw; height: 32vw; top: 30%; right: -8%; background: var(--accent-blue); animation-delay: -7s; }
        .aurora span:nth-child(3) { width: 28vw; height: 28vw; bottom: -10%; left: 20%; background: var(--accent-green); animation-delay: -14s; }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, 6%) scale(1.08); }
          66% { transform: translate(-5%, -4%) scale(0.94); }
        }

        .crystal-field { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .shard {
          position: absolute;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.02) 60%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(2px);
          clip-path: polygon(50% 0%, 100% 38%, 78% 100%, 22% 100%, 0% 38%);
          animation: fall linear infinite, spin linear infinite;
          box-shadow: 0 0 18px rgba(120, 160, 255, 0.25);
        }
        html[data-theme="light"] .shard {
          background: linear-gradient(135deg, rgba(120, 140, 255, 0.35), rgba(120, 140, 255, 0.03) 60%);
          border: 1px solid rgba(80, 100, 220, 0.18);
          box-shadow: 0 0 14px rgba(90, 110, 220, 0.18);
        }
        @keyframes fall {
          from { transform: translateY(-10vh) translateX(0); }
          to { transform: translateY(110vh) translateX(var(--drift, 0px)); }
        }
        @keyframes spin {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        /* ---------- layout ---------- */
        .wrap {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          min-height: calc(100vh - 60px);
          padding-bottom: 84px;
        }
        @media (min-width: 981px) and (min-height: 650px) {
          .wrap {
            max-height: calc(100vh - 60px);
            align-items: center;
          }
        }
        @media (max-width: 980px) {
          .wrap { grid-template-columns: 1fr; padding-bottom: 84px; }
          .left { padding-bottom: 84px; }
        }

        .left {
          padding: 24px 48px 84px;
          display: flex; flex-direction: column; gap: 14px;
          position: relative;
          border-right: 1px solid var(--panel-border);
        }
        @media (max-width: 980px) { .left { border-right: none; padding: 24px 24px 84px; } }

        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(90, 110, 255, 0.35);
          flex-shrink: 0;
          overflow: hidden;
          padding: 3px;
        }
        .brand-mark img { width: 100%; height: 100%; object-fit: contain; }
        .brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); }
        .brand-sub { font-size: 10px; letter-spacing: 0.12em; color: var(--text-dimmer); font-weight: 600; margin-top: 1px; }

        .headline { margin-top: 4px; }
        .headline h1 {
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 800; line-height: 1.08; letter-spacing: -0.02em;
          color: var(--text);
        }
        .headline .grad-line {
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 800; line-height: 1.12; letter-spacing: -0.02em;
          margin-top: 1px;
        }
        .grad-line .w1 { background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .grad-line .w2 { background: linear-gradient(90deg, var(--accent-purple), #ff7ad9); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .grad-line .w3 { background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .lede { color: var(--text-dim); font-size: 13.5px; line-height: 1.45; max-width: 440px; margin-top: 3px; }

        .features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 2px; max-width: 500px; }
        @media (max-width: 600px) { .features { grid-template-columns: repeat(2, 1fr); } }
        .feature { display: flex; flex-direction: column; gap: 4px; }
        .feature .ico {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: var(--input-bg); border: 1px solid var(--input-border);
        }
        .feature .ico svg { width: 17px; height: 17px; }
        .feature span { font-size: 11px; color: var(--text-dim); line-height: 1.3; font-weight: 500; }

        /* 3D Glass Dashboard Showcase Panel */
        .glass-panel-3d-stage {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 10px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glass-panel-3d {
          position: relative;
          width: 100%;
          border-radius: 20px;
          padding: 6px;
          background: linear-gradient(145deg, rgba(8, 12, 28, 0.95), rgba(16, 22, 46, 0.90));
          border: 1px solid rgba(80, 140, 255, 0.35);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55), 0 0 35px rgba(56, 214, 255, 0.3);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transform: perspective(900px) rotateX(6deg) rotateY(-8deg);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          overflow: hidden;
        }

        html[data-theme="light"] .glass-panel-3d {
          background: linear-gradient(145deg, rgba(14, 20, 42, 0.95), rgba(24, 32, 60, 0.90));
          border: 1px solid rgba(79, 123, 255, 0.45);
          box-shadow: 0 16px 40px rgba(79, 123, 255, 0.28), 0 0 30px rgba(56, 214, 255, 0.25);
        }

        .glass-panel-3d:hover {
          transform: perspective(900px) rotateX(2deg) rotateY(-2deg) scale(1.02);
          box-shadow: 0 25px 60px rgba(90, 110, 255, 0.45);
        }

        .dashboard-3d-img {
          width: 100%;
          height: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
        }

        .ai-pulse-ring {
          position: absolute;
          inset: -22px;
          border-radius: 32px;
          border: 1.5px dashed rgba(56, 214, 255, 0.55);
          background: url('/images/ak_os_3d_bg_orbit.png') center/cover no-repeat;
          opacity: 0.45;
          filter: drop-shadow(0 0 25px rgba(56, 214, 255, 0.4));
          pointer-events: none;
          animation: spinPulseRing 26s linear infinite;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(155, 92, 255, 0.3);
        }

        html[data-theme="light"] .ai-pulse-ring {
          opacity: 0.38;
          border-color: rgba(79, 123, 255, 0.55);
        }

        @keyframes spinPulseRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Moving Background Floating 3D Badges & Glowing Orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(12px);
          pointer-events: none;
          z-index: 0;
        }
        .bg-orb.orb-1 {
          width: 90px; height: 90px;
          top: -20px; left: -30px;
          background: radial-gradient(circle, rgba(56, 214, 255, 0.5), transparent);
          animation: orbFloat1 6s ease-in-out infinite alternate;
        }
        .bg-orb.orb-2 {
          width: 100px; height: 100px;
          bottom: -20px; right: -30px;
          background: radial-gradient(circle, rgba(155, 92, 255, 0.5), transparent);
          animation: orbFloat2 7s ease-in-out infinite alternate;
        }
        @keyframes orbFloat1 {
          0% { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(15px, 10px) scale(1.15); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate(0, 0) scale(0.95); }
          100% { transform: translate(-15px, -10px) scale(1.2); }
        }

        .bg-float-card {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border-radius: 12px;
          background: rgba(12, 18, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 15px rgba(79, 123, 255, 0.25);
          pointer-events: none;
        }

        html[data-theme="light"] .bg-float-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(79, 123, 255, 0.3);
          box-shadow: 0 10px 24px rgba(79, 123, 255, 0.22);
        }

        .bg-float-card.card-tl {
          top: -14px;
          left: -18px;
          animation: floatTL 5.2s ease-in-out infinite;
        }

        .bg-float-card.card-tr {
          top: -16px;
          right: -12px;
          animation: floatTR 6.5s ease-in-out infinite;
        }

        .bg-float-card.card-br {
          bottom: -14px;
          right: -10px;
          animation: floatBR 5.8s ease-in-out infinite;
        }

        @keyframes floatTL {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-7px) rotate(-1deg); }
        }

        @keyframes floatTR {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-9px) rotate(4deg); }
        }

        @keyframes floatBR {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(7px) rotate(0deg); }
        }

        .bg-float-card .ico-box {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(79, 123, 255, 0.18);
          border: 1px solid rgba(79, 123, 255, 0.28);
          flex-shrink: 0;
        }

        .bg-float-card .val {
          font-size: 11px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.1;
        }

        .bg-float-card .lbl {
          font-size: 9px;
          font-weight: 700;
          color: var(--accent-green);
        }

        .footnote { display: flex; gap: 10px; align-items: flex-start; margin-top: auto; padding-top: 10px; max-width: 440px; }
        .footnote .ico { width: 34px; height: 34px; border-radius: 8px; background: var(--input-bg); border: 1px solid var(--input-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footnote .ico svg { width: 16px; height: 16px; }
        .footnote b { font-size: 12.5px; display: block; margin-bottom: 2px; color: var(--text); }
        .footnote p { font-size: 11.5px; color: var(--text-dimmer); line-height: 1.4; }

        /* ---------- right panel ---------- */
        .right {
          display: flex; align-items: center; justify-content: center;
          padding: 24px 32px; position: relative;
        }

        /* Unique Animated Theme Toggle Button */
        .theme-toggle-animated {
          position: absolute;
          top: 20px;
          right: 32px;
          z-index: 10;
          display: flex;
          align-items: center;
          width: 140px;
          height: 36px;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          padding: 3px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        html[data-theme="light"] .theme-toggle-animated {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(79, 123, 255, 0.2);
          box-shadow: 0 8px 20px rgba(79, 123, 255, 0.15);
        }

        .toggle-pill-active {
          position: absolute;
          top: 3px;
          left: 3px;
          width: calc(50% - 3px);
          height: calc(100% - 6px);
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          box-shadow: 0 4px 14px rgba(90, 110, 255, 0.5);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .theme-toggle-animated.is-dark .toggle-pill-active {
          transform: translateX(100%);
        }

        .toggle-btn-opt {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          cursor: pointer;
          transition: color 0.3s ease;
          height: 100%;
        }

        .toggle-btn-opt.active-text {
          color: #ffffff !important;
        }

        .card {
          width: 100%; max-width: 420px;
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 20px;
          padding: 28px 28px 22px;
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          box-shadow: var(--card-shadow);
          animation: cardIn .7s cubic-bezier(.2, .8, .2, 1) both;
          margin-top: 14px;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .card-logo {
          width: 52px; height: 52px; border-radius: 14px; margin: 0 auto 12px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 25px rgba(120, 110, 255, 0.4);
          animation: pulseGlow 3s ease-in-out infinite;
          overflow: hidden;
          padding: 4px;
        }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 10px 30px rgba(120, 110, 255, 0.35); } 50% { box-shadow: 0 10px 36px rgba(120, 110, 255, 0.6); } }
        .card-logo img { width: 100%; height: 100%; object-fit: contain; }

        .card h2 { text-align: center; font-size: 20px; font-weight: 800; color: var(--text); }
        .card .sub { text-align: center; color: var(--text-dimmer); font-size: 12.5px; margin-top: 2px; margin-bottom: 16px; }

        .notice {
          display: flex; gap: 10px; padding: 10px 12px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(79, 123, 255, 0.12), rgba(155, 92, 255, 0.10));
          border: 1px solid rgba(120, 140, 255, 0.22);
          margin-bottom: 14px;
        }
        .notice .ico { width: 26px; height: 26px; border-radius: 8px; background: rgba(120, 140, 255, 0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notice .ico svg { width: 14px; height: 14px; }
        .notice b { font-size: 12px; color: var(--accent-blue); display: block; }
        .notice p { font-size: 11px; color: var(--text-dim); line-height: 1.4; margin-top: 1px; }

        .error-alert {
          display: flex; gap: 8px; padding: 10px 12px; border-radius: 12px;
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: #f43f5e;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        label { font-size: 12.5px; font-weight: 600; display: block; margin-bottom: 5px; color: var(--text); }
        .row-label { display: flex; justify-content: space-between; align-items: center; }
        .row-label a { font-size: 11.5px; color: var(--accent-blue); text-decoration: none; font-weight: 600; }
        .field { position: relative; margin-bottom: 14px; }
        .field svg.li {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; opacity: .7; color: var(--text-dim);
          pointer-events: none; z-index: 3;
        }
        .field input {
          width: 100%;
          padding-top: 11px !important;
          padding-bottom: 11px !important;
          padding-left: 48px !important;
          padding-right: 46px !important;
          background: var(--input-bg); border: 1px solid var(--input-border);
          border-radius: 12px; color: var(--text); font-size: 13.5px;
          outline: none; transition: border-color .2s ease, background .2s ease;
          position: relative; z-index: 1;
        }
        .field input::placeholder { color: var(--text-dimmer); }
        .field input:focus { border-color: var(--accent-blue); background: rgba(79, 123, 255, 0.06); }
        .field .eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          cursor: pointer; opacity: .7; background: none; border: none; padding: 4px;
          color: var(--text-dim); z-index: 3; display: flex; align-items: center; justify-content: center;
        }
        .field .eye svg { width: 17px; height: 17px; }

        .row-between { display: flex; justify-content: space-between; align-items: center; margin: 2px 0 14px; }
        .remember { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dim); }
        .remember input { width: 15px; height: 15px; accent-color: var(--accent-blue); }
        .row-between a { font-size: 12px; color: var(--accent-blue); text-decoration: none; font-weight: 600; }

        .btn-primary {
          width: 100%; padding: 12px; border: none; border-radius: 12px;
          background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 10px 24px rgba(100, 100, 255, 0.35);
          transition: transform .15s ease, box-shadow .15s ease;
          background-size: 200% 100%;
          animation: sheen 5s linear infinite;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(100, 100, 255, 0.45); }
        .btn-primary:active { transform: translateY(0px) scale(.99); }
        .btn-primary:disabled { opacity: 0.75; cursor: not-allowed; }
        @keyframes sheen { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }

        .divider { display: flex; align-items: center; gap: 10px; margin: 16px 0 12px; }
        .divider span { font-size: 10.5px; letter-spacing: .08em; color: var(--text-dimmer); font-weight: 600; white-space: nowrap; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--panel-border); }

        .oauth { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
        .oauth button {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px 6px; border-radius: 10px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          color: var(--text); font-size: 12px; font-weight: 600; cursor: pointer;
          transition: background .2s ease, transform .15s ease;
        }
        .oauth button:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-1px); }
        html[data-theme="light"] .oauth button:hover { background: rgba(20, 25, 60, 0.06); }
        .oauth svg { width: 15px; height: 15px; }

        .signup-note {
          display: flex; gap: 8px; align-items: center; padding: 10px 12px;
          border-radius: 12px; background: var(--input-bg); border: 1px solid var(--input-border);
          font-size: 12px; color: var(--text-dim); margin-bottom: 12px;
        }
        .signup-note a { color: var(--accent-blue); font-weight: 700; text-decoration: none; }
        .signup-note svg { width: 15px; height: 15px; flex-shrink: 0; opacity: .7; }

        .copyright { text-align: center; font-size: 11px; color: var(--text-dimmer); }

        /* FIXED BOTTOM STRIP FOOTER */
        .strip {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
          background: var(--panel);
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          border-top: 1px solid var(--panel-border);
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 10px 48px;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.25);
        }

        /* COMPACT RESPONSIVE VIEWPORT SCALING FOR 100% RESOLUTION FIT */
        @media (min-width: 981px) and (max-height: 850px) {
          .wrap {
            height: calc(100vh - 54px) !important;
            max-height: calc(100vh - 54px) !important;
            padding-bottom: 54px !important;
          }
          .left {
            padding: 16px 36px 58px !important;
            gap: 8px !important;
          }
          .right {
            padding: 12px 24px 58px !important;
          }
          .card {
            margin-top: 0 !important;
            padding: 18px 22px 14px !important;
            max-width: 385px !important;
          }
          .card-logo {
            width: 40px !important; height: 40px !important; margin: 0 auto 6px !important;
          }
          .card h2 { font-size: 17px !important; }
          .card .sub { font-size: 11.5px !important; margin-top: 1px !important; margin-bottom: 10px !important; }
          .notice { padding: 8px 10px !important; margin-bottom: 10px !important; }
          .notice b { font-size: 11.5px !important; }
          .notice p { font-size: 10.5px !important; }
          label { font-size: 11.5px !important; margin-bottom: 3px !important; }
          .field { margin-bottom: 8px !important; }
          .field input { padding-top: 8px !important; padding-bottom: 8px !important; font-size: 12.5px !important; }
          .row-between { margin: 1px 0 8px !important; font-size: 11px !important; }
          .btn-primary { padding: 9px !important; font-size: 13px !important; }
          .divider { margin: 10px 0 8px !important; }
          .oauth { margin-bottom: 8px !important; gap: 6px !important; }
          .oauth button { padding: 6px 4px !important; font-size: 11px !important; }
          .signup-note { padding: 6px 10px !important; margin-bottom: 8px !important; font-size: 11px !important; }
          .copyright { font-size: 10px !important; }

          .headline h1 { font-size: 26px !important; }
          .headline .grad-line { font-size: 26px !important; }
          .lede { font-size: 12px !important; margin-top: 2px !important; }
          .features { margin-top: 2px !important; gap: 6px !important; }
          .feature .ico { width: 30px !important; height: 30px !important; }
          .feature span { font-size: 10.5px !important; }
          .glass-panel-3d-stage { max-width: 380px !important; margin: 4px auto !important; }
          .glass-panel-3d { padding: 8px !important; }
          .dashboard-3d-img { max-height: 155px !important; }
          .footnote { padding-top: 2px !important; gap: 8px !important; }
          .footnote .ico { width: 28px !important; height: 28px !important; }
          .footnote b { font-size: 11px !important; }
          .footnote p { font-size: 10px !important; }
        }

        @media (min-width: 981px) and (max-height: 740px) {
          .wrap {
            transform: scale(0.92);
            transform-origin: center top;
          }
        }
        @media (max-width: 900px) { .strip { grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 10px 20px; } }
        .strip-item { display: flex; gap: 10px; align-items: center; }
        .strip-item .ico { width: 34px; height: 34px; border-radius: 8px; background: var(--input-bg); border: 1px solid var(--input-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .strip-item .ico svg { width: 16px; height: 16px; }
        .strip-item b { font-size: 12.5px; display: block; color: var(--text); }
        .strip-item span { font-size: 11px; color: var(--text-dimmer); }
      `}</style>

      <canvas ref={canvasRef} id="bg-canvas"></canvas>
      <div className="aurora"><span></span><span></span><span></span></div>
      <div ref={crystalFieldRef} className="crystal-field" id="crystal-field"></div>

      <div className="wrap">
        {/* LEFT */}
        <div className="left">
          <div className="brand">
            <div className="brand-mark">
              <Image src="/images/ak_os_3d_logo.png" alt="AK OS Logo" width={38} height={38} className="object-contain" priority />
            </div>
            <div>
              <div className="brand-name">AK Business OS</div>
              <div className="brand-sub">NEXT-GEN BUSINESS OPERATING SYSTEM</div>
            </div>
          </div>

          <div className="headline">
            <h1>Run Your Business.</h1>
            <div className="grad-line"><span className="w1">Smarter.</span> <span className="w2">Faster.</span> <span className="w3">Better.</span></div>
            <p className="lede">AK Business OS is an all-in-one platform to manage your operations, delight customers, and grow revenue — from anywhere.</p>
          </div>

          <div className="features">
            <div className="feature">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div>
              <span>Real-time<br />Analytics</span>
            </div>
            <div className="feature">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#9b5cff" strokeWidth="2"><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/><path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6"/></svg></div>
              <span>Smart<br />Orders</span>
            </div>
            <div className="feature">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#38d6ff" strokeWidth="2"><circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.3c2.6.4 4.5 2.4 4.5 5.7"/></svg></div>
              <span>Team<br />Management</span>
            </div>
            <div className="feature">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#33e6a6" strokeWidth="2"><path d="M12 2l8 3.5V11c0 5.2-3.4 9-8 11-4.6-2-8-5.8-8-11V5.5L12 2z"/><path d="M9 12l2 2 4-4"/></svg></div>
              <span>Secure &<br />Reliable</span>
            </div>
          </div>

          <div className="glass-panel-3d-stage">
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="ai-pulse-ring"></div>

            <div className="bg-float-card card-tl">
              <div className="ico-box"><svg viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2.5"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div>
              <div>
                <div className="val">$13,238.26</div>
                <div className="lbl">▲ +14.2% Growth</div>
              </div>
            </div>

            <div className="bg-float-card card-tr">
              <div className="ico-box"><svg viewBox="0 0 24 24" fill="none" stroke="#9b5cff" strokeWidth="2.5"><path d="M12 2l8 3.5V11c0 5.2-3.4 9-8 11-4.6-2-8-5.8-8-11V5.5L12 2z"/><path d="M9 12l2 2 4-4"/></svg></div>
              <div>
                <div className="val">99.9% Uptime</div>
                <div className="lbl">AI Engine Active</div>
              </div>
            </div>

            <div className="bg-float-card card-br">
              <div className="ico-box"><svg viewBox="0 0 24 24" fill="none" stroke="#38d6ff" strokeWidth="2.5"><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/><path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6"/></svg></div>
              <div>
                <div className="val">156 Orders</div>
                <div className="lbl">Live Real-time</div>
              </div>
            </div>

            <div className="glass-panel-3d">
              <Image
                src="/images/ak_os_3d_dashboard.png"
                alt="AK Business OS 3D Dashboard Showcase"
                width={440}
                height={220}
                className="dashboard-3d-img"
                priority
              />
            </div>
          </div>

          <div className="footnote">
            <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#9b5cff" strokeWidth="2"><path d="M12 2l8 3.5V11c0 5.2-3.4 9-8 11-4.6-2-8-5.8-8-11V5.5L12 2z"/></svg></div>
            <div>
              <b>Enterprise Grade Security</b>
              <p>Your data is protected with industry-leading security and compliance standards.</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className={`theme-toggle-animated ${isLight ? 'is-light' : 'is-dark'}`}>
            <div className="toggle-pill-active" />
            <button
              id="btn-light"
              type="button"
              className={`toggle-btn-opt ${isLight ? 'active-text' : ''}`}
              onClick={() => setTheme('light')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
              Light
            </button>
            <button
              id="btn-dark"
              type="button"
              className={`toggle-btn-opt ${!isLight ? 'active-text' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
              Dark
            </button>
          </div>

          <div className="card">
            <div className="card-logo">
              <Image src="/images/ak_os_3d_logo.png" alt="AK OS Logo" width={44} height={44} className="object-contain" priority />
            </div>
            <h2>Welcome Back! 👋</h2>
            <p className="sub">Sign in to access your workspace</p>

            <div className="notice">
              <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2"><path d="M12 2l8 3.5V11c0 5.2-3.4 9-8 11-4.6-2-8-5.8-8-11V5.5L12 2z"/></svg></div>
              <div>
                <b>Secure Access</b>
                <p>All logins are protected with advanced encryption and multi-layer security.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="error-alert">
                <Info size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMsg}</p>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="mt-1.5 underline flex items-center gap-1 font-bold text-xs"
                  >
                    <RefreshCw size={11} /> Retry Connection
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email">Email Address</label>
              <div className="field">
                <svg className="li" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M3 6l9 7 9-7"/><path d="M3 6h18v12H3z"/></svg>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#f43f5e', fontSize: '11px', marginTop: '-8px', marginBottom: '10px', fontWeight: 600 }}>
                  {errors.email.message}
                </p>
              )}

              <div className="row-label">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="field">
                <svg className="li" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#f43f5e', fontSize: '11px', marginTop: '-8px', marginBottom: '10px', fontWeight: 600 }}>
                  {errors.password.message}
                </p>
              )}

              <div className="row-between">
                <label className="remember">
                  <input type="checkbox" {...register('rememberMe')} />
                  Remember this device
                </label>
                <Link href="/help">Need help?</Link>
              </div>

              <button type="submit" className="btn-primary" disabled={loading || success}>
                {success ? (
                  <>
                    <CheckCircle size={16} /> Loading Workspace...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Workspace
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: '16px', height: '16px' }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider"><span>OR CONTINUE WITH</span></div>

            <div className="oauth">
              <button type="button" onClick={() => setErrorMsg('Google SSO is ready for production domain.')}>
                <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.8-.07-1.5-.2-2.2H12v4.2h5.9c-.25 1.3-1 2.4-2.15 3.1v2.6h3.5c2-1.9 3.25-4.6 3.25-7.7z"/><path fill="#34A853" d="M12 23c2.9 0 5.35-.95 7.15-2.6l-3.5-2.6c-.97.65-2.2 1.05-3.65 1.05-2.8 0-5.2-1.9-6.05-4.4H2.35v2.7C4.15 20.6 7.8 23 12 23z"/><path fill="#FBBC05" d="M5.95 14.45A6.9 6.9 0 0 1 5.6 12c0-.85.15-1.7.35-2.45V6.85H2.35A11 11 0 0 0 1 12c0 1.8.4 3.5 1.35 5.15l3.6-2.7z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .55 4.1 1.6l3.1-3.1C17.35 2.1 14.9 1 12 1 7.8 1 4.15 3.4 2.35 6.85l3.6 2.7C6.8 7.05 9.2 5.4 12 5.4z"/></svg> Google
              </button>
              <button type="button" onClick={() => setErrorMsg('Microsoft Entra ID is ready for enterprise SSO.')}>
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="9" height="9" fill="#F35325"/><rect x="13" y="2" width="9" height="9" fill="#81BC06"/><rect x="2" y="13" width="9" height="9" fill="#05A6F0"/><rect x="13" y="13" width="9" height="9" fill="#FFBA08"/></svg> Microsoft
              </button>
              <button type="button" onClick={() => setErrorMsg('Apple ID authentication is ready for iOS/macOS.')}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c.09 1.02-.31 2.03-.94 2.76-.64.75-1.68 1.33-2.68 1.24-.11-1 .37-2.05 1-2.76.68-.78 1.83-1.34 2.62-1.24zM20.6 17.2c-.55 1.28-.82 1.85-1.53 2.98-1 1.6-2.4 3.6-4.14 3.62-1.55.02-1.95-1-4.04-1-2.1 0-2.55 1-4.05.98-1.75-.02-3.08-1.82-4.08-3.4C.6 16.9-.2 12.4 1.5 9.4c.9-1.6 2.5-2.6 4.2-2.62 1.55-.03 3 1.05 3.95 1.05.94 0 2.7-1.3 4.56-1.1.78.03 2.96.32 4.36 2.4-3.68 2.02-3.08 7.06 0 8.07z"/></svg> Apple
              </button>
            </div>

            <div className="signup-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>
              New to AK Business OS? <Link href="/signup">Create your workspace</Link>
            </div>

            <p className="copyright">© 2026 AK Business OS. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* FIXED FOOTER STRIP */}
      <div className="strip">
        <div className="strip-item">
          <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg></div>
          <div><b>Built for Every Business</b><span>Scalable for startups to enterprises.</span></div>
        </div>
        <div className="strip-item">
          <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#38d6ff" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8"/></svg></div>
          <div><b>Real-time Insights</b><span>Make data-driven decisions.</span></div>
        </div>
        <div className="strip-item">
          <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#9b5cff" strokeWidth="2"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg></div>
          <div><b>Powerful Automation</b><span>Save time and reduce errors.</span></div>
        </div>
        <div className="strip-item">
          <div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#33e6a6" strokeWidth="2"><path d="M12 2l8 3.5V11c0 5.2-3.4 9-8 11-4.6-2-8-5.8-8-11V5.5L12 2z"/></svg></div>
          <div><b>Always Available</b><span>99.9% uptime, always reliable.</span></div>
        </div>
      </div>
    </>
  );
}
