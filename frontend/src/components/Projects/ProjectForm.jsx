import { useState } from 'react';

const ProjectForm = ({ project = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!project) {
        // Reset form if creating new project
        setFormData({ title: '', description: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="project-form-container">
      <h3>{project ? 'Edit Project' : 'Create New Project'}</h3>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={50}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;