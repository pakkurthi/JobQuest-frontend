import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form, Tabs, Tab } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import ApplicationService from '../services/application.service';
import { useAuth } from '../context/AuthContext';
import './ProviderApplicationsPage.css';

export default function ProviderApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [processingIds, setProcessingIds] = useState({});
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let response;
      
      if (jobId) {
        console.log(`Fetching applications for specific job ID: ${jobId}`);
        response = await ApplicationService.getApplicationsForJob(jobId);
      } else {
        console.log("Fetching all applications for job provider");
        response = await ApplicationService.getProviderApplications();
      }
      
      console.log("API Response:", response);
      
      if (response && response.data) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this application?`)) {
      try {
        setProcessingIds(prev => ({ ...prev, [applicationId]: true }));
        
        await ApplicationService.updateApplicationStatus(applicationId, newStatus);
        
        setApplications(applications.map(app =>
          app.id === applicationId 
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } 
            : app
        ));
        
        alert(`Application ${newStatus.toLowerCase()} successfully!`);
      } catch (err) {
        console.error(`Error ${newStatus.toLowerCase()}ing application:`, err);
        alert(`Failed to ${newStatus.toLowerCase()} application. Please try again.`);
      } finally {
        setProcessingIds(prev => ({ ...prev, [applicationId]: false }));
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'primary';
      case 'UNDER_REVIEW':
        return 'info';
      case 'SHORTLISTED':
        return 'info';
      case 'INTERVIEWED':
        return 'secondary';
      case 'OFFERED':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'WITHDRAWN':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => {
        if (activeTab === 'new') return app.status === 'APPLIED';
        if (activeTab === 'reviewing') return ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWED'].includes(app.status);
        if (activeTab === 'accepted') return ['ACCEPTED', 'OFFERED'].includes(app.status);
        if (activeTab === 'rejected') return app.status === 'REJECTED';
        if (activeTab === 'withdrawn') return app.status === 'WITHDRAWN';
        return true;
      });

  const getApplicationsCount = (tabKey) => {
    if (tabKey === 'all') return applications.length;
    if (tabKey === 'new') return applications.filter(app => app.status === 'APPLIED').length;
    if (tabKey === 'reviewing') return applications.filter(app => ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWED'].includes(app.status)).length;
    if (tabKey === 'accepted') return applications.filter(app => ['ACCEPTED', 'OFFERED'].includes(app.status)).length;
    if (tabKey === 'rejected') return applications.filter(app => app.status === 'REJECTED').length;
    if (tabKey === 'withdrawn') return applications.filter(app => app.status === 'WITHDRAWN').length;
    return 0;
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

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h1 className="h3 fw-bold mb-0">
            {jobId ? 'Applications for This Job' : 'All Applications'}
          </h1>
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
        
        <div>
          {jobId ? (
            <Link to="/applications-management" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>
              View All Applications
            </Link>
          ) : (
            <Link to="/my-jobs" className="btn btn-outline-primary">
              <i className="bi bi-briefcase me-1"></i>
              My Job Listings
            </Link>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 application-tabs"
      >
        <Tab 
          eventKey="all" 
          title={
            <span>
              All Applications 
              <Badge bg="secondary" className="ms-2">{getApplicationsCount('all')}</Badge>
            </span>
          }
        />
        <Tab 
          eventKey="new" 
          title={
            <span>
              New 
              <Badge bg="primary" className="ms-2">{getApplicationsCount('new')}</Badge>
            </span>
          }
        />
        <Tab 
          eventKey="reviewing" 
          title={
            <span>
              In Review 
              <Badge bg="info" className="ms-2">{getApplicationsCount('reviewing')}</Badge>
            </span>
          }
        />
        <Tab 
          eventKey="accepted" 
          title={
            <span>
              Accepted 
              <Badge bg="success" className="ms-2">{getApplicationsCount('accepted')}</Badge>
            </span>
          }
        />
        <Tab 
          eventKey="rejected" 
          title={
            <span>
              Rejected 
              <Badge bg="danger" className="ms-2">{getApplicationsCount('rejected')}</Badge>
            </span>
          }
        />
        <Tab 
          eventKey="withdrawn" 
          title={
            <span>
              Withdrawn 
              <Badge bg="secondary" className="ms-2">{getApplicationsCount('withdrawn')}</Badge>
            </span>
          }
        />
      </Tabs>

      {filteredApplications.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="py-4">
              <div className="empty-state-icon mb-3">
                <i className="bi bi-clipboard-x fs-1 text-primary opacity-50"></i>
              </div>
              <h3 className="h4 mb-3">No Applications Found</h3>
              <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "500px" }}>
                {activeTab === 'all' 
                  ? "You haven't received any job applications yet." 
                  : `You don't have any ${activeTab === 'new' ? 'new' : activeTab} applications at the moment.`}
              </p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} className="g-4">
          {filteredApplications.map((application) => (
            <Col key={application.id}>
              <Card className={`application-card ${application.status === 'WITHDRAWN' ? 'withdrawn' : ''}`}>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={9}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h2 className="h5 mb-1">
                            {application.jobTitle || 'Untitled Position'}
                          </h2>
                          <p className="company-name mb-2">{application.company || 'Your Company'}</p>
                          <div className="d-flex mb-3">
                            <Badge 
                              bg={getStatusBadgeVariant(application.status)} 
                              className="me-2 status-badge">
                              {application.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-muted small d-flex align-items-center">
                              <i className="bi bi-calendar me-1"></i>
                              Applied: {formatDate(application.appliedAt)}
                            </span>
                            {application.updatedAt && application.status !== 'APPLIED' && (
                              <span className="text-muted small ms-2 d-flex align-items-center">
                                <i className="bi bi-clock-history me-1"></i>
                                Updated: {formatDate(application.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="applicant-info mb-3 p-3 border rounded bg-light">
                        <h6 className="mb-2 fw-bold">
                          <i className="bi bi-person-circle me-2"></i>
                          Applicant Information
                        </h6>
                        <Row>
                          <Col md={4}>
                            <div className="mb-2 mb-md-0">
                              <strong>Name:</strong> {application.applicantName}
                            </div>
                          </Col>
                          <Col md={5}>
                            <div className="mb-2 mb-md-0">
                              <strong>Email:</strong> {application.applicantEmail}
                            </div>
                          </Col>
                          <Col md={3}>
                            {application.resumeUrl && (
                              <a 
                                href={application.resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-file-earmark-text me-1"></i>
                                View Resume
                              </a>
                            )}
                          </Col>
                        </Row>
                      </div>
                      
                      {application.coverLetter && (
                        <div className="mb-3">
                          <h6 className="fw-bold mb-2">Cover Letter</h6>
                          <div className="cover-letter-container">
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {application.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}
                    </Col>
                    
                    <Col md={3}>
                      <Card className="border-0 bg-light h-100">
                        <Card.Body className="d-flex flex-column">
                          <h6 className="fw-bold mb-3">Actions</h6>
                          
                          {application.status === 'APPLIED' && (
                            <>
                              <Button
                                variant="outline-primary"
                                className="mb-2 w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'UNDER_REVIEW')}
                              >
                                {processingIds[application.id] ? (
                                  <Spinner as="span" size="sm" animation="border" role="status" className="me-1" />
                                ) : (
                                  <i className="bi bi-eye me-1"></i>
                                )}
                                Mark as Reviewing
                              </Button>
                              
                              <Button
                                variant="success"
                                className="mb-2 w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                              >
                                {processingIds[application.id] ? (
                                  <Spinner as="span" size="sm" animation="border" role="status" className="me-1" />
                                ) : (
                                  <i className="bi bi-check-circle me-1"></i>
                                )}
                                Accept
                              </Button>
                              
                              <Button
                                variant="danger"
                                className="w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                              >
                                {processingIds[application.id] ? (
                                  <Spinner as="span" size="sm" animation="border" role="status" className="me-1" />
                                ) : (
                                  <i className="bi bi-x-circle me-1"></i>
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {application.status === 'UNDER_REVIEW' && (
                            <>
                              <Button
                                variant="outline-primary"
                                className="mb-2 w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'SHORTLISTED')}
                              >
                                <i className="bi bi-list-check me-1"></i>
                                Shortlist
                              </Button>
                              
                              <Button
                                variant="success"
                                className="mb-2 w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Accept
                              </Button>
                              
                              <Button
                                variant="danger"
                                className="w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                              >
                                <i className="bi bi-x-circle me-1"></i>
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {['SHORTLISTED', 'INTERVIEWED'].includes(application.status) && (
                            <>
                              <Button
                                variant="success"
                                className="mb-2 w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Accept
                              </Button>
                              
                              <Button
                                variant="danger"
                                className="w-100"
                                disabled={processingIds[application.id]}
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                              >
                                <i className="bi bi-x-circle me-1"></i>
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {['ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(application.status) && (
                            <div className="text-center py-3">
                              <p className="mb-2 text-muted">
                                {application.status === 'ACCEPTED' && (
                                  <>
                                    <i className="bi bi-check-circle-fill text-success me-2 fs-4"></i>
                                    <br/>
                                    This application has been accepted.
                                  </>
                                )}
                                
                                {application.status === 'REJECTED' && (
                                  <>
                                    <i className="bi bi-x-circle-fill text-danger me-2 fs-4"></i>
                                    <br/>
                                    This application has been rejected.
                                  </>
                                )}
                                
                                {application.status === 'WITHDRAWN' && (
                                  <>
                                    <i className="bi bi-dash-circle-fill text-secondary me-2 fs-4"></i>
                                    <br/>
                                    This application was withdrawn by the applicant.
                                  </>
                                )}
                              </p>
                              
                              {application.updatedAt && (
                                <p className="small text-muted mb-0">
                                  {formatDate(application.updatedAt)}
                                </p>
                              )}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
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
