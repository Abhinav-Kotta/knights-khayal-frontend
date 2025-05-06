// File: src/pages/MemberForm.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL ='/api';

interface MemberFormData {
  name: string;
  instrument: string;
  bio: string;
  isCaptain: boolean;
  order: number;
  active: boolean;
}

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    instrument: '',
    bio: '',
    isCaptain: false,
    order: 999,
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

    // If editing, fetch the existing member data
    if (isEditMode) {
      const fetchMember = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/admin/members`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const members = response.data;
          const member = members.find((m: any) => m._id === id);
          
          if (member) {
            setFormData({
              name: member.name,
              instrument: member.instrument,
              bio: member.bio,
              isCaptain: member.isCaptain,
              order: member.order,
              active: member.active
            });
            
            setImagePreview(member.image.startsWith('http') ? member.image : `${API_URL}${member.image}`);
          } else {
            setError('Member not found');
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching member:', err);
          setError('Failed to load member data');
          setLoading(false);
          
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          }
        }
      };

      fetchMember();
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

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('instrument', formData.instrument);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('isCaptain', formData.isCaptain.toString());
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('active', formData.active.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      if (isEditMode) {
        // Update existing membe
        await axios.put(
          `${API_URL}/admin/members/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Member updated successfully');
      } else {
        // Create new member
        await axios.post(
          `${API_URL}/admin/members`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Member created successfully');
        
        // Reset form for new member creation
        setFormData({
          name: '',
          instrument: '',
          bio: '',
          isCaptain: false,
          order: 999,
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
      console.error('Error saving member:', err);
      setError('Failed to save member data. Please try again.');
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
        <h1>{isEditMode ? 'Edit Member' : 'Add New Member'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="instrument">Instrument/Role*</label>
            <input
              type="text"
              id="instrument"
              name="instrument"
              value={formData.instrument}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio*</label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isCaptain"
                checked={formData.isCaptain}
                onChange={handleCheckboxChange}
              />
              Captain
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="order">Display Order</label>
            <input
              type="number"
              id="order"
              name="order"
              min="1"
              value={formData.order}
              onChange={handleNumberChange}
            />
            <small>Lower numbers appear first</small>
          </div>
          
          {isEditMode && (
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleCheckboxChange}
                />
                Active Member
              </label>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="image">Profile Image*</label>
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
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;