// src/components/common/Pagination.js

// React 라이브러리 임포트
import React from 'react'; // React 라이브러리 임포트

function Pagination({ 
  page, // 현재 페이지 번호
  totalPages, // 전체 페이지 수
  onPageChange // 페이지 변경 시 호출될 콜백 함수
}) {
  return (
    <nav className="mt-4 d-flex justify-content-center"> {/* 페이지네이션 네비게이션 바 */}
      {/* 페이지 번호 목록을 나열하는 ul 태그 */}
      <ul className="pagination">
        {/* 이전 페이지 버튼 */}
        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}> {/* 첫 페이지일 경우 비활성화 */}
          <button className="page-link" onClick={() => onPageChange(page - 1)}>&laquo;</button> {/* 이전 페이지로 이동 */}
        </li>

        {/* 페이지 번호 목록 */}
        {[...Array(totalPages)].map((_, i) => ( //  전체 페이지 수만큼 페이지 번호를 생성
          <li key={i} className={`page-item ${page === i ? 'active' : ''}`}> {/* 현재 페이지는 active 클래스 적용 */}
            <button className="page-link" onClick={() => onPageChange(i)}>{i + 1}</button> {/* 페이지 번호 버튼 */}
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li className={`page-item ${page + 1 >= totalPages ? 'disabled' : ''}`}> {/* 마지막 페이지일 경우 비활성화 */}
          <button className="page-link" onClick={() => onPageChange(page + 1)}>&raquo;</button> {/* 다음 페이지로 이동 */}
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
