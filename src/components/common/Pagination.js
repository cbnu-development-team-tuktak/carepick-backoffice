// src/components/common/Pagination.js

import React from 'react';

/**
 * 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} page - 현재 페이지 번호 (0부터 시작)
 * @param {number} totalPages - 전체 페이지 수
 * @param {Function} onPageChange - 페이지 변경 시 호출할 콜백 함수
 */
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="mt-4 d-flex justify-content-center">
      <ul className="pagination">
        {/* 이전 페이지 버튼 */}
        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>&laquo;</button>
        </li>

        {/* 페이지 번호 목록 */}
        {[...Array(totalPages)].map((_, i) => (
          <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(i)}>{i + 1}</button>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li className={`page-item ${page + 1 >= totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
