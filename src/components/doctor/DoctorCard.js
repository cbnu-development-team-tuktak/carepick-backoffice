import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

function DoctorCard({ id, name, profileImage, hospitalName, specialties }) {
  const navigate = useNavigate(); // ✅ 네비게이터 훅

  const nameWithoutTag = name.replace('[전문의]', '').trim();

  return (
    <div
      className="card doctor-card"
      onClick={() => navigate(`/doctor/${id}`)} // ✅ 클릭 시 이동
      style={{ cursor: 'pointer' }} // ✅ 마우스 커서 변경
    >
      <img
        src={profileImage || '/default-doctor.png'}
        alt="Doctor"
        className="card-img-top doctor-image"
      />

      <div className="card-body doctor-body">
        {/* 이름과 진료과 한 줄에 배치 */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">{nameWithoutTag}</h6>
          <span className="text-muted small">{specialties?.[0] || '정보 없음'}</span>
        </div>

        {/* 병원명 */}
        <p className="text-muted small mb-0">
          {hospitalName || '정보 없음'}
        </p>
      </div>
    </div>
  );
}

export default DoctorCard;
