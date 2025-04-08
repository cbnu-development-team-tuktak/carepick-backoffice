// React 관련 import
import React from 'react'; // React 라이브러리 import
import { useDispatch } from 'react-redux'; // Redux 액션 디스패치용
import { useNavigate } from 'react-router-dom'; // 페이지 이동 처리를 위한 훅

// Redux 액션 import
import { setSpecialties } from '../../store/hospitalFilterSlice'; // 병원 필터에서 진료과 설정 액션

// 컴포넌트 관련 import
import SpecialtyChoiceMessage from './SpecialtyChoiceMessage'; // 사용자에게 진료과 버튼 선택

function SelfDiagnosisMessages({ 
  messages, // 대화 메시지 목록 (사용자 및 GPT 메시지 포함)
  setMessages // 메시지 상태를 업데이트하는 함수
}) {
  const dispatch = useDispatch(); // Redux 디스패처
  const navigate = useNavigate(); // 페이지 이동 함수

  return (
    <div className="mx-auto p-3 rounded messages-container">
      {messages.map((msg, index) => {
        // 진료과 추천 메시지인 경우 (role이 'user'이고 suggestedSpecialties가 포함된 경우)
        if (msg.role === 'user' && msg.suggestedSpecialties) {
          return (
            <SpecialtyChoiceMessage
              key={index} // map 반복을 위한 고유 키 설정
              specialties={msg.suggestedSpecialties} // 추천된 진료과 배열을 전달
              onSelect={(specialty) => console.log(`진료과 선택됨: ${specialty}`)} // 선택 시 콘솔에 로그 출력
              onComplete={(specialty) => {
                // 진료과 선택 시 GGPT 응답 메시지 형식으로 병원 확인 메시지를 추가
                setMessages((prev) => [
                  ...prev, // 기존 메시지 유지
                  {
                    id: Date.now(), // 고유 ID 생성
                    role: 'gpt', // 시스템 메시지로 설정
                    content: (
                      <span
                        onClick={() => {
                          dispatch(setSpecialties([specialty])); // 클릭 시 진료과 필터 설정
                          navigate('/hospital'); // 병원 페이지로 이동
                        }}
                        className="btn btn-link p-0 text-decoration-none" // 스타일 그대로 유지
                        style={{ color: 'white', cursor: 'pointer' }} // 텍스트 색상 및 커서
                        role="button" // 접근성을 위한 역할 설정
                        tabIndex={0} // 키보드 접근 가능하게
                      >
                        <strong>{specialty}</strong>에 해당하는 병원을 확인하러 이동합니다 →
                      </span>
                    )
                  },
                ]);
              }}
            />
          );
        }

        // 일반 메시지
        return (
          <div
            key={index} // 반복을 위한 고유 키 값
            // 메시지 역할에 따라 클래스 다르게 적용
            className={`message ${msg.role === 'user' ? 'message-user' : 'message-gpt'}`}
          >
            <span className="message-content">
              {
                typeof msg.content === 'string' 
                  ? msg.content // 일반 텍스트일 경우 그대로 출력
                  : msg.content // 링크나 JSX 형식일 경우 그대로 렌더링 
              }
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SelfDiagnosisMessages;
