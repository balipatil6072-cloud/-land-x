import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowRight,
  MapPin,
  Lock,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Compass,
  Cpu,
  Zap,
} from 'lucide-react';
import { LandXLogo } from '../components/common/LandXLogo';
import { useAuth } from '../context/AuthContext';

// Restrained Marker Icon for GIS Preview
const redIcon = L.divIcon({
  html: '<div class="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-md"></div>',
  className: 'custom-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Landing Page Map Preview Style State (Standard by default)
  const [previewMapStyle, setPreviewMapStyle] = useState<'standard' | 'dark'>('standard');

  // About KSHETRA Infrastructure Visual Carousel State
  const [aboutSlide, setAboutSlide] = useState(0);
  const [resetTimerToken, setResetTimerToken] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const aboutSlides = [
    {
      id: 1,
      tag: 'LAND ACQUISITION',
      badge: 'NATIONAL INFRASTRUCTURE INTELLIGENCE',
      title: '787.52 HECTARES LAND ACQUISITION',
      subtitle: 'Madurantakam Corridor land parcels identified for acquisition',
      image: '/images/about-carousel-1.jpg',
    },
    {
      id: 2,
      tag: 'PROJECT MONITORING',
      badge: 'INFRASTRUCTURE DEVELOPMENT',
      title: 'EXPRESSWAY CONSTRUCTION CORRIDOR',
      subtitle: 'Active corridor earthwork & highway alignment assessment',
      image: '/images/about-carousel-2.jpg',
    },
    {
      id: 3,
      tag: 'FIELD VERIFICATION',
      badge: 'CADASTRAL LAND SURVEY',
      title: 'FIELD SURVEY & TOTAL STATION MEASUREMENT',
      subtitle: 'SLAO officers verifying land boundary & highway alignment',
      image: '/images/about-carousel-3.jpg',
    },
    {
      id: 4,
      tag: 'PROJECT DEVELOPMENT',
      badge: 'CORRIDOR ALIGNMENT EXCAVATION',
      title: 'MAJOR INFRASTRUCTURE EXCAVATION',
      subtitle: 'Active land parcel excavation monitored against SLA schedule',
      image: '/images/about-carousel-4.jpg',
    },
    {
      id: 5,
      tag: 'LAND & PROJECT PLANNING',
      badge: 'CADASTRAL PARCEL ALIGNMENT',
      title: 'AERIAL LAND PARCEL SURVEYING',
      subtitle: 'Agricultural land parcel boundaries & corridor right-of-way',
      image: '/images/about-carousel-5.png',
    },
  ];

  // Handlers to update slide and reset 2-second playback timer
  const handleNextAboutSlide = () => {
    setAboutSlide((prev) => (prev === aboutSlides.length - 1 ? 0 : prev + 1));
    setResetTimerToken((prev) => prev + 1);
  };

  const handlePrevAboutSlide = () => {
    setAboutSlide((prev) => (prev === 0 ? aboutSlides.length - 1 : prev - 1));
    setResetTimerToken((prev) => prev + 1);
  };

  const handleSelectAboutSlide = (index: number) => {
    setAboutSlide(index);
    setResetTimerToken((prev) => prev + 1);
  };

  // Continuous 2-Second Automatic Playback Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAboutSlide((prev) => (prev === aboutSlides.length - 1 ? 0 : prev + 1));
    }, 2000); // Exactly 2 seconds per image

    return () => clearInterval(interval);
  }, [resetTimerToken, aboutSlides.length]);

  const handleNav = (targetPath: string) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  useEffect(() => {
    console.log(
      "KSHETRA HERO VIDEO SOURCE:",
      "/videos/land-x-sih26017-hero.mp4?v=sih26017-final"
    );

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleCanPlay = () => {
      if (videoEl.readyState >= 2) {
        setVideoLoaded(true);
      }
    };

    const handleError = () => {
      setVideoError(true);
    };

    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('error', handleError);

    if (videoEl.readyState >= 2) {
      setVideoLoaded(true);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('error', handleError);
    };
  }, []);

  // Priority Attention Projects Data
  const priorityProjects = [
    {
      id: 'LA-1842',
      name: 'Mumbai–Nagpur Infrastructure Corridor',
      location: 'Nashik, Maharashtra',
      risk: 92,
      trend: '↑ +21',
      delay: '+74 days',
      driver: 'Compensation',
    },
    {
      id: 'LA-1931',
      name: 'Patna–Gaya Expressway Corridor',
      location: 'Gaya, Bihar',
      risk: 87,
      trend: '↑ +16',
      delay: '+58 days',
      driver: 'Legal dispute',
    },
    {
      id: 'LA-2077',
      name: 'Bundelkhand Industrial Expressway Phase II',
      location: 'Jalaun, Uttar Pradesh',
      risk: 84,
      trend: '↑ +14',
      delay: '+48 days',
      driver: 'Documentation',
    },
  ];

  // Delay Drivers Data
  const delayDrivers = [
    { driver: 'Compensation Disbursement Backlog', pct: 38 },
    { driver: 'Pending High Court / Revenue Tribunal Disputes', pct: 24 },
    { driver: 'Land Record & Cadastral Verification', pct: 19 },
    { driver: 'Inter-Departmental Approvals & Clearances', pct: 11 },
    { driver: 'Rehabilitation & Resettlement (R&R) Implementation', pct: 8 },
  ];

  // Workflow Steps
  const workflowSteps = [
    {
      step: '01',
      title: 'PROJECT DATA',
      desc: 'Land acquisition project information and cadastral records are consolidated into a unified intelligence schema.',
    },
    {
      step: '02',
      title: 'RISK ANALYSIS',
      desc: 'KSHETRA predictive analytics evaluate 14 delay parameters to identify emerging bottleneck patterns early.',
    },
    {
      step: '03',
      title: 'OFFICER ACTION',
      desc: 'Authorities receive prioritized, actionable intervention recommendations for targeted dispute resolution.',
    },
    {
      step: '04',
      title: 'MONITORING',
      desc: 'Project progress, stage milestones, and risk score reductions are monitored in real time.',
    },
  ];

  return (
    <div className="relative w-screen min-h-screen bg-slate-950 text-white font-sans antialiased select-none overflow-x-hidden">
      {/* 1. FIXED FULL-SCREEN INFRASTRUCTURE VIDEO BACKGROUND LAYER WITH DARK NAVY OVERLAY */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Poster fallback image */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 z-0 ${
            videoLoaded && !videoError && !prefersReducedMotion ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url('/images/land-x-sih26017-hero-poster.jpg?v=sih26017-final')`,
          }}
        />

        {/* Layer 1: Infrastructure Hero Video */}
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            key="/videos/land-x-sih26017-hero.mp4?v=sih26017-final"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/land-x-sih26017-hero-poster.jpg?v=sih26017-final"
            className="absolute inset-0 w-full h-full object-cover object-center z-10 opacity-100 filter brightness-100 saturate-100"
          >
            <source
              src="/videos/land-x-sih26017-hero.mp4?v=sih26017-final"
              type="video/mp4"
            />
          </video>
        )}

        {/* Layer 2: Dark Navy Overlay (~76.5% Overlay / ~23.5% Net Video Visibility) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(3,8,22,0.77) 0%, rgba(5,14,36,0.75) 50%, rgba(3,8,22,0.78) 100%)',
          }}
        />

        {/* Layer 3: Subtle Technical Grid Pattern & Intelligence Nodes */}
        <div
          className="absolute inset-0 z-25 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56,189,248,0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* 2. HERO SECTION CONTAINING GLASS HEADER & MAIN CONTENT */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* MAIN GLASS HEADER BAR */}
        <header className="relative z-30 bg-slate-900/75 backdrop-blur-md border-b border-slate-800/80 py-3.5 px-4 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Logo + Subtitle Lockup */}
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => handleNav('/command-center')}
            >
              <LandXLogo size="lg" lightMode={true} showWordmark={true} className="w-[125px] sm:w-[140px]" />
              <div className="hidden lg:block border-l border-slate-700/80 pl-4 py-0.5">
                <span className="font-mono font-bold text-xs text-white uppercase block tracking-wider leading-none">
                  NATIONAL PLATFORM
                </span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                  Land Acquisition &amp; Infrastructure Intelligence
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-mono font-bold text-slate-300">
              <button
                onClick={() => navigate('/')}
                className="text-white font-bold border-b-2 border-blue-500 pb-0.5"
              >
                HOME
              </button>
              <button
                onClick={() => handleNav('/command-center')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                NATIONAL SITUATION
              </button>
              <button
                onClick={() => handleNav('/national-map')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                NATIONAL MAP
              </button>
              <button
                onClick={() => handleNav('/projects')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                PROJECTS
              </button>
              <button
                onClick={() => handleNav('/early-warning')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                WARNINGS
              </button>
              <button
                onClick={() => handleNav('/interventions')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                ACTIONS
              </button>
            </nav>

            {/* Right Action Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(isAuthenticated ? '/command-center' : '/login')}
                className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xs text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAuthenticated ? 'OFFICER WORKSPACE →' : 'GOVERNMENT OFFICER LOGIN →'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* HERO MAIN CONTENT AREA */}
        <main className="relative z-30 px-4 md:px-12 max-w-7xl mx-auto w-full my-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-10">
          {/* Left Column: Core Headline & CTAs */}
          <div className="max-w-2xl space-y-5 text-left">
            {/* Subtle AI Intelligence Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-blue-500/40 rounded-xs text-[11px] font-mono font-bold text-blue-400 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>AI PREDICTIVE SIGNAL &bull; CONTINUOUS MONITORING</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] font-sans">
              Predict <span className="text-blue-400">land acquisition</span> delays.<br />
              Act before <span className="text-blue-400">infrastructure</span> projects stop.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              KSHETRA helps government officers identify acquisition bottlenecks, assess delay risk, prioritize intervention, and monitor project progress across India.
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 font-mono text-xs font-bold">
              <button
                onClick={() => handleNav('/command-center')}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xs shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <span>ENTER NATIONAL SITUATION →</span>
              </button>

              <button
                onClick={() => handleNav('/national-map')}
                className="px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-all uppercase"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>EXPLORE NATIONAL MAP</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Project Intelligence Alert Card (LA-1842) */}
          <div className="w-full max-w-md lg:max-w-sm">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xs p-5 shadow-2xl space-y-4 font-sans text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-blue-400">PROJECT ALERT &bull; LA-1842</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-xs bg-red-950 text-red-400 font-mono text-[10px] font-bold border border-red-800 uppercase">
                  CRITICAL RISK
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">
                  Mumbai–Nagpur Infrastructure Corridor
                </h3>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                  Nashik, Maharashtra &bull; Infrastructure Sector
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xs border border-slate-800/80 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">DELAY RISK</span>
                  <span className="text-2xl font-black text-red-400">92%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PROJECTED SLIP</span>
                  <span className="text-xl font-bold text-slate-200">+74 DAYS</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <span className="text-[10px] font-bold text-amber-400 uppercase block">PRIMARY BOTTLENECK</span>
                <p className="font-sans text-slate-300 font-medium leading-snug">
                  Compensation (38% beneficiary records unresolved in Nashik Tehsil)
                </p>
              </div>

              <button
                onClick={() => handleNav('/projects/LA-1842')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-bold rounded-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-slate-700 shadow-xs"
              >
                <span>INSPECT PROJECT BRIEF &rarr;</span>
              </button>
            </div>
          </div>
        </main>

        {/* 3. BOTTOM INSTITUTIONAL KPI STRIP */}
        <footer className="relative z-30 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md py-4 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-center md:text-left gap-4 md:gap-0">
              <div className="px-4 py-2 first:pl-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PROJECTS MONITORED</span>
                <span className="text-2xl sm:text-3xl font-black text-white block mt-0.5">4,286</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Across 28 States &amp; UTs</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">PROJECTS AT RISK</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 block mt-0.5">618</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Delay probability &gt; 65%</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">CRITICAL ATTENTION</span>
                <span className="text-2xl sm:text-3xl font-black text-red-400 block mt-0.5">147</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Immediate action required</span>
              </div>
              <div className="px-4 py-2 last:pr-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PREDICTED DELAY EXPOSURE</span>
                <span className="text-2xl sm:text-3xl font-black text-white block mt-0.5">+18,420 DAYS</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Cumulative schedule slippage</span>
              </div>
            </div>
          </div>
        </footer>
      </section>

      {/* 4. EXPANSION SECTIONS BELOW HERO */}
      <div className="relative z-10 bg-slate-950/95 backdrop-blur-md text-slate-100 w-full space-y-16 py-16 px-4 md:px-12 max-w-7xl mx-auto font-sans text-left">
        {/* SECTION 1: ABOUT KSHETRA (EDITORIAL 2-COLUMN LAYOUT) */}
        <section className="space-y-8 border-b border-slate-800 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT COLUMN: Editorial Text + Compact Intelligence Modules */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                  PLATFORM OVERVIEW
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                  ABOUT KSHETRA
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  KSHETRA is a land acquisition intelligence and monitoring platform designed to help authorities identify emerging acquisition bottlenecks before they become project delays.
                </p>
              </div>

              {/* COMPACT INTELLIGENCE MODULES (PREDICT, IDENTIFY, INTERVENE) */}
              <div className="space-y-3 font-sans">
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-start space-x-3.5 shadow-md">
                  <div className="w-8 h-8 bg-slate-950 border border-slate-800 rounded-xs flex items-center justify-center text-blue-400 font-mono font-bold flex-shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                      <span>PREDICT</span>
                      <span className="text-[10px] text-blue-400 font-normal">&bull; Early Warning</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-normal mt-0.5">
                      Identify projects with rising delay probability before schedule benchmarks are breached.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-start space-x-3.5 shadow-md">
                  <div className="w-8 h-8 bg-slate-950 border border-slate-800 rounded-xs flex items-center justify-center text-amber-400 font-mono font-bold flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                      <span>IDENTIFY</span>
                      <span className="text-[10px] text-amber-400 font-normal">&bull; Bottleneck Root-Cause</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-normal mt-0.5">
                      Determine primary acquisition bottlenecks (compensation, litigation, title disputes, clearances).
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-start space-x-3.5 shadow-md">
                  <div className="w-8 h-8 bg-slate-950 border border-slate-800 rounded-xs flex items-center justify-center text-emerald-400 font-mono font-bold flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                      <span>INTERVENE</span>
                      <span className="text-[10px] text-emerald-400 font-normal">&bull; Targeted Officer SLA</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-normal mt-0.5">
                      Prioritize administrative actions, deploy targeted field camps, and monitor risk reduction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REPLACED VISUAL AREA WITH LARGE INFRASTRUCTURE IMAGE CAROUSEL */}
            <div className="lg:col-span-6 relative">
              <div
                className="relative rounded-xs overflow-hidden border border-slate-800 shadow-2xl group w-full h-[280px] sm:h-[340px] lg:h-[420px] font-sans select-none"
                onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  const touchEndX = e.changedTouches[0].clientX;
                  if (touchStartX - touchEndX > 40) {
                    handleNextAboutSlide();
                  } else if (touchEndX - touchStartX > 40) {
                    handlePrevAboutSlide();
                  }
                }}
              >
                {aboutSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
                      aboutSlide === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                    />
                    {/* Subtle Dark Navy Gradient Overlay (~75% photo visibility, ~25% overlay) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Small Professional Lower-Left Information Overlay */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-900/85 backdrop-blur-xs border border-slate-700/80 p-2.5 rounded-xs font-mono text-xs text-white shadow-xl flex items-center justify-between z-20">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">{slide.tag}</span>
                          <span className="text-[9px] text-slate-400 font-normal">&bull; {slide.badge}</span>
                        </div>
                        <div className="font-bold text-slate-100 text-xs font-sans tracking-tight">{slide.title}</div>
                        <div className="text-[10px] text-slate-300 font-sans leading-tight">{slide.subtitle}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2 hidden sm:block">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">KSHETRA RADAR</span>
                        <span className="text-emerald-400 font-bold text-[9px] flex items-center space-x-1 justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>ACTIVE</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Vertically Centered Left / Right Manual Navigation Buttons */}
                <button
                  onClick={handlePrevAboutSlide}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 rounded-xs font-mono text-xs cursor-pointer transition-colors shadow-lg flex items-center justify-center opacity-85 hover:opacity-100"
                  aria-label="Previous Image"
                >
                  <span className="text-sm font-bold">&larr;</span>
                </button>
                <button
                  onClick={handleNextAboutSlide}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 rounded-xs font-mono text-xs cursor-pointer transition-colors shadow-lg flex items-center justify-center opacity-85 hover:opacity-100"
                  aria-label="Next Image"
                >
                  <span className="text-sm font-bold">&rarr;</span>
                </button>

                {/* Slide Indicator Bar (01 / 05 & Dots) */}
                <div className="absolute top-3 right-3 z-30 flex items-center space-x-2 font-mono text-[10px] text-slate-300 bg-slate-900/85 px-2.5 py-1 rounded-xs border border-slate-800 backdrop-blur-xs">
                  <span className="font-bold text-white">0{aboutSlide + 1} / 05</span>
                  <div className="flex items-center space-x-1">
                    {aboutSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectAboutSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          aboutSlide === idx ? 'bg-blue-500 w-3' : 'bg-slate-500 w-1.5 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FIELD -> DATA -> DECISION PROCESS SEQUENCE */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xs p-5 shadow-lg font-mono">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-3">
              OPERATIONAL PROCESS FLOW &bull; FIELD TO DECISION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xs space-y-1">
                <span className="text-base font-bold text-blue-400 block">01</span>
                <span className="text-xs font-bold text-white uppercase block font-mono">FIELD &amp; PROJECT DATA</span>
                <p className="text-[11px] text-slate-400 font-sans">Cadastral, compensation &amp; Tehsil records</p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xs space-y-1">
                <span className="text-base font-bold text-amber-400 block">02</span>
                <span className="text-xs font-bold text-white uppercase block font-mono">PREDICTIVE ANALYSIS</span>
                <p className="text-[11px] text-slate-400 font-sans">ML delay probability scoring</p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xs space-y-1">
                <span className="text-base font-bold text-red-400 block">03</span>
                <span className="text-xs font-bold text-white uppercase block font-mono">BOTTLENECK IDENTIFICATION</span>
                <p className="text-[11px] text-slate-400 font-sans">Litigation, title &amp; clearance diagnosis</p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xs space-y-1">
                <span className="text-base font-bold text-emerald-400 block">04</span>
                <span className="text-xs font-bold text-white uppercase block font-mono">TARGETED INTERVENTION</span>
                <p className="text-[11px] text-slate-400 font-sans">SLAO action dispatch &amp; audit logging</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW KSHETRA SUPPORTS OFFICERS (4-STEP WORKFLOW) */}
        <section className="space-y-8 border-b border-slate-800 pb-12">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
              OPERATIONAL METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              HOW KSHETRA SUPPORTS OFFICERS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item) => (
              <div key={item.step} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xs space-y-3">
                <span className="text-2xl font-black font-mono text-blue-400 block">
                  {item.step}
                </span>
                <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: NATIONAL COVERAGE & GIS PREVIEW SECTION */}
        <section className="space-y-8 border-b border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                GEOSPATIAL MONITORING
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans mt-1">
                NATIONAL LAND ACQUISITION MONITORING
              </h2>
            </div>
            <button
              onClick={() => handleNav('/national-map')}
              className="text-xs font-mono font-bold text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore GIS Map Layer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* GIS Leaflet Map Preview */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-2 rounded-xs shadow-xl relative">
              {/* Map Style Selector Toggle Overlay */}
              <div className="absolute top-4 right-4 z-20 flex items-center bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-xs p-1 text-[10px] font-mono text-white shadow-md space-x-1">
                <button
                  onClick={() => setPreviewMapStyle('standard')}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    previewMapStyle === 'standard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  STANDARD
                </button>
                <button
                  onClick={() => setPreviewMapStyle('dark')}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    previewMapStyle === 'dark' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DARK
                </button>
              </div>

              <div className="h-72 w-full rounded-xs overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={3}
                  minZoom={2}
                  maxZoom={18}
                  worldCopyJump={true}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  style={{ width: '100%', height: '100%' }}
                >
                  {previewMapStyle === 'standard' ? (
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                      maxZoom={18}
                      maxNativeZoom={18}
                    />
                  ) : (
                    <>
                      <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={18}
                        maxNativeZoom={16}
                      />
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={18}
                        maxNativeZoom={16}
                      />
                    </>
                  )}
                  <Marker position={[19.9975, 73.7898]} icon={redIcon} />
                  <Marker position={[26.8467, 80.9462]} icon={redIcon} />
                  <Marker position={[25.5941, 85.1376]} icon={redIcon} />
                </MapContainer>
              </div>
            </div>

            {/* State Concentration Table + Supporting Infrastructure Imagery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xs divide-y divide-slate-800 font-mono text-xs shadow-xl">
                <div className="p-3 bg-slate-950 font-bold text-slate-300 flex justify-between">
                  <span>STATE JURISDICTION</span>
                  <span>AT-RISK CORRIDORS</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-bold text-white">Maharashtra</span>
                  <span className="font-bold text-red-400">142 at-risk projects</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-bold text-white">Uttar Pradesh</span>
                  <span className="font-bold text-red-400">116 at-risk projects</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-bold text-white">Bihar</span>
                  <span className="font-bold text-red-400">98 at-risk projects</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-bold text-white">Odisha</span>
                  <span className="font-bold text-amber-400">64 at-risk projects</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-bold text-white">Karnataka</span>
                  <span className="font-bold text-amber-400">51 at-risk projects</span>
                </div>
              </div>

              {/* SECOND SUPPORTING INFRASTRUCTURE SURVEY VISUAL */}
              <div className="relative rounded-xs overflow-hidden border border-slate-800 shadow-lg group font-mono text-xs">
                <img
                  src="https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80"
                  alt="Infrastructure Corridor Aerial Survey"
                  className="w-full h-32 object-cover object-center filter brightness-90 contrast-105 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-slate-200">
                  <span className="font-bold text-slate-100 uppercase tracking-wider">CADASTRAL FIELD SURVEY</span>
                  <span className="text-blue-400 font-bold">&bull; SECTOR REGISTRY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRIMARY DELAY DRIVERS ANALYSIS */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
              ANALYTICAL BREAKDOWN
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight font-sans mt-1">
              PRIMARY ACQUISITION DELAY DRIVERS
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical distribution of key parameters contributing to schedule slippage across monitored projects.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xs divide-y divide-slate-800 text-xs px-5">
            {delayDrivers.map((item) => (
              <div key={item.driver} className="py-3.5 flex items-center justify-between">
                <span className="font-semibold text-slate-200 font-sans">{item.driver}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-36 sm:w-56 h-2 bg-slate-950 rounded-xs overflow-hidden hidden sm:block">
                    <div className="h-full bg-blue-500 rounded-xs" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="font-bold text-white font-mono text-sm">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: PROJECTS REQUIRING ATTENTION TABLE */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                EXECUTIVE SUMMARY
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans mt-1">
                PROJECTS REQUIRING IMMEDIATE ATTENTION
              </h2>
            </div>
            <button
              onClick={() => handleNav('/projects')}
              className="text-xs font-mono font-bold text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View Full Directory &rarr;</span>
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xs overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 font-mono text-[10px] text-slate-400 uppercase">
                  <th className="py-3 px-4">PROJECT ID &amp; NAME</th>
                  <th className="py-3 px-4">LOCATION</th>
                  <th className="py-3 px-4 text-center">RISK SCORE</th>
                  <th className="py-3 px-4 text-center">TREND</th>
                  <th className="py-3 px-4 text-center">PREDICTED DELAY</th>
                  <th className="py-3 px-4">PRIMARY BOTTLENECK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {priorityProjects.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleNav(`/projects/${row.id}`)}
                    className="hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-400 block text-xs">{row.id}</span>
                      <span className="font-bold text-white block text-xs">{row.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{row.location}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400 text-sm">{row.risk}%</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">{row.trend}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">{row.delay}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{row.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: EXPLORE KSHETRA FINAL ENTRY POINT */}
        <section className="p-8 bg-slate-900/90 border border-slate-800 text-white rounded-xs space-y-4 text-center shadow-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xs text-[11px] font-mono text-blue-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>EXECUTIVE DISPATCH &bull; SIH26017</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-mono">
            EXPLORE KSHETRA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-sans">
            Move from national visibility to project-level predictive intelligence.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono font-bold">
            <button
              onClick={() => handleNav('/command-center')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xs cursor-pointer shadow-md transition-colors uppercase tracking-wider"
            >
              View National Situation &rarr;
            </button>
            <button
              onClick={() => handleNav('/projects')}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs cursor-pointer transition-colors uppercase"
            >
              Explore Projects &rarr;
            </button>
          </div>
        </section>
      </div>

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className="relative z-10 bg-slate-950 text-slate-300 py-12 px-4 md:px-12 font-mono text-xs border-t border-slate-800 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800 pb-8">
          {/* Branding Left */}
          <div className="md:col-span-5 space-y-3">
            <LandXLogo size="md" lightMode={true} showWordmark={true} className="w-[130px]" />
            <div className="text-xs text-slate-300 font-sans">
              Land Acquisition &amp; Infrastructure Intelligence Platform
            </div>
            <div className="text-[11px] text-slate-400">
              Government Operations Platform &bull; SIH 2026 Prototype
            </div>
          </div>

          {/* Nav Links Center */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              PORTAL NAVIGATION
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleNav('/command-center')} className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer">
                National Situation
              </button>
              <button onClick={() => handleNav('/national-map')} className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer">
                National Map
              </button>
              <button onClick={() => handleNav('/projects')} className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer">
                Projects Directory
              </button>
              <button onClick={() => handleNav('/early-warning')} className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer">
                Early Warnings
              </button>
              <button onClick={() => handleNav('/interventions')} className="text-left text-slate-300 hover:text-white transition-colors cursor-pointer">
                Actions Center
              </button>
              <button onClick={() => navigate('/login')} className="text-left text-blue-400 font-bold hover:underline cursor-pointer">
                Officer Login
              </button>
            </div>
          </div>

          {/* Security & Disclaimer Right */}
          <div className="md:col-span-3 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Operational Security</span>
            </div>
            <p className="leading-relaxed">
              Authorized personnel access protected under SIH 2026 prototype governance policy.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>&copy; 2026 KSHETRA &bull; National Infrastructure Intelligence Platform (Prototype)</span>
          <span>SIH26017 Government Architecture</span>
        </div>
      </footer>
    </div>
  );
};
