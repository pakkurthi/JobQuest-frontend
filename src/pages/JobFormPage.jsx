import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import JobService from '../services/job.service';
import { useAuth } from '../context/AuthContext';
import './JobFormPage.css'; 

export default function JobFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { isJobProvider } = useAuth();
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    category: '',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    experienceLevel: ''
  });

  useEffect(() => {
    if (!isJobProvider()) {
      navigate('/');
      return;
    }
    
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const response = await JobService.getJobById(id);
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching job details:', err);
          setError('Failed to load job details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing, isJobProvider, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        jobType: formData.type,
        experienceLevel: formData.experienceLevel,
        category: formData.category,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
      };
      
      if (isEditing) {
        await JobService.updateJob(id, jobData);
        navigate(`/jobs/${id}`);
      } else {
        const response = await JobService.createJob(jobData);
        navigate(`/jobs/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      setError(err.response?.data?.message || 'Failed to save job. Please try again.');
      setSaving(false);
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
    <div className="job-form-wrapper">
      <Container className="py-5">
        <div className="text-center mb-5 form-title-header">
          <h1 className="display-5 fw-bold">
            {isEditing ? 'Refine Your Job Listing' : 'Create an Opportunity'}
          </h1>
          <p className="lead">
            Fill out the form below to attract the best talent for your team.
          </p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Card className="form-card">
          <Card.Header>
            <h5 className="mb-0">
              <i className="bi bi-file-earmark-text-fill me-2"></i>
              Job Details
            </h5>
          </Card.Header>
          <Card.Body className="p-4 p-md-5">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-4">
                  <Form.Group controlId="title">
                    <Form.Label className="fw-medium">Job Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior Software Engineer"/>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Group controlId="company">
                    <Form.Label className="fw-medium">Company <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Acme Corporation"/>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Group controlId="location">
                    <Form.Label className="fw-medium">Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. New York, NY or Remote"/>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Group controlId="type">
                    <Form.Label className="fw-medium">Job Type</Form.Label>
                    <Form.Select name="type" value={formData.type} onChange={handleChange}>
                      <option value="">Select Type...</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                 <Col md={6} className="mb-4">
                  <Form.Group controlId="salary">
                    <Form.Label className="fw-medium">Salary</Form.Label>
                    <Form.Control type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $50,000 - $70,000"/>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Group controlId="experienceLevel">
                    <Form.Label className="fw-medium">Experience Level</Form.Label>
                    <Form.Select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                      <option value="">Select Level...</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} className="mb-4">
                    <Form.Group controlId="description">
                        <Form.Label className="fw-medium">Job Description <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" name="description" rows={5} required value={formData.description} onChange={handleChange} placeholder="Provide a detailed description of the job..."/>
                    </Form.Group>
                </Col>
                <Col xs={12} className="mb-4">
                    <Form.Group controlId="requirements">
                        <Form.Label className="fw-medium">Requirements</Form.Label>
                        <Form.Control as="textarea" name="requirements" rows={4} value={formData.requirements} onChange={handleChange} placeholder="List the skills, qualifications, and experience required..."/>
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    <Form.Group controlId="responsibilities">
                        <Form.Label className="fw-medium">Responsibilities</Form.Label>
                        <Form.Control as="textarea" name="responsibilities" rows={4} value={formData.responsibilities} onChange={handleChange} placeholder="Outline the key responsibilities and duties..."/>
                    </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-3 mt-5">
                <Button variant="outline-secondary" onClick={() => navigate(-1)} className="px-4 py-2">Cancel</Button>
                <Button variant="primary" type="submit" disabled={saving} className="submit-btn">
                  {saving ? <Spinner as="span" size="sm" className="me-2" /> : <i className={`bi ${isEditing ? 'bi-check-circle-fill' : 'bi-plus-circle-fill'} me-2`}></i>}
                  {isEditing ? 'Update Job' : 'Post Job'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
