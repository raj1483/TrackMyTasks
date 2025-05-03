



                import { BrowserRouter, Routes, Route } from 'react-router-dom';
                import Layout from './components/shared/Layout';
                import PrivateRoute from './components/shared/PrivateRoute';
                import Home from './pages/Home';
                import Dashboard from './pages/Dashboard';
                import Projects from './pages/Projects';
                import Login from './components/auth/Login';
                import Signup from './components/auth/Signup';

                function App() {
                  return (
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Home />} />
                          <Route path="login" element={<Login />} />
                          <Route path="signup" element={<Signup />} />

 {/* Catch-all route can be added to redirect or show 404 */}
                {/* <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Page Not Found</h2>} /> */}
                <Route path="*" element={<NotFound />} />
                          <Route element={<PrivateRoute />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="projects" element={<Projects />} />
                            <Route path="projects/:projectId/tasks" element={<Tasks />} />
                          </Route>
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  );
                }