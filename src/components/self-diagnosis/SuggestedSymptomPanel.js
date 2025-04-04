// React 관련 import
import React from 'react';

function SuggestedSymptomPanel({ suggestedSymptoms, onAddSymptom }) {
  return (
    <div className="mb-4">
      <strong>함께 나타날 수 있는 증상:</strong>
      <div
        className="mt-2 border rounded p-3"
        style={{
          minHeight: '60px',
          backgroundColor: suggestedSymptoms.length > 0 ? '#f8f9fa' : '#e9ecef',
        }}
      >
        {suggestedSymptoms.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {suggestedSymptoms.map((symptom) => (
              <button
                key={symptom}
                className="btn btn-outline-primary btn-sm"
                onClick={() => onAddSymptom(symptom)}
              >
                + {symptom}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-muted">아직 추천할 증상이 없습니다.</span>
        )}
      </div>
    </div>
  );
}

export default SuggestedSymptomPanel;