// React 관련 import
import React, { useEffect, useState } from 'react'; // 컴포넌트 생성 및 상태/효과 관리 훅 사용

// 아이콘 import
import { FaSearch } from 'react-icons/fa'; // 검색 아이콘 (FontAwesome) 사용

// Redux 관련 import
import { useSelector } from 'react-redux'; // Redux 전역 상태 조회를 위한 훅

function SearchBar({
  value, // 현재 입력창에 입력된 값
  onChange, // 입력값 변경 시 호출되는 핸들러 함수
  type = 'hospitals', // 검색 대상 유형 ('hospitals' | 'symptoms' | 'diseases')
  onSelect, // 연관 검색어 클릭 시 선택된 항목을 상위로 전달하는 콜백
  selectedItems = [], // 이미 선택된 항목 목록 (예: 선택된 질병 리스트)
  onRemove // 선택된 항목에서 제거할 때 호출되는 핸들러
}) {
  // 연관 검색어 목록 상태 (null이면 아직 검색하지 않은 상태)
  const [suggestions, setSuggestions] = useState(null);

  // Redux 전역 상태에서 병원, 증상, 질병 목록 가져오기
  const hospitals = useSelector((state) => state.hospitals.hospitals); // 병원 리스트
  const symptoms = useSelector((state) => state.symptoms.symptoms); // 증상 리스트
  const diseases = useSelector((state) => state.diseases.diseases); // 질병 리스트

  // 입력값 또는 검색 대상(type)이 변경될 때마다 실행
  useEffect(() => {
    // 입력값이 비어 있거나 공백만 있을 경우
    if (!value.trim()) {
      setSuggestions(null); // 추천 목록 초기화
      return; // 종료
    }

    // 검색 대상(type)에 따라 추천할 데이터 소스 선택
    const source =
      type === 'hospitals' ? hospitals : // 병원 검색일 경우 병원 리스트
      type === 'symptoms' ? symptoms : // 증상 검색일 경우 증상 리스트
      type === 'diseases' ? diseases : // 질병 검색일 경우 질병 리스트
      []; // 알 수 있는 타입일 경우 빈 배열 반환

    // 입력값으로 시작하는 항목만 필터링 (대소문자 구분 없음)
    const filtered = source
      .filter((item) => 
        (item.name || '')
          .toLowerCase() // 소문자로 변환
          .startsWith(value.toLowerCase()) // 입력값으로 시작하는지 확인
      )
      .slice(0, 5); // 최대 5개까지 추천

    // 필터링된 결과를 상태로 저장 → 화면에 추천 리스트로 표시됨
    setSuggestions(filtered);
  }, [value, hospitals, symptoms, diseases, type]);

  return (
    <div className="mb-4">
      {/* 입력창 (검색창 + 아이콘 포함)*/}
      <div className="input-group">
        {/* 검색 아이콘 (왼쪽에 표시) */}
        <span className="input-group-text bg-white d-flex align-items-center">
          <FaSearch /> {/* FontAwesome 검색 아이콘 */}
        </span>

        {/* 텍스트 입력 필드 */}
        <input
          type="text" // 입력 타입: 일반 텍스트
          className="form-control" // Bootstrap 폼 스타일 적용
          placeholder={`${
            type === 'hospitals' ? '병원' : 
            type === 'symptoms' ? '증상' :
            '질병'
          } 이름을 입력하세요...`}
          value={value} // 현재 입력값 (상위에서 전달받음)
          onChange={(e) => // 사용자가 입력할 때마다
            onChange(e.target.value) // 부모 상태로 입력값 전달
          }
        />
      </div>

      {/* 연관 검색어 추천 목록이 있을 경우에만 렌더링*/}
      {suggestions !== null && (
        <div className="search-suggestions">
          {/* 추천 항목이 존재하는 경우 */}
          {suggestions.length > 0 ? (
            <ul className="list-group mb-0">
              {/* 최대 5개의 추천 항목을 리스트로 렌더링 */}
              {suggestions.map((item, idx) => (
                <li
                  key={item.id || idx} // 고유 키로 ID 또는 인덱스 사용
                  className="list-group-item list-group-item-action" // Bootstrap 리스트 스타일 적용
                  style={{ cursor: 'pointer' }} // 클릭 가능한 포인터 스타일
                  onClick={() => {
                    onChange(item.name); // 클릭한 항목의 이름을 입력창에 반영
                    onSelect?.(item.name); // 선택된 항목을 상위로 전달
                    setSuggestions(null); // 추천 리스트 닫기
                  }}
                >
                  {item.name} {/* 항목 이름 표시 */}
                </li>
              ))}
            </ul>
          ) : (
            // 추천 항목이 없을 경우 안내 메시지 출력
            <div className="search-suggestions-empty">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 선택된 항목이 하나 이상 존재할 경우에만 렌더링 */}
      {selectedItems.length > 0 && (
        <div className="selected-items-wrapper">
          {/* 선택된 항목 리스트를 반복 렌더링 */}
          {selectedItems.map((item) => (
            <div key={item} className="selected-item-badge">
              {item} {/* 항목 이름 표시 */}
              {/* 항목 제거 버튼 (X) */}
              <button
                className="btn btn-sm btn-close btn-close-white" // 쟉은 흰색 닫기 버튼 (Bootstrap)
                onClick={() => onRemove?.(item)} // 클릭 시 해당 항목 제거 콜백 호출
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
