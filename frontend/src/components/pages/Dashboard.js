import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, CircularProgress } from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../services/projectService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Welcome, {user.name}</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateProject}>
          New Project
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Your Projects
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : projects.length === 0 ? (
        <Typography>No projects yet. Create your first project!</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;