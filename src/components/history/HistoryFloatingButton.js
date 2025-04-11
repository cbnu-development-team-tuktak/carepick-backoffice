// src/components/common/button/HistoryFloatingButton.js

import React from 'react';
import FloatingButton from '../common/button/FloatingButton';

const HistoryFloatingButton = ({ onClick }) => {
  return (
    <FloatingButton
      mode="version" // 아이콘은 FaHistory로 고정됨
      onClick={onClick}
    />
  );
};

export default HistoryFloatingButton;
