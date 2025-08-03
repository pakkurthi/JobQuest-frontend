import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'JOB_SEEKER',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };
      
      await register(userData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="register-card border-0">
              <Card.Header>
                <h2 className="card-title mb-0">Create Your Account</h2>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="mb-4 bg-danger bg-opacity-25 text-white border-0">
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label className="form-label">First name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. John"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label">Last name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Doe"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. john.doe@example.com"
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Create a password"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label">Confirm password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm your password"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">I am a...</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="JOB_SEEKER">Job Seeker</option>
                      <option value="JOB_PROVIDER">Job Provider</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="checkbox"
                      id="terms"
                      label={
                        <span>
                          I agree to the <a href="#">Terms and Conditions</a>
                        </span>
                      }
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                      className="register-btn"
                    >
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </div>
                </Form>
                
                <div className="text-center mt-4 bottom-link">
                  <p>
                    Already have an account?{' '}
                    <Link to="/login">
                      Sign In
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
