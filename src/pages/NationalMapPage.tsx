import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { calculateProjectRisk } from '../services/predictionService';
import type { RiskCategory, Project } from '../types';
import { ArrowRight, RefreshCw, TrendingUp, X, Search, Filter } from 'lucide-react';

// Restrained Colored Circle Marker Generator with 32px Touch Target
function createCustomIcon(category: RiskCategory, isVelocityHigh: boolean) {
  let colorClass = 'bg-emerald-600 border-white shadow-md';
  let pulseClass = '';

  if (category === 'Critical' || isVelocityHigh) {
    colorClass = 'bg-red-600 border-white shadow-lg';
    pulseClass = 'animate-ping opacity-75 bg-red-500';
  } else if (category === 'High') {
    colorClass = 'bg-orange-500 border-white shadow-md';
  } else if (category === 'Medium') {
    colorClass = 'bg-amber-500 border-white shadow-md';
  }

  const htmlStr = `
    <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer pointer-events-auto">
      ${category === 'Critical' || isVelocityHigh ? `<span class="absolute w-6 h-6 rounded-full ${pulseClass} pointer-events-none"></span>` : ''}
      <div class="w-5 h-5 rounded-full ${colorClass} border-2 cursor-pointer pointer-events-auto shadow-xs hover:scale-125 transition-transform"></div>
    </div>
  `;

  return L.divIcon({
    html: htmlStr,
    className: 'custom-leaflet-marker cursor-pointer pointer-events-auto',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Controller to programmatic map pan/zoom
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface NationalMapPageProps {
  selectedState: string;
  setSelectedState: (s: string) => void;
}

const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.0, 68.0],
  [36.0, 97.5],
];

export const NationalMapPage: React.FC<NationalMapPageProps> = ({
  selectedState,
  setSelectedState,
}) => {
  const navigate = useNavigate();
  const { projects, warnings } = useApp();

  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('All');
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');

  // MAP STYLE BASEMAP SELECTOR: 'dark' (Default National Infrastructure GIS) | 'standard' | 'satellite' | 'terrain'
  const [basemapStyle, setBasemapStyle] = useState<'dark' | 'standard' | 'satellite' | 'terrain'>('dark');

  // Layer Toggle
  const showCorridors = true;

  // Selected project for Right-Side Slide-Over / Overlay Detail Panel
  const [activeProjectPanel, setActiveProjectPanel] = useState<{
    project: Project;
    prediction: ReturnType<typeof calculateProjectRisk>;
    warning?: (typeof warnings)[0];
  } | null>(null);

  // Map state view center & zoom
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);

  // Calculate risks for all projects dynamically
  const projectsWithRisk = projects.map((project) => ({
    project,
    prediction: calculateProjectRisk(project),
    warning: warnings.find((w) => w.projectId === project.id),
  }));

  // Handle state zoom hierarchy
  useEffect(() => {
    if (selectedState === 'Maharashtra') {
      setMapCenter([19.7515, 75.7139]);
      setMapZoom(7);
    } else if (selectedState === 'Bihar') {
      setMapCenter([25.5941, 85.1376]);
      setMapZoom(7);
    } else if (selectedState === 'Uttar Pradesh') {
      setMapCenter([26.8467, 80.9462]);
      setMapZoom(7);
    } else if (selectedState === 'Odisha') {
      setMapCenter([20.9517, 85.0985]);
      setMapZoom(7);
    } else if (selectedState === 'Karnataka') {
      setMapCenter([15.3173, 75.7139]);
      setMapZoom(7);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  }, [selectedState]);

  // Filter projects
  const filteredList = projectsWithRisk.filter(({ project, prediction }) => {
    if (selectedState !== 'All' && project.state !== selectedState) return false;
    if (selectedRiskLevel !== 'All' && prediction.riskCategory !== selectedRiskLevel) return false;
    if (
      mapSearchQuery.trim() &&
      !project.name.toLowerCase().includes(mapSearchQuery.toLowerCase()) &&
      !project.id.toLowerCase().includes(mapSearchQuery.toLowerCase()) &&
      !project.district.toLowerCase().includes(mapSearchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Highlighted Infrastructure Corridors across India
  const mumbaiNagpurCorridor: [number, number][] = [
    [19.0760, 72.8777], // Mumbai
    [19.2183, 72.9781], // Thane
    [19.9975, 73.7898], // Nashik (LA-1842 bottleneck)
    [20.7002, 77.0082], // Akola
    [20.9320, 77.7523], // Amravati
    [21.1458, 79.0882], // Nagpur
  ];

  const patnaGayaCorridor: [number, number][] = [
    [25.5941, 85.1376], // Patna
    [24.7955, 84.9994], // Gaya
  ];

  const bundelkhandCorridor: [number, number][] = [
    [26.8467, 80.9462], // Lucknow / Jalaun
    [25.1800, 79.6400], // Jhansi / Bundelkhand
  ];

  const bengaluruChennaiCorridor: [number, number][] = [
    [12.9716, 77.5946], // Bengaluru
    [12.9165, 79.1325], // Vellore
    [13.0827, 80.2707], // Chennai
  ];

  return (
    <div className="h-full w-full relative bg-slate-100 text-slate-900 overflow-hidden font-sans antialiased select-none">
      {/* TOP LEFT CONTROLS: SEARCH & RISK LEVEL FILTER */}
      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="w-64 sm:w-80 bg-white/95 backdrop-blur-md border border-slate-300 rounded shadow-md p-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search project / district (e.g. LA-1842)..."
            value={mapSearchQuery}
            onChange={(e) => setMapSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 border-none px-2 py-1 focus:outline-hidden font-medium"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-slate-300 p-1.5 rounded shadow-md text-xs font-mono flex items-center space-x-1.5 text-slate-800">
          <Filter className="w-3.5 h-3.5 text-blue-700" />
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 font-bold cursor-pointer focus:outline-hidden"
          >
            <option value="All">All Risk Levels ({filteredList.length})</option>
            <option value="Critical">Critical (≥80%)</option>
            <option value="High">High (60-79%)</option>
            <option value="Medium">Medium (40-59%)</option>
            <option value="Low">Low (&lt;40%)</option>
          </select>
        </div>
      </div>

      {/* TOP RIGHT CONTROLS: MAP STYLE SELECTOR & SPATIAL RISK LEGEND */}
      <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-2">
        {/* COMPACT MAP STYLE SELECTOR */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 p-1.5 rounded shadow-md text-xs font-mono flex items-center space-x-1.5 text-slate-800">
          <span className="font-bold text-[10px] text-slate-500 uppercase">MAP STYLE</span>
          <select
            value={basemapStyle}
            onChange={(e) => setBasemapStyle(e.target.value as 'standard' | 'satellite' | 'terrain' | 'dark')}
            className="bg-slate-50 border border-slate-300 text-slate-800 rounded px-2 py-1 font-bold cursor-pointer focus:outline-hidden"
          >
            <option value="standard">Standard</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* SPATIAL RISK LEGEND OVERLAY */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 p-2 rounded shadow-md text-[11px] font-mono flex items-center space-x-3 text-slate-800 font-bold">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>LOW</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>MEDIUM</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>HIGH</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>CRITICAL</span>
          </span>
        </div>
      </div>

      {/* BOTTOM RIGHT RESET CONTROL */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
        <button
          onClick={() => {
            setSelectedState('All');
            setSelectedRiskLevel('All');
            setMapSearchQuery('');
            setActiveProjectPanel(null);
          }}
          className="px-3 py-1.5 bg-white/95 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs rounded font-bold shadow-md flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-800" />
          <span>Reset View</span>
        </button>
      </div>

      {/* FULL VIEWPORT LEAFLET MAP CANVAS */}
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={4}
          maxZoom={12}
          maxBounds={INDIA_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />

          {/* 100% Free Open Basemaps (Zero API Keys Required) */}
          {basemapStyle === 'standard' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {basemapStyle === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {basemapStyle === 'terrain' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {basemapStyle === 'dark' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          )}

          {/* Highlighted National Infrastructure Corridor Lines */}
          {showCorridors && (
            <>
              <Polyline
                positions={mumbaiNagpurCorridor}
                pathOptions={{
                  color: basemapStyle === 'dark' ? '#60a5fa' : '#2563eb',
                  weight: 4,
                  opacity: 0.8,
                  dashArray: '8, 8',
                }}
              />
              <Polyline
                positions={patnaGayaCorridor}
                pathOptions={{
                  color: basemapStyle === 'dark' ? '#f59e0b' : '#d97706',
                  weight: 3.5,
                  opacity: 0.8,
                  dashArray: '6, 6',
                }}
              />
              <Polyline
                positions={bundelkhandCorridor}
                pathOptions={{
                  color: basemapStyle === 'dark' ? '#ef4444' : '#dc2626',
                  weight: 3.5,
                  opacity: 0.8,
                  dashArray: '6, 6',
                }}
              />
              <Polyline
                positions={bengaluruChennaiCorridor}
                pathOptions={{
                  color: basemapStyle === 'dark' ? '#3b82f6' : '#1d4ed8',
                  weight: 3.5,
                  opacity: 0.8,
                  dashArray: '6, 6',
                }}
              />
            </>
          )}

          {filteredList.map((item) => {
            const { project, prediction, warning } = item;
            const isVelocityHigh = warning ? warning.riskVelocityPoints > 15 : false;

            return (
              <Marker
                key={project.id}
                position={[project.lat, project.lng]}
                icon={createCustomIcon(prediction.riskCategory, isVelocityHigh)}
                interactive={true}
                eventHandlers={{
                  click: (e) => {
                    if (e.originalEvent) {
                      e.originalEvent.stopPropagation();
                    }
                    setActiveProjectPanel(item);
                  },
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* SELECTED PROJECT INTELLIGENCE PANEL (SLIDE-OVER / OVERLAY ON MARKER CLICK) */}
      {activeProjectPanel && (
        <div className="absolute top-0 right-0 bottom-0 z-30 w-80 md:w-96 bg-slate-950 text-white border-l border-slate-800 p-6 shadow-2xl space-y-5 overflow-y-auto font-sans animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-sm font-bold text-blue-400">
              {activeProjectPanel.project.id}
            </span>
            <button
              onClick={() => setActiveProjectPanel(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              {activeProjectPanel.project.name}
            </h2>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {activeProjectPanel.project.district}, {activeProjectPanel.project.state}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded">
              <span className="text-[10px] text-slate-400 block uppercase">DELAY RISK</span>
              <span className="text-2xl font-black text-red-400">
                {activeProjectPanel.prediction.riskScorePercent}%
              </span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-400 block uppercase">EXPECTED DELAY</span>
              <span className="text-xl font-bold text-slate-200">
                +{activeProjectPanel.prediction.predictedDelayDays} DAYS
              </span>
            </div>
          </div>

          {/* Primary Driver & Bottleneck */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">PRIMARY BOTTLENECK:</span>
              <span className="text-amber-400 font-bold text-sm block">
                {activeProjectPanel.project.recommendedIntervention.primaryDriver}
              </span>
              <span className="text-slate-300 text-[11px] block mt-1">
                38% beneficiary records unresolved
              </span>
            </div>

            {/* Recommended Action */}
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1">
              <span className="text-[10px] text-blue-400 font-mono font-bold uppercase block">RECOMMENDED ACTION:</span>
              <span className="text-slate-200 text-xs font-semibold block">
                Deploy beneficiary-bank reconciliation camp Nashik Tehsil.
              </span>
            </div>

            {activeProjectPanel.warning && (
              <div className="flex justify-between p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px]">
                <span className="text-slate-400">RISK VELOCITY</span>
                <span className="text-red-400 font-bold flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{activeProjectPanel.warning.riskVelocityPoints} pts / {activeProjectPanel.warning.riskVelocityDays}d</span>
                </span>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <button
            onClick={() => navigate(`/projects/${activeProjectPanel.project.id}`)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>OPEN PROJECT INTELLIGENCE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
