import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import OfficerDashboard from "./pages/officer/OfficerDashboard.tsx";
import ClaimDetail from "./pages/officer/ClaimDetail";
import Analytics from "./pages/officer/Analytics";
import Reports from "./pages/officer/Reports";

import CitizenHome from "./pages/citizen/CitizenHome";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Officer */}
      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRole="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer/claim/:id"
        element={
          <ProtectedRoute allowedRole="officer">
            <ClaimDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer/analytics"
        element={
          <ProtectedRoute allowedRole="officer">
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer/reports"
        element={
          <ProtectedRoute allowedRole="officer">
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Citizen */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;