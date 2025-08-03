import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; 

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card border-0">
              <Card.Header>
                <h2 className="card-title mb-0">Sign In</h2>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="mb-4 bg-danger bg-opacity-25 text-white border-0">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                      className="login-btn"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                </Form>
                
                <div className="text-center mt-4 bottom-link">
                  <p>
                    Not a member?{' '}
                    <Link to="/register">
                      Create an account
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
