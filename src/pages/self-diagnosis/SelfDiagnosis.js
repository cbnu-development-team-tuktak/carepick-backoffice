// React 관련 import
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// 공통 컴포넌트 import
import PageHeader from '../../components/common/PageHeader';
import SelfDiagnosisInput from '../../components/self-diagnosis/SelfDiagnosisInput';
import SelfDiagnosisMessages from '../../components/self-diagnosis/SelfDiagnosisMessages';
import CurrentSymptomList from '../../components/self-diagnosis/CurrentSymptomList';
import SuggestedSymptomPanel from '../../components/self-diagnosis/SuggestedSymptomPanel';

// 서비스 함수 import
import { submitSymptomsForDiagnosis } from '../../services/selfDiagnosisService';

// 큰따옴표에서 증상 키워드만 추출
const extractQuotedSymptoms = (text) => {
  const matches = text.match(/"([^\"]+)"/g);
  return matches ? matches.map((m) => m.replace(/"/g, '').trim()) : [];
};

function SelfDiagnosis() {
  const symptoms = useSelector((state) => state.symptoms.symptoms);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [accumulatedSymptoms, setAccumulatedSymptoms] = useState([]);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState([]);
  const [lastDiseaseCount, setLastDiseaseCount] = useState(0);
  const [lastDiseasesText, setLastDiseasesText] = useState('');

  const handleSubmit = async (text) => {
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const quoted = extractQuotedSymptoms(text);
    const valid = quoted.filter((symptom) => symptoms.some((s) => s.name === symptom));
    const nextSymptoms = Array.from(new Set([...accumulatedSymptoms, ...valid]));
    setAccumulatedSymptoms(nextSymptoms);

    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, role: 'gpt', content: '' }]);

    try {
      const response = await submitSymptomsForDiagnosis(nextSymptoms);
      setSuggestedSymptoms(response.suggestedSymptoms || []);

      // 병 개수 파악 및 내용 분리
      const diseaseLines = (response.message.match(/^-/gm) || []).length;
      setLastDiseaseCount(diseaseLines);

      const [header, ...rest] = response.message.split('\n');
      const bodyText = rest.join('\n').trim();
      const headerText = header + (diseaseLines > 5 ? "\n(관련 질병이 많아 일부만 표시합니다.)" : '');
      setLastDiseasesText(diseaseLines > 5 ? '' : bodyText);

      let currentChar = 0;
      const fullMessage = diseaseLines > 5 ? headerText : response.message;

      const typingInterval = setInterval(() => {
        currentChar++;
        const animatedText = fullMessage.slice(0, currentChar);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId ? { ...msg, content: animatedText } : msg
          )
        );
        if (currentChar >= fullMessage.length) {
          clearInterval(typingInterval);
          setIsLoading(false);
        }
      }, 40);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: loadingId, role: 'gpt', content: '서버 오류가 발생했습니다. 다시 시도해 주세요.' },
      ]);
      setIsLoading(false);
    }
    setInputValue('');
  };

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

  const handleAddSuggestedSymptom = (symptom) => {
    if (!accumulatedSymptoms.includes(symptom)) {
      handleSubmit(`"${symptom}"`);
    }
  };

  return (
    <>
      <div className="container mt-4 mb-5">
        <PageHeader
          title="자가진단"
          description="현재 증상을 입력하면 관련된 질병을 알려드려요."
        />

        <CurrentSymptomList
          accumulatedSymptoms={accumulatedSymptoms}
          onRemove={removeSymptom}
        />

        <SuggestedSymptomPanel
          suggestedSymptoms={suggestedSymptoms}
          onAddSymptom={handleAddSuggestedSymptom}
        />

        <SelfDiagnosisMessages messages={messages} />

        {lastDiseasesText && (
          <div className="alert alert-info white-space-pre-wrap mt-3">
            <pre>{lastDiseasesText}</pre>
          </div>
        )}
      </div>

      <SelfDiagnosisInput
        onSubmit={handleSubmit}
        disabled={isLoading}
        value={inputValue}
        onChange={(val) => setInputValue(val)}
      />
    </>
  );
}

export default SelfDiagnosis;