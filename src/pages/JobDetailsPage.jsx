import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import JobService from '../services/job.service';
import ApplicationService from '../services/application.service';
import { useAuth } from '../context/AuthContext';
import './JobDetailsPage.css'; 

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isJobProvider, isJobSeeker } = useAuth();
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await JobService.getJobById(id);
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplicationError(null);
    
    try {
      const applicationData = {
        jobId: job.id,
        coverLetter,
        resumeUrl: resumeUrl.trim() || undefined
      };
      
      await ApplicationService.applyForJob(applicationData);
      setApplicationSuccess(true);
      setSubmitting(false);
      
      setTimeout(() => {
        setShowApplyModal(false);
        setCoverLetter('');
        setResumeUrl('');
        setApplicationSuccess(false);
        
        if (window.confirm('Application submitted successfully! Would you like to view all your applications?')) {
          navigate('/my-applications');
        }
      }, 2000);
    } catch (err) {
      console.error('Error applying for job:', err);
      setApplicationError(err.response?.data?.message || 'Failed to apply. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="text-center p-4 mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!job) {
    return (
       <Container>
        <Alert variant="secondary" className="text-center p-4 mt-4">
          Job not found.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <div className="job-details-header">
        <Container>
          <div className="mb-4">
            <Link to="/jobs" className="text-white d-inline-flex align-items-center text-decoration-none back-link">
              <i className="bi bi-arrow-left-circle me-2"></i>
              Back to All Jobs
            </Link>
          </div>
          <h1 className="h2 fw-bold mb-2">{job.title}</h1>
          <div className="d-flex flex-wrap gap-4 header-meta">
            <span><i className="bi bi-building"></i>{job.company}</span>
            <span><i className="bi bi-geo-alt"></i>{job.location}</span>
            <span><i className="bi bi-calendar3"></i>Posted on {formatDate(job.createdAt)}</span>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <Card className="details-card">
          <Card.Body>
            <Row>
              <Col lg={8}>
                <div className="details-section mb-4">
                  <h2>Job Description</h2>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
                </div>

                {job.requirements && (
                  <div className="details-section mb-4">
                    <h2>Requirements</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
                  </div>
                )}

                {job.responsibilities && (
                  <div className="details-section mb-4">
                    <h2>Responsibilities</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{job.responsibilities}</p>
                  </div>
                )}
              </Col>
              
              <Col lg={4}>
                <Card className="overview-card">
                  <Card.Body>
                    <h3 className="h5 fw-bold mb-3">Job Overview</h3>
                    <ListGroup variant="flush">
                      {(job.jobType || job.type) && (
                        <ListGroup.Item className="d-flex align-items-start">
                          <span className="icon-label"><i className="bi bi-briefcase"></i></span>
                          <div>
                            <div className="small text-muted">Job Type</div>
                            <div className="fw-medium">{job.jobType || job.type}</div>
                          </div>
                        </ListGroup.Item>
                      )}
                      {job.category && (
                        <ListGroup.Item className="d-flex align-items-start">
                          <span className="icon-label"><i className="bi bi-tag"></i></span>
                          <div>
                            <div className="small text-muted">Category</div>
                            <div className="fw-medium">{job.category}</div>
                          </div>
                        </ListGroup.Item>
                      )}
                      {job.salary && (
                        <ListGroup.Item className="d-flex align-items-start">
                          <span className="icon-label"><i className="bi bi-cash-stack"></i></span>
                          <div>
                            <div className="small text-muted">Salary</div>
                            <div className="fw-medium">{job.salary}</div>
                          </div>
                        </ListGroup.Item>
                      )}
                      {job.experienceLevel && (
                        <ListGroup.Item className="d-flex align-items-start">
                           <span className="icon-label"><i className="bi bi-graph-up-arrow"></i></span>
                           <div>
                            <div className="small text-muted">Experience</div>
                            <div className="fw-medium">{job.experienceLevel}</div>
                          </div>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                    
                    <hr className="my-4" />

                    {!isJobProvider() && isJobSeeker() && (
                      <div className="d-grid">
                        <Button 
                          variant="primary"
                          className="apply-btn"
                          onClick={() => setShowApplyModal(true)}
                        >
                          <i className="bi bi-send-check me-2"></i>
                          Apply Now
                        </Button>
                      </div>
                    )}
                    
                    {!user && (
                      <div className="text-center">
                        <Button as={Link} to="/login" className="w-100 login-to-apply-btn">
                          Log In to Apply
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      
      <Modal show={showApplyModal} onHide={() => !submitting && setShowApplyModal(false)} centered backdrop="static">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Apply for {job?.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApply}>
          <Modal.Body>
            {applicationSuccess ? (
              <Alert variant="success">Application Submitted Successfully!</Alert>
            ) : (
              <>
                {applicationError && <Alert variant="danger">{applicationError}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Cover Letter</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're the best fit..."
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Resume URL (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://resumelink.com"
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          {!applicationSuccess && (
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowApplyModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? <Spinner as="span" size="sm" /> : 'Submit Application'}
              </Button>
            </Modal.Footer>
          )}
        </Form>
      </Modal>
    </>
  );
}
