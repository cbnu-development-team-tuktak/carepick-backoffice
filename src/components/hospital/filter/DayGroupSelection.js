import React from 'react';

/**
 * 평일/주말/매일 선택용 드롭다운 컴포넌트
 * @param {string} selectedGroup - 현재 선택된 그룹
 * @param {function} onChange - 그룹 변경 핸들러
 */
const DayGroupSelection = ({ selectedGroup, onChange }) => {
  return (
    <select
      className="form-select"
      value={selectedGroup}
      onChange={(e) => {
        if (typeof onChange === 'function') {
          onChange(e.target.value);
        }
      }}
      style={{ width: '112px', height: '40px', fontSize: '14px' }}
    >
      <option value="">선택</option>
      <option value="weekday">평일</option>
      <option value="weekend">주말</option>
      <option value="everyday">매일</option>
    </select>
  );
};

export default DayGroupSelection;
