import React, { useState, useEffect } from 'react';
import API from '../../api/axiosConfig.jsx';
import Modal from '../Common/Modal.jsx';
import ProjectForm from '../Projects/ProjectForm.jsx';
import TaskForm from '../Tasks/TaskForm.jsx';
import TaskDetails from '../Tasks/TaskDetails.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes, usersRes, teamsRes, tagsRes] = await Promise.all([
        API.get('/projects'),
        API.get('/tasks'),
        API.get('/auth/users'),
        API.get('/teams'),
        API.get('/tags'),
      ]);

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
      setTeams(teamsRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error('Dashboard data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };

  const handleTaskUpdate = () => {
    fetchData();
    setIsTaskDetailsModalOpen(false);
    setSelectedTask(null);
    toast.success('Task updated successfully!');
  };

  return (
    <div className="dashboard-container">
      {error && <p className="error-message">{error}</p>}

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Projects</h2>
          <button className="btn btn-primary" onClick={() => setIsProjectModalOpen(true)}>
            Create New Project
          </button>
        </div>
        <div className="card-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="dashboard-card project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p><strong>Status: {project.status}</strong></p>
              </div>
            ))
          ) : (
            <p className="no-data-message">No projects found. Create one!</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Tasks</h2>
          <button className="btn btn-primary" onClick={() => setIsTaskModalOpen(true)}>
            Create New Task
          </button>
        </div>
        <div className="card-grid">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id}
                className="dashboard-card task-card"
                onClick={() => handleTaskClick(task)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{task.name}</h3>
                <p><strong>Status:</strong> {task.status}</p>
              </div>
            ))
          ) : (
            <p className="no-data-message">No tasks found. Create one!</p>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <ProjectForm
          onProjectAdded={() => {
            fetchData();
            toast.success('Project created successfully!');
            setIsProjectModalOpen(false);
          }}
          onClose={() => setIsProjectModalOpen(false)}
        />
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onTaskAdded={() => {
            fetchData();
            toast.success('Task created successfully!');
            setIsTaskModalOpen(false);
          }}
          onClose={() => setIsTaskModalOpen(false)}
          projects={projects}
          teams={teams}
          users={users}
          tags={tags}
        />
      </Modal>

      {/* Task Details Modal */}
      <Modal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => {
          setIsTaskDetailsModalOpen(false);
          setSelectedTask(null);
        }}
      >
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={() => {
              setIsTaskDetailsModalOpen(false);
              setSelectedTask(null);
            }}
            onUpdate={handleTaskUpdate}
            projects={projects}
            teams={teams}
            users={users}
            tags={tags}
          />
        )}
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
