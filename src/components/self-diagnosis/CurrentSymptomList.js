// React 관련 import
import React from 'react'; // React 컴포넌트 기본 기능 사용

// 현재 입력된 증상 목록을 표시
function CurrentSymptomList({ 
  accumulatedSymptoms, // 누적된 증상 키워드 목록
  onRemove // 증상 제거 함수
}) {
  return (
    <div className="mb-3">
      {/* 제목 텍스트 */}
      <strong>현재 입력된 증상</strong>
      <div className="mt-2">
        {/* 회색 배경의 출력 영역 */}
        <div className="bg-light border p-3 rounded min-vh-25">
          {accumulatedSymptoms.length === 0 ? (
            // 입력된 증상이 없는 경우 안내 메시지 출력
            <div className="text-muted">증상을 입력하시면 여기에 표시됩니다.</div>
          ) : (
            // 입력된 증상 목록을 파란색 배지로 표시하고, 각 증상마다 제거 버튼 포함
            <div className="d-flex flex-wrap gap-2">
              {accumulatedSymptoms.map((symptom) => (
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
    </div>
  );
}

export default CurrentSymptomList;
