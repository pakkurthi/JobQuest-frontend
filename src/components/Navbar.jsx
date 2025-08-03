import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isJobProvider, isJobSeeker } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation items based on auth status and user role
  const navigation = [
    { name: 'HOME', href: '/', current: location.pathname === '/' },
    { name: 'JOBS', href: '/jobs', current: location.pathname === '/jobs' },
  ];
  
  // Add role-specific navigation items
  if (user) {
    if (isJobProvider()) {
      navigation.push(
        { name: 'MY JOB LISTINGS', href: '/my-jobs', current: location.pathname === '/my-jobs' },
        { name: 'APPLICATIONS', href: '/applications-management', current: location.pathname === '/applications-management' },
        { name: 'POST JOB', href: '/post-job', current: location.pathname === '/post-job' }
      );
    } else if (isJobSeeker()) {
      navigation.push(
        { name: 'MY APPLICATIONS', href: '/my-applications', current: location.pathname === '/my-applications' }
      );
    }
  }

  return (
    <BsNavbar bg="primary" variant="dark" expand="lg" className="mb-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/">JOBQUEST</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navigation.map((item) => (
              <Nav.Link 
                key={item.name}
                as={Link} 
                to={item.href}
                active={item.current}
              >
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown title={user.firstName || 'Account'} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">PROFILE</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>SIGN OUT</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">LOGIN</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-outline-light">REGISTER</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
