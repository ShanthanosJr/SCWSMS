import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exportProjectToPDF } from '../ExportUtils';

export default function Projects({ project, onDelete }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Fallback images at component level
  const fallbackImages = {
    'Residential': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%23FFD700"/%3E%3Ctext x="200" y="125" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="%23000"%3EResidential%3C/text%3E%3C/svg%3E',
    'Commercial': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%23FFA500"/%3E%3Ctext x="200" y="125" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="%23000"%3ECommercial%3C/text%3E%3C/svg%3E',
    'Infrastructure': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%23FFD700"/%3E%3Ctext x="200" y="125" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="%23000"%3EInfrastructure%3C/text%3E%3C/svg%3E',
    'Industrial': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%23FFA500"/%3E%3Ctext x="200" y="125" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="%23000"%3EIndustrial%3C/text%3E%3C/svg%3E',
    'default': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"%3E%3Crect width="400" height="250" fill="%23FFD700"/%3E%3Ctext x="200" y="125" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18" fill="%23000"%3EProject%3C/text%3E%3C/svg%3E'
  };

  // Get project images array or fallback to single image/default
  const getProjectImages = (project) => {
    if (project.pimg && Array.isArray(project.pimg) && project.pimg.length > 0) {
      return project.pimg;
    }
    
    if (project.pimg && typeof project.pimg === 'string') {
      return [project.pimg];
    }
    
    const defaultImages = {
      'Residential': 'https://picsum.photos/400/250?random=201',
      'Commercial': 'https://picsum.photos/400/250?random=202',
      'Infrastructure': 'https://picsum.photos/400/250?random=203',
      'Industrial': 'https://picsum.photos/400/250?random=204',
      default: 'https://picsum.photos/400/250?random=200'
    };
    
    return [defaultImages[project.ptype] || defaultImages.default];
  };

  const projectImages = getProjectImages(project);
  const hasMultipleImages = projectImages.length > 1;

  // Auto-carousel effect (3 seconds) when hovering over the image area
  useEffect(() => {
    let intervalId;
    if (isAutoPlaying && hasMultipleImages) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === projectImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3 second interval
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, hasMultipleImages, projectImages.length]);

  const handlePreviousImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(currentImageIndex === 0 ? projectImages.length - 1 : currentImageIndex - 1);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(currentImageIndex === projectImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'success';
      case 'Completed': return 'primary';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
      <div className="card h-100 shadow-sm border-0 overflow-hidden" style={{transition: 'transform 0.2s, box-shadow 0.2s'}} 
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-5px)';
             e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
           }}>
        
        {/* Project Image Carousel */}
        <div 
          className="position-relative" 
          style={{height: '200px', overflow: 'hidden'}}
          onMouseEnter={() => setIsAutoPlaying(true)}
          onMouseLeave={() => setIsAutoPlaying(false)}
        >
          <img 
            src={projectImages[currentImageIndex]} 
            alt={`${project.pname} - ${currentImageIndex + 1}`}
            className="card-img-top"
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s'
            }}
            onError={(e) => {
              if (!e.target.src.includes('data:image/svg+xml')) {
                e.target.src = fallbackImages[project.ptype] || fallbackImages.default;
              }
            }}
          />
          
          {/* Navigation buttons for multiple images */}
          {hasMultipleImages && (
            <>
              <button
                className="btn btn-dark btn-sm position-absolute top-50 start-0 translate-middle-y ms-2"
                onClick={handlePreviousImage}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  opacity: 0.8,
                  zIndex: 2
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                title="Previous image"
              >
                ←
              </button>
              <button
                className="btn btn-dark btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={handleNextImage}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  opacity: 0.8,
                  zIndex: 2
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
                title="Next image"
              >
                →
              </button>
              
              {/* Image counter */}
              <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                <span 
                  className="badge bg-dark bg-opacity-75 text-white"
                  style={{fontSize: '0.75rem'}}
                >
                  {currentImageIndex + 1} / {projectImages.length}
                </span>
              </div>
              
              {/* Image dots indicator */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                <div className="d-flex gap-1">
                  {projectImages.map((_, index) => (
                    <button
                      key={index}
                      className={`btn p-0 rounded-circle ${
                        index === currentImageIndex ? 'btn-light' : 'btn-secondary'
                      }`}
                      style={{
                        width: '8px',
                        height: '8px',
                        opacity: index === currentImageIndex ? 1 : 0.6
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      title={`Go to image ${index + 1}`}
                    >
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Status Badge */}
          <div className="position-absolute top-0 start-0 m-3">
            <span className={`badge bg-${getStatusColor(project.pstatus)} fs-6`}>
              {project.pstatus}
            </span>
          </div>
          
          {/* Priority Badge */}
          <div className="position-absolute top-0 end-0 m-3">
            <span className={`badge bg-${getPriorityColor(project.ppriority)} fs-6`}>
              {project.ppriority}
            </span>
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          {/* Project Header */}
          <div className="mb-3">
            <h5 className="card-title fw-bold text-dark mb-1">{project.pname}</h5>
            <p className="text-muted small mb-2">
              <span className="badge bg-light text-dark">{project.pcode}</span>
              {project.pnumber && <span className="ms-2">#{project.pnumber}</span>}
            </p>
          </div>

          {/* Project Details */}
          <div className="mb-3 flex-grow-1">
            <div className="row g-2 small">
              <div className="col-12 mb-2">
                <strong>📍 Location:</strong>
                <div className="text-muted">{project.plocation}</div>
              </div>
              
              <div className="col-6">
                <strong>🏗️ Type:</strong>
                <div>
                  <span className="badge bg-info text-white">{project.ptype}</span>
                </div>
              </div>
              
              <div className="col-6">
                <strong>💰 Budget:</strong>
                <div className="text-success fw-bold">
                  ${parseFloat(project.pbudget || 0).toLocaleString()}
                </div>
              </div>
              
              <div className="col-6">
                <strong>📅 Start:</strong>
                <div className="text-muted small">
                  {new Date(project.pcreatedat).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="col-6">
                <strong>🗓️ End:</strong>
                <div className="text-muted small">
                  {new Date(project.penddate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            {project.pobservations && (
              <div className="mt-2">
                <strong className="small">📝 Notes:</strong>
                <p className="text-muted small mb-0" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.pobservations}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-auto">
            <button 
              className="btn btn-outline-info btn-sm flex-fill"
              onClick={() => navigate(`/ptfd/project-view/${project._id}`)} // Fixed path
              title="View Details"
            >
              👁️ View
            </button>
            <button 
              className="btn btn-outline-warning btn-sm flex-fill"
              onClick={() => navigate(`/ptfd/projects/${project._id}`)} // Fixed path
              title="Edit Project"
            >
              ✏️ Edit
            </button>
            <button 
              className="btn btn-outline-success btn-sm flex-fill"
              onClick={() => exportProjectToPDF(project, `project-${project.pcode}.pdf`)}
              title="Export Project"
            >
              📄 Export
            </button>
            <button 
              onClick={() => onDelete(project._id)} 
              className="btn btn-outline-danger btn-sm flex-fill"
              title="Delete Project"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}