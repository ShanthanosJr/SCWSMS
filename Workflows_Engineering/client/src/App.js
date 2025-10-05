import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './Nav'; // Import the Nav component

// Import each module's main component
import WspmModule from './modules/wspm/WspmModule';
import EtmModule from './modules/etm/EtmModule';
import CimModule from './modules/cim/CimModule';
import MistmModule from './modules/mistm/MistmModule.jsx';
import PtfdModule from './modules/ptfd/PtfdModule';

// Component to conditionally render navigation
function ConditionalNav() {
  const location = useLocation();
  
  // Routes where global navigation should NOT be displayed
  const hideNavRoutes = [
    '/ptfd/', // ptfd index/home
    '/ptfd',  // ptfd index/home (without trailing slash)
    '/ptfd/user-projects',
    '/ptfd/user-timeline', 
    '/ptfd/user-finance',
    '/ptfd/join-with-us',
    '/ptfd/user-chatbot'
  ];
  
  // Check if current path should hide navigation
  const shouldHideNav = hideNavRoutes.some(route => 
    location.pathname === route || 
    (route.endsWith('/') && location.pathname === route.slice(0, -1))
  );
  
  // Don't show nav on user view pages and ptfd index
  if (shouldHideNav) {
    return null;
  }
  
  return <Nav />;
}

function App() {
  return (
    <Router>
      <ConditionalNav /> {/* Conditionally rendered navbar */}
      <Routes>
        <Route path="/wspm/*" element={<WspmModule />} />
        <Route path="/etm/*" element={<EtmModule />} />
        <Route path="/cim/*" element={<CimModule />} />
        <Route path="/mistm/*" element={<MistmModule />} />
        <Route path="/ptfd/*" element={<PtfdModule />} />
        <Route path="/" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>Welcome! Choose a module from the navbar.</h2></div>} /> {/* Home page */}
      </Routes>
    </Router>
  );
}

export default App;