// React 관련 import
import React from 'react'; // React 컴포넌트 기능 사용

// 컴포넌트 관련 import
import TimeInputField from '../../common/input/TimeInputField'; // 시간 입력 필드

// 기본 제공 시간 옵션 (드롭다운에서 시간 범위 선택 시 사용)
const durationOptions = [
  { label: '30분', value: 30 },
  { label: '1시간', value: 60 },
  { label: '1시간 30분', value: 90 },
  { label: '2시간', value: 120 },
  { label: '3시간', value: 180 },
  { label: '4시간', value: 240 },
  { label: '6시간', value: 360 },
  { label: '8시간', value: 480 },
  { label: '10시간', value: 600 },
  { label: '12시간', value: 720 },
];

// 시작 시간과 종료 시간 사이의 차이를 분 단위로 계산
const getDurationBetween = (startTime, endTime) => {
  // 시작 시간 또는 종료 시간이 없으면 null 반환
  if (!startTime || !endTime) return null;

  // 'HH:mm' 형식의 문자열을 시(hour), 분(minute) 숫자로 변환
  const [startHour, startMin] = startTime.split(':').map(Number); // 시작 시간 포맷팅
  const [endHour, endMin] = endTime.split(':').map(Number); // 종료 시간 포맷팅

  // 시작 시간을 분 단위로 환산
  const start = startHour * 60 + startMin;
  
  // 종료 시간을 분 단위로 환산
  const end = endHour * 60 + endMin;

  // 종료 시간 - 시작 시간으로 시간 범위 계산
  const diff = end - start;

  // 시간 범위가 양수일 경우 반환, 그렇지 않을 경우 잘못된 입력으로 null 처리
  return diff > 0 ? diff : null;
};

const TimeSelection = ({
  startTime, // 시작 시간
  endTime, // 종료 시간
  duration, // 시간 범위
  onStartChange, // 시작 시간 변경 시 호출되는 함수
  onEndChange, // 종료 시간 변경 시 호출되는 함수
  onDurationChange, // 시간 범위 변경 시 호출되는 함수
}) => {
  // 시간 범위를 분 단위로 계산
  const currentDiff = getDurationBetween(startTime, endTime);

  // 시간 범위 option 중 일치하는 옵션이 있는지 확인
  const matchedOption = durationOptions.find(opt => opt.value === currentDiff);

  // 일치하는 옵션이 있으면 해당 값을 사용, 없으면 빈 문자열을 설정
  const derivedValue = matchedOption ? matchedOption.value : '';

  return (
    <div className="d-flex gap-4 mt-4 mb-4 align-items-end">
      {/* 시작 시간 */}
      <TimeInputField
        label="시작 시간" // 입력 필드 상단 라벨
        value={startTime} // 현재 시작 시간 값
        onChange={onStartChange} // 시작 시간 변경 시 호출되는 콜백 함수
        width="132px" // 입력 필드 너비
        height="38px" // 입력 필드 높이
      />

      {/* 종료 시간 */}
      <TimeInputField
        label="종료 시간" // 입력 필드 상단 라벨
        value={endTime} // 현재 종료 시간 값
        onChange={onEndChange} // 종료 시간 변경 시 호출되는 콜백 함수
        width="132px" // 입력 필드 너비
        height="38px" // 입력 필드 높이
      />

      {/* 시간 범위 선택 */}
      <div className="duration-select-wrapper">
        <label className="duration-select-label">시간 범위</label>
        <select
          className="form-select duration-select"
          value={
            duration !== ''
              ? duration // 사용자가 직접 선택한 값
              : derivedValue !== ''
              ? derivedValue // 시작~종료 시간에서 유추된 값
              : '' // 유효한 값이 없으면 '선택'으로 설정
          }
          onChange={(e) =>
            onDurationChange(e.target.value === '' ? '' : Number(e.target.value))
          }
        >
          {/* '선택' 옵션 - 값이 없을 경우 기본 선택됨 */}
          <option value="">선택</option>

          {/* 실제 옵션들 */}
          {durationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
};

export default TimeSelection;
