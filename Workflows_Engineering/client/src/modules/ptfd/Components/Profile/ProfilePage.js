import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { BsPerson, BsBuilding, BsArrowRightCircle, BsCamera, BsPencilSquare, BsSave, BsXCircle, BsTrash, BsExclamationCircle } from 'react-icons/bs';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    employeeId: '',
    nic: '',
    phoneNumber: '',
    address: '',
    email: '',
    birthYear: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user token from localStorage (stable reference)
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Fetch user profile data (stable reference for useEffect)
  const fetchProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5050/api/users/profile', config);
      const userData = response.data;
      
      setProfileData({
        name: userData.name || '',
        age: userData.age || '',
        employeeId: userData.employeeId || '',
        nic: userData.nic || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        email: userData.email || '',
        birthYear: userData.birthYear || '',
        avatar: userData.avatar || ''
      });
      
      // Set avatar preview - handle both relative and absolute URLs
      if (userData.avatar) {
        if (userData.avatar.startsWith('http')) {
          setAvatarPreview(userData.avatar);
        } else {
          setAvatarPreview(`http://localhost:5050${userData.avatar}`);
        }
      } else {
        setAvatarPreview(''); // No avatar
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data');
    }
  }, [getToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.age) {
      newErrors.age = 'Age is required';
    } else if (!/^\d+$/.test(profileData.age) || parseInt(profileData.age) < 18 || parseInt(profileData.age) > 100) {
      newErrors.age = 'Please enter a valid age (18-100)';
    }
    
    if (!profileData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    if (!profileData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!/^[\d]{9}[vV]$|^[\d]{12}$/.test(profileData.nic)) {
      newErrors.nic = 'Please enter a valid NIC number';
    }
    
    if (!profileData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-()]+$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!profileData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!profileData.birthYear) {
      newErrors.birthYear = 'Birth year is required';
    } else if (!/^\d{4}$/.test(profileData.birthYear) || 
               parseInt(profileData.birthYear) < 1900 || 
               parseInt(profileData.birthYear) > new Date().getFullYear()) {
      newErrors.birthYear = 'Please enter a valid birth year';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      // Prepare form data
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('age', profileData.age);
      formData.append('employeeId', profileData.employeeId);
      formData.append('nic', profileData.nic);
      formData.append('phoneNumber', profileData.phoneNumber);
      formData.append('address', profileData.address);
      formData.append('email', profileData.email);
      formData.append('birthYear', profileData.birthYear);
      
      // Only append avatar if it's a file (not a string URL)
      if (profileData.avatar && typeof profileData.avatar !== 'string') {
        formData.append('avatar', profileData.avatar);
      }

      const response = await axios.put('http://localhost:5050/api/users/profile', formData, config);
      
      // Update user data in localStorage
      const userData = {
        name: response.data.name,
        email: response.data.email,
        id: response.data._id,
        avatar: response.data.avatar
      };
      
      // Handle avatar URL properly - add base URL if it's a relative path
      if (response.data.avatar && !response.data.avatar.startsWith('http')) {
        userData.avatar = `http://localhost:5050${response.data.avatar}`;
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      
      // Dispatch storage event to notify other components of the change
      window.dispatchEvent(new Event('storage'));
      
      // Update avatar preview if a new one was uploaded
      if (response.data.avatar) {
        if (response.data.avatar.startsWith('http')) {
          setAvatarPreview(response.data.avatar);
        } else {
          setAvatarPreview(`http://localhost:5050${response.data.avatar}`);
        }
      } else {
        setAvatarPreview(''); // No avatar
      }
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    fetchProfile();
    setErrors({});
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        await axios.delete('http://localhost:5050/api/users/profile', config);
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Dispatch storage event to notify other components of the change
        window.dispatchEvent(new Event('storage'));
        
        alert('Account deleted successfully');
        // Redirect to sign in or home
        window.location.href = '/signin';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="container-fluid py-5" style={{ background: 'linear-gradient(135deg, #f6f5f4 0%, #fdfcfb 100%)' }}>
      <Nav />
      {/* Hero Header Section */}
      <section className="container-fluid px-4 py-5" style={{
        background: 'linear-gradient(135deg, #fdfcfb 0%, #f8f7f4 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(107, 70, 193, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107, 70, 193, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="row justify-content-center position-relative">
          <div className="col-lg-10">
            <div className="text-center mb-5" style={{
              borderRadius: '24px',
              padding: '4rem 3rem',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 252, 251, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(107, 70, 193, 0.3)',
                  marginRight: '1rem'
                }}>
                  <BsPerson className="text-white fs-1" />
                </div>
                <div>
                  <h1 className="display-3 fw-bold mb-1" style={{
                    color: '#1a1a1a',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                  }}> Profile Management</h1>
                  <p className="h5 text-muted mb-0" style={{ fontWeight: '300' }}>
                    Curate your professional persona with sophisticated precision
                  </p>
                </div>
              </div>
              <p className="lead mb-4" style={{
                color: '#6b7280',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Update personal details, employment information, and contact data with precision in your construction management profile.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button onClick={() => navigate("/ptfd/projects")} className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold" style={{
                  borderRadius: '50px',
                  border: '2px solid #6B46C1',
                  color: '#6B46C1',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(107, 70, 193, 0.2)'
                }}>
                  <BsBuilding className="me-2" />View Projects
                </button>
                <button onClick={() => navigate("/ptfd/signin")} className="btn btn-primary btn-lg px-5 py-3 fw-semibold" style={{
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(107, 70, 193, 0.4)',
                  transition: 'all 0.3s ease'
                }}>
                  <BsArrowRightCircle className="me-2" />Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Container Section */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', background: 'linear-gradient(145deg, #f6f5f4, #fdfcfb)' }}>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4" style={{ color: '#6B46C1', borderBottom: '3px solid #f8f7f4', paddingBottom: '1rem', fontSize: '1.25rem' }}>
                    <BsCamera className="me-3 text-muted fs-5" /> Profile Photo
                  </h5>
                  <div className="row g-4 justify-content-center">
                    <div className="col-lg-4 text-center">
                      <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #6B46C1', boxShadow: '0 0 15px rgba(107, 70, 193, 0.4)', margin: '0 auto' }}>
                        <img 
                          src={avatarPreview || 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image'} 
                          alt="Profile" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image';
                          }}
                        />
                      </div>
                      {isEditing && (
                        <div className="mt-3">
                          <label htmlFor="avatar" className="btn btn-outline-secondary" style={{ borderRadius: '20px', fontWeight: '600' }}>
                            <BsCamera className="me-2" /> Change Photo
                          </label>
                          <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4" style={{ color: '#6B46C1', borderBottom: '3px solid #f8f7f4', paddingBottom: '1rem', fontSize: '1.25rem' }}>
                    <BsPerson className="me-3 text-muted fs-5" /> Personal Information
                  </h5>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.name ? 'border-danger' : ''}`}
                        placeholder="Enter your full name"
                        disabled={!isEditing}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.name && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.name}</small>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={profileData.age}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.age ? 'border-danger' : ''}`}
                        placeholder="Enter your age"
                        disabled={!isEditing}
                        min="18"
                        max="100"
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.age && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.age}</small>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Birth Year</label>
                      <input
                        type="number"
                        id="birthYear"
                        name="birthYear"
                        value={profileData.birthYear}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.birthYear ? 'border-danger' : ''}`}
                        placeholder="Enter your birth year"
                        disabled={!isEditing}
                        min="1900"
                        max={new Date().getFullYear()}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.birthYear && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.birthYear}</small>}
                    </div>
                  </div>
                </div>

                {/* Employment Info Section */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4" style={{ color: '#6B46C1', borderBottom: '3px solid #f8f7f4', paddingBottom: '1rem', fontSize: '1.25rem' }}>
                    <BsPerson className="me-3 text-muted fs-5" /> Employment Details
                  </h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Employee ID</label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={profileData.employeeId}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.employeeId ? 'border-danger' : ''}`}
                        placeholder="Enter your employee ID"
                        disabled={!isEditing}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.employeeId && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.employeeId}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>NIC Number</label>
                      <input
                        type="text"
                        id="nic"
                        name="nic"
                        value={profileData.nic}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.nic ? 'border-danger' : ''}`}
                        placeholder="Enter your NIC number"
                        disabled={!isEditing}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.nic && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.nic}</small>}
                    </div>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4" style={{ color: '#6B46C1', borderBottom: '3px solid #f8f7f4', paddingBottom: '1rem', fontSize: '1.25rem' }}>
                    <BsPerson className="me-3 text-muted fs-5" /> Contact Information
                  </h5>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Phone Number</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.phoneNumber ? 'border-danger' : ''}`}
                        placeholder="Enter your phone number"
                        disabled={!isEditing}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.phoneNumber && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.phoneNumber}</small>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className={`form-control py-3 ${errors.email ? 'border-danger' : ''}`}
                        placeholder="Enter your email address"
                        disabled={!isEditing}
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                        }}
                      />
                      {errors.email && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.email}</small>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>Address</label>
                      <textarea
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        className={`form-control ${errors.address ? 'border-danger' : ''}`}
                        placeholder="Enter your full address"
                        disabled={!isEditing}
                        rows="3"
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#fdfcfb',
                          border: '1px solid #e5e7eb',
                          fontSize: '1rem',
                          minHeight: '100px',
                        }}
                      />
                      {errors.address && <small className="text-danger d-block mt-1"><BsExclamationCircle className="me-1" /> {errors.address}</small>}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="text-end mb-5">
                  {!isEditing ? (
                    <button 
                      type="button" 
                      className="btn btn-lg px-5 py-3 fw-semibold"
                      onClick={handleEdit}
                      style={{
                        borderRadius: '50px',
                        background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 25px rgba(107, 70, 193, 0.4)',
                        transition: 'all 0.3s ease',
                        minWidth: '200px',
                      }}
                    >
                      <BsPencilSquare className="me-2" /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        type="submit" 
                        className="btn btn-lg px-5 py-3 fw-semibold me-3"
                        disabled={loading}
                        style={{
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '1.1rem',
                          boxShadow: '0 8px 25px rgba(107, 70, 193, 0.4)',
                          transition: 'all 0.3s ease',
                          minWidth: '200px',
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem' }}></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <BsSave className="me-2" /> Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-lg px-5 py-3 fw-semibold me-3"
                        onClick={handleCancel}
                        disabled={loading}
                        style={{
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #A0AEC0 0%, #718096 100%)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '1.1rem',
                          boxShadow: '0 8px 25px rgba(160, 174, 192, 0.4)',
                          transition: 'all 0.3s ease',
                          minWidth: '200px',
                        }}
                      >
                        <BsXCircle className="me-2" /> Cancel
                      </button>
                    </>
                  )}
                  <button 
                    type="button" 
                    className="btn btn-lg px-5 py-3 fw-semibold"
                    onClick={handleDeleteAccount}
                    style={{
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(229, 62, 62, 0.4)',
                      transition: 'all 0.3s ease',
                      minWidth: '200px',
                    }}
                  >
                    <BsTrash className="me-2" /> Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-5 py-4" style={{ color: '#6B46C1' }}>
        <p className="mb-0">&copy; 2025 Construction Management System. All rights reserved.</p>
        <small className="text-muted">Powered by PTFD</small>
      </footer>
    </div>
  );
};

export default ProfilePage;