// src/components/common/InitialFilter.js
import React from 'react';

function InitialFilter({ initials, selected, onSelect }) {
  return (
    <div className="mb-3 d-flex flex-wrap gap-2">
      {initials.map((char) => (
        <button
          key={char}
          className={`btn btn-sm ${selected === char ? 'btn-dark text-white' : 'btn-light'}`}
          onClick={() => onSelect(char)}
        >
          {char}
        </button>
      ))}
    </div>
  );
}

export default InitialFilter;
