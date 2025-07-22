 import React, { useState } from 'react';
import API from '../../api/axiosConfig.jsx';

const TaskForm = ({ onTaskAdded, onClose, projects, teams }) => {
  const [name, setName] = useState('');
  const [project, setProject] = useState('');
  const [team, setTeam] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [timeToComplete, setTimeToComplete] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullDueDate = dueDate && dueTime ? `${dueDate}T${dueTime}` : null;

      const newTask = {
        name,
        project,
        team,
        dueDate: fullDueDate,
        timeToComplete: parseInt(timeToComplete),
        owners: [],
        tags: [],
        status: 'To Do',
      };

      await API.post('/tasks', newTask);
      setName('');
      setProject('');
      setTeam('');
      setDueDate('');
      setDueTime('');
      setTimeToComplete('');
      setError('');
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form p-4" style={{ minWidth: '350px' }}>
      <h5 className="mb-3">Create New Task</h5>

      <div className="form-group mb-3">
        <label>Select Project</label>
        <select className="form-control" value={project} onChange={(e) => setProject(e.target.value)} required>
          <option value="">Dropdown</option>
          {projects.map((proj) => (
            <option key={proj._id} value={proj._id}>{proj.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Task Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Task Name"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label>Select Team</label>
        <select className="form-control" value={team} onChange={(e) => setTeam(e.target.value)} required>
          <option value="">Dropdown</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-md-6 form-group mb-3">
          <label>Select Due Date</label>
          <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>
        <div className="col-md-6 form-group mb-3">
          <label>Estimated Time (in days)</label>
          <input type="number" className="form-control" value={timeToComplete} onChange={(e) => setTimeToComplete(e.target.value)} required min={1} />
        </div>
      </div>

      <div className="form-group mb-3">
        <label>Due Time</label>
        <input type="time" className="form-control" value={dueTime} onChange={(e) => setDueTime(e.target.value)} required />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary mr-2" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">Create</button>
      </div>
    </form>
  );
};

export default TaskForm;
