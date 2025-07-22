import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig.jsx';
import Modal from '../Common/Modal.jsx';
import TaskDetails from '../Tasks/TaskDetails.jsx';

const ProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProjectData = useCallback(async () => {
    try {
     
      const projectsRes = await API.get('/projects');
      setProjects(projectsRes.data);

      const usersRes = await API.get('/auth/users');
      setUsers(usersRes.data);

      const tagsRes = await API.get('/tags');
      setTags(tagsRes.data);

      const teamsRes = await API.get('/teams');
      setTeams(teamsRes.data);

      const queryParams = new URLSearchParams(location.search);
      const queryString = queryParams.toString();
      const tasksRes = await API.get(`/tasks?${queryString}`);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to fetch project data.');
      console.error('ProjectView data fetch error:', err);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleFilterChange = (filterName, value) => {
    const queryParams = new URLSearchParams(location.search);
    if (value) {
      queryParams.set(filterName, value);
    } else {
      queryParams.delete(filterName);
    }
    navigate(`?${queryParams.toString()}`);
  };

  const getFilterValue = (filterName) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(filterName) || '';
  };

  const getProjectName = (projectId) => projects.find(p => p._id === projectId)?.name || 'N/A';
  const getTeamName = (teamId) => teams.find(t => t._id === teamId)?.name || 'N/A';
  const getOwnerNames = (ownerIds) =>
    ownerIds.map(id => users.find(u => u._id === id)?.name || 'Unknown').join(', ');

  const groupedTasks = tasks.reduce((acc, task) => {
    const projectName = getProjectName(task.project);
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(task);
    return acc;
  }, {});

  return (
    <div className="main-content-area">
      <div className="page-header">
        <h2>Create Moodboard</h2>
      </div>
      <p>
        This project centers around compiling a digital moodboard to set the visual direction and tone for the brand identity.
        The moodboard will showcase a curated selection of images, color palettes, typography samples, textures, and layout inspirations
        that collectively evoke the intended mood and style.
      </p>

      {error && <p className="error-message">{error}</p>}

      <h3>Sort by:</h3>
      <div className="filter-bar">
        <div className="filter-group">
          <label>Project</label>
          <select value={getFilterValue('project')} onChange={(e) => handleFilterChange('project', e.target.value)}>
            <option value="">All Projects</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>{proj.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Owner</label>
          <select value={getFilterValue('owner')} onChange={(e) => handleFilterChange('owner', e.target.value)}>
            <option value="">All Owners</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tags</label>
          <select value={getFilterValue('tags')} onChange={(e) => handleFilterChange('tags', e.target.value)}>
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={getFilterValue('status')} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={() => navigate('/projects')}>Reset Filters</button>
      </div>

      {Object.keys(groupedTasks).length > 0 ? (
        Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
          <div key={projectName} className="project-group-tasks">
            <div className="task-table-wrapper">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Status</th>
                    <th>Owners</th>
                    <th>Tags</th>
                    <th>Time to Complete (days)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.name}</td>
                      <td>
                        <span className={`status-badge status-${task.status.replace(/\s/g, '').toLowerCase()}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>{getOwnerNames(task.owners)}</td>
                      <td>{task.tags.join(', ')}</td>
                      <td>{task.timeToComplete}</td>
                      <td>
                        <button className="button-small btn btn-primary" onClick={() => setSelectedTask(task)}>
                          View/Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="no-data-message">No tasks found for the selected filters.</p>
      )}

      {selectedTask && (
        <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details">
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={() => fetchProjectData()}
            projects={projects}
            teams={teams}
            users={users}
            tags={tags}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProjectView;