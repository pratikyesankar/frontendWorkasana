import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';
import TaskDetails from './TaskDetails';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const queryString = queryParams.toString();
      const response = await API.get(`/tasks?${queryString}`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error('Error fetching tasks:', err);
    }
  }, [location.search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [usersRes, teamsRes, projectsRes, tagsRes] = await Promise.all([
          API.get('/auth/users'),
          API.get('/teams'),
          API.get('/projects'),
          API.get('/tags'),
        ]);
        setUsers(usersRes.data);
        setTeams(teamsRes.data);
        setProjects(projectsRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    fetchFiltersData();
  }, []);

  const handleFilterChange = (filterName, value) => {
    const queryParams = new URLSearchParams(location.search);
    if (value) {
      queryParams.set(filterName, value);
    } else {
      queryParams.delete(filterName);
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleSortChange = (sortOption) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('sortBy', sortOption);
    navigate(`?${queryParams.toString()}`);
  };

  const getFilterValue = (filterName) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(filterName) || '';
  };

  const resetFilters = () => {
    navigate('/tasks');
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    fetchTasks();  
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task.');
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="task-list-container">
      <h2>All Tasks</h2>

      <div className="filters-sort-section">
        <div className="filter-group">
          <label>Owner:</label>
          <select
            value={getFilterValue('owner')}
            onChange={(e) => handleFilterChange('owner', e.target.value)}
          >
            <option value="">All Owners</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Team:</label>
          <select
            value={getFilterValue('team')}
            onChange={(e) => handleFilterChange('team', e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Tags:</label>
          <select
            value={getFilterValue('tags')}
            onChange={(e) => handleFilterChange('tags', e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Project:</label>
          <select
            value={getFilterValue('project')}
            onChange={(e) => handleFilterChange('project', e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={getFilterValue('status')}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={getFilterValue('sortBy')}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">None</option>
            <option value="timeToComplete">Time to Complete</option>
            
          </select>
        </div>
        <button onClick={resetFilters} className="reset-button">Reset Filters</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      <div className="task-cards-container">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3 onClick={() => handleTaskClick(task)}>{task.name}</h3>
              <p><strong>Project:</strong> {projects.find(p => p._id === task.project)?.name || 'N/A'}</p>
              <p><strong>Team:</strong> {teams.find(t => t._id === task.team)?.name || 'N/A'}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Time to Complete:</strong> {task.timeToComplete} days</p>
              <div className="task-actions">
                <button onClick={() => handleTaskClick(task)}>View Details</button>
                <button onClick={() => handleDeleteTask(task._id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default TaskList;