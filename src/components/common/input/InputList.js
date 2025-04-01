// src/components/common/input/InputList.js
import React from 'react';

const InputList = ({ label, values, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      {label}
    </label>
    {values.length > 0 ? (
      values.map((item, idx) => (
        <input
          key={idx}
          type="text"
          className="form-control mb-2"
          value={item}
          onChange={(e) => onChange(e, idx)}
        />
      ))
    ) : (
      <input
        type="text"
        className="form-control"
        value={placeholder || '정보 없음'}
      />
    )}
  </div>
);

export default InputList;
