import { useState, useRef } from 'react';
import { Camera, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    description: '',
    isUrgent: false,
    photoUrl: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitSuccess(true);
      setFormData({
        type: '',
        location: '',
        description: '',
        isUrgent: false,
        photoUrl: null
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setError('An error occurred while submitting your report. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Report an Incident</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Help us keep the environment safe by reporting any issues or suspicious activities.
      </p>

      {submitSuccess && (
        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 />
          Report submitted successfully! Thank you.
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="type">Type of Activity *</label>
          <select 
            id="type" 
            name="type" 
            className="form-control" 
            value={formData.type} 
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select the type of incident</option>
            <option value="Unattended Bag">Unattended Bag</option>
            <option value="Broken Lock/Door">Broken Lock/Door</option>
            <option value="Unauthorized Person">Unauthorized Person</option>
            <option value="Maintenance Issue">Maintenance Issue</option>
            <option value="Safety Hazard">Safety Hazard</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">Location *</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            className="form-control" 
            placeholder="E.g., North Wing Entrance, 2nd Floor Hallway"
            value={formData.location} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Detailed Description *</label>
          <textarea 
            id="description" 
            name="description" 
            className="form-control" 
            placeholder="Describe what you saw in detail..."
            value={formData.description} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photo Upload (Optional)</label>
          <div 
            className="photo-upload-area" 
            onClick={() => fileInputRef.current.click()}
          >
            {formData.photoUrl ? (
              <div>
                <img src={formData.photoUrl} alt="Preview" className="photo-preview" />
                <p style={{ marginTop: '0.5rem', color: 'var(--primary-color)' }}>Click to change photo</p>
              </div>
            ) : (
              <div>
                <Camera size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>Click to snap a photo or upload an image</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handlePhotoUpload} 
            />
          </div>
        </div>

        <div className="form-group checkbox-group" style={{ marginBottom: '2rem' }}>
          <input 
            type="checkbox" 
            id="isUrgent" 
            name="isUrgent" 
            checked={formData.isUrgent} 
            onChange={handleChange}
          />
          <label htmlFor="isUrgent" style={{ fontWeight: 600, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertTriangle size={18} />
            This is an urgent situation (Emergency)
          </label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (
            <>
              <Send size={18} />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
