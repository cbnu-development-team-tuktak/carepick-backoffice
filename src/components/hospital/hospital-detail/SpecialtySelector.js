// React 관련 import
import React from 'react';
import { Row, Col, Form } from 'react-bootstrap'; // Bootstrap 컴포넌트 import

// 유틸 함수: 배열을 7개씩 나누는 chunk 함수
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

/**
 * 진료과 선택 컴포넌트 (7열 고정)
 *
 * @param {Object} props
 * @param {Array<{ id: string, name: string }>} props.specialties - 전체 진료과 리스트
 * @param {string[]} props.selected - 선택된 진료과 이름 목록
 * @param {function} props.onChange - 진료과 변경 핸들러 (string[] → void)
 */
function SpecialtySelector({ specialties = [], selected = [], onChange }) {
  // 진료과 토글 핸들러
  const handleToggle = (name) => {
    const updated = selected.includes(name)
      ? selected.filter(s => s !== name)
      : [...selected, name];
    onChange(updated);
  };

  // 7개씩 나누기 (row 단위)
  const chunks = chunkArray(specialties, 7);

  return (
    <Form.Group className="specialty-selector mb-4">
      <Form.Label className="fw-bold" style={{ fontSize: '1.2rem' }}>진료과 선택</Form.Label>
      {chunks.map((row, rowIndex) => (
        <Row key={rowIndex} className="no-gap">
          {row.map((specialty, colIndex) => (
            <Col key={colIndex} className="no-gap" style={{ width: `${100 / 7}%`, maxWidth: `${100 / 7}%` }}>
              <div
                className={`specialty-box ${selected.includes(specialty.name) ? 'selected' : ''}`}
                onClick={() => handleToggle(specialty.name)}
              >
                {specialty.name}
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </Form.Group>
  );
}

export default SpecialtySelector;
