 import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import TeamDetails from './TeamDetails';
import Modal from '../Common/Modal';
import Sidebar from '../Common/Sidebar.jsx';  

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  
  const [newTeamMembers, setNewTeamMembers] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const fetchTeamsAndSupportData = useCallback(async () => {
    try {
      const teamsRes = await API.get('/teams');
      setTeams(teamsRes.data);
    } catch (err) {
      setError('Failed to fetch teams.');
      console.error('Error fetching data for TeamView:', err);
    }
  }, []);

  useEffect(() => {
    fetchTeamsAndSupportData();
  }, [fetchTeamsAndSupportData]);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          API.get('/auth/users'),
          API.get('/projects'),
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        console.error('Error fetching support data for TeamView:', err);
      }
    };
    fetchSupportData();
  }, []);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  const handleCloseDetails = () => {
    setSelectedTeam(null);
  };
  

  const handleNewMemberChange = (index, value) => {
    const updatedMembers = [...newTeamMembers];
    updatedMembers[index] = value;
    setNewTeamMembers(updatedMembers);
  };

  const handleCreateNewTeam = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newTeamName.trim()) {
      setError('Team name cannot be empty.');
      return;
    }

    try {
      const teamData = {
        name: newTeamName.trim(),
        description: `Team for ${newTeamName.trim()}`,
        
        members: newTeamMembers.filter(name => name.trim()),
      };

      const res = await API.post('/teams', teamData);
      setMessage(`Team "${res.data.name}" created successfully!`);
      setIsNewTeamModalOpen(false); 
      setNewTeamName('');  
      setNewTeamMembers(['', '', '']);  
      fetchTeamsAndSupportData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create new team.');
      console.error('Create team error:', err);
    }
  };

  return (
    <div className="team-view-page-container d-flex">  
      <Sidebar />  
      <div className="main-content-area flex-grow-1 p-3"> 
        <div className="team-view-container">
          <div className="content-header">
            <h2>Teams</h2>
            <button className="btn btn-primary" onClick={() => setIsNewTeamModalOpen(true)}>
              + New Team
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          {teams.length > 0 ? (
            <div className="row">
              {teams.map((team) => (
                <div key={team._id} className="col-md-4" onClick={() => handleTeamClick(team)}>
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <h4>{team.name}</h4>
                      <p><strong>Description:</strong> {team.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No teams available. Create a new team!</p>
          )}

        
          <Modal
            isOpen={!!selectedTeam}
            onClose={handleCloseDetails}
            title={selectedTeam ? `Team Details: ${selectedTeam.name}` : "Team Details"}
          >
            {selectedTeam && (
              <TeamDetails
                team={selectedTeam}
                onClose={handleCloseDetails}
                users={users}
                projects={projects}
              />
            )}
          </Modal>

        
          <Modal
            isOpen={isNewTeamModalOpen}
            onClose={() => {
              setIsNewTeamModalOpen(false);
              setNewTeamName('');  
              setNewTeamMembers(['', '', '']); 
              setError(''); 
              setMessage('');  
            }}
            title="Create New Team"
          >
            <form onSubmit={handleCreateNewTeam} className="form-modal">
              <div className="form-group">
                <label htmlFor="newTeamName">Team Name</label>
                <input
                  type="text"
                  id="newTeamName"
                  className="form-control"
                  placeholder="Enter Team Name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Add Members</label>
                
                {newTeamMembers.map((member, index) => (
                  <div key={index} className="member-input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Member Name"
                      value={member}
                      onChange={(e) => handleNewMemberChange(index, e.target.value)}
                    />
                  </div>
                ))}
                
              </div>

              {error && <p className="error-message">{error}</p>}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsNewTeamModalOpen(false);
                    setNewTeamName('');  
                    setNewTeamMembers(['', '', '']);  
                    setError('');  
                    setMessage(''); 
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TeamView;
