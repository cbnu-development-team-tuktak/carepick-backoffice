// 추천 검색어 패널 컴포넌트
import React from 'react';

function SuggestedKeywordPanel({ 
  mode, // 현재 입력 모드
  keyword, // 현재 입력된 키워드 (검색어)
  sourceItems, // 기반 데이터 리스트 (예: DB에서 검색된 항목들)
  suggestedKeywords, // 추천 키워드 목록
  onSelectKeyword // 키워드 클릭 시 호출할 함수
}) {
  // 자연어 모드이거나 키워드가 비어 있을 경우 패널을 렌더링하지 않음
  if (mode === '자연어' || !keyword) return null;

  return (
    <div className="mt-2 bg-light border rounded p-2 suggested-keyword-panel">
      {sourceItems.length === 0 ? (
        // 데이터가 아직 로드되지 않은 경우 로딩 스피너와 메시지 출력
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm text-secondary" role="status" />
          <span className="text-secondary">
            {mode === '증상' ? '증상 정보 로드 중입니다...' : '질병 정보 로드 중입니다...'}
          </span>
        </div>
      ) : suggestedKeywords.length > 0 ? (
        <>
          {/* 추천 키워드가 존재하는 경우 */}
          <strong>추천 {mode} 검색어</strong>

          {/* 추천 키워드를 배지 형태로 표시 */}
          <div className="mt-1 d-flex flex-wrap gap-2">
            {suggestedKeywords.map((item) => (
              <span
                key={item.id} // 고유 키값 설정
                className="badge bg-secondary suggested-keyword" // 배지 스타일 클래스
                style={{ cursor: 'pointer' }} // 마우스 커서 포인터로 설정
                onClick={() => onSelectKeyword(item.name)} // 클릭 시 상위 함수 호출
              >
                {item.name} {/* 추천 키워드 텍스트 출력 */}
              </span>
            ))}
          </div>
        </>
      ) : (
        // 추천 키워드가 없을 경우 표시할 메시지
        <div className="text-muted">일치하는 {mode} 검색어가 없습니다.</div>
      )}
    </div>
  );
}

export default SuggestedKeywordPanel;
