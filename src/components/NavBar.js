// components/Navbar.js
import { useNavigate } from 'react-router-dom';
/**
 * 
 * @returns {JSX.Element} NavBar component with navigation links and logout functionality.
 * For now, the navbar includes links to Home, List Apps, and Logout.
 * Future improvements could include user profile access, settings, and responsive design.
 */
export function NavBar() {
  const navigate = useNavigate();

  const handleList = () => {
    navigate('/apps');
  }
  const handleLogout = () => {
    // Clear auth tokens or session
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/"><i className="bi bi-box-seam me-2"></i>Home</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="nav-link btn btn-link active" onClick={handleList}>
                  <i className="bi bi-list-ul me-1"></i>List Apps</button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-warning btn btn-link" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </>
  );
}
