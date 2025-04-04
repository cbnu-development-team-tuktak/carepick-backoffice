// React 관련 import
import React, { useEffect, useState } from 'react'; // 컴포넌트 생성 및 상태, 생명주기 훅 사용
import { useSelector } from 'react-redux'; // Redux 전역 상태에서 값 가져오기

function SelfDiagnosisInput({ 
  onSubmit, // 입력 제출 시 실행되는 콜백 함수
  disabled, // 입력창 활성화 여부 (로딩 중 비활성화)
  value = '', // 외부에서 제어하는 입력창 기본값
  onChange // 입력값이 변경될 때 실행되는 콜백 함수
}) {
  const [input, setInput] = useState(value); // 입력창 상태 관리
  const [filteredSymptoms, setFilteredSymptoms] = useState([]); // 자동완성 추천 증상 목록

  // Redux 전역 상태에서 증상 목록을 가져옴
  const symptoms = useSelector((state) => state.symptoms.symptoms);

  // 현재 입력 중인 텍스트에서 마지막 큰따옴표 안에 있는 문자열을 추출
  const getCurrentQuotedKeyword = (text) => {
    const match = text.match(/"([^"]*)$/); // 마지막 큰따옴표 이후 문자 추출
    return match ? match[1] : '';
  };

  // 현재 입력 중인 따옴표 안 키워드를 실시간 추적
  const currentKeyword = getCurrentQuotedKeyword(input);

  useEffect(() => {
    // currentKeyword가 존재하고, 증상 목록(symptoms)이 비어있지 않은 경우에만 필터링 수행
    if (currentKeyword.length > 0 && symptoms.length > 0) {
      const filtered = symptoms
        // 현재 입력 중인 키워드로 시작하는 증상만 필터링
        .filter((s) => s.name.startsWith(currentKeyword))
        // 최대 5개까지만 추천 증상으로 표시
        .slice(0, 5);
      setFilteredSymptoms(filtered); // 필터링된 증상 목록을 상태로 설정
    } else {
      // 키워드가 없거나 증상 목록이 비어 있으면 추천 목록 초기화
      setFilteredSymptoms([]);
    }
  }, [input, symptoms]); // input 또는 symptoms가 변경될 때마다 실행됨

  // 입력창에서 Enter를 눌렀을 때 실행
  const handleSend = () => {
    // 입력값이 비어 있거나, 입력 비활성화 상태이면 아무 동작도 하지 않음
    if (input.trim() === '' || disabled) return;
    // 부모 컴포넌트로 입력값 전달 (진단 요청)
    onSubmit(input);
    // 입력창 초기화
    setInput('');
    // 추천 증상 목록 초기화
    setFilteredSymptoms([]);
  };

  // 입력창 내용이 변경될 때 실행
  const handleInputChange = (e) => { 
    // 입력값 상태로 저장
    setInput(e.target.value);
    // 외부에서 onChange 함수가 존재한다면 호출하여 상태 동기화
    onChange?.(e.target.value);
  };

  // 추천된 증상 배지를 클릭했을 때 실행
  const handleSelectSuggestion = (name) => {
    // 현재 입력 중인 큰따옴표 안 텍스트를 선택한 증상으로 교체
    const newText = input.replace(/"[^"]*$/, `"${name}" `);
    // 새 입력창으로 설정
    setInput(newText);
    // 추천 목록 초기화
    setFilteredSymptoms([]);
    // 외부에 변경된 입력값 전달
    onChange?.(newText);
  };

  return (
    <div className="p-2 border-top shadow mx-auto input-container">
      {/* 연관 검색어 추천 */}
      {currentKeyword && ( // 현재 입력 중인 키워드가 있을 때만 추천 증상 표시
        <div className="mt-2 bg-light border rounded p-2">
          {symptoms.length === 0 ? ( // 증상 정보가 아직 로딩되지 않은 경우
            <div className="d-flex align-items-center gap-2">
              {/* 로딩 스피너 */}
              <div className="spinner-border spinner-border-sm text-secondary" role="status" />
              <span className="text-secondary">증상 정보 로드 중입니다...</span>
            </div>
          ) : filteredSymptoms.length > 0 ? ( // 필터링된 증상이 있는 경우
            <>
              <strong>추천 증상</strong> {/* 추천 증상 표시 */}
              <div className="mt-1 d-flex flex-wrap gap-2">
                {filteredSymptoms.map((s) => ( // 필터링된 증상 목록을 순차적으로 표시
                  <span
                    key={s.id} // 고유 키
                    className="badge bg-secondary" // Bootstrap 배지 스타일 적용
                    style={{ cursor: 'pointer' }} // 클릭 가능한 느낌을 주기 위한 커서 스타일 
                    onClick={() => handleSelectSuggestion(s.name)} // 증상 클릭 시 해당 증상 선택
                  >
                    "{s.name}" {/* 추천 증상 이름 표시 */}
                  </span>
                ))}
              </div>
            </>
          ) : ( // 일치하는 증상이 없는 경우
            // 일치하는 증상이 없다는 메시지 표시
            <div className="text-muted">일치하는 증상이 없습니다.</div>
          )}
        </div>
      )}

      {/* 입력창 */}
      <input
        type="text" // 입력창 타입 설정
        className="form-control" // BootStrap 스타일 클래스 적용
        placeholder={`현재 발생한 증상을 입력해주세요. 예: "두통" "눈이 침침함"`} // 입력창에 보여줄 기본 안내 텍스트
        value={input} // 입력창 상태와 바인딩
        onChange={handleInputChange} // 입력값 변경 시 호출되는 함수
        onKeyDown={(e) => e.key === 'Enter' && handleSend()} // Enter 키가 눌리면 handleSend 함수 실행
        disabled={disabled} // disabled 상태일 경우 입력 불가
      />
    </div>
  );
}

export default SelfDiagnosisInput;
