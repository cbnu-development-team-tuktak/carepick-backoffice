// React 관련 import
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group'; // 애니메이션 효과용

// 하위 패널 import
import CurrentSymptomPanel from './CurrentSymptomPanel'; // 증상 목록
import SuggestedSymptomPanel from './SuggestedSymptomPanel'; // 추천 증상
import NaturalTextExamplePanel from './NaturalTextExamplePanel'; // 자연어 예시 문장

// 자연어 예시 문장 리스트
const exampleSentences = [
  '요즘 기침이 자주 나고 가래가 껴요',
  '머리가 지끈지끈 아프고 속이 메스꺼워요',
  '배가 아프고 설사가 계속돼요',
  '소화가 잘 안 되고 명치가 더부룩해요',
  '목이 따갑고 열이 나요',
];

function SelfDiagnosisPanelSection({
  mode, // 현재 입력 모드
  accumulatedSymptoms, // 입력된 증상 목록
  suggestedSymptoms, // 추천 증상 목록
  onRemoveSymptom, // 증상 제거 핸들러
  onAddSymptom, // 추천 증상 추가 핸들러
  onSelectExample, // 자연어 예시 문장 선택 핸들러
}) {
  const fadeRef = useRef(null); // 애니메이션을 위한 ref

  return (
    // 자가진단 입력 모드에 따라 보여지는 패널 영역
    <div className="panel-section mb-4">
      {/* '증상' 모드일 때만 표시되는 패널 */}
      <CSSTransition
        in={mode === '증상'} // 현재 모드가 '증상'일 때만 보여짐
        timeout={500} // 애니메이션 지속 시간 (0.5초)
        classNames="fade" // CSS 클래스 접두어 설정 (fade-enter, fade-exit 등)
        unmountOnExit // 숨길 때 DOM에서 제거
        nodeRef={fadeRef} // 애니메이션 대상 ref
      >
        {/* 증상 입력 패널 */}
        <div ref={fadeRef} className="fade-container">
          {/* 현재 입력된 증상 리스트 */}
          <CurrentSymptomPanel
            accumulatedSymptoms={accumulatedSymptoms}
            onRemove={onRemoveSymptom}
          />
          {/* 함께 나타날 수 있는 추천 증상 리스트 */}
          <SuggestedSymptomPanel
            suggestedSymptoms={suggestedSymptoms}
            onAddSymptom={onAddSymptom}
          />
        </div>
      </CSSTransition>

      {/* '자연어' 모드일 때만 예시 문장 패널만 표시 */}
      {mode === '자연어' && (
        <NaturalTextExamplePanel
          examples={exampleSentences} // 버튼으로 출력할 예시 문장 배열
          onSelectExample={onSelectExample} // 예시 클릭 시 상위에서 처리할 콜백 함수
        />
      )}
    </div>
  );
}

export default SelfDiagnosisPanelSection;
