import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfileV2 = ({ inSidebar = false }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4514/4514759.png',
    role: 'User',
    status: 'online',
    lastActive: 'Just now'
  });
  
  // Get user data from localStorage or use default
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        // Ensure avatar has a fallback if empty or null
        let avatar = parsedUserData.avatar || 'https://cdn-icons-png.flaticon.com/512/4514/4514759.png';
        
        // Handle relative avatar paths
        if (avatar && !avatar.startsWith('http') && !avatar.startsWith('data:')) {
          avatar = `http://localhost:5050${avatar}`;
        }
        
        return {
          name: parsedUserData.name || 'Guest User',
          email: parsedUserData.email || 'guest@example.com',
          avatar: avatar,
          role: parsedUserData.role || 'User',
          status: parsedUserData.status || 'online',
          lastActive: parsedUserData.lastActive || 'Just now'
        };
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return {
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4514/4514759.png',
      role: 'User',
      status: 'online',
      lastActive: 'Just now'
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update user data when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserData());
    };

    // Set initial user data
    setUser(getUserData());

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Enhanced toggle with animation
  const toggleProfile = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const closeDropdown = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Update state immediately
    setUser({
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4514/4514759.png',
      role: 'User',
      status: 'offline',
      lastActive: 'Offline'
    });
    console.log('User signed out');
    closeDropdown();
    // Redirect to sign in page
    navigate('/ptfd/signin');
  };

  const handleProfileClick = () => {
    navigate('/ptfd/profile');
    closeDropdown();
  };

  const handleSettingsClick = () => {
    navigate('/ptfd/settings');
    closeDropdown();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'var(--profile-admin)',
      'Premium': 'var(--profile-premium)', 
      'Member': 'var(--profile-member)',
      'Guest': 'var(--profile-guest)'
    };
    return colors[role] || colors['Member'];
  };

  return (
    <div className={`user-profile-container ${inSidebar ? 'sidebar-profile' : ''}`}>
      <button 
        ref={buttonRef}
        className={`user-profile-button ${inSidebar ? 'sidebar-button' : ''} ${isOpen ? 'active' : ''}`} 
        onClick={toggleProfile}
        aria-label="User profile"
        aria-expanded={isOpen}
      >
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img 
              src={user.avatar} 
              alt="User avatar" 
              className={`user-avatar ${inSidebar ? 'sidebar-avatar' : ''}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="avatar-fallback" style={{ display: 'none' }}>
              {getInitials(user.name)}
            </div>
          </div>
          <div className={`status-indicator ${user.status}`}></div>
        </div>
        
        <div className="user-info">
          <span className={`user-name ${inSidebar ? 'sidebar-name' : ''}`}>
            {user.name}
          </span>
          <span className="user-role">{user.role}</span>
        </div>

        <div className="dropdown-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`user-profile-dropdown ${inSidebar ? 'sidebar-dropdown' : ''} ${isAnimating ? 'animating' : ''}`}
        >
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <img 
                  src={user.avatar} 
                  alt="User avatar" 
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="profile-avatar-fallback" style={{ display: 'none' }}>
                  {getInitials(user.name)}
                </div>
                <div className={`status-badge ${user.status}`}>
                  <div className="status-dot"></div>
                </div>
              </div>
            </div>
            
            <div className="profile-info">
              <div className="profile-name-section">
                <h4 className="profile-name">{user.name}</h4>
                <span 
                  className="profile-badge" 
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {user.role}
                </span>
              </div>
              <p className="profile-email">{user.email}</p>
              <div className="profile-status">
                <span className={`status-text ${user.status}`}>
                  {user.status === 'online' ? 'Online' : 'Offline'}
                </span>
                <span className="last-active">• {user.lastActive}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-welcome">
            <div className="welcome-content">
              <h3 className="welcome-title">Welcome back!</h3>
              <p className="welcome-subtitle">Ready to continue your journey?</p>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="profile-action-btn primary-action" onClick={handleProfileClick}>
              <div className="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">My Profile</span>
                <span className="action-subtitle">View and edit your profile</span>
              </div>
            </button>
            
            <div className="action-divider"></div>
            
            <button className="profile-action-btn secondary-action" onClick={handleSettingsClick}>
              <div className="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">Settings</span>
                <span className="action-subtitle">Preferences and privacy</span>
              </div>
            </button>
            
            <div className="action-divider"></div>
            
            <button className="profile-action-btn danger-action" onClick={handleSignOut}>
              <div className="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <div className="action-content">
                <span className="action-title">Sign Out</span>
                <span className="action-subtitle">Sign out of your account</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileV2;