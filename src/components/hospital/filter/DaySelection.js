import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import DayGroupSelection from './DayGroupSelection';

const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
const weekdays = ['월', '화', '수', '목', '금'];
const weekend = ['토', '일'];

const DaySelection = ({ selectedDays, toggleDay, setDays }) => {
  const [selectedGroup, setSelectedGroup] = useState('');

  const isWeekdaySelected = useMemo(
    () => weekdays.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  const isWeekendSelected = useMemo(
    () => weekend.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  const isEverydaySelected = useMemo(
    () => daysOfWeek.every(day => selectedDays.includes(day)),
    [selectedDays]
  );

  // ✅ 드롭다운에서 선택 시 로직
  const handleGroupChange = (newGroup) => {
    let groupDays = [];

    if (newGroup === 'weekday') groupDays = weekdays;
    else if (newGroup === 'weekend') groupDays = weekend;
    else if (newGroup === 'everyday') groupDays = daysOfWeek;

    // "선택" → 아무 것도 선택하지 않음
    setDays(groupDays);
    setSelectedGroup(newGroup);
  };

  // ✅ 선택된 요일에 따라 드롭다운 상태 자동 업데이트
  useEffect(() => {
    if (isEverydaySelected) {
      setSelectedGroup('everyday');
    } else if (isWeekdaySelected && !weekend.some(day => selectedDays.includes(day))) {
      setSelectedGroup('weekday');
    } else if (isWeekendSelected && !weekdays.some(day => selectedDays.includes(day))) {
      setSelectedGroup('weekend');
    } else {
      setSelectedGroup('');
    }
  }, [selectedDays]);

  return (
    <div className="mt-4">
      <label className="form-label">진료 시간 선택</label>
      <div className="d-flex gap-2 flex-wrap align-items-center">
        <DayGroupSelection
          selectedGroup={selectedGroup}
          onChange={handleGroupChange}
        />

        {daysOfWeek.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <Button
              key={day}
              variant={isSelected ? 'primary' : 'outline-primary'}
              onClick={() => toggleDay(day)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '50%',
                padding: '0',
                textAlign: 'center',
                borderColor: isSelected ? '#0d6efd' : '#d1d5db',
                color: isSelected ? '#ffffff' : '#000000',
              }}
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
