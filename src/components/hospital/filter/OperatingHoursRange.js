import React, { useState, useEffect } from 'react';
import DaySelection from './DaySelection';
import TimeSelection from './TimeSelection';

const OperatingHoursRange = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(''); // ✅ 에러 메시지 상태

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ✅ 종료 시간 자동 계산 + 자정 초과 예외 처리
  useEffect(() => {
    if (startTime && duration) {
      const [hour, minute] = startTime.split(':').map(Number);
      const totalStartMinutes = hour * 60 + minute;
      const totalEndMinutes = totalStartMinutes + Number(duration);

      if (totalEndMinutes >= 24 * 60) {
        // 자정(00:00)을 넘으면 경고
        setEndTime('');
        setError('종료 시간은 자정을 초과할 수 없습니다. 범위를 다시 지정해주시길 바랍니다.');
        return;
      }

      const endHour = Math.floor(totalEndMinutes / 60);
      const endMinute = totalEndMinutes % 60;
      const hh = String(endHour).padStart(2, '0');
      const mm = String(endMinute).padStart(2, '0');
      setEndTime(`${hh}:${mm}`);
      setError('');
    } else {
      setEndTime('');
      setError('');
    }
  }, [startTime, duration]);

  return (
    <div className="mt-4">
      <DaySelection
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        setDays={setSelectedDays}
      />

      <TimeSelection
        startTime={startTime}
        endTime={endTime}
        duration={duration}
        onStartChange={(e) => setStartTime(e.target.value)}
        onEndChange={(e) => setEndTime(e.target.value)} // ✅ 추가!
        onDurationChange={(value) => setDuration(value)}
      />


      {/* ✅ 에러 메시지 출력 */}
      {error && (
        <div
          className="text-danger"
          style={{ fontSize: '13px', marginTop: '-8px' }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default OperatingHoursRange;
