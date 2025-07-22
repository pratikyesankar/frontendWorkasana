import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosConfig.jsx';
import Modal from '../Common/Modal.jsx';

const TeamDetails = ({ team, onClose, users: allUsersProp, projects }) => {
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState(allUsersProp || []);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberNameInput, setNewMemberNameInput] = useState('');     
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTeamMembers = useCallback(async () => {
    if (!team || !team._id) {
      setMembers([]);
      return;
    }
    try {
      const tasksRes = await API.get(`/tasks?team=${team._id}`);
      const ownerIds = new Set();
      tasksRes.data.forEach(task => {
        task.owners.forEach(ownerId => ownerIds.add(ownerId));
      });

      if (!allUsersProp || allUsersProp.length === 0) {
        const usersRes = await API.get('/auth/users');
        setAllUsers(usersRes.data);
        const currentMembers = usersRes.data.filter(user => ownerIds.has(user._id));
        setMembers(currentMembers);
      } else {
        const currentMembers = allUsersProp.filter(user => ownerIds.has(user._id));
        setMembers(currentMembers);
      }
    } catch (err) {
      setError('Failed to fetch team members.');
      console.error('TeamDetails members fetch error:', err);
    }
  }, [team, allUsersProp]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
     
    if (!newMemberNameInput.trim()) {
      setError('Please enter a member name.');
      return;
    }
    if (!team || !team._id) {
        setError('No team selected to add member to.');
        return;
    }

    try {
      setMessage('Member added (simulated)!');
      setError('');
      setIsAddMemberModalOpen(false);  
      setNewMemberNameInput('');  
      
      fetchTeamMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member.');
      setMessage('');
    }
  };

  if (!team) {
    return null;
  }

  return (
    <div className="team-details-modal">
      <div className="modal-content">
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <section className="team-members-section">
          <h3>Members</h3>
          
          <button className="btn btn-primary" onClick={() => {
            setIsAddMemberModalOpen(true);
            setNewMemberNameInput('');  
            setError('');  
          }}>Add Member</button>
        </section>

        <Modal
          isOpen={isAddMemberModalOpen}
          onClose={() => {
            setIsAddMemberModalOpen(false);
            setNewMemberNameInput('');  
            setError('');  
          }}
          title="Add New Member"
        >
          <form onSubmit={handleAddMember} className="form-modal">
            <div className="form-group">
              <label>Member Name</label>
              <input  
                type="text"
                className="form-control"
                placeholder="Member Name"  
                value={newMemberNameInput} 
                onChange={(e) => setNewMemberNameInput(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsAddMemberModalOpen(false);
                  setNewMemberNameInput('');  
                  setError('');  
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Add</button>
            </div>
          </form>
        </Modal>

        <div className="form-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default TeamDetails;