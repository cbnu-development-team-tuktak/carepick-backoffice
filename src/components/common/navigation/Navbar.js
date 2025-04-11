// React Router 관련 import
import { Link, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';              
import NavItem from './NavItem';       
              
function Navbar() {
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';

  return (
    <nav className="navbar navbar-expand-lg navbar-primary">
      <div className="container-fluid">
        <Link className="navbar-brand font-weight-bold" to="/">Carepick</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavItem to="/" label="홈" />
            <NavItem to="/hospital" label="병원 관리" />
            <NavItem to="/doctor" label="의사 관리" />
            <NavItem to="/symptom" label="증상 관리" />
            <NavItem to="/disease" label="질병 관리" />
            <NavItem to="/self-diagnosis" label="자가진단" />
            <NavItem to="/terminal" label="터미널" />
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/settings">
                <FaCog style={{ color: isSettingsPage ? '#ffcc00' : 'white' }} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
