// React 관련 import
import React, { useState } from 'react'; // React 및 상태 관리를 위한 useState
import { useSelector } from 'react-redux'; // Redux 전역 상태 접근용 useSelector

// 공통 컴포넌트 import
import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 제목 및 설명 컴포넌트
import SelfDiagnosisInput from '../../components/self-diagnosis/SelfDiagnosisInput'; // 사용자 입력창 컴포넌트
import SelfDiagnosisMessages from '../../components/self-diagnosis/SelfDiagnosisMessages'; // 대화 메시지 출력 컴포넌트
import CurrentSymptomList from '../../components/self-diagnosis/CurrentSymptomList'; // 현재 입력된 증상 리스트 컴포넌트
import SuggestedSymptomPanel from '../../components/self-diagnosis/SuggestedSymptomPanel'; // 추천 증상 패널 컴포넌트

// 서비스 함수 import
import { submitSymptomsForDiagnosis } from '../../services/selfDiagnosisService'; // 증상 키워드 기반 자가진단 요청 함수

// 큰따옴표로 묶인 증상 키워드를 추출하는 유틸 함수
const extractQuotedSymptoms = (text) => {
  // 정규식을 사용해 큰따옴표("...")로 묶인 부분만 모두 찾음
  const matches = text.match(/"([^\"]+)"/g);

  // 찾은 결과가 있을 경우, 큰따옴표를 제거하고 양쪽 공백 제거
  return matches ? matches.map((m) => m.replace(/"/g, '').trim()) : [];
};

function SelfDiagnosis() {
  // Redux 전역 상태에서 증상 리스트 불러오기
  const symptoms = useSelector((state) => state.symptoms.symptoms);

  // 채팅 메시지 목록 상태 (사용자/시스템 메시지 둘다 포함)
  const [messages, setMessages] = useState([]);

  // 요청 처리 중 로딩 여부를 나타내는 상태
  const [isLoading, setIsLoading] = useState(false);
  
  // 현재 입력창에 입력 중인 문자열 상태
  const [inputValue, setInputValue] = useState('');

  // 누적된 증상 키워드를 저장하는 상태 (사용자가 추가한 전체 증상)
  const [accumulatedSymptoms, setAccumulatedSymptoms] = useState([]);

  // 백엔드에서 추천받은 '함께 나타날 수 있는 증상' 리스트
  const [suggestedSymptoms, setSuggestedSymptoms] = useState([]);

  // 백엔드에서 추천받은 '추천 진료과' 리스트
  const [suggestedSpecialties, setSuggestedSpecialties] = useState([]);

  // 사용자가 증상을 입력하고 제출할 때 호출
  const handleSubmit = async (text) => {
    const newUserMessage = { // 사용자 메시지
      id: Date.now(), // 고유 ID 생성
      role: 'user', // 메시지 역할은 사용자로 지정
      content: text, // 입력한 텍스트
    };

    // 새 메시지를 이전 메시지 목록에 추가
    setMessages((prev) => [...prev, newUserMessage]);

    // 로딩 상태로 전환 (GPT 응답 대기 중)
    setIsLoading(true);

    // 큰 따옴표로 감싼 증상 키워드 추출
    const quoted = extractQuotedSymptoms(text);

    // 추출된 키워드 중 유효한 증상만 필터링
    const valid = quoted.filter((symptom) => symptoms.some((s) => s.name === symptom));

    // 기존에 누적된 증상과 병합 후 중복 제거
    const nextSymptoms = Array.from(new Set([...accumulatedSymptoms, ...valid]));

    // 누적 증상 상태 업데이트
    setAccumulatedSymptoms(nextSymptoms);

    // GPT 응답 대기용 메시지(빈 메시지) 추가
    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, role: 'gpt', content: '' }]);

    try {
      // 백엔드에 누적된 증상 리스트를 전송하고 결과 응답 수신
      const response = await submitSymptomsForDiagnosis(nextSymptoms);

      // 추천 증상(함께 나타날 수 있는 증상) 목록 업데이트
      setSuggestedSymptoms(response.suggestedSymptoms || []);

      // 추천 진료과 목록 업데이트 (여기 추가!)
      setSuggestedSpecialties(response.suggestedSpecialties || []);

      // 응답 메시지에서 질병 라인 개수 계산 (예: "- 감기" 형태로 시작하는 줄 개수)
      const diseaseLines = (response.message.match(/^-/gm) || []).length;

      // 응답 메시지를 header(요약) 외 body(질병 목록)로 분리
      const [header, ...rest] = response.message.split('\n');
      const bodyText = rest.join('\n').trim(); // 나머지 질병 리스트
      const notice = diseaseLines > 5 ? "\n(관련 질병이 많아 일부만 표시합니다.)" : ''; 

      // 메시지 최종 조합 (5개 초과 시 body 생략)
      const messageText = header + notice + (diseaseLines > 5 ? '' : ('\n' + bodyText));

      // GPT 메시지를 타자 애니메이션으로 출력
      let currentChar = 0;

      // 40ms마다 한 글자씩 출력하는 애니메이션 효과 출력
      const typingInterval = setInterval(() => {
        currentChar++; // 현재 출력할 글자 위치 증가
        const animatedText = messageText.slice(0, currentChar); // 현재까지의 텍스트

        // 현재 로딩 중인 메시지를 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId ? { ...msg, content: animatedText } : msg
          )
        );

        // 전체 텍스트 출력이 끝나면 타이핑 중단 및 로딩 해제
        if (currentChar >= messageText.length) {
          clearInterval(typingInterval); // 타이핑 애니메이션 중단
          setIsLoading(false); // 로딩 상태 해제

          // 메시지 2개 추가: GPT + 사용자형 진료과 선택 메시지
          setMessages((prev) => [
            ...prev,
            {
              id: loadingId + 1, // 고유 ID 부여
              role: 'user', // 사용자 메시지로 지정
              content: '', // 텍스트 없이 버튼만 출력
              suggestedSpecialties: response.suggestedSpecialties || [], // 추천 진료과 배열
            },
          ]);
        }
      }, 40); // 40ms마다 한 글자씩 출력
    } catch (error) { // 서버 요청 중 오류가 발생한 경우
      // 사용자에게 오류 메시지를 출력
      setMessages((prev) => [
        ...prev,
        { 
          id: loadingId, // GPT 응답 ID 유지
          role: 'gpt', // 역할: gpt
          content: '서버 오류가 발생했습니다. 다시 시도해 주세요.' // 오류 메시지 표시
        },
      ]);

      setIsLoading(false); // 로딩 사애 해제
    }
    setInputValue(''); // 입력창 비우기 (입력값 초기화)
  };

  // 사용자가 특정 증상을 제거할 때 호출
  const removeSymptom = (symptom) => {
    // 선택된 symptomd을 제외한 나머지 증상 목록 구성
    const next = accumulatedSymptoms.filter((s) => s !== symptom);

    // 누적 증상 목록 상태 갱신
    setAccumulatedSymptoms(next);

    // 시스템 메시지로 "제거되었습니다" 알림 추가
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), // 메시지 고유 ID
        role: 'gpt', // GPT 역할로 설정
        content: `증상 "${symptom}"이 제거되었습니다.`, // 사용자에게 보여줄 메시지
      },
    ]);
  };

  // 사용자가 추천 증상 중 하나를 선택했을 때 호출
  const handleAddSuggestedSymptom = (symptom) => {
    // 이미 추가된 증상이 아닌 경우에만 처리
    if (!accumulatedSymptoms.includes(symptom)) {
      // 해당 증상을 큰따옴표로 감싸서 다시 제출
      handleSubmit(`"${symptom}"`);
    }
  };

  return (
    <>
      {/* 전체 자가진단 화면의 본문 영역 */}
      <div className="container mt-4 mb-5">
        {/* 페이지 상단 제목 및 설명 */}
        <PageHeader
          title="자가진단"
          description="현재 증상을 입력하면 관련된 질병을 알려드려요."
        />

        {/* 현재까지 입력된 증상 목록 표시 */}
        <CurrentSymptomList
          accumulatedSymptoms={accumulatedSymptoms} // 누적된 증상 전달
          onRemove={removeSymptom} // 증상 제거 함수 전달
        />

        {/* 추천 증상 목록 (사용자가 추가할 수 있는 버튼 리스트) */}
        <SuggestedSymptomPanel
          suggestedSymptoms={suggestedSymptoms} // 추천 증상 배열 전달
          onAddSymptom={handleAddSuggestedSymptom} // 클릭 시 증상 추가 함수
        />

        {/* 사용자 및 GPT의 대화 메시지 영역 */}
        <SelfDiagnosisMessages 
          messages={messages} // 현재까지의 모든 메시지 목록 (사용자 입력 + GPT 응답 + 진료과 버튼 등 포함)
          setMessages={setMessages} // 메시지 상태 업데이트 함수
        />
      </div>

      {/* 하단 입력창 컴포넌트 (고정 위치) */}
      <SelfDiagnosisInput
        onSubmit={handleSubmit} // 입력 전송 함수
        disabled={isLoading} // 로딩 중일 땐 입력 비활성화
        value={inputValue} // 현재 입력값
        onChange={(val) => setInputValue(val)} // 입력값 변경 핸들러
      />
    </>
  );
}

export default SelfDiagnosis;
