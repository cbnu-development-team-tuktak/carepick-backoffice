// React 관련 import
import React from 'react'; // React 라이브러리 import

function NaturalTextExamplePanel({ 
  examples, // 예시 문장 배열 (자연어 입력 예시)
  onSelectExample // 예시 문장 클릭 시 호출할 함수
}) {
  return (
    <div className="mb-4">
      {/* 제목 */}
      <strong>예시 문장으로 테스트해보세요</strong>

      {/* 예시 문장 리스트 영역 */}
      <div className="mt-2 border rounded p-3 bg-light">
        <div className="d-flex flex-column gap-2">
          {examples.map((sentence, index) => (
            // 각 예시 문장을 버튼으로 렌더링
            <button
              key={index} // 고유 키
              className="btn btn-light text-start border" // 좌측 정렬된 버튼
              onClick={() => onSelectExample(sentence)} // 선택 시 선택된 예시 전달
            >
              {sentence}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NaturalTextExamplePanel;
