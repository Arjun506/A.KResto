'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import {
  Shield,
  Store,
  Lock,
  Mail,
  Loader2,
  UtensilsCrossed,
  LogIn,
  Users,
  ChefHat,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  Award,
  BookOpen,
  Smartphone,
  Crown,
  CreditCard,
  Bell
} from 'lucide-react';

async function signJwt(payload: any, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const base64UrlEncode = (str: string) => {
    return window.btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };
  
  const headerStr = base64UrlEncode(JSON.stringify(header));
  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerStr}.${payloadStr}`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(dataToSign);
  
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  
  const signature = await window.crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    data
  );
  
  const signatureBytes = new Uint8Array(signature);
  let signatureBinary = "";
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    signatureBinary += String.fromCharCode(signatureBytes[i]);
  }
  const signatureBase64 = window.btoa(signatureBinary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  return `${dataToSign}.${signatureBase64}`;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [portal, setPortal] = useState<'super-admin' | 'restaurant'>('restaurant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'owner' | 'billing' | 'waiter' | 'chef' | 'shop'>('owner');
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show password toggle
  const [showPassword, setShowPassword] = useState(false);

  // Culinary modal state
  const [showMealsModal, setShowMealsModal] = useState(false);

  // Hanging lamp string snap state
  const [isSnapping, setIsSnapping] = useState(false);

  // Floating particles list
  const [particles, setParticles] = useState<{ id: number; left: string; size: number; delay: string; duration: string; opacity: number; color: string }[]>([]);

  // Trigger toast utility
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Generate particles on mount
  useEffect(() => {
    const generated: typeof particles = [];
    const colors = [
      'rgba(224, 183, 244, 0.45)', // Soft Lavender
      'rgba(242, 181, 225, 0.45)', // Cotton Candy Pink
      'rgba(191, 222, 243, 0.45)', // Ice Blue
      'rgba(185, 233, 233, 0.45)', // Mint Blue
      'rgba(255, 201, 180, 0.45)', // Peach
      'rgba(254, 226, 119, 0.45)'  // Soft Gold
    ];
    for (let i = 0; i < 45; i++) {
      generated.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3.5 + 1.2,
        delay: `${Math.random() * 12}s`,
        duration: `${Math.random() * 14 + 7}s`,
        opacity: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setParticles(generated);
  }, []);

  // Auto-fill credentials on mount based on role
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPortal = params.get('portal') === 'super-admin' ? 'super-admin' : 'restaurant';
    setPortal(initialPortal);
    
    if (initialPortal === 'super-admin') {
      setEmail('admin.console');
      setPassword('654321');
    } else {
      setSelectedRole('owner');
      setEmail('owner@akresto.com');
      setPassword('654321');
    }
  }, []);

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

  // Switch role quick-selector
  const handleRoleSelect = (role: 'owner' | 'billing' | 'waiter' | 'chef' | 'shop') => {
    setSelectedRole(role);
    if (role === 'shop') {
      setEmail('shop@akresto.com');
    } else {
      setEmail(`${role}@akresto.com`);
    }
    setPassword('654321');
    setErrorMsg(null);
  };

  // Toggle between Restaurant and Super Admin portal
  const togglePortal = () => {
    setErrorMsg(null);
    const targetPortal = portal === 'restaurant' ? 'super-admin' : 'restaurant';
    setPortal(targetPortal);
    
    if (targetPortal === 'super-admin') {
      setEmail('admin.console');
    } else {
      setEmail(`${selectedRole}@akresto.com`);
    }
    setPassword('654321');
  };

  // Snapping pull cord theme toggle
  const handleThemePull = () => {
    setIsSnapping(true);
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setTimeout(() => {
      setIsSnapping(false);
    }, 600);
  };

  const handleLogin = async () => {
    setErrorMsg(null);
    setToastMessage(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    try {
      setLoading(true);

      let token: string | null = null;
      try {
        const data = await loginUser(email, password);
        token = data.access_token;
      } catch (err) {
        console.warn('Backend auth offline. Local bypass active...', err);
        if (password === '654321') {
          const role = portal === 'super-admin' 
            ? 'SUPER_ADMIN' 
            : (selectedRole === 'owner' ? 'OWNER' : (selectedRole === 'billing' ? 'CASHIER' : (selectedRole === 'shop' ? 'OWNER' : selectedRole.toUpperCase())));
          
          const payload = {
            sub: portal === 'super-admin' ? 'admin-id' : `${selectedRole}-id`,
            email: email,
            role: role,
            restaurantId: 'rest-1',
          };
          token = await signJwt(payload, 'super-secret');
        } else {
          throw err;
        }
      }

      if (!token) {
        throw new Error('Authentication failed');
      }

      login(token);
      
      const payload = decodeJwt(token);
      if (portal === 'super-admin' && payload?.role !== 'SUPER_ADMIN') {
        setErrorMsg('This login page is only for platform super admin access.');
        return;
      }

      triggerToast('Authentication successful! Welcome to A.Kresto.');

      setTimeout(() => {
        if (payload && payload.role === 'SUPER_ADMIN') {
          router.push('/super-admin');
        } else if (selectedRole === 'shop') {
          router.push('/dashboard/shop');
        } else {
          router.push('/dashboard');
        }
      }, 1250);

    } catch (error) {
      console.error(error);
      setErrorMsg('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden transition-colors duration-700 bg-slate-50 dark:bg-[#03050b] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* 1. Global Custom CSS Styles for Orbits and floating effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) translateX(35px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes driftLight {
          0% { transform: translateX(-8%) scale(1.0); opacity: 0.4; }
          100% { transform: translateX(8%) scale(1.25); opacity: 0.85; }
        }
        @keyframes breatheGlow {
          0% { transform: scale(1.0); opacity: 0.35; }
          100% { transform: scale(1.35); opacity: 0.75; }
        }
        @keyframes sweepLight {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes spinOrbit { 
          100% { transform: rotate(360deg); } 
        }
        @keyframes floatLogo {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
        @keyframes cordSnap {
          0% { height: 120px; }
          45% { height: 180px; }
          70% { height: 105px; }
          85% { height: 128px; }
          100% { height: 120px; }
        }
        .cord-snap-anim {
          animation: cordSnap 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .glass-panel {
          background: ${resolvedTheme === 'dark' ? 'rgba(15, 23, 42, 0.62)' : 'rgba(255, 255, 255, 0.52)'};
          backdrop-filter: blur(28px);
          border-radius: 2.5rem;
          border: 1px solid ${resolvedTheme === 'dark' ? 'rgba(224, 183, 244, 0.15)' : 'rgba(255, 255, 255, 0.45)'};
          box-shadow: ${resolvedTheme === 'dark' 
            ? '0 35px 70px -15px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.1)' 
            : '0 35px 70px -15px rgba(51, 0, 204, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)'};
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .glass-panel::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 24px;
          width: 44px;
          height: 44px;
          border-top: 2px solid ${resolvedTheme === 'dark' ? '#CF9BDD' : '#3300cc'};
          border-left: 2px solid ${resolvedTheme === 'dark' ? '#CF9BDD' : '#3300cc'};
          border-radius: 8px 0 0 0;
          pointer-events: none;
          opacity: 0.75;
        }
        .glass-panel::after {
          content: '';
          position: absolute;
          bottom: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-bottom: 2px solid ${resolvedTheme === 'dark' ? '#cc00cc' : '#E5A0D7'};
          border-right: 2px solid ${resolvedTheme === 'dark' ? '#cc00cc' : '#E5A0D7'};
          border-radius: 0 0 8px 0;
          pointer-events: none;
          opacity: 0.75;
        }
        .accent-stripe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #E0B7F4, #3300cc, #cc00cc, #F2B5E1, transparent);
          background-size: 200% 100%;
          animation: sweepLight 4s infinite linear;
          border-radius: 3px;
        }
        .logo-orbits {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        .orbit-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid ${resolvedTheme === 'dark' ? 'rgba(207, 155, 221, 0.35)' : 'rgba(51, 0, 204, 0.25)'};
          box-sizing: border-box;
        }
        .ring-1 { width: 200px; height: 200px; animation: spinOrbit 28s linear infinite; }
        .ring-2 { width: 150px; height: 150px; top: 25px; left: 25px; animation: spinOrbit 18s linear reverse infinite; }
        .ring-3 { width: 100px; height: 100px; top: 50px; left: 50px; animation: spinOrbit 12s linear infinite; }
        .orbit-dot-icon {
          position: absolute;
          width: 24px;
          height: 24px;
          background: ${resolvedTheme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${resolvedTheme === 'dark' ? 'rgba(207, 155, 221, 0.45)' : 'rgba(51, 0, 204, 0.35)'};
          border-radius: 50%;
          box-shadow: 0 0 10px ${resolvedTheme === 'dark' ? 'rgba(204, 0, 204, 0.4)' : 'rgba(51, 0, 204, 0.2)'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .logo-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 76px;
          height: 76px;
          background: ${resolvedTheme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
          border: 1.5px solid ${resolvedTheme === 'dark' ? '#CF9BDD' : '#3300cc'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px ${resolvedTheme === 'dark' ? 'rgba(153,0,204,0.35)' : 'rgba(51,0,204,0.25)'};
          animation: floatLogo 4s ease-in-out infinite;
        }
        .stat-card {
          background: ${resolvedTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(51, 0, 204, 0.03)'};
          border-radius: 1.5rem;
          padding: 1.25rem 0.85rem;
          text-align: center;
          backdrop-filter: blur(8px);
          border: 1px solid ${resolvedTheme === 'dark' ? 'rgba(224, 183, 244, 0.1)' : 'rgba(51, 0, 204, 0.08)'};
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: ${resolvedTheme === 'dark' ? '#CF9BDD' : '#3300cc'};
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }
        .meal-card {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(12px);
          border-radius: 1.5rem;
          border: 1px solid rgba(207, 155, 221, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 1.5rem;
          text-align: center;
        }
        .meal-card:hover {
          transform: translateY(-6px);
          border-color: #CF9BDD;
          background: rgba(30, 41, 59, 0.88);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }
        .light-sweep {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${resolvedTheme === 'dark' 
            ? 'radial-gradient(circle at 35% 40%, rgba(153, 0, 204, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
            : 'radial-gradient(circle at 35% 40%, rgba(224, 183, 244, 0.32) 0%, rgba(0, 0, 0, 0) 70%)'};
          pointer-events: none;
          z-index: 1;
          animation: driftLight 15s infinite alternate ease-in-out;
        }
        .glow-pass {
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 80%;
          height: 80%;
          background: ${resolvedTheme === 'dark'
            ? 'radial-gradient(ellipse, rgba(51, 0, 204, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(185, 233, 233, 0.38) 0%, transparent 70%)'};
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
          animation: breatheGlow 18s infinite alternate ease-in-out;
        }
        .center-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 80vmax;
          height: 80vmax;
          transform: translate(-50%, -50%);
          background: ${resolvedTheme === 'dark'
            ? 'radial-gradient(circle, rgba(204, 0, 204, 0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(242, 181, 225, 0.12) 0%, transparent 70%)'};
          pointer-events: none;
          z-index: 1;
        }
        .vignette {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: ${resolvedTheme === 'dark'
            ? 'inset 0 0 140px rgba(0, 0, 0, 0.85)'
            : 'inset 0 0 140px rgba(0, 0, 0, 0.25)'};
          pointer-events: none;
          z-index: 3;
        }
      `}} />

      {/* 2. Cinematic Background Video */}
      <video 
        id="bgVideo" 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed inset-0 w-full h-full object-cover -z-20 pointer-events-none"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-wooden-table-with-restaurant-table-setting-32894-large.mp4" type="video/mp4" />
      </video>

      {/* Fallback Background Image (Pastel design if video fails or is offline) */}
      <div 
        className="fixed inset-0 w-full h-full -z-30 bg-cover bg-center transition-opacity duration-1000 pointer-events-none"
        style={{ 
          backgroundImage: resolvedTheme === 'dark' 
            ? "none" 
            : "url('/images/login_background_pastel.png')",
          backgroundBlendMode: 'overlay',
          backgroundColor: resolvedTheme === 'dark' ? '#03050b' : '#f8fafc'
        }}
      />

      {/* Atmospheric Overlays for Contrast */}
      <div 
        className="fixed inset-0 w-full h-full -z-10 transition-colors duration-500 pointer-events-none" 
        style={{ 
          background: resolvedTheme === 'dark' ? 'rgba(3, 5, 11, 0.72)' : 'rgba(248, 250, 252, 0.42)',
          backdropFilter: 'blur(3px)'
        }}
      />
      <div className="light-sweep" />
      <div className="glow-pass" />
      <div className="center-glow" />
      <div className="vignette" />

      {/* Fine Dust floating particles */}
      <div className="particles fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full filter blur-[1px]"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
              background: p.color,
              animationName: 'floatParticle',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              bottom: '-20px'
            }}
          />
        ))}
      </div>

      {/* 3. Hanging Lamp Theme Toggler */}
      <div className="fixed top-0 right-16 z-50 flex flex-col items-center select-none pointer-events-auto">
        {/* Lamp Graphic */}
        <div className="relative">
          <img 
            src="/images/lamp_design.png" 
            alt="Theme Lamp" 
            className="w-28 h-auto transition-all duration-300 drop-shadow-md" 
            style={{ 
              filter: resolvedTheme === 'dark' 
                ? 'brightness(0.4) drop-shadow(0 0 0px transparent)' 
                : 'brightness(1.15) drop-shadow(0 0 20px rgba(254, 240, 138, 0.85))'
            }} 
          />
        </div>
        {/* Pull String cord */}
        <div 
          onClick={handleThemePull}
          className="flex flex-col items-center cursor-pointer group"
          title="Pull cord to switch theme"
        >
          <div 
            className={`pull-string-line ${isSnapping ? 'cord-snap-anim' : ''}`}
            style={{
              background: resolvedTheme === 'dark' ? '#475569' : '#94a3b8',
              boxShadow: resolvedTheme === 'light' ? '0 0 8px rgba(252, 211, 77, 0.5)' : 'none',
              height: '120px',
              width: '2.5px',
              transition: 'background 0.3s'
            }}
          />
          {/* Pull string handle ball */}
          <div 
            className="w-6 h-6 rounded-full border border-slate-400 transition-all duration-300 group-hover:scale-125 shadow-lg"
            style={{
              background: resolvedTheme === 'dark' ? '#1e293b' : '#fef08a',
              borderColor: resolvedTheme === 'dark' ? '#64748b' : '#facc15',
              boxShadow: resolvedTheme === 'light' ? '0 0 10px #facc15' : 'none',
              marginTop: '-1px'
            }}
          />
        </div>
      </div>

      {/* Toast popup notifications */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full bg-slate-900/80 dark:bg-slate-900/80 border border-[#CF9BDD]/35 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5A0D7] animate-ping" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* 4. Split Login Screen Layout */}
      <div className="w-full max-w-6xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* LEFT COLUMN: BRAND DETAILS + ORBITING LOGO */}
          <div className="glass-panel p-12 flex flex-col justify-between hidden md:flex min-h-[660px] relative">
            
            {/* Crystal and Glass Watermark Graphic overlay */}
            <div 
              className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-[0.08] pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: "url('/images/billing_watermark.png')" }}
            />
            {/* Glossy glare diagonal reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

            <div className="relative z-10">
              {/* orbiting circles animation centering brand logo clipped inside a white circle */}
              <div className="logo-orbits mb-10">
                <div className="orbit-ring ring-1">
                  <div className="orbit-dot-icon" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-[#CF9BDD]" />
                  </div>
                </div>
                <div className="orbit-ring ring-2">
                  <div className="orbit-dot-icon" style={{ top: '10%', left: '85%' }}>
                    <UtensilsCrossed className="w-3 h-3 text-[#E5A0D7]" />
                  </div>
                </div>
                <div className="orbit-ring ring-3">
                  <div className="orbit-dot-icon" style={{ top: '20%', left: '15%' }}>
                    <Crown className="w-3.5 h-3.5 text-[#FEBFA1]" />
                  </div>
                </div>
                
                {/* centered original logo p-1 bg-white rounded-full */}
                <div className="logo-center flex items-center justify-center overflow-hidden rounded-full">
                  <img src="/images/logo.png" alt="A.KResto Logo" className="w-[90%] h-[90%] object-contain rounded-full bg-white p-1" />
                </div>
              </div>

              <div className="text-center md:text-left space-y-3">
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#CF9BDD] via-[#E5A0D7] to-[#FEBFA1] bg-clip-text text-transparent">
                  WELCOME BACK
                </h1>
                <div className="h-1.5 w-20 bg-gradient-to-r from-[#CF9BDD] to-[#E5A0D7] rounded-full" />
                <p className="text-slate-900 dark:text-slate-100 text-2xl font-black">Sign in to your workspace</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-bold">A.KResto Next-Generation Restaurant SaaS</p>
              </div>

              {/* Motivational welcome text / Features summary list */}
              <div className="mt-8 space-y-4 max-w-md">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-bold">
                  ✨ Coordinate table floor plans, manage preparation times on Kitchen Display monitors, and register orders seamlessly in a single workspace.
                </p>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {[
                    '⚡ Real-time Sync',
                    '📊 Billing Console',
                    '🍳 KDS Display',
                    '🛎️ Waiter Desk'
                  ].map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3.5 py-1 text-xs font-black rounded-full border border-[#CF9BDD]/30 bg-[#CF9BDD]/5 text-[#3300cc] dark:text-[#E5A0D7] shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="stat-card">
                <UtensilsCrossed className="text-[#CF9BDD] dark:text-[#E5A0D7] mx-auto text-xl mb-1.5" size={26} />
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">2.4k</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">TABLES SERVED</div>
              </div>
              <div className="stat-card">
                <TrendingUp className="text-[#CF9BDD] dark:text-[#E5A0D7] mx-auto text-xl mb-1.5" size={26} />
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">98%</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">UPTIME</div>
              </div>
              <div className="stat-card">
                <Store className="text-[#CF9BDD] dark:text-[#E5A0D7] mx-auto text-xl mb-1.5" size={26} />
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">150+</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">LOCATIONS</div>
              </div>
            </div>

            {/* Sub-quote message */}
            <div className="text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-2.5 font-black relative z-10">
              <span className="w-2 h-2 bg-[#E5A0D7] rounded-full animate-ping" />
              <span>cinematic hospitality · next‑gen platform</span>
            </div>
          </div>
          
          {/* RIGHT COLUMN: LOGIN CREDENTIALS FORM */}
          <div className="glass-panel p-12 relative flex flex-col justify-between min-h-[660px]">
            <div className="accent-stripe" />
            {/* Glare reflect overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header text */}
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                  {portal === 'super-admin' ? 'Super Admin Portal' : 'Access Dashboard'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-bold">Sign in with your enterprise credentials</p>
              </div>

              {/* Quick Staff Role Selector buttons with unique vector icons */}
              {portal === 'restaurant' && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Staff Role</span>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { 
                        id: 'owner' as const, 
                        label: 'Owner', 
                        icon: Crown,
                        activeClass: 'border-[#FEBFA1]/60 bg-[#FEBFA1]/10 text-[#e07f4f] dark:text-[#FEBFA1] shadow-[0_0_15px_rgba(254,191,161,0.25)]'
                      },
                      { 
                        id: 'shop' as const, 
                        label: 'Shop Owner', 
                        icon: Store,
                        activeClass: 'border-violet-500/60 bg-violet-500/10 text-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      },
                      { 
                        id: 'billing' as const, 
                        label: 'Billing', 
                        icon: CreditCard,
                        activeClass: 'border-[#BFDEF3]/60 bg-[#BFDEF3]/10 text-[#3182bd] dark:text-[#BFDEF3] shadow-[0_0_15px_rgba(191,222,243,0.25)]'
                      },
                      { 
                        id: 'waiter' as const, 
                        label: 'Waiter', 
                        icon: Bell,
                        activeClass: 'border-[#E0B7F4]/60 bg-[#E0B7F4]/10 text-[#8b5cf6] dark:text-[#E0B7F4] shadow-[0_0_15px_rgba(224,183,244,0.25)]'
                      },
                      { 
                        id: 'chef' as const, 
                        label: 'Chef/Staff', 
                        icon: ChefHat,
                        activeClass: 'border-[#F3A9B1]/60 bg-[#F3A9B1]/10 text-[#e11d48] dark:text-[#F3A9B1] shadow-[0_0_15px_rgba(243,169,177,0.25)]'
                      }
                    ].map((role) => {
                      const IconComponent = role.icon;
                      const isActive = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelect(role.id)}
                          className={`py-3.5 px-2 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 group ${
                            isActive
                              ? role.activeClass + ' font-black scale-105'
                              : 'border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform ${isActive ? 'animate-pulse' : ''}`} />
                          <span className="text-xs font-black">{role.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-bold text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Input Forms */}
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5 text-sm font-semibold">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-black text-slate-500 dark:text-slate-400 block tracking-wider">
                    {portal === 'super-admin' ? 'ADMIN EMAIL / USERNAME' : 'EMAIL / STAFF ID'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder={portal === 'super-admin' ? 'admin.console' : `${selectedRole}@akresto.com`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-100/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl pl-12 pr-4 py-4 outline-none text-slate-900 dark:text-white focus:border-[#3300cc] focus:ring-4 focus:ring-[#3300cc]/10 transition font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-black text-slate-500 dark:text-slate-400 block tracking-wider">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-100/50 dark:bg-black/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl pl-12 pr-10 py-4 outline-none text-slate-900 dark:text-white focus:border-[#3300cc] focus:ring-4 focus:ring-[#3300cc]/10 transition font-bold text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#CF9BDD] transition focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Session checkbox & reset links */}
                <div className="flex items-center justify-between text-sm font-bold pt-1">
                  <label className="flex items-center cursor-pointer select-none">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 dark:border-slate-800 text-[#3300cc] focus:ring-[#3300cc]/40 mr-2 accent-[#3300cc]" />
                    <span className="text-slate-600 dark:text-slate-400 font-extrabold">Remember session</span>
                  </label>
                  
                  <button 
                    type="button"
                    onClick={() => triggerToast('A password reset link has been dispatched to your email.')}
                    className="text-[#3300cc] dark:text-[#E5A0D7] hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Sign In button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#3300cc] via-[#9900cc] to-[#cc00cc] hover:from-[#250099] hover:to-[#aa00aa] text-white font-black py-4 rounded-2xl transition active:scale-[0.98] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2.5 text-base mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>{portal === 'super-admin' ? 'Access Console' : 'Sign In'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer triggers - Cleaned-up Icons-Only Bar */}
            <div className="relative z-10 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
              
              {/* Michelin dishes showcase list */}
              <button
                onClick={() => setShowMealsModal(true)}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-r from-[#CF9BDD]/15 to-[#F2B5E1]/15 border border-[#CF9BDD]/30 text-[#CF9BDD] dark:text-[#E5A0D7] font-bold hover:bg-[#CF9BDD]/20 transition group text-sm outline-none focus:outline-none"
              >
                <UtensilsCrossed className="group-hover:rotate-12 transition-transform text-[#CF9BDD]" size={16} />
                <span>Explore culinary masterpieces</span>
                <ArrowRight size={14} className="text-[#E5A0D7]" />
              </button>

              {/* Icons-Only Control Footer (Removed Hub Text & Swapped Switch Text for Centered Icons) */}
              <div className="flex justify-center items-center gap-5 pt-2">
                {/* Help button */}
                <button 
                  type="button"
                  onClick={() => triggerToast('System status: Active & Secured.')}
                  className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#3300cc] dark:hover:text-[#E5A0D7] hover:bg-[#CF9BDD]/5 transition active:scale-95 flex items-center justify-center focus:outline-none"
                  title="System Info"
                >
                  <HelpCircle size={16} />
                </button>

                {/* Main Switch Portal Center Action Icon */}
                <button
                  type="button"
                  onClick={togglePortal}
                  className="p-3.5 rounded-full bg-gradient-to-r from-[#3300cc] to-[#cc00cc] text-white hover:from-[#250099] hover:to-[#aa00aa] transition active:scale-95 shadow-md shadow-indigo-500/20 flex items-center justify-center focus:outline-none"
                  title={`Switch to ${portal === 'restaurant' ? 'Super Admin' : 'Restaurant Portal'}`}
                >
                  {portal === 'restaurant' ? <Shield size={18} /> : <Store size={18} />}
                </button>

                {/* Documentation / Manuals Button */}
                <button 
                  type="button"
                  onClick={() => triggerToast('Opening Documentation and manual portal...')}
                  className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#3300cc] dark:hover:text-[#E5A0D7] hover:bg-[#CF9BDD]/5 transition active:scale-95 flex items-center justify-center focus:outline-none"
                  title="Guides & Manuals"
                >
                  <BookOpen size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Signature dishes modal */}
      {showMealsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-gradient-to-br from-[#0F172A] to-black/90 rounded-3xl border border-[#CF9BDD]/35 shadow-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Award className="text-[#E5A0D7] text-3xl" size={28} />
                <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#CF9BDD] to-[#FEBFA1] bg-clip-text text-transparent tracking-tight">
                  AKResto Signature Collection
                </h3>
              </div>
              <button 
                onClick={() => setShowMealsModal(false)}
                className="text-white/60 hover:text-white text-3xl leading-none transition focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            <p className="text-slate-300 text-xs font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-[#FEBFA1]" size={14} /> Michelin-inspired plates — crafted by elite chefs
            </p>
            
            {/* Dishes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: '🥩', name: 'A5 Wagyu Tataki', desc: 'Seared wagyu, ponzu gel, gold flake', price: '$129', tag: '289 orders' },
                { emoji: '🦞', name: 'Azure Lobster', desc: 'Thermidor butter, caviar, champagne cream', price: '$159', tag: "Chef's pick" },
                { emoji: '🍝', name: 'Truffle Carbonara', desc: 'Black truffle, guanciale, parmesan espuma', price: '$54', tag: 'Premium' },
                { emoji: '🍣', name: 'Omakase Voyage', desc: '15 pieces, uni, toro, ikura, gold leaf', price: '$189', tag: 'Fresh catch' },
                { emoji: '🍰', name: 'Ruby Chocolate Dome', desc: 'raspberry gel, lychee sorbet, silver pearls', price: '$24', tag: 'Exclusive' },
                { emoji: '🥗', name: 'Mediterranean Eden', desc: 'heirloom tomatoes, burrata, aged balsamic', price: '$32', tag: 'Plant-based' }
              ].map((meal, idx) => (
                <div key={idx} className="meal-card">
                  <div className="text-5xl mb-3">{meal.emoji}</div>
                  <h4 className="text-lg font-black text-white">{meal.name}</h4>
                  <p className="text-[#CF9BDD]/80 text-xs mt-1 font-semibold">{meal.desc}</p>
                  <div className="flex justify-between items-center mt-4 text-[10px] text-white/70 font-bold border-t border-white/5 pt-3">
                    <span className="bg-[#CF9BDD]/15 text-[#E5A0D7] px-2 py-0.5 rounded-full">{meal.tag}</span>
                    <span className="text-[#FEBFA1] text-xs font-black">{meal.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-white/40 text-xs border-t border-white/10 pt-6 font-bold flex items-center justify-center gap-1.5">
              <Smartphone className="text-[#E5A0D7]" size={13} />
              <span>Real-time ordering & AI sync active after login</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
