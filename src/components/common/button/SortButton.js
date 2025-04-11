// src/components/common/button/SortButton.js

import React from 'react';
import { Dropdown } from 'react-bootstrap';

/**
 * 정렬 버튼 컴포넌트
 * @param {string} current - 현재 선택된 정렬 기준
 * @param {string[]} options - 정렬 옵션 목록
 * @param {Function} onSelect - 정렬 기준 선택 시 호출되는 함수
 */
function SortButton({ current, options, onSelect }) {
  return (
    <Dropdown className="mb-3">
      <Dropdown.Toggle variant="primary">
        정렬: {current}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option, idx) => (
          <Dropdown.Item key={idx} onClick={() => onSelect(option)}>
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SortButton;
