// components/Navbar.js
import { useNavigate } from 'react-router-dom';
import '../style/NavBar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        <button onClick={() => navigate('/apps')}><i className="bi bi-list-ul" style={{ marginRight: "8px" }}></i>List Apps</button>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout}><i className="bi bi-lock" style={{ marginRight: "8px" }}></i>Logout</button>
      </div>
    </nav>
  );
}
