import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

function Navigation({ token, onLogout }) {
  const location = useLocation();
  
  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-brand">
        <ShieldAlert size={28} color="var(--primary-color)" />
        Incident Reporting
      </Link>
      <div className="nav-links">
        <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>Report Issue</Link>
        {token && (
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LayoutDashboard size={18} />
              Dashboard
            </span>
          </Link>
        )}
        {!token ? (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogIn size={18} /> Login
              </span>
            </Link>
            <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserPlus size={18} /> Sign Up
              </span>
            </Link>
          </>
        ) : (
          <button onClick={onLogout} className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={18} /> Logout
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  return (
    <Router>
      <div className="app-container">
        <Navigation token={token} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage token={token} />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/login" element={<LoginPage setToken={setToken} />} />
            <Route path="/signup" element={<SignupPage setToken={setToken} />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute token={token}>
                  <DashboardPage token={token} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
