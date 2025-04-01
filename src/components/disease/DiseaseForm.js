import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa'; // 아이콘 임포트
import { fetchSymptoms } from '../../services/symptomService'; // fetchSymptoms 함수 임포트
import InputField from '../common/input/InputField'; // 텍스트 입력 필드 컴포넌트

// 증상 관리 컴포넌트
const DiseaseForm = ({
  disease, // 질병 정보
  isEditing, // 편집 가능 여부
  symptoms = [], // 현재 증상 목록 (기본값 빈 배열)
  handleSymptomChange, // 증상 수정 처리 함수
  handleAddSymptom, // 증상 추가 처리 함수
  handleDeleteSymptom, // 증상 삭제 처리 함수
}) => {
  const [newSymptom, setNewSymptom] = useState(''); // 새로운 증상 입력 상태
  const [filteredSymptoms, setFilteredSymptoms] = useState([]); // 필터링된 증상 목록
  const [allSymptoms, setAllSymptoms] = useState([]); // DB에서 가져온 전체 증상 목록

  // 증상 목록을 서버에서 가져오기
  useEffect(() => {
    const getSymptoms = async () => {
      try {
        const data = await fetchSymptoms(); // fetchSymptoms 호출
        setAllSymptoms(data); // 가져온 증상 목록 저장
      } catch (error) {
        console.error('증상 목록을 가져오는 데 실패했습니다:', error);
      }
    };
    getSymptoms(); // 컴포넌트가 마운트 될 때 한 번 호출
  }, []);

  // 증상 검색 처리
  const handleSearchSymptom = (e) => {
    const searchTerm = e.target.value; // 입력값을 그대로 사용
    setNewSymptom(searchTerm);

    // 검색어가 비어있다면, 필터링된 증상 목록을 초기화
    if (searchTerm === '') {
      setFilteredSymptoms([]);
      return;
    }

    // 필터링된 증상 목록을 5개로 제한하고, 입력값으로 시작하는 증상만 필터링
    setFilteredSymptoms(
      allSymptoms
        .filter(symptom => symptom.name.toLowerCase().startsWith(searchTerm.toLowerCase())) // symptom.name으로 시작하는 문자열만 필터링
        .slice(0, 5) // 최대 5개만 표시
    );
  };

  // 증상 추가 처리 (기존 리스트에 추가)
  const handleAddNewSymptom = (symptom) => {
    if (symptom && !symptoms.includes(symptom)) {
      handleAddSymptom(symptom); // 증상 추가
      setNewSymptom(''); // 검색어 초기화
    }
  };

  // 폼 제출 처리 (연필 버튼 클릭 시)
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 방지
    // 연필 클릭 시에만 실제 제출되는 코드 구현
    console.log('수정 사항 제출');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 질병명 입력 (disabled) */}
      <InputField 
        label="질병명" 
        value={disease?.name || ''} 
        disabled={true} 
      />

      {/* 진료과 목록 입력 (disabled) */}
      <InputField 
        label="진료과" 
        value={disease?.specialties.join(', ') || ''} 
        disabled={true} 
      />

      <h5>증상 관리</h5>
      {/* 증상 검색창 */}
      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="증상 검색"
          value={newSymptom}
          onChange={handleSearchSymptom} // 증상 검색 처리
        />
      </div>

      {/* 증상 목록 필터링 */}
      <div className="mb-4">
        {filteredSymptoms.length > 0 ? (
          <ul>
            {filteredSymptoms.map((symptom, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{symptom.name}</span> {/* symptom.name으로 출력 */}
                <button
                  className="btn btn-sm btn-outline-primary"
                  type="button" // 폼 제출을 방지하려면 type="button"으로 설정
                  onClick={() => handleAddNewSymptom(symptom.name)} // 선택된 증상 추가
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>일치하는 증상이 없습니다.</p>
        )}
      </div>

      {/* 선택된 증상 리스트 */}
      <div className="mb-4">
        {symptoms.map((symptom, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            {/* 편집 모드일 때만 수정할 수 있게끔 */}
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="form-control me-2"
                  value={symptom}
                  onChange={(e) => handleSymptomChange(e, index)} // 증상 수정 처리
                />
                <button
                  className="btn btn-sm btn-success me-2 px-3 py-1"
                  type="button" // 폼 제출을 방지하려면 type="button"으로 설정
                  onClick={() => handleSymptomChange(symptom, index)} // 저장 처리
                >
                  <FaSave />
                </button>
                <button
                  className="btn btn-sm btn-secondary px-3 py-1"
                  type="button" // 폼 제출을 방지하려면 type="button"으로 설정
                  onClick={() => handleDeleteSymptom(index)} // 삭제 처리
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : (
              <>
                {/* 수정, 삭제 버튼이 아닌 일반 텍스트로 증상 표시 */}
                <span className="me-2">{symptom}</span>
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  type="button" // 폼 제출을 방지하려면 type="button"으로 설정
                  onClick={() => handleSymptomChange(symptom, index)} // 수정 모드로 진입
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button" // 폼 제출을 방지하려면 type="button"으로 설정
                  onClick={() => handleDeleteSymptom(index)} // 삭제
                >
                  <FaTrashAlt />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default DiseaseForm;
