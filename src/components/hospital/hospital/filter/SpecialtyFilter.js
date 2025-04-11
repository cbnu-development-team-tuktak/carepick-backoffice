// React 관련 import
import React from 'react'; // React 컴포넌트 생성을 위한 기본 라이브러리
import { Form, Row, Col } from 'react-bootstrap'; // Bootstrap의 Form 구성 요소 및 레이아웃(Row, Col) 컴포넌트 사용

// 선택 가능한 진료과 목록 상수 정의 (전국 공통 진료과 기준)
const SPECIALTIES = [
  "가정의학과", "내과", "마취통증의학과", "방사선종양학과", "병리과", "산부인과",
  "성형외과", "소아청소년과", "신경과", "신경외과", "안과", "영상의학과", "외과",
  "이비인후과", "정신건강의학과", "직업환경의학과", "치과", "한방과", "흉부외과"
];

function SpecialtyFilter({ 
  selectedSpecialties = [], // 현재 선택된 진료과 리스트
  onChange // 진료과 선택 또는 해제 시 호출되는 콜백 함수
}) {
  // 진료과 토글 함수
  const handleToggle = (specialty) => {
    // 이미 선택된 진료과라면 목록에서 제거, 아니면 추가
    const updated = selectedSpecialties.includes(specialty) 
      ? selectedSpecialties.filter(s => s !== specialty) // 선택 해제
      : [...selectedSpecialties, specialty]; // 선택 추가

    onChange(updated); // 변경된 진료과 목록을 부모 컴포넌트로 전달
  };

  return (
    // 전체 진료과 선택 영역
    <Form.Group className="specialty-filter mb-4">
      {/* 진료과 섹션 제목 */}
      <Form.Label>진료과 선택</Form.Label>
      {/* 2열 그리드 형태의 진료과 버튼 목록 */}
      <Row className="no-gap">
        {/* 전체 진료과 반복 렌더링 */}
        {SPECIALTIES.map((specialty, idx) => (
          <Col xs={6} key={idx} className="no-gap">
            {/* 진료과 항목 클릭 시 toggle 기능 수행 */}
            <div
              className={`specialty-box ${selectedSpecialties.includes(specialty) ? 'selected' : ''}`}
              onClick={() => handleToggle(specialty)} // 클릭 시 토글 함수 실행
            >
              {specialty} {/* 진료과 이름 출력 */}
            </div>
          </Col>
        ))}
      </Row>
    </Form.Group>
  );
}

export default SpecialtyFilter;
