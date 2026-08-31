import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
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
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public KSHETRA Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Government Officer Authentication Portal */}
            <Route path="/login" element={<LoginPage />} />

            {/* Core AI Predictive Capability Route */}
            <Route
              path="/predictive-intelligence"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <PredictiveIntelligencePage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Main Enterprise Workspace Routes inside AppShell (Protected) */}
            <Route
              path="/command-center"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <CommandCenterPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/national-map"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <ProjectDetailPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Early Warnings Routes (Protected) */}
            <Route
              path="/early-warning"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <EarlyWarningPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/early-warnings"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <EarlyWarningPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Predictive Scenario Intelligence Modules (Protected) */}
            <Route
              path="/prediction-lab"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <PredictionLabPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/interventions"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <InterventionCenterPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/governance"
              element={
                <ProtectedRoute>
                  <AppShell
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  >
                    <GovernancePage />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Modular Future Capability Placeholders (Protected) */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
