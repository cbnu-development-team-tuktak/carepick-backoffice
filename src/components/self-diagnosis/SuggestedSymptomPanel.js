// React 관련 import
import React from 'react'; // React 라이브러리 import

function SuggestedSymptomPanel({ 
  suggestedSymptoms, // 추천된 증상 목록
  onAddSymptom // 증상을 추가하는 함수
}) {
  return (
    <div className="mb-4">
      {/* 제목 */}
      <strong>함께 나타날 수 있는 증상</strong>
      <div
        className={`mt-2 border rounded p-3 suggested-symptom-panel ${suggestedSymptoms.length > 0 ? 'has-symptoms' : 'no-symptoms'}`}
      >
        {suggestedSymptoms.length > 0 ? ( // 추천 증상이 있을 때
          <div className="d-flex flex-wrap gap-2">
            {suggestedSymptoms.map((symptom) => (
              // 각 증상 추천 버튼
              <button
                key={symptom} // 고유 키 값
                className="btn btn-outline-primary btn-sm" // 버튼 스타일
                onClick={() => onAddSymptom(symptom)} // 증상 추가 함수 호출
              >
                + {symptom} {/* 증상 이름 */}
              </button>
            ))}
          </div>
        ) : ( // 추천 증상이 없을 때
          // 메시지 표시
          <span className="text-muted">아직 추천할 증상이 없습니다.</span>
        )}
      </div>
    </div>
  );
}

export default SuggestedSymptomPanel;
