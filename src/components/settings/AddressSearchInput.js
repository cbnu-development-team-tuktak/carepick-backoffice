import React, { useState, useEffect } from 'react';
import AddressSearchResult from './AddressSearchResult';

const AddressSearchInput = ({ value, onChange, onSelect }) => {
  const [results, setResults] = useState(null);
  const CONFIRM_KEY = 'devU01TX0FVVEgyMDI1MDQwNDIwNTIxMTExNTYxNTc=';

  // 주소 검색 함수
  const handleSearch = () => {
    if (!value.trim()) return;

    fetch(
      `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${CONFIRM_KEY}&currentPage=1&countPerPage=5&keyword=${encodeURIComponent(
        value
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

  // 엔터 키 눌렀을 때 검색 실행, 백스페이스 키 눌렀을 때는 결과 초기화
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }

    if (e.key === 'Backspace') {
      setResults(null);
    }
  };

  // 주소 선택 후 처리
  const handleSelect = (selected) => {
    onChange(selected.address); // 부모 컴포넌트로 선택된 주소 전달
    setResults(null); // 결과 초기화
    onSelect(selected); // 부모 컴포넌트로 선택된 주소 전달
  };

  // query 상태가 변경될 때마다 검색 실행 (useEffect로 구현)
  useEffect(() => {
    if (value) {
      handleSearch();
    } else {
      setResults(null);
    }
  }, [value]);

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="도로명, 지번 주소 입력"
        value={value} // 부모에서 받은 query 상태값을 입력 필드에 반영
        onChange={(e) => onChange(e.target.value)} // 입력값 변경 시 부모의 상태 업데이트
        onKeyDown={handleKeyDown} // 키 입력 시 처리
      />
      <AddressSearchResult results={results} onSelect={handleSelect} /> {/* 검색 결과 렌더링 */}
    </div>
  );
};

export default AddressSearchInput;
