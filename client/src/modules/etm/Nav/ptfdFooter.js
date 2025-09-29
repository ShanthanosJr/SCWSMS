import React from 'react';
import './ptfdFooter.css';

const ptfdFooter = () => {
    return (
        <footer className="construction-footer ptfd-construction-footer">
            <div className="container ptfd-container">
                <div className="row ptfd-row">
                    <div className="col-12 ptfd-col-12">
                        <div className="footer-brand mb-4 d-flex justify-content-center gap-4 fs-3 fw-bold ptfd-footer-brand">
                            <span className="ptfd-brand-text">WORKFLOWS</span>
                            <span className="ptfd-brand-text">ENGINEERING</span>
                        </div>

                        <p className="footer-tagline text-uppercase mb-4 ptfd-footer-tagline">
                            Smart Construction Workflow & Safety Management System
                        </p>

                        {/* Social icons */}
                        <div className="footer-social mb-4 ptfd-footer-social" aria-label="Social media links">
                            <a href="https://facebook.com/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook" title="Facebook" className="ptfd-social-link">
                                <span role="img" aria-hidden className="ptfd-social-icon">📘</span>
                            </a>
                            <a href="https://instagram.com/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram" title="Instagram" className="ptfd-social-link">
                                <span role="img" aria-hidden className="ptfd-social-icon">📸</span>
                            </a>
                            <a href="https://linkedin.com/company/workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn" title="LinkedIn" className="ptfd-social-link">
                                <span role="img" aria-hidden className="ptfd-social-icon">💼</span>
                            </a>
                            <a href="https://x.com/workflowseng" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter/X" title="Twitter/X" className="ptfd-social-link">
                                <span role="img" aria-hidden className="ptfd-social-icon">🐦</span>
                            </a>
                            <a href="https://youtube.com/@workflowsengineering" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube" title="YouTube" className="ptfd-social-link">
                                <span role="img" aria-hidden className="ptfd-social-icon">▶️</span>
                            </a>
                        </div>

                        {/* Quick links */}
                        <div className="footer-links mb-4 ptfd-footer-links">
                            <a href="#hero" className="ptfd-footer-link">Home</a>
                            <a href="#project" className="ptfd-footer-link">Projects</a>
                            <a href="#timeline" className="ptfd-footer-link">Timelines</a>
                            <a href="#dashboard" className="ptfd-footer-link">Financial</a>
                            <a href="#safety" className="ptfd-footer-link">Safety</a>
                            <a href="#growth" className="ptfd-footer-link">AI</a>
                        </div>

                        {/* Contact 
            <div className="footer-contact mb-4 ptfd-footer-contact">
              <div className="ptfd-contact-item">Email: info@workflowsengineering.com</div>
              <div className="ptfd-contact-item">Phone: +1 (71) 429-8544</div>
            </div>

            <p className="footer-website fw-semibold mb-3 ptfd-footer-website">
              WWW.WORKFLOWSENGINEERING.COM
            </p>*/}
                        <div className="footer-copy ptfd-footer-copy">
                            <div className="ptfd-contact-item">info@workflowsengineering.com</div>
                            <div className="ptfd-contact-item">+94 (71) 429-8544</div>
                            © {new Date().getFullYear()} Workflows Engineering. All rights reserved.</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ptfdFooter;
