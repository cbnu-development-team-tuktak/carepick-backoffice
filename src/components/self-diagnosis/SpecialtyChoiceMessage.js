import React from 'react';

// 진료과 선택 메시지 컴포넌트
function SpecialtyChoiceMessage({ 
  specialties = [], // 진료과 목록 (버튼으로 표시할 문자열 배열)
  onSelect, // 진료과 버튼 클릭 시 호출되는 콜백 함수 (ex. 로그 출력용)
  onComplete // 진료과 선택 완료 후 실행할 콜백 함수 (ex. 메시지 추가용)
}) {
  // 진료과가 없으면 아무것도 렌더링하지 않음
  if (!specialties || specialties.length === 0) return null;

  const handleClick = (specialty) => {
    // 선택된 진료과 처리
    onSelect?.(specialty); // 사용자가 진료과를 클릭했을 때 실행
    onComplete?.(specialty); // 선택 완료 시 실행되는 후처리 (ex. GPT 응답 메시지 추가)
  };

  return (
    // 사용자 쪽 메시지(오른쪽 정렬)로 렌더링
    <div className="message message-user">
      {/* 메시지 말풍선 내부 영역 */}
      <div className="message-content p-2">
        {/* 버튼들을 수직 정렬 (끝 정렬 + 간격 설정) */}
        <div className="d-flex flex-column align-items-end gap-2">
          {/* 전달받은 진료과 목록을 버튼으로 출력 */}
          {specialties.map((specialty, idx) => (
            <button
              key={idx} // 고유 키
              className="btn btn-outline-primary btn-sm text-nowrap" // 버튼 스타일
              style={{ width: '160px' }} // 버튼 너비 고정
              onClick={() => handleClick(specialty)} // 클릭 시 선택 처리 함수 호출
            >
              {specialty} {/* 진료과 이름 */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialtyChoiceMessage;
