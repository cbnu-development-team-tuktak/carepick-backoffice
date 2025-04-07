import React, { useState } from 'react';
import AddressSearchResult from './AddressSearchResult';

const AddressSearchInput = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const CONFIRM_KEY = 'devU01TX0FVVEgyMDI1MDQwNDIwNTIxMTExNTYxNTc=';

  const handleSearch = () => {
    if (!query.trim()) return;

    fetch(
      `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${CONFIRM_KEY}&currentPage=1&countPerPage=5&keyword=${encodeURIComponent(
        query
      )}&resultType=json`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results.juso) {
          setResults(data.results.juso);
        } else {
          setResults([]);
        }
      })
      .catch((err) => {
        console.error('주소 검색 실패', err);
        alert('주소 검색 중 오류가 발생했습니다.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }

    // ✅ 백스페이스 눌렀을 때는 결과 초기화
    if (e.key === 'Backspace') {
      setResults(null);
    }
  };

  const handleSelect = (selected) => {
    setQuery(selected.address);
    setResults(null);
    onSelect(selected);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="도로명, 지번 주소 입력"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <AddressSearchResult results={results} onSelect={handleSelect} />
    </div>
  );
};

export default AddressSearchInput;
