import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default function Footer() {
  return (
    <footer className="bg-light text-dark py-4 mt-5 border-top">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <h5 className="mb-3 fw-bold">JobPortal</h5>
            <p className="text-muted small">
              Connecting talent with opportunities. Find your next career move or the perfect candidate.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="mb-3 fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
          
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/jobs" className="text-muted text-decoration-none">Browse Jobs</Link></li>
              <li className="mb-2"><Link to="/post-job" className="text-muted text-decoration-none">Post a Job</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none">About Us</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className="mb-3 fw-bold">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-muted">Email: info@jobportal.com</li>
              <li className="mb-2 text-muted">Phone: (+91)3128983516</li>
              <li className="mb-2 text-muted">Address: Hyderabad ,New York </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center border-top pt-3">
            <p className="text-muted small">© {new Date().getFullYear()} JobQuest. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
