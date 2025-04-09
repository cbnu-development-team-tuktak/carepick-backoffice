// React 관련 import
import React from 'react'; // React 컴포넌트 기본 기능 사용

// 현재 입력된 증상 패널 컴포넌트
function CurrentSymptomPanel({ 
  accumulatedSymptoms, // 누적된 증상 키워드 목록
  onRemove // 증상 제거 함수
}) {
  return (
    <div className="mb-4">
      {/* 제목 */}
      <strong>현재 입력된 증상</strong>
      {/* 현재 입력된 증상을 보여주는 패널 영역 */}
      <div
        className={`mt-2 border rounded p-3 bg-light current-symptom-panel ${
          accumulatedSymptoms.length > 0 ? 'has-symptoms' : 'no-symptoms'
        }`}
      >
        {accumulatedSymptoms.length === 0 ? (
          // 입력된 증상이 없는 경우 안내 메시지 출력
          <span className="text-muted">증상을 입력하시면 여기에 표시됩니다.</span>
        ) : (
          // 입력된 증상 목록이 있는 경우 증상 목록을 배지 형태로 출력
          <div className="d-flex flex-wrap gap-2">
            {accumulatedSymptoms.map((symptom) => (
              // 각 증상은 파란색 배지로 표시되며, 제거 버튼(X)을 포함
              <span key={symptom} className="badge bg-primary p-2">
                {symptom}
                {/* X 버튼을 눌러 해당 증상 제거 */}
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
  );
}

export default CurrentSymptomPanel;
