import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowRight,
  MapPin,
  Lock,
  Building2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Globe,
  Compass,
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

  const handleNav = (targetPath: string) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased select-none flex flex-col justify-between">
      {/* 1. TOP UTILITY BAR (GOVERNMENT PORTAL STYLE) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono py-1.5 px-4 md:px-12 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold text-white tracking-wide uppercase">
            Government Operations Platform &bull; SIH 2026 Prototype
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-[10px]">
          <span className="text-slate-400 flex items-center space-x-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>National Infrastructure Cell</span>
          </span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-slate-400">English (India)</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-slate-400 flex items-center space-x-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>Portal Guidelines</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN INSTITUTIONAL HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs py-3.5 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Logo + Subtitle Lockup */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => handleNav('/command-center')}
          >
            <LandXLogo size="lg" lightMode={false} showWordmark={true} className="w-[125px] sm:w-[140px]" />
            <div className="hidden lg:block border-l border-slate-300 pl-4 py-0.5">
              <span className="font-mono font-bold text-xs text-slate-900 uppercase block tracking-wider leading-none">
                National Platform
              </span>
              <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                Land Acquisition &amp; Infrastructure Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono font-bold text-slate-700">
            <button
              onClick={() => navigate('/')}
              className="text-blue-700 font-bold border-b-2 border-blue-700 pb-0.5"
            >
              HOME
            </button>
            <button
              onClick={() => handleNav('/command-center')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              NATIONAL SITUATION
            </button>
            <button
              onClick={() => handleNav('/national-map')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              NATIONAL MAP
            </button>
            <button
              onClick={() => handleNav('/projects')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              PROJECTS
            </button>
            <button
              onClick={() => handleNav('/early-warning')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              WARNINGS
            </button>
            <button
              onClick={() => handleNav('/interventions')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              ACTIONS
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(isAuthenticated ? '/command-center' : '/login')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAuthenticated ? 'OFFICER WORKSPACE →' : 'GOVERNMENT OFFICER LOGIN →'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (GOVERNMENT PORTAL STYLE) */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16 px-4 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Core Institutional Message */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-xs text-[11px] font-mono font-bold text-blue-900 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <span>NATIONAL LAND ACQUISITION INTELLIGENCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-sans">
              Predict land acquisition delays.<br />
              <span className="text-blue-900">Act before infrastructure projects stop.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans max-w-2xl">
              KSHETRA helps government officers identify acquisition bottlenecks, assess delay risk, prioritize intervention, and monitor project progress across India.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => handleNav('/command-center')}
                className="px-6 py-3.5 bg-blue-800 hover:bg-blue-900 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xs shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <span>ENTER NATIONAL SITUATION →</span>
              </button>

              <button
                onClick={() => handleNav('/national-map')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono font-bold text-xs uppercase rounded-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-600" />
                <span>EXPLORE NATIONAL MAP</span>
              </button>
            </div>
          </div>

          {/* Right Column: Redesigned Government Alert Card (LA-1842) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-300 rounded-xs p-5 shadow-lg space-y-4 font-sans text-left relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-red-600" />
                  <span className="font-mono text-xs font-bold text-slate-900">PROJECT ALERT &bull; LA-1842</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-xs bg-red-100 text-red-800 font-mono text-[10px] font-bold border border-red-200 uppercase">
                  CRITICAL RISK
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Mumbai–Nagpur Infrastructure Corridor
                </h3>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  Nashik, Maharashtra &bull; Infrastructure Sector
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">DELAY RISK</span>
                  <span className="text-2xl font-black text-red-700">92%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">PROJECTED SLIP</span>
                  <span className="text-xl font-bold text-slate-900">+74 DAYS</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1 font-mono">
                <span className="text-[10px] font-bold text-amber-900 uppercase block">PRIMARY BOTTLENECK</span>
                <p className="font-sans text-slate-800 font-medium leading-snug">
                  Compensation (38% beneficiary records unresolved in Nashik Tehsil)
                </p>
              </div>

              <button
                onClick={() => handleNav('/projects/LA-1842')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>INSPECT PROJECT BRIEF &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NATIONAL LAND ACQUISITION MONITORING STATS BAR */}
      <section className="bg-slate-900 text-white py-8 px-4 md:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-mono text-center md:text-left gap-4 md:gap-0">
            <div className="px-4 py-2 first:pl-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PROJECTS MONITORED</span>
              <span className="text-3xl font-black text-white block mt-1">4,286</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Across 28 States &amp; UTs</span>
            </div>
            <div className="px-4 py-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">PROJECTS AT RISK</span>
              <span className="text-3xl font-black text-amber-400 block mt-1">618</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Delay probability &gt; 65%</span>
            </div>
            <div className="px-4 py-2">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">CRITICAL ATTENTION</span>
              <span className="text-3xl font-black text-red-400 block mt-1">147</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Immediate intervention required</span>
            </div>
            <div className="px-4 py-2 last:pr-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PREDICTED DELAY EXPOSURE</span>
              <span className="text-3xl font-black text-white block mt-1">+18,420 DAYS</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Cumulative schedule slippage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT KSHETRA SECTION */}
      <section className="py-14 px-4 md:px-12 bg-slate-50 border-b border-slate-200 text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest block">
              PLATFORM OVERVIEW
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              ABOUT KSHETRA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              KSHETRA is a land acquisition intelligence and monitoring platform designed to help authorities identify emerging acquisition bottlenecks before they become project delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xs shadow-2xs space-y-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xs flex items-center justify-center text-blue-800 font-mono font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-slate-900 text-sm uppercase">PREDICT</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Identify projects with rising delay probability before schedule benchmarks are breached.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xs shadow-2xs space-y-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xs flex items-center justify-center text-blue-800 font-mono font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-mono font-bold text-slate-900 text-sm uppercase">IDENTIFY</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Determine the primary acquisition bottlenecks (compensation, litigation, title disputes, clearances) affecting progress.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xs shadow-2xs space-y-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xs flex items-center justify-center text-blue-800 font-mono font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-mono font-bold text-slate-900 text-sm uppercase">INTERVENE</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Prioritize administrative actions, deploy targeted field camps, and monitor whether intervention reduces risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW KSHETRA SUPPORTS OFFICERS (4-STEP WORKFLOW) */}
      <section className="py-14 px-4 md:px-12 bg-white border-b border-slate-200 text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest block">
              OPERATIONAL METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              HOW KSHETRA SUPPORTS OFFICERS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item) => (
              <div key={item.step} className="bg-slate-50 border border-slate-200 p-5 rounded-xs space-y-3">
                <span className="text-2xl font-black font-mono text-blue-800 block">
                  {item.step}
                </span>
                <h3 className="font-mono font-bold text-slate-900 text-xs uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NATIONAL COVERAGE & GIS PREVIEW SECTION */}
      <section className="py-14 px-4 md:px-12 bg-slate-50 border-b border-slate-200 text-left">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest block">
                GEOSPATIAL MONITORING
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans mt-1">
                NATIONAL LAND ACQUISITION MONITORING
              </h2>
            </div>
            <button
              onClick={() => handleNav('/national-map')}
              className="text-xs font-mono font-bold text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore GIS Map Layer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* GIS Leaflet Map Preview */}
            <div className="lg:col-span-7 bg-white border border-slate-300 p-2 rounded-xs shadow-2xs">
              <div className="h-72 w-full rounded-xs overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={4}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; Esri World Street Map'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                  />
                  <Marker position={[19.9975, 73.7898]} icon={redIcon} />
                  <Marker position={[26.8467, 80.9462]} icon={redIcon} />
                  <Marker position={[25.5941, 85.1376]} icon={redIcon} />
                </MapContainer>
              </div>
            </div>

            {/* State Concentration Table */}
            <div className="lg:col-span-5 bg-white border border-slate-300 rounded-xs divide-y divide-slate-200 font-mono text-xs shadow-2xs">
              <div className="p-3 bg-slate-900 text-white font-bold flex justify-between">
                <span>STATE JURISDICTION</span>
                <span>AT-RISK CORRIDORS</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Maharashtra</span>
                <span className="font-bold text-red-700">142 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Uttar Pradesh</span>
                <span className="font-bold text-red-700">116 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Bihar</span>
                <span className="font-bold text-red-700">98 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Odisha</span>
                <span className="font-bold text-amber-700">64 at-risk projects</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="font-bold text-slate-900">Karnataka</span>
                <span className="font-bold text-amber-700">51 at-risk projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRIMARY DELAY DRIVERS ANALYSIS */}
      <section className="py-14 px-4 md:px-12 bg-white border-b border-slate-200 text-left">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest block">
              ANALYTICAL BREAKDOWN
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans mt-1">
              PRIMARY ACQUISITION DELAY DRIVERS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical distribution of key parameters contributing to schedule slippage across monitored projects.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xs divide-y divide-slate-200 text-xs px-5">
            {delayDrivers.map((item) => (
              <div key={item.driver} className="py-3.5 flex items-center justify-between">
                <span className="font-semibold text-slate-800 font-sans">{item.driver}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-36 sm:w-56 h-2 bg-slate-200 rounded-xs overflow-hidden hidden sm:block">
                    <div className="h-full bg-blue-800 rounded-xs" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-sm">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PROJECTS REQUIRING ATTENTION TABLE */}
      <section className="py-14 px-4 md:px-12 bg-slate-50 border-b border-slate-200 text-left">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-800 uppercase tracking-widest block">
                EXECUTIVE SUMMARY
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-sans mt-1">
                PROJECTS REQUIRING IMMEDIATE ATTENTION
              </h2>
            </div>
            <button
              onClick={() => handleNav('/projects')}
              className="text-xs font-mono font-bold text-blue-800 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View Full Directory &rarr;</span>
            </button>
          </div>

          <div className="bg-white border border-slate-300 rounded-xs overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">PROJECT ID &amp; NAME</th>
                  <th className="py-3 px-4">LOCATION</th>
                  <th className="py-3 px-4 text-center">RISK SCORE</th>
                  <th className="py-3 px-4 text-center">TREND</th>
                  <th className="py-3 px-4 text-center">PREDICTED DELAY</th>
                  <th className="py-3 px-4">PRIMARY BOTTLENECK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {priorityProjects.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleNav(`/projects/${row.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-800 block text-xs">{row.id}</span>
                      <span className="font-bold text-slate-900 block text-xs">{row.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{row.location}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-700 text-sm">{row.risk}%</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-700">{row.trend}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{row.delay}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 md:px-12 font-mono text-xs border-t border-slate-800 text-left">
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
