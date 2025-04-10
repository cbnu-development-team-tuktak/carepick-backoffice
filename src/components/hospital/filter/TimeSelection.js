import React from 'react';
import TimeInputField from '../../common/input/TimeInputField';

// 기본 제공 시간 옵션 (단위: 분)
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

const getDurationBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const start = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  const diff = end - start;
  return diff > 0 ? diff : null;
};

const TimeSelection = ({
  startTime,
  endTime,
  duration,
  onStartChange,
  onEndChange,
  onDurationChange,
}) => {
  const currentDiff = getDurationBetween(startTime, endTime);
  const matchedOption = durationOptions.find(opt => opt.value === currentDiff);
  const derivedValue = matchedOption ? matchedOption.value : '';

  return (
    <div className="d-flex gap-4 mt-4 mb-4 align-items-end">
      {/* 시작 시간 */}
      <TimeInputField
        label="시작 시간"
        value={startTime}
        onChange={onStartChange}
        width="132px"
        height="38px"
      />

      {/* 종료 시간 */}
      <TimeInputField
        label="종료 시간"
        value={endTime}
        onChange={onEndChange}
        width="132px"
        height="38px"
      />

      {/* 시간 범위 선택 */}
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '120px',
        }}
      > 
        <label style={{ fontSize: '12px', marginBottom: '4px' }}>시간 범위</label>
        <select
          className="form-select"
          value={duration !== '' ? duration : derivedValue}
          onChange={(e) =>
            onDurationChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          style={{
            padding: '8px',
            fontSize: '14px',
            height: '38px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">선택</option>
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
