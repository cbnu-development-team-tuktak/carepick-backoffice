// React 관련 import
import React, { useState } from 'react'; // React 및 상태 관리를 위한 useState
import { useSelector } from 'react-redux'; // Redux 전역 상태 접근용 useSelector

// 공통 컴포넌트 import
import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 제목 및 설명 컴포넌트
import SelfDiagnosisInput from '../../components/self-diagnosis/SelfDiagnosisInput'; // 사용자 입력창 컴포넌트
import SelfDiagnosisMessages from '../../components/self-diagnosis/SelfDiagnosisMessages'; // 대화 메시지 출력 컴포넌트
import SelfDiagnosisPanelSection from '../../components/self-diagnosis/panel/SelfDiagnosisPanelSection'; // 모드에 따른 판넬 전환 컴포넌트

// 서비스 함수 import
import {
  submitSymptomsForDiagnosis,
  submitDiseasesForDiagnosis,
  submitNaturalTextForDiagnosis,
} from '../../services/self-diagnosis/selfDiagnosisService'; // 자가진단 API 요청 함수들

// 콤마로 구분된 텍스트를 배열로 추출하는 유틸 함수
const extractCommaSeparatedList = (text) => {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

function SelfDiagnosis() {
  const symptoms = useSelector((state) => state.symptoms.symptoms); // Redux에서 증상 목록 불러오기

  const [messages, setMessages] = useState([]); // 전체 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 여부
  const [inputValue, setInputValue] = useState(''); // 현재 입력창 값
  const [accumulatedSymptoms, setAccumulatedSymptoms] = useState([]); // 누적된 증상 목록
  const [suggestedSymptoms, setSuggestedSymptoms] = useState([]); // 추천 증상 목록
  const [suggestedSpecialties, setSuggestedSpecialties] = useState([]); // 추천 진료과 목록
  const [mode, setMode] = useState('증상'); // 현재 입력 모드 상태

  // 입력 제출 처리
  const handleSubmit = async (mode, inputText) => {
    setMode(mode); // 모드 동기화

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: inputText,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    let response;
    let nextSymptoms = [...accumulatedSymptoms];

    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, role: 'gpt', content: '' }]);

    try {
      if (mode === '증상') {
        const parsed = extractCommaSeparatedList(inputText);
        const valid = parsed.filter((symptom) =>
          symptoms.some((s) => s.name === symptom)
        );
        nextSymptoms = Array.from(new Set([...accumulatedSymptoms, ...valid]));
        setAccumulatedSymptoms(nextSymptoms);
        response = await submitSymptomsForDiagnosis(nextSymptoms);
      } else if (mode === '질병') {
        const diseases = extractCommaSeparatedList(inputText);
        response = await submitDiseasesForDiagnosis(diseases);
      } else if (mode === '자연어') {
        response = await submitNaturalTextForDiagnosis(inputText);
      }

      setSuggestedSymptoms(response.suggestedSymptoms || []);
      setSuggestedSpecialties(response.suggestedSpecialties || []);

      const diseaseLines = (response.message.match(/^-/gm) || []).length;
      const [header, ...rest] = response.message.split('\n');
      const bodyText = rest.join('\n').trim();
      const notice = diseaseLines > 5 ? "\n(관련 질병이 많아 일부만 표시합니다.)" : '';
      const messageText = header + notice + (diseaseLines > 5 ? '' : '\n' + bodyText);

      let currentChar = 0;
      const typingInterval = setInterval(() => {
        currentChar++;
        const animatedText = messageText.slice(0, currentChar);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId ? { ...msg, content: animatedText } : msg
          )
        );

        if (currentChar >= messageText.length) {
          clearInterval(typingInterval);
          setIsLoading(false);

          if ((response.suggestedSpecialties || []).length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                id: loadingId + 1,
                role: 'user',
                content: '',
                suggestedSpecialties: response.suggestedSpecialties,
              },
            ]);
          }
        }
      }, 40);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          role: 'gpt',
          content: '서버 오류가 발생했습니다. 다시 시도해 주세요.',
        },
      ]);
      setIsLoading(false);
    }

    setInputValue('');
  };

  // 증상 제거 처리
  const removeSymptom = (symptom) => {
    const next = accumulatedSymptoms.filter((s) => s !== symptom);
    setAccumulatedSymptoms(next);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'gpt',
        content: `증상 "${symptom}"이 제거되었습니다.`,
      },
    ]);
  };

  // 추천 증상 추가 처리
  const handleAddSuggestedSymptom = (symptom) => {
    if (!accumulatedSymptoms.includes(symptom)) {
      handleSubmit('증상', symptom);
    }
  };

  return (
    <>
      <div className="container mt-4 mb-5">
        <PageHeader
          title="자가진단"
          description="현재 증상을 입력하면 관련된 질병을 알려드려요."
        />

        {/* 모드에 따른 패널 영역 전환 */}
        <SelfDiagnosisPanelSection
          mode={mode}
          accumulatedSymptoms={accumulatedSymptoms}
          suggestedSymptoms={suggestedSymptoms}
          onRemoveSymptom={removeSymptom}
          onAddSymptom={handleAddSuggestedSymptom}
          onSelectExample={(text) => handleSubmit('자연어', text)}
        />

        <SelfDiagnosisMessages
          messages={messages}
          setMessages={setMessages}
        />
      </div>

      <SelfDiagnosisInput
        onSubmit={({ mode, value }) => handleSubmit(mode, value)}
        disabled={isLoading}
        value={inputValue}
        onChange={(val) => setInputValue(val)}
        mode={mode}
        setMode={setMode}
      />
    </>
  );
}

export default SelfDiagnosis;