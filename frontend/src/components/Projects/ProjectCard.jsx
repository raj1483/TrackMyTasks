import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProjectCard = ({ project, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(project._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.title}</h3>
        <div className="project-actions">
          <Link to={`/projects/${project._id}/edit`} className="btn-icon">
            <FaEdit />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-icon danger"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-footer">
        <Link to={`/projects/${project._id}/tasks`} className="btn-link">
          View Tasks
        </Link>
        <span className="project-date">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;