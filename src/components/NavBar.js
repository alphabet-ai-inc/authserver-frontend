// components/Navbar.js
import { useNavigate } from 'react-router-dom';
import '../style/NavBar.css';

export function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or session
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button onClick={() => navigate('/apps')}>📋 List Apps</button>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout}>🔒 Logout</button>
      </div>
    </nav>
  );
}
