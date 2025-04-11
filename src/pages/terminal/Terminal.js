// // Terminal.jsx

// // React 및 기본 훅 import
// import React, { useEffect, useState, useRef } from 'react'; // 컴포넌트 작성 및 상태/생명주기/DOM 참조 훅 사용

// // 실시간 통신 관련 라이브러리
// import SockJS from 'sockjs-client'; // WebSocket 연결을 위한 SockJS 클라이언트
// import { Client } from '@stomp/stompjs'; // 최신 STOMP 클라이언트 사용

// // 공통 컴포넌트 import
// import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 헤더

// function Terminal() {
//   // 수신한 로그 메시지를 저장하는 배열
//   const [logs, setLogs] = useState([]);

//   // WebSocket 연결 상태 (null = 시도 전, true = 연결 성공, false = 연결 실패)
//   const [isConnected, setIsConnected] = useState(null);

//   // 애니메이션용 점 개수 (0~3)
//   const [dotCount, setDotCount] = useState(0);

//   // 로그 출력 영역의 DOM 요소에 접근하기 위한 ref (자동 스크롤에 사용)
//   const logBoxRef = useRef(null);

//   useEffect(() => {
//     // 서버가 살아 있는지 확인
//     const checkServerHealth = async () => {
//       try {
//         // 서버에 ping 요청을 보냄 (응답 여부로 상태 판단)
//         const res = await fetch('/api/log/ping');
//         if (res.ok) { // 서버가 정상 응답한 경우
          
//           setIsConnected(true); // 연결 성공으로 업데이트 
//           connectWebSocket(); // 웹 소켓 연결 시도
//         } else { // 서버가 비정상 응답한 경우
//           setIsConnected(false); // 연결 실패로 업데이트
//         }
//       } catch (err) {
//         // 서버가 응답하지 않을 경우
//         console.error('서버 연결 실패:', err);
//         setIsConnected(false); // 연결 실패로 업데이트
//       }
//     };

//     // 웹 소켓 연결
//     const connectWebSocket = () => {
//       try {
//         // STOMP 클라이언트 인스턴스 생성
//         const stompClient = new Client({
//           // SockJS를 사용하는 WebSocket 팩토리 함수
//           webSocketFactory: () =>
//             new SockJS('/ws-logs', null, {
//               transports: ['websocket'], // fallback 방지
//             }),
//           debug: () => {}, // 디버그 로그 제거
//           reconnectDelay: 0, // 자동 재연결 비활성화
//         });

//         // 연결 성공 시 콜백
//         stompClient.onConnect = () => {
//           // /topic/logs 채널 구독
//           stompClient.subscribe('/topic/logs', (message) => {

//             if (message.body) {
//               setLogs((prevLogs) => [...prevLogs, message.body]);
//             }
//           });
//         };

//         // 연결 실패 시 콜백
//         stompClient.onStompError = (error) => {
//           console.error('STOMP 연결 에러:', error);
//           setIsConnected(false); // 실패 상태로 설정
//         };

//         // WebSocket 연결 시작
//         stompClient.activate();

//         // 클린업: 컴포넌트 언마운트 시 연결 종료
//         return () => {
//           stompClient.deactivate();
//         };
//       } catch (e) {
//         // STOMP 클라이언트 초기화 중 예외 발생
//         console.error('WebSocket 초기화 에러:', e);
//         setIsConnected(false);
//       }
//     };

//     // 컴포넌트 마운트 시 서버 상태 확인
//     checkServerHealth();
//   }, []);

//   // 점 애니메이션을 위한 useEffect
//   useEffect(() => {
//     // 서버 연결이 성공하고, 아직 수신된 로그가 없는 경우
//     if (isConnected === true && logs.length === 0) {
//       // 0.5초마다 점 개수(docCount) 값을 증가시켜 점 개수를 순환
//       const interval = setInterval(() => {
//         setDotCount((prev) => (prev + 1) % 4); // 0 → 1 → 2 → 3 → 0 반복
//       }, 500);

//       // 컴포넌트 언마운트 또는 조건 변화 시 타이머 해제 (클린업)
//       return () => clearInterval(interval); 
//     }
//   }, [isConnected, logs.length]);

//   // 새 로그가 추가되면 스크롤을 맨 아래로 이동
//   useEffect(() => {
//     if (logBoxRef.current) {
//       // 로그 출력 박스의 스크롤을 가장 아래로 이동
//       logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
//     }
//   }, [logs]); // logs가 변경될 때마다 실행

//   return (
//     <div className="container px-0">
//       <PageHeader
//         title="터미널"
//         description="백엔드 로그 및 시스템 메시지를 실시간으로 확인할 수 있는 페이지입니다."
//       />

//       {/* 로그 출력 영역 (서버 연결 상태 + 로그 모두 포함) */}
//       <div ref={logBoxRef} className="logBox">
//         {/* 서버 연결에 실패한 경우 */}
//         {isConnected === false && (          
//           // 서버 연결 여부
//           <div>❌ 서버 연결 실패</div>
//         )}

//         {/* 서버 연결에 성공하고, 아직 로그가 없는 경우 */}
//         {isConnected === true && logs.length === 0 && (
//           // 서버 연결 여부와 로그 대기 메시지
//           <div>
//             ✅ 서버 연결 성공<br /> 
//             🔄 로그 수신 대기 중{".".repeat(dotCount)}
//           </div>
//         )}

//         {isConnected === true && logs.length > 0 && (
//           <>
//             {/* 서버 연결 여부 */}
//             <div>✅ 서버 연결 성공</div>
            
//             {/* 로그 목록 */}
//             {logs.map((log, index) => (
//               <div key={index}>
//                 {typeof log === 'string'
//                   ? log.replaceAll('<', '&lt;') // HTML 태그 깨짐 방지
//                   : JSON.stringify(log) // JSON인 경우 문자열 변환
//                 } 
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Terminal;
