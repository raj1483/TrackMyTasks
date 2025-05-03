import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import projectService from '../../api/projects';
import './Projects.css';

const ProjectList = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await projectService.getProjects(token);
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleCreateProject = async (projectData) => {
    try {
      const { data } = await projectService.createProject(projectData, token);
      setProjects([...projects, data]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId, token);
      setProjects(projects.filter(project => project._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>My Projects</h2>
        {projects.length < 4 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {projects.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>You don't have any projects yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;