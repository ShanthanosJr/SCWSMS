import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav'; // Your Nav.js

// Import each module's main component
import WspmModule from './modules/wspm/WspmModule';
import EtmModule from './modules/etm/EtmModule';
import CimModule from './modules/cim/CimModule';
import MistmModule from './modules/mistm/MistmModule.tsx';
import PtfdModule from './modules/ptfd/PtfdModule';

function App() {
  return (
    <Router>
      <Nav /> {/* Navbar always visible */}
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