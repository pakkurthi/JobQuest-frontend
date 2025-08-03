import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/auth.service';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import './ProfilePage.css'; 

export default function ProfilePage() {
  const { user, isJobProvider, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        const profileData = response.data;
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phoneNumber: profileData.phoneNumber || '',
          bio: profileData.bio || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUpdateSuccess(false);
    
    try {
      // NOTE: This should call a real update API.
      console.log("Simulating profile update with:", formData);
      setUpdateSuccess(true);
      
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Container className="py-5">
        {profile && (
          <header className="profile-header mb-4">
            <div className="profile-avatar">
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.email}</h1>
              <Badge pill bg={isJobProvider() ? "success" : "info"}>
                {isJobProvider() ? 'Recruiter' : 'Job Seeker'}
              </Badge>
            </div>
          </header>
        )}
        
        {error && <Alert variant="danger">{error}</Alert>}
        {updateSuccess && <Alert variant="success">Profile updated successfully!</Alert>}
        
        <Card className="profile-form-card">
          <Card.Body className="p-4 p-md-5">
            <h3 className="mb-4">Edit Your Information</h3>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                     <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g., (123) 456-7890"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} className="mb-3">
                   <Form.Group>
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a little about yourself..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" className="update-btn">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Update Profile
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
