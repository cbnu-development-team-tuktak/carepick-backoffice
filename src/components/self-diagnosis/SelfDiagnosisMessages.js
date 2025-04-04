// React 관련 import
import React from 'react'; // React 라이브러리 import

// 자가진단 메시지
function SelfDiagnosisMessages({ 
  messages // 보여줄 메시지 목록
}) {
  return (
    // 메시지 영역 컨테이너
    <div className="mx-auto p-3 rounded messages-container">
      {messages.map((msg, index) => (
        // 각 메시지의 역할에 따라 스타일 적용 (사용자 메시지 vs GPT 메시지)
        <div
          key={index} // 고유 키 값
          // 역할에 따라 클래슴여 변경
          className={`message ${msg.role === 'user' ? 'message-user' : 'message-gpt'}`}
        >
          {/* 메시지 내용 */}
          <span className="message-content">
            {msg.content} {/* 메시지 내용 출력 */}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SelfDiagnosisMessages;
