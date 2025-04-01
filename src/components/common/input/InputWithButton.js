import React from 'react';

function InputWithButton({ placeholder, buttonText = '수정', onButtonClick }) {
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby="button-addon2"
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        id="button-addon2"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default InputWithButton;
