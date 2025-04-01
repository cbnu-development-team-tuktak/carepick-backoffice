// src/components/common/PageHeader.js
import React from 'react';

/**
 * 공통 페이지 헤더 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} props.description - 페이지 설명 문구
 * @param {React.ReactNode} [props.rightButton] - 오른쪽에 표시할 버튼 컴포넌트
 */
function PageHeader({ title, description, rightButton }) {
  return (
    <div className="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h2 className="fw-bold fs-2">{title}</h2>
        <p className="text-muted">{description}</p>
      </div>
      {/* 오른쪽에 버튼이 있으면 표시 */}
      <div>
        {rightButton}
      </div>
    </div>
  );
}

export default PageHeader;
