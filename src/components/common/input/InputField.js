// src/components/common/InputField.js
import React from 'react';

const InputField = ({ label, value, disabled, onChange }) => (
  <div className="mb-3">
    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
      {label}
    </label>
    <input
      type="text"
      className="form-control"
      value={value}
      disabled={disabled}
      onChange={onChange}
    />
  </div>
);

export default InputField;
