import React from 'react';

function SymptomCard({ symptom, isEditing, onToggleEdit, onNameChange }) {
  return (
    <div className="card p-2 d-flex flex-row align-items-center justify-content-between"
         style={{
           minWidth: '280px',
           maxWidth: '280px',
           boxSizing: 'border-box',
         }}>
      <input
        type="text"
        value={symptom.name}
        disabled={!isEditing}
        onChange={(e) => onNameChange(symptom.id, e.target.value)}
        style={{
          width: '160px',
          height: '28px',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          paddingLeft: '6px',
          paddingRight: '6px',
          backgroundColor: isEditing ? '#fff' : '#eee',
          marginRight: '4px',
        }}
      />
      <div className="d-flex flex-row gap-1">
        <button
          className="btn btn-sm btn-primary"
          style={{ fontSize: '12px', padding: '2px 6px' }}
          onClick={() => onToggleEdit(symptom.id)}
        >
          {isEditing ? '저장' : '수정'}
        </button>
        <button
          className="btn btn-sm btn-danger"
          style={{ fontSize: '12px', padding: '2px 6px' }}
          disabled
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default SymptomCard;
