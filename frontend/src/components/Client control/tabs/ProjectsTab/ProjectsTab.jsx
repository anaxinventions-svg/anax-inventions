import './ProjectsTab.css';

const ProjectsTab = ({ projects, selectedProject, setSelectedProject }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'Planning': return 'status-planning';
      case 'Active': return 'status-active';
      case 'Paused': return 'status-paused';
      case 'Completed': return 'status-completed';
      default: return 'status-planning';
    }
  };

  return (
    <div className="projects-tab">
      <div className="tab-header">
        <h2>📁 My Projects</h2>
        <p>View and manage all your projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No Projects Yet</h3>
          <p>Your projects will appear here once assigned by the admin.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div
              key={project._id}
              className={`project-card ${selectedProject?._id === project._id ? 'selected' : ''}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
              </div>
              <p className="project-desc">{project.description?.substring(0, 80)}...</p>
              <div className="project-details">
                <div className="detail">
                  <span className="detail-label">Budget</span>
                  <span className="detail-value">{project.currency} {project.totalBudget?.toLocaleString()}</span>
                </div>
                <div className="detail">
                  <span className="detail-label">Progress</span>
                  <span className="detail-value">{project.overallProgress}%</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.overallProgress}%` }}></div>
              </div>
              <button className="view-btn">View Details →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;