// components/hospital/HospitalImageViewer.jsx

import React, { useState } from 'react';
import HospitalImageCarousel from './HospitalImageCarousel';
import HospitalImageList from './HospitalImageList';

/**
 * 병원 이미지 확인용 뷰어 (슬라이드/목록 전환 가능)
 * 
 * @param {string[]} imageUrls - 병원 이미지 URL 배열
 */
function HospitalImageViewer({ imageUrls = [] }) {
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' 또는 'list'

  return (
    <div className="mb-4 hospital-thumbnail-list">
      {/* 모드 전환 버튼 */}
      <div className="text-end mb-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={(e) => {
            e.preventDefault();
            setViewMode((prev) => (prev === 'carousel' ? 'list' : 'carousel'));
          }}
        >
          {viewMode === 'carousel' ? '목록 보기' : '슬라이드 보기'}
        </button>
      </div>

      {/* 선택된 뷰 모드에 따라 이미지 출력 */}
      {viewMode === 'carousel' ? (
        <HospitalImageCarousel imageUrls={imageUrls} />
      ) : (
        <HospitalImageList imageUrls={imageUrls} />
      )}
    </div>
  );
}

export default HospitalImageViewer;
