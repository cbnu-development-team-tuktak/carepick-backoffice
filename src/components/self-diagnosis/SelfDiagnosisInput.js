// React 관련 import
import React, { useEffect, useState } from 'react'; // 컴포넌트 생성 및 상태, 생명주기 훅 사용
import { useSelector } from 'react-redux'; // Redux 전역 상태에서 값 가져오기

// 아이콘 import (react-icons/fa)
import { FaStethoscope, FaVirus, FaCommentDots } from 'react-icons/fa'; // 청진기, 바이러스, 말풍선 아이콘

// 추천 검색어 패널 import
import SuggestedKeywordPanel from './panel/SuggestedKeywordPanel'; // 추천 검색어 패널 컴포넌트

function SelfDiagnosisInput({ 
  onSubmit, // 입력 제출 시 실행되는 콜백 함수
  disabled, // 입력창 활성화 여부 (로딩 중 비활성화)
  value = '', // 외부에서 제어하는 입력창 기본값
  onChange, // 입력값이 변경될 때 실행되는 콜백 함수
  mode, // 입력 모드 상태 ("증상" 또는 "질병" 또는 "자연어")
  setMode // 입력 모드 변경 함수 (부모 상태 제어용)
}) {
  const [input, setInput] = useState(value); // 입력창 상태 관리
  const [filteredItems, setFilteredItems] = useState([]); // 추천 검색어 목록

  const symptoms = useSelector((state) => state.symptoms.symptoms); // 증상 목록 (전역 상태)
  const diseases = useSelector((state) => state.diseases.diseases); // 질병 목록 (전역 상태)

  // 입력된 텍스트에서 마지막 콤마 이후 단어 추출
  const getCurrentKeyword = (text) => {
    const segments = text.split(','); // 콤마로 입력을 분리
    return segments[segments.length - 1].trim(); // 마지막 입력된 키워드만 추출 (공백 제거)
  };

  const currentKeyword = getCurrentKeyword(input); // 현재 입력 중인 키워드

  // 현재 모드에 따라 추천 대상 리스트 선택
  const candidates = mode === '증상' ? symptoms : mode === '질병' ? diseases : [];

  // 입력이 바뀔 때마다 추천 키워드 갱신
  useEffect(() => {
    // 자연어 모드일 경우 추천 키워드 기능 비활성화
    if (mode === '자연어') return setFilteredItems([]);

    // 현재 키워드와 후보군이 존재할 경우 필터링 수행
    if (currentKeyword.length > 0 && candidates.length > 0) {
      const filtered = candidates
        .filter((item) => item.name.startsWith(currentKeyword)) // 현재 키워드로 시작하는 항목만 추출
        .slice(0, 10); // 최대 10개까지만 제한
      setFilteredItems(filtered); // 필터링된 결과 저장
    } else {
      setFilteredItems([]); // 조건에 맞지 않으면 추천 키워드 비움
    }
  }, [input, symptoms, diseases, mode]); // input이나 후보군, 모드가 변경될 때마다 실행

  // 입력 제출 처리
  const handleSend = () => {
    // 입력값이 비어 있거나 버튼이 비활성화된 경우 전송 중단
    if (input.trim() === '' || disabled) return;

    // 상위 컴포넌트로 입력 데이터(mode와 함께) 전달
    onSubmit({ mode, value: input });

    // 입력창 초기화
    setInput('');

    // 추천 키워드 초기화
    setFilteredItems([]);
  };

  // 입력창 텍스트 변경 시 처리
  const handleInputChange = (e) => {
    // 입력 상태 업데이트
    setInput(e.target.value);

    // 외부에서 전달된 onChange 함수가 있을 경우 호출
    onChange?.(e.target.value);
  };

  // 추천 키워드 클릭 시 마지막 항목 교체
  const handleSelectSuggestion = (name) => {
    // 입력값을 콤마로 분리하여 배열로 만듦
    const segments = input.split(',');

    // 마지막 요소(현재 작성 중인 키워드)를 선택된 추천 키워드로 교체
    segments[segments.length - 1] = ` ${name}`;

    // 다시 문자열을 합치고, 뒤에 콤마+공백 추가
    const newText = segments.join(',').trim() + ', ';

    setInput(newText); // 입력값 업데이트
    setFilteredItems([]); // 추천 키워드 리스트 초기화
    onChange?.(newText); // 외부에 변경된 입력값 전달
  };

  // 모드 순환: 증상 -> 질병 -> 자연어 -> 증상 ...
  const handleModeSwitch = () => {
    setMode((prev) => {
      if (prev === '증상') return '질병';
      if (prev === '질병') return '자연어';
      return '증상';
    });
  };

  return (
    <div className="p-2 border-top shadow mx-auto input-container">
      {/* 추천 검색어 패널 */}
      <SuggestedKeywordPanel
        mode={mode} // 현재 입력 모드
        keyword={currentKeyword} // 현재 입력 중인 키워드 (콤마 뒤 단어)
        sourceItems={candidates} // 전체 후보 키워드 목록 
        suggestedKeywords={filteredItems} // 필터링된 추천 키워드 목록
        onSelectKeyword={handleSelectSuggestion} // 추천 키워드 클릭 시 처리 함수
      />

      {/* 입력창 + 모드 뱃지 */}
      <div className="input-group">
        {/* 현재 모드에 따라 아이콘과 텍스트 변경 */}
        <span className="input-group-text bg-light fw-bold d-flex align-items-center gap-2">
          {mode === '증상' ? <FaStethoscope /> : mode === '질병' ? <FaVirus /> : <FaCommentDots />}
          {mode} {/* 현재 모드 표시: 증상 / 질병 / 자연어 */}
        </span>

        {/* 사용자 입력창 */}
        <input
          type="text"
          className="form-control"
          placeholder={
            mode === '증상'
              ? '예: 기침, 콧물, 발열' // 증상 모드일 때 예시
              : mode === '질병'
              ? '예: 감기, 비염, 대상포진' // 질병 모드일 때 예시
              : '예: 어지럽고 속이 메스꺼워요' // 자연어 모드일 때 예시
          }
          value={input} // 현재 입력 값
          onChange={handleInputChange} // 입력 변경 시 상태 
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(); // Enter 키 입력 시 전송
            else if (e.key === '/' && !e.shiftKey) {
              e.preventDefault(); // '/' 키로 모드 순환 
              handleModeSwitch(); // 모드 변경 함수 호출
            }
          }}
          disabled={disabled} // 로딩 중일 때 입력 비활성화
        />
      </div>
    </div>
  );
}

export default SelfDiagnosisInput;
