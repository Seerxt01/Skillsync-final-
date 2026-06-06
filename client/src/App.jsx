import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// ─── App.jsx — Route Configuration ───────────────────────────────────────────
// This is the root component. It sets up:
// 1. AuthProvider   → wraps everything so all components can access auth state
// 2. BrowserRouter  → enables React Router (URL-based navigation)
// 3. Routes         → maps URLs to page components
//
// Route types:
//   Public   → anyone can visit (/login, /signup)
//   Protected → only logged-in users (/dashboard) — wrapped in <ProtectedRoute>
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route → redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected route — ProtectedRoute checks if user is logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
