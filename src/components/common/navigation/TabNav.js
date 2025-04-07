import React from 'react'; 
import { Nav } from 'react-bootstrap'; // 필요한 컴포넌트 import

function TabNav({ setActiveKey, menuItems }) {
  return (
    <Nav variant="pills" className="nav-pills nav-fill">
      {menuItems.map((item, index) => (
        <Nav.Item style={{ width: '50%' }} key={index}>
          <Nav.Link eventKey={item.key} onClick={() => setActiveKey(item.key)}>
            {item.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default TabNav;
