// src/components/common/input/InputGroup.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * @param {Object} props
 * @param {string} label - 전체 필드의 레이블
 * @param {string} leftLabel - 첫 번째 필드의 이름 (예: 위도)
 * @param {string} leftValue - 첫 번째 필드 값
 * @param {string} rightLabel - 두 번째 필드의 이름 (예: 경도)
 * @param {string} rightValue - 두 번째 필드 값
 * @param {boolean} readOnly - 읽기 전용 여부 (기본값: true)
 */
const InputGroupField = ({
  label,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  readOnly = true,
}) => {
  return (
    <Form.Group className="mb-4">
      <Form.Label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{label}</Form.Label>
      <div className="input-group">
        <span className="input-group-text">{leftLabel}</span>
        <input
          type="text"
          className="form-control"
          value={leftValue}
          readOnly={readOnly}
        />
        <span className="input-group-text">{rightLabel}</span>
        <input
          type="text"
          className="form-control"
          value={rightValue}
          readOnly={readOnly}
        />
      </div>
    </Form.Group>
  );
};

export default InputGroupField;
