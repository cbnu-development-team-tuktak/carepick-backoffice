import React from 'react';
import { useNavigate } from 'react-router-dom';

function HospitalCard({ hospital }) {
  const navigate = useNavigate();

  const {
    id,
    name,
    address,
    specialties,
    images,
  } = hospital;

  const thumbnailUrl = images?.[0]?.url || '/img/hospital/default-thumbnail.jpg';

  return (
    <div
      className="card hospital-card shadow-sm"
      onClick={() => navigate(`/hospital/${id}`)}
      style={{ cursor: 'pointer', borderRadius: '12px' }}
    >
      <img
        src={thumbnailUrl}
        alt="병원 썸네일"
        className="card-img-top hospital-image"
      />

      <div className="card-body hospital-body">
        <h6 className="fw-bold mb-1 truncate-text">{name}</h6>
        <p className="text-muted small mb-1 truncate-text">
          {specialties?.length > 0 ? specialties.join(' | ') : '진료과 정보 없음'}
        </p>
        <p className="text-muted small mb-0 truncate-text">
          {address || '주소 정보 없음'}
        </p>
      </div>
    </div>
  );
}

export default HospitalCard;
