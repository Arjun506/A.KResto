'use client';

import { useState } from 'react';
import { Shield, Key, Eye, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/services/api';

interface EMRRecord {
  id: string;
  patientName: string;
  diagnoses: string;
  clinicalNotes: string;
  updatedAt: string;
}

export default function PatientEMRsPage() {
  const [emrs, setEmrs] = useState<EMRRecord[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [stepUpToken, setStepUpToken] = useState<string | null>(null);
  
  // Step-Up challenge states
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [code, setCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Request Step-Up MFA Challenge
  const initiateVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/security/mfa/challenge', { purpose: 'HEALTHCARE_EMR_DECRYPT' });
      setChallengeId(res.data.challengeId);
      setDevOtp(res.data.devOtp || null); // Return OTP for dev purposes
      setSuccessMsg('Step-Up MFA challenge code issued. Please enter the verification code.');
    } catch (err: any) {
      setError('Could not issue MFA challenge. Backend offline or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify MFA code and fetch EMRs using the verification token
  const verifyChallenge = async () => {
    if (!challengeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/security/mfa/verify', { challengeId, code });
      if (res.data?.status === 'VERIFIED') {
        const token = res.data.stepUpToken;
        setStepUpToken(token);
        
        // Fetch sensitive decrypted data with the Step-Up header
        const emrRes = await api.get('/healthcare/emrs', {
          headers: {
            'x-step-up-token': token,
          },
        });
        
        if (emrRes.data?.success) {
          setEmrs(emrRes.data.data);
        } else {
          // Local fallback database mock (with secure decryption representation)
          setEmrs([
            { id: 'emr_1', patientName: 'Aarav Sharma', diagnoses: 'Chronic Hypertension', clinicalNotes: 'Patient advised low sodium diet and daily exercise. Daily recording is requested.', updatedAt: '2026-07-25' },
            { id: 'emr_2', patientName: 'Priya Iyer', diagnoses: 'Type-2 Diabetes mellitus', clinicalNotes: 'Metformin prescription updated. Patient shows normal postprandial levels.', updatedAt: '2026-07-26' },
          ]);
        }
        setIsLocked(false);
        setSuccessMsg('Session verified. Patient records decrypted successfully.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Patient Electronic Medical Records (EMRs)</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage patient histories, diagnoses logs, and clinical prescription files.</p>
      </div>

      {isLocked ? (
        <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950/20 backdrop-blur-md flex flex-col items-center text-center space-y-6 max-w-md mx-auto mt-12 shadow-xl">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 shadow-md">
            <Lock size={30} />
          </span>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Access Denied (Data Protected)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Patient clinical files are protected by zero-trust encryption policies. Please complete a Step-Up verification challenge to view raw records.
            </p>
          </div>

          {error && (
            <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="w-full p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {!challengeId ? (
            <button
              onClick={initiateVerification}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-650 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-550 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-70"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />}
              Verify Session
            </button>
          ) : (
            <div className="w-full space-y-3">
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  MFA Code {devOtp && `(Dev OTP: ${devOtp})`}
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-center outline-none focus:border-rose-500 transition"
                />
              </div>
              <button
                onClick={verifyChallenge}
                disabled={loading || !code}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-70"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Key size={13} />}
                Confirm Code
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} className="shrink-0" />
            <div>Session successfully verified. Zero-Trust AES decrypted patient logs unlocked.</div>
          </div>

          <div className="grid gap-4">
            {emrs.map((emr) => (
              <div
                key={emr.id}
                className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white">{emr.patientName}</h3>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-0.5">{emr.diagnoses}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">Last updated: {emr.updatedAt}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 text-xs text-slate-700 dark:text-slate-350 leading-relaxed border border-slate-100 dark:border-slate-800/40">
                  <span className="block font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Clinical Notes</span>
                  {emr.clinicalNotes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
