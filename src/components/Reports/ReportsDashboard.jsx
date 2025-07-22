import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import API from '../../api/axiosConfig';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsDashboard = () => {
  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [pendingWork, setPendingWork] = useState(0);
  const [closedTasksByTeam, setClosedTasksByTeam] = useState({});
  const [closedTasksByOwner, setClosedTasksByOwner] = useState({});
  const [closedTasksByProject, setClosedTasksByProject] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [
          lastWeekRes,
          pendingRes,
          closedByTeamRes,
          closedByOwnerRes,
          closedByProjectRes,
        ] = await Promise.all([
          API.get('/report/last-week'),
          API.get('/report/pending'),
          API.get('/report/closed-tasks?groupBy=team'),
          API.get('/report/closed-tasks?groupBy=owner'),
          API.get('/report/closed-tasks?groupBy=project'),
        ]);

        setLastWeekTasks(lastWeekRes.data);
        setPendingWork(pendingRes.data.totalDaysPending);
        setClosedTasksByTeam(closedByTeamRes.data);
        setClosedTasksByOwner(closedByOwnerRes.data);
        setClosedTasksByProject(closedByProjectRes.data);
      } catch (err) {
        setError('Failed to fetch reports.');
        console.error('Error fetching reports:', err);
      }
    };

    fetchReports();
  }, []);
 
  const lastWeekData = {
    labels: lastWeekTasks.map(task => task.name),
    datasets: [
      {
        label: 'Tasks Completed Last Week',
        data: lastWeekTasks.map(task => task.timeToComplete),  
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
 
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title',  
      },
    },
  };
  
  const pendingWorkData = {
    labels: ['Pending Work'],
    datasets: [
      {
        label: 'Total Days Pending',
        data: [pendingWork],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
   
  const closedByTeamData = {
    labels: Object.keys(closedTasksByTeam),
    datasets: [
      {
        label: 'Tasks Closed by Team',
        data: Object.values(closedTasksByTeam),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const closedByOwnerData = {
    labels: Object.keys(closedTasksByOwner),
    datasets: [
      {
        label: 'Tasks Closed by Owner',
        data: Object.values(closedTasksByOwner),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const closedByProjectData = {
    labels: Object.keys(closedTasksByProject),
    datasets: [
      {
        label: 'Tasks Closed by Project',
        data: Object.values(closedTasksByProject),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="reports-dashboard-container">
      <h2>Reports and Visualizations</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="chart-section">
        <h3>Total Work Done Last Week</h3>
        {lastWeekTasks.length > 0 ? (
          <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Tasks Completed Last Week' } } }} data={lastWeekData} />
        ) : (
          <p>No tasks completed last week.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Total Days of Work Pending</h3>
        {pendingWork > 0 ? (
          <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Total Days of Work Pending' } } }} data={pendingWorkData} />
        ) : (
          <p>No pending work.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Tasks Closed by Team</h3>
        {Object.keys(closedTasksByTeam).length > 0 ? (
          <Pie options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Tasks Closed by Team' } } }} data={closedByTeamData} />
        ) : (
          <p>No tasks closed by team.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Tasks Closed by Owner</h3>
        {Object.keys(closedTasksByOwner).length > 0 ? (
          <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Tasks Closed by Owner' } } }} data={closedByOwnerData} />
        ) : (
          <p>No tasks closed by owner.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Tasks Closed by Project</h3>
        {Object.keys(closedTasksByProject).length > 0 ? (
          <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Tasks Closed by Project' } } }} data={closedByProjectData} />
        ) : (
          <p>No tasks closed by project.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;