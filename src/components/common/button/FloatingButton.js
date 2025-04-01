// src/components/common/button/FloatingButton.js
import React from 'react';
import { FaPen, FaSave, FaPlus } from 'react-icons/fa'; // 아이콘 가져오기

const FloatingButton = ({ mode, onClick }) => {
  let icon;

  switch (mode) {
    case 'edit':
      icon = <FaPen size={24} />;
      break;
    case 'save':
      icon = <FaSave size={24} />;
      break;
    case 'add':
      icon = <FaPlus size={24} />;
      break;
    default:
      icon = <FaPlus size={24} />;
  }

  return (
    <button
      className="btn btn-primary position-fixed"
      style={{
        right: '20px',
        bottom: '20px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;
