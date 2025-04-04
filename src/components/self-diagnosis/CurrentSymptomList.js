// React 관련 import
import React from 'react';

function CurrentSymptomList({ accumulatedSymptoms, onRemove }) {
  return (
    <div className="mb-3">
      <strong>현재 입력된 증상:</strong>
      <div className="mt-2">
        <div className="bg-light border p-3 rounded min-vh-25">
          {accumulatedSymptoms.length === 0 ? (
            <div className="text-muted">증상을 입력하시면 여기에 표시됩니다.</div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {accumulatedSymptoms.map((symptom) => (
                <span key={symptom} className="badge bg-primary p-2">
                  {symptom}
                  <button
                    className="btn btn-sm btn-close btn-close-white ms-2"
                    onClick={() => onRemove(symptom)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrentSymptomList;
