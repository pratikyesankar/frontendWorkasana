 import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authName');
    
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">Workasana</Link>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="nav-item">
          <i className="material-icons icon">dashboard</i> Dashboard
        </Link>
        <Link to="/projects" className="nav-item">
          <i className="material-icons icon">folder</i> Projects
        </Link>
        <Link to="/teams" className="nav-item">
          <i className="material-icons icon">group</i> Team
        </Link>
        <Link to="/reports" className="nav-item">
          <i className="material-icons icon">assessment</i> Reports
        </Link>
         <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <i className="material-icons icon">logout</i> Logout
        </button>
      </div>
      </nav>
     
    </aside>
  );
};

export default Sidebar;