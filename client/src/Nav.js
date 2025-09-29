import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/wspm" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' }}>
          WSPM
        </Link>
        <Link to="/etm" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' }}>
          ETM
        </Link>
        <Link to="/cim" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' }}>
          CIM
        </Link>
        <Link to="/mistm" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' }}>
          MISTM
        </Link>
        <Link to="/ptfd" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' }}>
          PTFD
        </Link>
      </div>
    </nav>
  );
}

export default Nav;