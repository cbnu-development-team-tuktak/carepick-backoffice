// React 관련 import
import React, { useEffect, useState } from 'react'; // React 컴포넌트 및 훅(useState, useEffect) 사용

// Redux 관련 import
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedDays,
  setStartTime,
  setEndTime,
  setDuration,
} from '../../../store/hospitalFilterSlice';

// 컴포넌트 import
import DaySelection from './DaySelection'; // 요일 선택 컴포넌트 
import TimeSelection from './TimeSelection'; // 시간 선택 컴포넌트

const OperatingHoursRange = () => {
  const dispatch = useDispatch();

  // Redux 전역 상태 가져오기
  const selectedDays = useSelector((state) => state.hospitalFilter.filters.selectedDays); // 선택된 요일 배열 (예: ['월', '화'])
  const startTime = useSelector((state) => state.hospitalFilter.filters.startTime); // 시작 시간 (예: '09:00')
  const duration = useSelector((state) => state.hospitalFilter.filters.duration); // 진료 지속 시간 (예: 180 = 3시간)
  const endTime = useSelector((state) => state.hospitalFilter.filters.endTime); // 종료 시간 (startTime + duration)

  const [error, setError] = useState(''); // 에러(유효성 검사) 메시지

  // 요일 선택/해제 토글
  const toggleDay = (day) => {
    dispatch(
      setSelectedDays(
        selectedDays.includes(day) // 이미 선택된 요일이면
          ? selectedDays.filter((d) => d !== day) // 해당 요일을 제거
          : [...selectedDays, day] // 선택되지 않은 요일이면 배열에 추가
      )
    );
  };

  // startTime 또는 duration이 변경될 때마다 종료 시간을 자동 계산하는 useEffect
  useEffect(() => {
    if (startTime && duration) {
      // 시작 시간을 ':' 기준으로 시(hour)와 분(minute)으로 분리
      const [hour, minute] = startTime.split(':').map(Number);

      // 시작 시간을 분 단위로 환산
      const totalStartMinutes = hour * 60 + minute;

      // 종료 시간을 분 단위로 계산
      const totalEndMinutes = totalStartMinutes + Number(duration);

      // 종료 시간이 자정(24:00, 1440분)을 초과하는 경우 에러 처리
      if (totalEndMinutes >= 24 * 60) {
        dispatch(setEndTime('')); // 종료 시간 초기화 
        setError('종료 시간은 자정을 초과할 수 없습니다. 범위를 다시 지정해주시길 바랍니다.');
        return;
      }

      // 종료 시간의 시와 분을 계산
      const endHour = Math.floor(totalEndMinutes / 60); // 종료 시간 시각
      const endMinute = totalEndMinutes % 60; // 종료 시간 분

      // HH:MM 형식으로 포맷팅
      const hh = String(endHour).padStart(2, '0');
      const mm = String(endMinute).padStart(2, '0');

      dispatch(setEndTime(`${hh}:${mm}`)); // 종료 시간 설정
      setError(''); // 에러 메시지 초기화
    } else {
      // 시작 시간이나 duration이 없는 경우
      dispatch(setEndTime('')); // 종료 시간 초기화
      setError(''); // 에러 메시지 초기화
    }
  }, [startTime, duration, dispatch]); // startTime 또는 duration이 변경될 때마다 실행

  return (
    <div className="mt-4">
      {/* 요일 선택 */}
      <DaySelection
        selectedDays={selectedDays} // 현재 선택된 요일 배열
        toggleDay={toggleDay} // 요일 선택/해제를 위한 함수
        setDays={(days) => dispatch(setSelectedDays(days))} // 선택된 요일 설정 함수
      />

      {/* 시간 선택 */}
      <TimeSelection
        startTime={startTime} // 시작 시간 (HH:mm)
        endTime={endTime} // 종료 시간 (HH:mm)
        duration={duration} // 원하는 시간 범위
        onStartChange={(e) => dispatch(setStartTime(e.target.value))} // 시작 시간 변경 핸들러
        onEndChange={(e) => dispatch(setEndTime(e.target.value))} // 종료 시간 변경 핸들러 
        onDurationChange={(value) => dispatch(setDuration(value))} // 시간 범위 변경 핸들러
      />

      {error && ( // 에러 상태가 존재할 경우
        // 빨간색 텍스트로 경고 표시
        <div
          className="text-danger"
          style={{ fontSize: '13px', marginTop: '-8px' }}
        >
          {/* 에러 메시지 */}
          {error}
        </div>
      )}
    </div>
  );
};

export default OperatingHoursRange;
