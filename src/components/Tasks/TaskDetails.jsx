 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig.jsx';
import './TaskDetails.css'

const TaskDetails = ({ task, onClose, onUpdate, projects, teams, users, tags }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    team: '',
    owners: [],
    tags: [],
    dueDate: '',
    status: 'In Progress',
    timeRemaining: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        project: task.project?._id || '',
        team: task.team?._id || '',
        owners: task.owners?.map(owner => owner._id) || [],
        tags: task.tags || [],
        dueDate: task.dueDate || '',
        status: task.status || 'In Progress',
        timeRemaining: task.timeToComplete || 0,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOwnersChange = (e) => {
    const selectedOwners = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      owners: selectedOwners,
    }));
  };

  const handleTagsChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      tags: selectedTags,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await API.post(`/tasks/${task._id}`, {
        ...formData,
        timeToComplete: formData.timeRemaining,
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError('Failed to update task.');
      console.error('Task update error:', err);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      const updatedTask = await API.post(`/tasks/${task._id}`, {
        ...formData,
        status: 'Completed',
        timeRemaining: 0,
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError('Failed to mark task as complete.');
      console.error('Mark as complete error:', err);
    }
  };

  return (
    <div className="task-details-container">
      <div className="row">
        <div className="col-md-2 task-details-sidebar bg-light p-3">
          <button
            className="btn btn-outline-secondary w-40 mb-3"
            onClick={() => navigate('/reports')}
          >
            Back
          </button>
           
        </div>
        <div className="col-md-10 task-details-content p-4">
          <h2 className="mb-4">Task: {formData.name}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="project" className="form-label">Project:</label>
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>{proj.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="team" className="form-label">Team:</label>
                <select
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="owners" className="form-label">Owners:</label>
                <select
                  id="owners"
                  name="owners"
                  multiple
                  value={formData.owners}
                  onChange={handleOwnersChange}
                  className="form-select"
                  style={{ height: '150px' }}
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="tags" className="form-label">Tags:</label>
                <select
                  id="tags"
                  name="tags"
                  multiple
                  value={formData.tags}
                  onChange={handleTagsChange}
                  className="form-select"
                  style={{ height: '150px' }}
                >
                  {tags.map((tag) => (
                    <option key={tag._id} value={tag.name}>{tag.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="dueDate" className="form-label">Due Date:</label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="timeRemaining" className="form-label">Time Remaining:</label>
                <div className="input-group">
                  <input
                    id="timeRemaining"
                    type="number"
                    name="timeRemaining"
                    value={formData.timeRemaining}
                    onChange={handleChange}
                    min="0"
                    className="form-control"
                  />
                  <span className="input-group-text">Days</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">Save Changes</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleMarkAsComplete}
              >
                Mark as Complete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;