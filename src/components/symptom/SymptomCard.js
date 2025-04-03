// src/components/symptom/SymptomCard.js
import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa'; // FontAwesome 아이콘
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅

function SymptomCard({ 
  symptom, // 증상 객체
  isEditing, // 현재 수정 중인가 상태 여부
  onToggleEdit, // 수정 상태 토글 함수
  onNameChange, // 입력값 변경 처리 함수
  onDelete // 삭제 처리 함수
}) {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
    if (isEditing) {
      onToggleEdit(symptom.id); // 저장(토글) 동작 수행
    } else {
      navigate(`/symptom/${symptom.id}`); // 상세 페이지로 이동
    }
  };

  return (
    <div className="card p-2 d-flex flex-row align-items-center justify-content-between symptom-card">
      {/* 증상별 입력 필드 */}
      <input
        type="text"
        className="form-control form-control-sm symptom-name-input"
        value={symptom.name}
        disabled={!isEditing}
        onChange={(e) => onNameChange(symptom.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />

      {/* 수정/삭제 버튼 그룹 */}
      <div className="d-flex symptom-button-group" onClick={(e) => e.stopPropagation()}>
        {/* 수정 또는 저장 아이콘 버튼 */}
        <button
          className="btn btn-sm btn-outline-primary symptom-icon-btn me-2"
          onClick={handleEditClick}
        >
          <FaPen size={14} />
        </button>

        {/* 삭제 아이콘 버튼 */}
        <button
          className="btn btn-sm btn-outline-danger symptom-icon-btn"
          onClick={() => onDelete(symptom.id)} // 삭제 버튼 클릭 시 onDelete 호출
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}

export default SymptomCard;
