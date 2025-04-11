// React 관련 import
import React from 'react'; // React 라이브러리 

const DayGroupSelection = ({ 
  selectedGroup, // 현재 선택된 그룹 ('weekday' 또는 'weekend')
  onChange // 그룹이 변경될 때 호출되는 콜백 함수그룹이 변경될 때 호출되는 콜백 함수
}) => {
  return (
    <select
      className="form-select" 
      value={selectedGroup} // 현재 선택한 값 (상위 컴포넌트에서 전달된 상태)
      onChange={(e) => { 
        if (typeof onChange === 'function') {
          onChange(e.target.value); // 선택된 값이 변경될 때 콜백 함수 호출 
        }
      }}
      style={{ 
        width: '112px', 
        height: '40px', 
        fontSize: '14px' 
      }}
    >
      <option value="">선택</option> {/* 기본 선택값 (선택 안 함) */}
      <option value="weekday">평일</option> {/* 월요일~금요일 */}
      <option value="weekend">주말</option> {/* 토요일~일요일 */}
      <option value="everyday">매일</option> {/* 매일 동일한 운영시간 */} 
    </select>
  );
};

export default DayGroupSelection;
