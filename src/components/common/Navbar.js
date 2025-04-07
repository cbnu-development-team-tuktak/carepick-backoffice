// React Router 관련 import
import { Link, NavLink, useLocation } from 'react-router-dom'; // 페이지 간 네비게이션을 위한 Link와 NavLink, useLocation 임포트
import { FaCog } from 'react-icons/fa'; // Font Awesome 톱니바퀴 아이콘 임포트

function Navbar() {
  const location = useLocation(); // 현재 URL 정보 가져오기

  // settings 페이지일 경우 아이콘 색상을 노란색으로 변경
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
            {/* 홈 메뉴 */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/" activeClassName="active">홈</NavLink>
            </li>

            {/* 관리 드롭다운 메뉴 */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                관리
              </a>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/symptom">증상 관리</NavLink></li>
                <li><NavLink className="dropdown-item" to="/disease">질병 관리</NavLink></li>
              </ul>
            </li>

            {/* 자가진단 메뉴 */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/self-diagnosis" activeClassName="active">자가진단</NavLink>
            </li>
          </ul>

          {/* 설정 메뉴 */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/settings">
                {/* settings 페이지일 경우 아이콘 색상을 노란색으로 변경 */}
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
