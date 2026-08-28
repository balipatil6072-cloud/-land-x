import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRight, MapPin } from 'lucide-react';
import { LandXLogo } from '../components/common/LandXLogo';

// Restrained Marker Icon
const redIcon = L.divIcon({
  html: '<div class="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>',
  className: 'custom-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Development diagnostic for visual inspection & network trace
    console.log(
      "LAND-X SIH26017 HERO VIDEO SOURCE:",
      "/videos/land-x-sih26017-hero.mp4?v=sih26017-final"
    );

    // Detect user accessibility prefers-reduced-motion setting
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
    { driver: 'Compensation', pct: 38 },
    { driver: 'Legal disputes', pct: 24 },
    { driver: 'Documentation', pct: 19 },
    { driver: 'Pending approvals', pct: 11 },
    { driver: 'Rehabilitation & resettlement (R&R)', pct: 8 },
  ];

  // Process Workflow Data
  const processWorkflow = [
    { step: '01', title: 'PROJECT DATA', desc: 'Historical + current acquisition information' },
    { step: '02', title: 'RISK DETECTION', desc: 'Identify projects entering elevated-risk trajectories' },
    { step: '03', title: 'DELAY PREDICTION', desc: 'Estimate probability and expected delay duration' },
    { step: '04', title: 'CAUSE IDENTIFICATION', desc: 'Explain the factors driving the prediction' },
    { step: '05', title: 'INTERVENTION RECOMMENDATION', desc: 'Suggest where administrative attention may be required' },
  ];

  return (
    <div className="relative w-screen min-h-screen bg-slate-950 text-white font-sans antialiased select-none overflow-x-hidden">
      {/* SINGLE SHARED FIXED HERO VIDEO BACKGROUND LAYER ACROSS ENTIRE PAGE FOR CONTINUITY */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Poster image fallback */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 z-0 ${
            videoLoaded && !videoError && !prefersReducedMotion ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url('/images/land-x-sih26017-hero-poster.jpg?v=sih26017-final')`,
          }}
        />

        {/* Layer 1: Dedicated Kapwing/SIH26017 Hero Video Source */}
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
            className="absolute inset-0 w-full h-full object-cover object-center z-10 opacity-[0.38] filter brightness-80 saturate-80"
          >
            <source
              src="/videos/land-x-sih26017-hero.mp4?v=sih26017-final"
              type="video/mp4"
            />
          </video>
        )}

        {/* Layer 2: Dark Navy Gradient Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(3,8,20,0.68) 0%, rgba(3,8,20,0.42) 50%, rgba(3,8,20,0.20) 100%)',
          }}
        />
      </div>

      {/* 100% PRESERVED HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* HERO HEADER BAR */}
        <header className="relative z-30 p-6 md:px-12 md:py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/command-center')}>
            <LandXLogo size="md" lightMode={true} showWordmark={false} />
            <div>
              <span className="font-mono text-base font-black tracking-widest text-white block leading-none">
                LAND-X
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                National Land Acquisition Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <button onClick={() => navigate('/')} className="text-white transition-colors cursor-pointer font-bold border-b border-blue-500 pb-0.5">
              Home
            </button>
            <button onClick={() => navigate('/command-center')} className="hover:text-white transition-colors cursor-pointer">
              Situation
            </button>
            <button onClick={() => navigate('/national-map')} className="hover:text-white transition-colors cursor-pointer">
              Map
            </button>
            <button onClick={() => navigate('/projects')} className="hover:text-white transition-colors cursor-pointer">
              Projects
            </button>
            <button onClick={() => navigate('/early-warning')} className="hover:text-white transition-colors cursor-pointer">
              Warnings
            </button>
            <button onClick={() => navigate('/interventions')} className="hover:text-white transition-colors cursor-pointer">
              Actions
            </button>
          </nav>

          <button
            onClick={() => navigate('/command-center')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>ENTER NATIONAL SITUATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* HERO MAIN CONTENT AREA */}
        <main className="relative z-30 px-6 md:px-12 max-w-7xl mx-auto w-full my-auto flex flex-col md:flex-row items-center justify-between gap-12 py-12">
          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[11px] font-mono font-semibold text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>NATIONAL LAND ACQUISITION INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              See the land bottleneck<br />
              before the project stops.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Predict acquisition delays, identify what is causing them, intervene early, and verify whether the intervention worked.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate('/command-center')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>ENTER NATIONAL SITUATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/national-map')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>EXPLORE NATIONAL MAP</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-72 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded p-4 shadow-2xl space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-blue-400">LA-1842</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] font-bold border border-red-800">
                  CRITICAL
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  NASHIK, MAHARASHTRA
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Mumbai–Nagpur Infrastructure Corridor
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400 text-[10px]">DELAY RISK</span>
                <span className="text-lg font-black text-red-400">92%</span>
              </div>

              <div className="text-[11px] text-slate-300 font-medium">
                <strong className="text-slate-400 block text-[10px] uppercase font-mono">PRIMARY BOTTLENECK</strong>
                <span>Compensation (38% beneficiary records unresolved)</span>
              </div>

              <button
                onClick={() => navigate('/projects/LA-1842')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <span>INSPECT PROJECT</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </main>

        {/* HERO FOOTER STATUS LINE */}
        <footer className="relative z-30 border-t border-white/10 bg-[rgba(5,12,28,0.78)] backdrop-blur-md py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-4 sm:space-x-6 text-[11px] tracking-wide">
              <span className="flex items-center space-x-1.5">
                <strong className="text-white font-bold text-xs">4,286</strong>
                <span className="text-slate-400 uppercase">PROJECTS MONITORED</span>
              </span>
              <span className="text-slate-700">&bull;</span>
              <span className="flex items-center space-x-1.5">
                <strong className="text-amber-400 font-bold text-xs">618</strong>
                <span className="text-slate-400 uppercase">AT RISK</span>
              </span>
              <span className="text-slate-700">&bull;</span>
              <span className="flex items-center space-x-1.5">
                <strong className="text-red-400 font-bold text-xs">147</strong>
                <span className="text-slate-400 uppercase">CRITICAL</span>
              </span>
              <span className="text-slate-700">&bull;</span>
              <span className="flex items-center space-x-1.5">
                <strong className="text-blue-400 font-bold text-xs">28</strong>
                <span className="text-slate-400 uppercase">STATES</span>
              </span>
            </div>

            <div className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase">
              SYNTHETIC DEMONSTRATION ENVIRONMENT &bull; SIH26017 &bull; DEPARTMENT OF LAND RESOURCES
            </div>
          </div>
        </footer>
      </section>

      {/* CONTINUOUS VISUAL ATMOSPHERE FOR EXPANSION SECTIONS BELOW HERO */}
      <div className="relative z-10 bg-slate-950/85 backdrop-blur-xs text-slate-100 w-full space-y-16 py-16 px-6 md:px-12 max-w-7xl mx-auto font-sans">
        {/* SECTION 1: NATIONAL RISK SNAPSHOT */}
        <section className="space-y-4 border-b border-slate-800 pb-12">
          <div>
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
              NATIONAL MONITORING PORTFOLIO
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              NATIONAL LAND ACQUISITION STATUS
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Predictive view of land-acquisition projects across India.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xs p-4 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-xs">
              <div className="px-4 py-2 first:pl-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">TOTAL MONITORED</span>
                <span className="text-2xl font-bold text-white block mt-1">4,286</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">AT RISK</span>
                <span className="text-2xl font-bold text-amber-400 block mt-1">618</span>
              </div>
              <div className="px-4 py-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">CRITICAL</span>
                <span className="text-2xl font-bold text-red-400 block mt-1">147</span>
              </div>
              <div className="px-4 py-2 last:pr-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">PREDICTED DELAY EXPOSURE</span>
                <span className="text-2xl font-bold text-white block mt-1">+18,420 DAYS</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHERE RISK IS CONCENTRATED */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              WHERE IS RISK CONCENTRATED?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identify geographic concentrations of potential acquisition delay.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Reused Leaflet Map Preview */}
            <div className="space-y-3">
              <div className="h-64 w-full bg-slate-900 border border-slate-800 rounded-xs relative overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={4}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                  />
                  <Marker position={[19.9975, 73.7898]} icon={redIcon} />
                  <Marker position={[26.8467, 80.9462]} icon={redIcon} />
                  <Marker position={[25.5941, 85.1376]} icon={redIcon} />
                </MapContainer>
              </div>

              <div className="text-right">
                <button
                  onClick={() => navigate('/national-map')}
                  className="text-xs font-mono font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  View national map &rarr;
                </button>
              </div>
            </div>

            {/* Right: State Concentration List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xs divide-y divide-slate-800 font-mono text-xs">
              <div className="p-3 bg-slate-950/90 font-bold text-slate-300 flex justify-between">
                <span>STATE</span>
                <span>AT-RISK CORRIDORS</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-white">Maharashtra</span>
                <span className="font-bold text-red-400">142 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-white">Uttar Pradesh</span>
                <span className="font-bold text-red-400">116 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-white">Bihar</span>
                <span className="font-bold text-red-400">98 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-white">Odisha</span>
                <span className="font-bold text-amber-400">64 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-semibold text-white">Karnataka</span>
                <span className="font-bold text-amber-400">51 at-risk projects</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: WHY PROJECTS ARE AT RISK */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                WHY PROJECTS ARE AT RISK
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand the factors contributing to predicted acquisition delays.
              </p>
            </div>

            <button
              onClick={() => navigate('/command-center')}
              className="text-xs font-mono font-bold text-blue-400 hover:underline cursor-pointer"
            >
              Explore delay drivers &rarr;
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xs divide-y divide-slate-800 text-xs px-5">
            {delayDrivers.map((item) => (
              <div key={item.driver} className="py-3.5 flex items-center justify-between">
                <span className="font-semibold text-slate-200 font-sans">{item.driver}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 sm:w-48 h-1.5 bg-slate-950 rounded-xs overflow-hidden hidden sm:block">
                    <div className="h-full bg-blue-500 rounded-xs" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="font-bold text-white font-mono text-sm">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: FROM REPORTING TO PREDICTION */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              FROM REPORTING TO PREDICTION
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              LAND-X shifts land-acquisition monitoring from reactive reporting to proactive intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {processWorkflow.map((item) => (
              <div key={item.step} className="p-4 bg-slate-900/90 border border-slate-800 rounded-xs space-y-2">
                <div className="font-mono text-xs font-bold text-blue-400 border-b border-slate-800 pb-1">
                  {item.step} &bull; {item.title}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: PROJECTS REQUIRING ATTENTION */}
        <section className="space-y-6 border-b border-slate-800 pb-12">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                PROJECTS REQUIRING ATTENTION
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Projects showing the strongest indicators of potential delay.
              </p>
            </div>

            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-mono font-bold text-blue-400 hover:underline cursor-pointer"
            >
              View all projects &rarr;
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <th className="py-2.5 px-4">PROJECT</th>
                  <th className="py-2.5 px-4">LOCATION</th>
                  <th className="py-2.5 px-4 text-center">RISK</th>
                  <th className="py-2.5 px-4 text-center">TREND</th>
                  <th className="py-2.5 px-4 text-center">PREDICTED DELAY</th>
                  <th className="py-2.5 px-4">PRIMARY DRIVER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {priorityProjects.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/projects/${row.id}`)}
                    className="hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-400 block">{row.id}</span>
                      <span className="font-semibold text-white block text-[11px]">{row.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{row.location}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-red-400 text-sm">{row.risk}%</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-red-400">{row.trend}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">{row.delay}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{row.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: EXPLORE LAND-X (FINAL ENTRY POINT) */}
        <section className="p-8 bg-slate-900/90 border border-slate-800 text-white rounded-xs space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight uppercase font-mono">
            EXPLORE LAND-X
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Move from national visibility to project-level intelligence.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono font-bold">
            <button
              onClick={() => navigate('/command-center')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xs cursor-pointer shadow-md transition-colors"
            >
              View National Situation &rarr;
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs cursor-pointer transition-colors"
            >
              Explore Projects &rarr;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
