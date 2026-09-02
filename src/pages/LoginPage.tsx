import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KshetraLogo } from '../components/common/LandXLogo';
import { DEMO_ACCOUNTS } from '../config/demoUsers';
import type { OfficerRole } from '../types/auth';
import {
  Mail,
  Key,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Building2,
  Globe,
  Landmark,
  MapPin,
  Briefcase,
  Activity,
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

  const fillDemoCredentials = () => {
    setEmail('admin@kshetra.gov.in');
    setPassword('kshetra2026');
  };

  const getRoleIcon = (role: OfficerRole) => {
    switch (role) {
      case 'NATIONAL_ADMIN':
        return Globe;
      case 'STATE_OFFICER':
        return Landmark;
      case 'DISTRICT_OFFICER':
        return MapPin;
      case 'PROJECT_OFFICER':
        return Briefcase;
      case 'MONITORING_OFFICER':
        return Activity;
      case 'READ_ONLY':
        return ShieldCheck;
      default:
        return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-between font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. TOP GOVERNMENT-STYLE HEADER */}
      <header className="h-[72px] bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Left: Logo, Wordmark & Subtitle */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <KshetraLogo size="md" lightMode={false} showWordmark={true} />
          </Link>
          <div className="hidden md:block h-6 w-px bg-slate-200 mx-4" />
          <span className="hidden md:inline-block text-xs font-medium text-slate-500">
            Land Acquisition Intelligence Platform
          </span>
        </div>

        {/* Center / Right: Portal Title, Demo Label & Public Portal Link */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <span className="hidden lg:inline-block text-xs font-semibold text-slate-700">
            Government Officer Portal
          </span>
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[11px] font-medium tracking-wide">
            SIH 2026 Prototype
          </span>
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1b365d] border border-slate-300 hover:border-slate-400 rounded-md text-xs font-semibold transition-colors shadow-2xs"
          >
            <span>Public Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. MAIN PAGE CONTENT CONTAINER */}
      <main className="my-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-[1160px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: OFFICIAL LOGIN FORM (~45% / 5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5 border-b border-slate-100 pb-5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Government Officer Login
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Secure access to the KSHETRA land acquisition intelligence platform.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Official Email / Officer ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. officer@kshetra.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-[#1b365d] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-[#1b365d] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#1b365d] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-normal">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1b365d] hover:bg-[#152a4a] active:bg-[#0f1f38] text-white font-semibold rounded-md transition-colors shadow-2xs flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-5 border-t border-slate-100 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Authorized government personnel only</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prototype authentication for SIH 2026 evaluation. Production deployment integrates official government SSO identity infrastructure.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: DEMO ROLE ACCESS PANEL (~55% / 7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Demo Role Access
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                    Prototype environment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  For SIH 2026 evaluation, select a role to explore role-based access.
                </p>
              </div>
            </div>

            {/* 6 ROLE CARDS IN A 2-COLUMN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const IconComponent = getRoleIcon(acc.role);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc.role)}
                    className="text-left p-4 bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-700/50 rounded-lg transition-all cursor-pointer group flex flex-col justify-between h-full space-y-3 shadow-2xs hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-md bg-slate-100 text-[#1b365d] group-hover:bg-[#1b365d] group-hover:text-white flex items-center justify-center transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors uppercase tracking-wider">
                          {acc.jurisdictionScope}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#1b365d] transition-colors leading-tight">
                          {acc.roleTitle}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {acc.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end text-xs font-semibold text-[#1b365d] opacity-80 group-hover:opacity-100 transition-opacity pt-1">
                      <span className="text-[11px]">Select Role</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* COMPACT PROTOTYPE CREDENTIALS SECTION */}
            <div className="pt-4 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800">Prototype credentials</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="text-[11px] text-blue-700 hover:text-blue-900 font-medium underline cursor-pointer"
                    >
                      Fill into form
                    </button>
                  </div>
                  <div className="text-slate-600 text-[11px] flex flex-wrap items-center gap-x-3">
                    <span><strong className="font-medium text-slate-500">Email:</strong> admin@kshetra.gov.in</span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span><strong className="font-medium text-slate-500">Password:</strong> kshetra2026</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 italic whitespace-nowrap">
                  For demonstration purposes only
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-xs text-slate-600 font-sans mt-auto">
        <div className="max-w-[1160px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-800">
              KSHETRA — Land Acquisition Intelligence Platform
            </div>
            <div className="text-[11px] text-slate-500">
              SIH 2026 Prototype &bull; Authorized access only
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
              Privacy
            </a>
            <span>&bull;</span>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
              Security
            </a>
            <span>&bull;</span>
            <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
