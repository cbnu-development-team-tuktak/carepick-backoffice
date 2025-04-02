import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash } from 'react-icons/fa';

function SymptomCard({ symptom, isEditing, onToggleEdit, onNameChange }) {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (isEditing) {
      onToggleEdit(symptom.id);
    } else {
      navigate(`/symptom/${symptom.id}`);
    }
  };

  return (
    <div className="card p-2 d-flex flex-row align-items-center justify-content-between symptom-card">
      <input
        type="text"
        className="form-control form-control-sm symptom-name-input"
        value={symptom.name}
        disabled={!isEditing}
        onChange={(e) => onNameChange(symptom.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="d-flex symptom-button-group" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn-sm btn-outline-primary symptom-icon-btn me-2"
          onClick={handleEditClick}
        >
          <FaPen size={14} />
        </button>
        <button
          className="btn btn-sm btn-outline-danger symptom-icon-btn"
          disabled
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}

export default SymptomCard;
