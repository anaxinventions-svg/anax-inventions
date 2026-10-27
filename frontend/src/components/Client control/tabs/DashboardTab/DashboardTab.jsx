import './DashboardTab.css';

const DashboardTab = ({ projects, user, loading }) => {
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);

  return (
    <div className="dashboard-tab">
      <div className="welcome-section">
        <h2>Welcome back, {user?.fullName}! 👋</h2>
        <p>Here's what's happening with your projects today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <h3>{projects.length}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h3>{activeProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{completedProjects}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{totalBudget.toLocaleString()}</h3>
            <p>Total Budget</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading your projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No Projects Yet</h3>
          <p>Your projects will appear here once assigned by the admin.</p>
        </div>
      ) : (
        <div className="recent-projects">
          <h3>Recent Projects</h3>
          <div className="projects-list">
            {projects.slice(0, 3).map(project => (
              <div key={project._id} className="project-item">
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <p>{project.description?.substring(0, 60)}...</p>
                </div>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.overallProgress}%` }}></div>
                  </div>
                  <span>{project.overallProgress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTab;