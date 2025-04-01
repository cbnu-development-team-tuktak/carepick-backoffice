// src/components/doctor/DoctorImage.js
import React from 'react';

const DoctorImage = ({ imageUrl, isEditing, onFileChange }) => {
  const imageSrc = imageUrl || '/img/doctor/default-profile.jpeg'; // 기본 이미지를 여기서 처리

  const handleImageClick = () => {
    // 이미지 클릭 시 새 창에서 이미지를 엽니다.
    const newWindow = window.open('', '_blank');
    newWindow.document.body.innerHTML = `<img src="${imageSrc}" style="max-width: 100%; height: auto; margin: 0; display: block;"/>`;
  };

  return (
    <div className="mb-4">
      <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        의사 이미지
      </label>
      <div className="text-left">
        {/* 이미지 클릭 시 새 창에서 확대된 이미지를 볼 수 있도록 설정 */}
        <img
          src={imageSrc}
          alt="Doctor"
          className="img-fluid rounded mb-3"
          style={{
            width: '100px', // 이미지 너비
            height: '100px', // 이미지 높이
            objectFit: 'cover', // 비율에 맞춰 이미지 크기 조정
            cursor: 'pointer', // 클릭 가능한 모양으로 변경
            display: 'block', // 블록 요소로 설정
            margin: '0', // 기본 margin 제거하여 왼쪽 상단에 배치
          }}
          onClick={handleImageClick} // 이미지 클릭 시 새 창 열기
        />
        {isEditing && (
          <input
            type="file"
            className="form-control"
            onChange={onFileChange}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorImage;
