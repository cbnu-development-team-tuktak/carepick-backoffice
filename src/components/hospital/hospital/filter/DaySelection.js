// React 관련 import
import React, { useEffect, useMemo, useState } from 'react';

// UI 라이브러리 import 
import { Button } from 'react-bootstrap'; // Bootstrap 버튼 컴포넌트 사용

// 컴포넌트 import
import DayGroupSelection from './DayGroupSelection'; // 평일/주말 그룹 선택 컴포넌트

// 요일 전체 목록 (select의 전체 option을 위함)
const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

// 평일 요일 목록 (select의 평일 option을 위함)
const weekdays = ['월', '화', '수', '목', '금'];

// 주말 요일 목록 (select의 주말 option을 위함)
const weekend = ['토', '일'];

const DaySelection = ({ 
  selectedDays, // 현재 선택된 요일 배열
  toggleDay, // 특정 요일 클릭 시 선택/해제 처리 함수
  setDays // 요일 전체를 설정하는 함수
}) => {
  // 선택된 그룹 상태 ('weekday', 'weekend' 등)
  const [selectedGroup, setSelectedGroup] = useState('');

  // 모든 평일이 선택되었는지 여부 계산 
  const isWeekdaySelected = useMemo(
    // selectedDays 배열에 weekdays의 모든 요일이 포함되어 있는지 확인
    () => weekdays.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  // 모든 주말이 선택되었는지 여부 계산
  const isWeekendSelected = useMemo(
    // selectedDays 배열에 weekend의 모든 요일이 포함되어 있는지 확인
    () => weekend.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  // 월-일 전체 요일이 모두 선택되었는지 여부 계산
  // selectedDays 배열에 daysOfWeek의 모든 요일이 포함되어 있는지 확인
  const isEverydaySelected = useMemo(
    () => daysOfWeek.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  // 요일 그룹(평일, 주말, 전체 등) 선택 시 호출되는 핸들러 함수
  const handleGroupChange = (newGroup) => {
    let groupDays = [];

    // 선택된 그룹에 따라 선택할 요일 배열 설정
    if (newGroup === 'weekday') groupDays = weekdays; // 평일 전체 선택
    else if (newGroup === 'weekend') groupDays = weekend; // 주말 전체 선택
    else if (newGroup === 'everyday') groupDays = daysOfWeek; // 전체 요일 선택

    // '선택 안 함'을 의미하는 경우에는 빈 배열이 그대로 유지됨

    // 선택된 요일 배열을 days로 업데이트
    setDays(groupDays);

    // 현재 선택된 요일 그룹 이름을 상태로 저장
    setSelectedGroup(newGroup);
  };

  
  // 선택된 요일
  useEffect(() => {
    // 모든 요일(월~일)이 선택된 경우      
    if (isEverydaySelected) {  
      // 매일(everyday) 그룹으로 설정
      setSelectedGroup('everyday'); 
    
    // 평일(월~금)만 선택된 경우
    } else if (isWeekdaySelected && !weekend.some(day => selectedDays.includes(day))) {
      // 평일(weekday) 그룹으로 설정
      setSelectedGroup('weekday');
    
    // 주말(토~일)만 선택된 경우
    } else if (isWeekendSelected && !weekdays.some(day => selectedDays.includes(day))) {
      // 주말(weekend) 그룹으로 설정
      setSelectedGroup('weekend');

    // 어느 그룹에도 정확히 일치하지 않는 경우
    } else {
      // 그룹 선택 해제
      setSelectedGroup('');
    }
  }, [selectedDays]); // 선택된 요일 상태(selectedDays)가 변경될 때마다 실행

  return (
    <div className="mt-4">
      {/* 진료 시간 선택 라벨 */}
      <label className="form-label">진료 시간 선택</label>
      {/* 요일 그룹 선택 영역 + 개별 요일 버튼 */}
      <div className="d-flex gap-2 flex-wrap align-items-center">
        
        {/* 평일 / 주말 / 전체 선택 등의 그룹 버튼 */}
        <DayGroupSelection
          selectedGroup={selectedGroup} // 현재 선택된 그룹 상태 (평일, 주말, 전체 선택)
          onChange={handleGroupChange} // 그룹 변경 시 호출될 핸들러
        />

        {/* 개별 요일 버튼 렌더링 (월~일) */}
        {daysOfWeek.map((day) => {
          // 현재 요일이 선택된 상태인지 여부
          const isSelected = selectedDays.includes(day);
          return (
            <Button
              key={day}
              variant={isSelected ? 'primary' : 'outline-primary'} // 선택된 경우 색상 강조
              onClick={() => toggleDay(day)} // 클릭 시 해당 요일 선택/해제
              className={`day-button ${isSelected ? 'selected' : ''}`} // 선택 상태에 따라 CSS 클래스 변경
            >
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelection;
