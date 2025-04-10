import React from 'react';

/**
 * 시간 입력 필드
 */
const TimeInputField = ({
  label,
  value,
  onChange,
  width = '120px',
  height = '38px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width,
      }}
    >
      <label style={{ fontSize: '12px', marginBottom: '4px' }}>{label}</label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        style={{
          height,
          padding: '8px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default TimeInputField;
