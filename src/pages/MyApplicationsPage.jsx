import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApplicationService from '../services/application.service';
import { useAuth } from '../context/AuthContext';
import './MyApplicationsPage.css';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isJobSeeker } = useAuth();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      console.log("Calling ApplicationService.getMyApplications()");
      const response = await ApplicationService.getMyApplications();
      console.log("API Response:", response);
      
    
      if (response && response.data) {
        console.log("Applications data received:", response.data);
        setApplications(response.data);
      } else {
        console.warn("No applications data in response");
        setApplications([]);
      }
      setError(null); 
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications. Please try again later.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("MyApplicationsPage mounted - Fetching applications...");
    fetchApplications();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'WITHDRAWN':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, isWithdrawing: true } : app
        ));
        
        console.log(`Attempting to withdraw application ${applicationId}`);
        const response = await ApplicationService.withdrawApplication(applicationId);
        console.log('Withdraw response:', response);
        

        alert('Application withdrawn successfully');
        
        fetchApplications();
      } catch (err) {
        console.error('Error withdrawing application:', err);
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, isWithdrawing: false } : app
        ));
        alert('Failed to withdraw application. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center p-4">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  console.log("Applications to render:", applications);
  return (
    <Container className="py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <h1 className="h3 fw-bold mb-0">My Applications</h1>
          <Button 
            variant="link" 
            className="ms-2 p-0 text-primary" 
            onClick={fetchApplications}
            disabled={loading}
            title="Refresh applications"
          >
            <i className={`bi bi-arrow-clockwise refresh-icon ${loading ? 'spin' : ''}`}></i>
          </Button>
        </div>
        <Link to="/jobs" className="btn btn-outline-primary">
          <i className="bi bi-search me-2"></i>
          Browse Jobs
        </Link>
      </div>
      


      {applications.length === 0 ? (
        <Card className="application-card text-center py-5">
          <Card.Body>
            <div className="py-4">
              <div className="empty-state-icon mb-3">
                <i className="bi bi-clipboard-x fs-1 text-primary opacity-50"></i>
              </div>
              <h3 className="h4 mb-3">No Applications Found</h3>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "500px" }}>
                You haven't applied to any jobs yet. Browse available positions and submit your first application.
              </p>
              <Link to="/jobs" className="btn btn-primary rounded-pill px-4 py-2">
                <i className="bi bi-search me-2"></i>
                Find Jobs to Apply
              </Link>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={1} className="g-4">
          {applications.map((application) => (
            <Col key={application.id}>
              <Card className={`application-card ${application.status === 'WITHDRAWN' ? 'withdrawn' : ''}`}>
                {application.status === 'WITHDRAWN' && (
                  <div className="withdrawn-badge">Withdrawn</div>
                )}
                {application.status === 'WITHDRAWN' && (
                  <div className="withdrawn-watermark">WITHDRAWN</div>
                )}
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 className="h5 mb-1">
                        <Link to={`/jobs/${application.jobId}`} className="job-title">
                          {application.jobTitle || 'Untitled Job'}
                        </Link>
                      </h2>
                      <p className="company-name mb-0">{application.company || 'Unknown Company'}</p>
                    </div>
                    <Badge 
                      bg={getStatusBadgeVariant(application.status)} 
                      className={`status-badge badge-${application.status.toLowerCase()}`}>
                      {application.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex flex-wrap mb-2">
                      <span className="job-detail">
                        <i className="bi bi-geo-alt"></i>
                        {application.location || 'Location not specified'}
                      </span>
                      <span className="job-detail">
                        <i className="bi bi-calendar"></i>
                        Applied: {formatDate(application.appliedAt)}
                      </span>
                      {application.updatedAt && (
                        <span className="d-flex align-items-center">
                          <i className="bi bi-clock-history me-1"></i>
                          Updated: {formatDate(application.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {application.coverLetter && application.coverLetter.trim() !== '' && (
                    <div className="mb-3">
                      <h6 className="fw-medium">Cover Letter</h6>
                      <div className="cover-letter-container">
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {application.coverLetter}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!application.coverLetter || application.coverLetter.trim() === '' ? (
                    <p className="mb-3 fst-italic text-muted">
                      <i className="bi bi-info-circle me-2"></i>
                      No cover letter was provided with this application
                    </p>
                  ) : null}
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="job-detail">
                      <span className="d-flex align-items-center">
                        <i className="bi bi-person"></i>
                        {application.applicantName}
                      </span>
                    </div>
                    
                    {(application.status === 'APPLIED' || application.status === 'PENDING') && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-3 py-1"
                        onClick={() => handleWithdraw(application.id)}
                        disabled={application.isWithdrawing}
                      >
                        {application.isWithdrawing ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-1"></i>
                            Withdraw Application
                          </>
                        )}
                      </Button>
                    )}
                    
                    {(application.status === 'APPROVED' || application.status === 'ACCEPTED') && (
                      <div className="d-flex align-items-center bg-success bg-opacity-10 text-success py-2 px-3 rounded">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <span className="fw-medium">Congratulations!</span>
                      </div>
                    )}
                    
                    {application.status === 'WITHDRAWN' && (
                      <div className="d-flex align-items-center bg-secondary bg-opacity-10 text-secondary py-2 px-3 rounded">
                        <i className="bi bi-calendar-x-fill me-2"></i>
                        <span className="fw-medium">Withdrawn on {formatDate(application.updatedAt || application.appliedAt)}</span>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
