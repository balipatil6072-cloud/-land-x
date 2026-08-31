import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KshetraLogo } from '../components/common/LandXLogo';
import { DEMO_ACCOUNTS } from '../config/demoUsers';
import type { OfficerRole } from '../types/auth';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Building2,
  Users,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/command-center';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password, rememberDevice);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoLogin = (role: OfficerRole) => {
    quickLogin(role);
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between select-none font-sans text-slate-100 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* TOP HEADER BAR */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <KshetraLogo size="md" lightMode={true} showWordmark={true} />
        </Link>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="hidden sm:inline text-slate-400">SIH2026 Prototype Authorization Gateway</span>
          <Link
            to="/"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs border border-slate-700 transition-colors font-semibold"
          >
            Public Portal &rarr;
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto px-4 py-8 max-w-4xl mx-auto w-full flex flex-col lg:flex-row items-stretch gap-6">
        {/* LEFT COLUMN: OFFICIAL LOGIN FORM */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xs p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center space-x-1.5 text-blue-400 font-mono text-[11px] uppercase tracking-wider font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Government Officer Access</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                KSHETRA PORTAL LOGIN
              </h1>
              <p className="text-xs text-slate-400">
                Secure access to National Land Acquisition &amp; Infrastructure Intelligence
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xs text-red-200 text-xs font-mono flex items-start space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold uppercase tracking-wider block text-[10px]">
                  Official Government Email / Officer ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. officer@kshetra.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xs pl-9 pr-3 py-2 text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold uppercase tracking-wider block text-[10px]">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xs pl-9 pr-3 py-2 text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded-xs bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white font-mono font-bold rounded-xs transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'SIGN IN →'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-1 text-[10px] font-mono text-slate-500">
            <div className="flex items-center space-x-1.5 text-slate-400 font-bold">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Authorized government personnel only</span>
            </div>
            <p className="text-slate-500 leading-tight">
              Prototype authentication for SIH2026 demonstration. Production deployment would integrate authorized Government SSO / identity infrastructure.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: SIH 2026 DEMO ACCESS PANEL */}
        <div className="w-full lg:w-80 bg-slate-900/90 border border-slate-800 rounded-xs p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h2 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                  SIH 2026 Demo Access
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="text-[10px] font-mono text-blue-400 hover:underline"
              >
                {showDemoCredentials ? 'Hide Info' : 'Show Info'}
              </button>
            </div>

            <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xs text-[11px] text-amber-200/90 space-y-1 font-sans">
              <div className="flex items-start space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-snug text-[10px]">
                  <strong>Prototype authentication</strong> — 1-click login below to test role-based access control during evaluation.
                </p>
              </div>
            </div>

            {/* 1-CLICK ROLE DEMO LOGIN BUTTONS */}
            <div className="space-y-2 pt-1 font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                SELECT DEMO ROLE FOR EVALUATION:
              </span>

              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.role)}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                        {acc.roleTitle}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                      {acc.department}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xs uppercase flex-shrink-0">
                    {acc.jurisdictionScope}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {showDemoCredentials && (
            <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 bg-slate-950 p-2.5 rounded-xs border border-slate-800/80">
              <div className="text-slate-300 font-bold flex items-center justify-between">
                <span>MANUAL DEMO CREDENTIALS:</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div><span className="text-slate-500">Email:</span> admin@kshetra.gov.in</div>
              <div><span className="text-slate-500">Password:</span> kshetra2026</div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-3 px-6 text-center text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>KSHETRA &bull; National Infrastructure Intelligence Platform</span>
        </div>
        <span>Government Operations &bull; SIH26017</span>
      </footer>
    </div>
  );
};
