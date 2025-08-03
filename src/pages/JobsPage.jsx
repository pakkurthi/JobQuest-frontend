import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Badge, Pagination, Spinner, Alert } from 'react-bootstrap';
import JobService from '../services/job.service';
import './JobsPage.css'; 

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });

  const fetchJobs = async (page = 0, search = '') => {
    setLoading(true);
    try {
      let response;
      if (search) {
        response = await JobService.searchJobs(search, { page, size: pagination.size });
      } else {
        response = await JobService.getAllJobs({ page, size: pagination.size });
      }
      
      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
        setPagination({
          ...pagination,
          page: 0,
          totalPages: 1,
          totalElements: response.data.length
        });
      } else {
        setJobs(response.data.content || []);
        setPagination({
          ...pagination,
          page: response.data.number || 0,
          totalPages: response.data.totalPages || 0,
          totalElements: response.data.totalElements || 0
        });
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(0, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchJobs(newPage, searchTerm);
    }
  };

  return (
    <Container className="py-4">
      <header className="jobs-header">
        <h1 className="display-5 fw-bold mb-3">Explore Opportunities</h1>
        <p className="lead">Your next career move is just a search away. Dive into thousands of listings.</p>
      </header>
      
      <Card className="search-card">
        <Card.Body className="p-4">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-center">
              <Col md>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, company, or skill..."
                  className="form-control-lg"
                />
              </Col>
              <Col md="auto">
                <Button 
                  type="submit" 
                  variant="primary"
                  className="btn-lg"
                >
                  <i className="bi bi-search me-2"></i>
                  Find Jobs
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center p-4">
          {error}
        </Alert>
      ) : jobs.length === 0 ? (
        <Alert variant="light" className="text-center p-5">
          <h3 className="fw-semibold">No Jobs Found</h3>
          <p className="text-muted">
            {searchTerm 
              ? `We couldn't find any jobs matching "${searchTerm}". Try a different search.` 
              : 'There are no jobs available right now. Please check back soon!'}
          </p>
        </Alert>
      ) : (
        <>
          <Row xs={1} md={2} className="g-4">
            {jobs.map((job) => (
              <Col key={job.id} className="job-card-grid-item">
                <Card className="job-card">
                  <Card.Body>
                    <div>
                      <h2 className="fs-5 mb-1">
                        <Link to={`/jobs/${job.id}`} className="job-title-link">
                          {job.title}
                        </Link>
                      </h2>
                      <p className="company-name mb-3">{job.company}</p>
                      
                      
                      <div className="job-meta-details mb-3">
                        {(job.jobType || job.type) && (
                          <span className="job-meta-item">
                            <i className="bi bi-briefcase"></i>
                            {job.jobType || job.type}
                          </span>
                        )}
                        {job.location && (
                           <span className="job-meta-item">
                            <i className="bi bi-geo-alt"></i>
                            {job.location}
                          </span>
                        )}
                      </div>
                      
                      <p className="job-description">
                        {job.description}
                      </p>
                    </div>
                    
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-primary mt-auto align-self-start"
                    >
                      View Details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                />
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i}
                    active={pagination.page === i}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages - 1}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
