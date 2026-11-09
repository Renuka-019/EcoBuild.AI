import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SolutionsLibraryPage } from './pages/SolutionsLibraryPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { AddNewBuildingPage } from './pages/AddNewBuildingPage';
import { MyBuildingsPage } from './pages/MyBuildingsPage';
import { BuildingAnalysisPage } from './pages/BuildingAnalysisPage';
import { DetailedAnalysisPage } from './pages/DetailedAnalysisPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CompareDesignsPage } from './pages/CompareDesignsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { CostSavingsPage } from './pages/CostSavingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { BenchmarkExplorerPage } from './pages/BenchmarkExplorerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/solutions" element={<SolutionsLibraryPage />} />
              <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Authenticated Application Workspace */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/buildings" element={<ProtectedRoute><MyBuildingsPage /></ProtectedRoute>} />
              <Route path="/buildings/new" element={<ProtectedRoute><AddNewBuildingPage /></ProtectedRoute>} />
              <Route path="/analyze/:id" element={<ProtectedRoute><BuildingAnalysisPage /></ProtectedRoute>} />
              <Route path="/analysis/:id" element={<ProtectedRoute><DetailedAnalysisPage /></ProtectedRoute>} />
              <Route path="/recommendations/:analysisId" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><CompareDesignsPage /></ProtectedRoute>} />
              <Route path="/simulator" element={<ProtectedRoute><SimulatorPage /></ProtectedRoute>} />
              <Route path="/cost-savings" element={<ProtectedRoute><CostSavingsPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/benchmarks" element={<ProtectedRoute><BenchmarkExplorerPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
