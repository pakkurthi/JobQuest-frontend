import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import JobService from '../services/job.service';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import './HomePage.css'; 

export default function HomePage() {
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      setLoading(true);
      try {
        const response = await JobService.getFeaturedJobs();
        setFeaturedJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
        try {
          const fallbackResponse = await JobService.getAllJobs({ page: 0, size: 6 });
          setFeaturedJobs(fallbackResponse.data.content || []);
        } catch (fallbackErr) {
          setError('Failed to load jobs. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <>
      <div className="homepage-wrapper">
        <section className="interactive-hero">
          <h1>Find Your Next Big Opportunity</h1>
          <p>
            Explore thousands of job openings from top companies and find the role that's right for you. Your career journey starts here.
          </p>
          <Form className="main-search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Job title, keyword, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="primary">
              <i className="bi bi-search me-2"></i>Search
            </Button>
          </Form>
        </section>

        <Container>
          
          <section className="category-section">
            <h2 className="text-center h3 fw-bold mb-4">Explore by Category</h2>
            <Row>
              <Col md={3} className="mb-4">
                <Link to="/jobs?category=Engineering" className="category-card">
                  <div className="icon"><i className="bi bi-gear-wide-connected"></i></div>
                  <h5 className="fw-bold">Engineering</h5>
                  <p className="text-muted small">Find roles in software, mechanical, and civil engineering.</p>
                </Link>
              </Col>
              <Col md={3} className="mb-4">
                <Link to="/jobs?category=Marketing" className="category-card">
                  <div className="icon"><i className="bi bi-megaphone-fill"></i></div>
                  <h5 className="fw-bold">Marketing</h5>
                  <p className="text-muted small">Discover opportunities in digital marketing, SEO, and branding.</p>
                </Link>
              </Col>
              <Col md={3} className="mb-4">
                <Link to="/jobs?category=Design" className="category-card">
                  <div className="icon"><i className="bi bi-palette-fill"></i></div>
                  <h5 className="fw-bold">Design</h5>
                  <p className="text-muted small">Explore creative roles in UX/UI, graphic, and product design.</p>
                </Link>
              </Col>
              <Col md={3} className="mb-4">
                <Link to="/jobs" className="category-card">
                  <div className="icon"><i className="bi bi-grid-fill"></i></div>
                  <h5 className="fw-bold">View All</h5>
                  <p className="text-muted small">Browse through all available job openings across every category.</p>
                </Link>
              </Col>
            </Row>
          </section>

          <section className="featured-jobs-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 fw-bold">Hottest Opportunities</h2>
              <Link to="/jobs" className="btn btn-outline-primary btn-sm">View all jobs →</Link>
            </div>

            {loading ? (
              <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <Row>
                {featuredJobs.slice(0, 3).map((job) => ( 
                  <Col key={job.id} lg={4} md={6} className="mb-4">
                    <Card className="h-100 featured-job-card">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold h5 mb-2">{job.title}</Card.Title>
                        <Card.Subtitle className="text-muted mb-3">{job.company}</Card.Subtitle>
                        <div className="mb-3">
                          <Badge pill bg="light" text="dark" className="me-2">{job.location}</Badge>
                          <Badge pill bg="light" text="dark">{job.jobType || job.type}</Badge>
                        </div>
                        <div className="mt-auto">
                          <Link to={`/jobs/${job.id}`} className="btn btn-primary w-100">View Details</Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </Container>
      </div>
      <Footer />
    </>
  );
}
