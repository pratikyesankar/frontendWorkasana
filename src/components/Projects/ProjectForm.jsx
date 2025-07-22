 import React, { useState } from 'react';
import API from '../../api/axiosConfig.jsx';

const ProjectForm = ({ onProjectAdded, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', { name, description });
      setName('');
      setDescription('');
      setError('');
      if (onProjectAdded) onProjectAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-modal">
      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Project Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
        ></textarea>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
