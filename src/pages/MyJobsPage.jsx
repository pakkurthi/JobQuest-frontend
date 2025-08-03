import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import JobService from '../services/job.service';
import { useAuth } from '../context/AuthContext';
import './MyJobsPage.css'; 

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isJobProvider } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isJobProvider()) {
      navigate('/');
      return;
    }
    
    const fetchMyJobs = async () => {
      try {
        const response = await JobService.getProviderJobs();
        setJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching your jobs:', err);
        setError('Failed to load your job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [isJobProvider, navigate]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await JobService.deleteJob(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Card className="p-4 mb-5 my-jobs-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 fw-bold">My Job Listings</h1>
            <p className="text-muted mb-0">Manage your posted jobs and view applications.</p>
          </div>
          <Link to="/post-job" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill me-2"></i>Post New Job
          </Link>
        </div>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {jobs.length === 0 && !loading ? (
        <Card className="text-center p-5 empty-state-card">
          <Card.Body>
            <i className="bi bi-briefcase-fill text-muted" style={{ fontSize: '3rem' }}></i>
            <h3 className="h5 mt-3">You haven't posted any jobs yet.</h3>
            <p className="text-muted">Click the button below to create your first listing and find the perfect candidate.</p>
            <Link to="/post-job" className="btn btn-primary mt-3">Post Your First Job</Link>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} className="g-4">
          {jobs.map((job) => (
            <Col key={job.id}>
              <Card className="job-listing-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <h2 className="h5 mb-1 job-title">
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                      </h2>
                      <p className="text-muted small mb-2">
                        <i className="bi bi-calendar-event me-1"></i>
                        Posted: {formatDate(job.createdAt)}
                      </p>
                      <div>
                        <Badge pill bg="light" text="dark" className="me-2">{job.location}</Badge>
                        <Badge pill bg="light" text="dark">{job.jobType || job.type}</Badge>
                      </div>
                    </Col>
                    <Col md={6} className="text-md-end mt-3 mt-md-0">
                      <div className="d-flex gap-2 justify-content-md-end">
                        <Link to={`/applications-management?jobId=${job.id}`} className="btn btn-sm btn-success action-btn">
                          <i className="bi bi-people-fill me-1"></i>Applications
                        </Link>
                        <Link to={`/edit-job/${job.id}`} className="btn btn-sm btn-primary action-btn">
                          <i className="bi bi-pencil-fill me-1"></i>Edit
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteJob(job.id)} className="action-btn">
                          <i className="bi bi-trash-fill me-1"></i>Delete
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
