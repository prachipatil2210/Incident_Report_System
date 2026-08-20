import { Link } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, LogIn, UserPlus, AlertTriangle } from 'lucide-react';

export default function HomePage({ token }) {
  return (
    <div className="home-container">
      <div className="hero-section glass-panel">
        <ShieldAlert size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        <h1 className="hero-title">Incident Reporting System</h1>
        <p className="hero-subtitle">
          A secure and efficient platform to report, track, and manage security incidents in real-time.
        </p>
        
        <div className="hero-actions">
          <Link to="/report" className="btn btn-danger btn-lg">
            <AlertTriangle size={20} />
            Report an Incident
          </Link>
          
          {token ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <LayoutDashboard size={20} />
              Go to Dashboard
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-lg">
                <LogIn size={20} />
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-lg">
                <UserPlus size={20} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card glass-panel">
          <h3>Quick Reporting</h3>
          <p>Submit incident reports quickly with our intuitive form. Attach photos and provide detailed descriptions.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Real-time Tracking</h3>
          <p>Monitor the status of reported incidents as they are investigated and resolved by our security team.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Secure Platform</h3>
          <p>Your data is protected. Role-based access ensures that sensitive information is only available to authorized personnel.</p>
        </div>
      </div>
    </div>
  );
}
