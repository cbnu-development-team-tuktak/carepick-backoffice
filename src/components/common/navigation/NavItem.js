// NavItem.jsx

// React 관련 import
import React from 'react'; // react 컴포넌트 사용을 위한 기본 import
import { NavLink } from 'react-router-dom'; // 현재 경로 기반으로 스타일이 자동 적용되는 링크 컴포넌트

const NavItem = ({ 
  to, // 이동 대상 경로 (예: '/home')
  label // 네비게이션이 표시될 이름 (예: /홈')
}) => (
  <li className="nav-item">
    <NavLink
      // 이동 대상 경로
      to={to} 
      // 현재 경로와 일치할 경우 'active' 클래스를 자동으로 붙임
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
    >
      {label} {/* 네비게이션 표시 이름 */}
    </NavLink>
  </li>
);

export default NavItem;
