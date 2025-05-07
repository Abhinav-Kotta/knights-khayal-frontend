// File: src/pages/PerformanceForm.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// const API_URL ='/api';

interface PerformanceFormData {
  title: string;
  date: string;
  venue: string;
  city: string;
  description: string;
  ticketLink: string;
  active: boolean;
}

const PerformanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<PerformanceFormData>({
    title: '',
    date: '',
    venue: '',
    city: '',
    description: '',
    ticketLink: '',
    active: true
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // If editing, fetch the existing performance data
    if (isEditMode) {
      const fetchPerformance = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/admin/performances`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const performances = response.data;
          const performance = performances.find((p: any) => p._id === id);
          
          if (performance) {
            setFormData({
              title: performance.title,
              date: performance.date,
              venue: performance.venue,
              city: performance.city,
              description: performance.description,
              ticketLink: performance.ticketLink || '',
              active: performance.active
            });
            
            setImagePreview(performance.image.startsWith('http') ? performance.image : `${API_URL}${performance.image}`);
          } else {
            setError('Performance not found');
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching performance:', err);
          setError('Failed to load performance data');
          setLoading(false);
          
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          }
        }
      };

      fetchPerformance();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (!isEditMode && !imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Create form data for multipart/form-data (for image upload)
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('ticketLink', formData.ticketLink);
      formDataToSend.append('active', formData.active.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      if (isEditMode) {
        // Update existing performance
        await axios.put(
          `${API_URL}/admin/performances/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Performance updated successfully');
      } else {
        // Create new performance
        await axios.post(
          `${API_URL}/admin/performances`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Performance created successfully');
        
        // Reset form for new performance creation
        setFormData({
          title: '',
          date: '',
          venue: '',
          city: '',
          description: '',
          ticketLink: '',
          active: true
        });
        setImageFile(null);
        setImagePreview('');
      }
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving performance:', err);
      setError('Failed to save performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !imagePreview) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="member-form-page">
      <div className="admin-container">
        <h1>{isEditMode ? 'Edit Performance' : 'Add New Performance'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="venue">Venue*</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="ticketLink">Ticket Link</label>
            <input
              type="url"
              id="ticketLink"
              name="ticketLink"
              placeholder="https://tickets.example.com/show-name"
              value={formData.ticketLink}
              onChange={handleInputChange}
            />
            <small>Leave empty if tickets are not available yet</small>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleCheckboxChange}
              />
              Active Performance
            </label>
            <small>Inactive performances won't be displayed on the public website</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Performance Image*</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="file-input"
              {...(!isEditMode && { required: true })}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Performance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceForm;