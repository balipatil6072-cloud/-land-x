import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { NationalMapPage } from './pages/NationalMapPage';
import { ProjectExplorerPage } from './pages/ProjectExplorerPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { PredictionLabPage } from './pages/PredictionLabPage';
import { InterventionCenterPage } from './pages/InterventionCenterPage';
import { GovernancePage } from './pages/GovernancePage';
import { PlaceholderPage } from './pages/PlaceholderPage';

import { PredictiveIntelligencePage } from './pages/PredictiveIntelligencePage';

export function App() {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* KSHETRA Dark Geospatial Hero Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Core AI Predictive Capability Route */}
          <Route
            path="/predictive-intelligence"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <PredictiveIntelligencePage />
              </AppShell>
            }
          />

          {/* Main Enterprise Workspace Routes inside AppShell */}
          <Route
            path="/command-center"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <CommandCenterPage />
              </AppShell>
            }
          />

          <Route
            path="/national-map"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <NationalMapPage
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                />
              </AppShell>
            }
          />

          <Route
            path="/projects"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <ProjectExplorerPage
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </AppShell>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <ProjectDetailPage />
              </AppShell>
            }
          />

          {/* Early Warnings Routes (Supporting both singular and plural aliases) */}
          <Route
            path="/early-warning"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <EarlyWarningPage />
              </AppShell>
            }
          />

          <Route
            path="/early-warnings"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <EarlyWarningPage />
              </AppShell>
            }
          />

          {/* Predictive Scenario Intelligence Modules */}
          <Route
            path="/prediction-lab"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <PredictionLabPage />
              </AppShell>
            }
          />

          <Route
            path="/interventions"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <InterventionCenterPage />
              </AppShell>
            }
          />

          <Route
            path="/governance"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <GovernancePage />
              </AppShell>
            }
          />

          {/* Modular Future Capability Placeholders */}
          <Route
            path="/analytics"
            element={
              <AppShell
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              >
                <PlaceholderPage
                  title="Analytics & Insights"
                  description="Deep analytical breakdowns across state timelines, stage bottlenecks, and land valuation trends."
                />
              </AppShell>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
