 import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Common/PrivateRoute.jsx'; 
import Login from './components/Auth/Login.jsx';  
import Signup from './components/Auth/Signup.jsx';  
import Dashboard from './components/Dashboard/Dashboard.jsx';  
import ProjectView from './components/Projects/ProjectView.jsx';  
import TeamView from './components/Teams/TeamView.jsx';  
import TeamDetails from './components/Teams/TeamDetails.jsx';  
import TaskList from './components/Tasks/TaskList.jsx';  
import ReportsDashboard from './components/Reports/ReportsDashboard.jsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';  

function App() {
  const token = localStorage.getItem('jwtToken');
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('jwtToken');
      setIsAuthenticated(newToken ? true : false);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="app-container">
        
        <main className="main-layout">
          <Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        
            <Route element={<PrivateRoute setIsAuthenticated={setIsAuthenticated} />}>
              <Route path="/" element={<Dashboard />} />  
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectView />} />
              <Route path="/teams" element={<TeamView />} />
              <Route path="/teams/:id" element={<TeamDetails />} />  
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/reports" element={<ReportsDashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
