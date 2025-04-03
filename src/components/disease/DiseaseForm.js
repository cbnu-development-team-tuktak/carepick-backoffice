// React 관련 import
import React, { useEffect, useState } from 'react'; // React 라이브러리 및 useEffect, useState 훅

// 아이콘 관련 import
import { 
  FaEdit, // 편집 아이콘 (FaEdit)
  FaTrashAlt, // 삭제 아이콘 (FaTrashAlt)
  FaSave // 저장 아이콘 (FaSave)
} from 'react-icons/fa'; // react-icons 패키지

// API 호출 관련 import
import { fetchSymptoms } from '../../services/symptomService'; // 증상 조회 API

// 컴포넌트 import
import InputField from '../common/input/InputField'; // 공통 입력 필드 컴포넌트

// DTO 변환 관련 import
import { fromSymptomApiResponse } from '../../dto/SymptomDetailsResponse'; // 증상 API 응답을 DTO로 변환하는 함수

const DiseaseForm = ({
  disease, // 질병 정보 
  isEditing, // 편집 모드 여부
  symptoms = [], // 질병과 연결된 증상 목록
  handleSymptomChange, // 증상 변경 처리 함수 
  handleAddSymptom, // 증상 추가 처리 함수
  handleDeleteSymptom, // 증상 삭제 처리 함수
}) => {
  // 새로운 증상 입력을 위한 상태 변수
  const [newSymptom, setNewSymptom] = useState('');
  // 필터링된 증상 목록 상태
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  // 모든 증상 목록 상태
  const [allSymptoms, setAllSymptoms] = useState([]);
  // 증상 목록 로딩 상태
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  useEffect(() => {
    // 증상 목록을 비동기적으로 가져오기
    const getSymptoms = async () => {
      try {
        // fetchSymptoms를 사용하여 증상 목록 가져오기 (페이지 0, 개수 1000)
        const response = await fetchSymptoms(0, 1000);

        // API 응답에서 받은 증상 데이터를 DTO 형식으로 변환
        const parsed = response.content.map(fromSymptomApiResponse);

        // 변환된 증상 데이터를 상태에 저장
        setAllSymptoms(parsed);
      } catch (error) {
        // 증상 목록을 가져오는 데 실패한 경우 에러 메시지 출력
        console.error('증상 목록을 가져오는 데 실패했습니다:', error);
      } finally {
        // 데이터 로딩이 끝났음을 알리기 위해 로딩 상태 false로 설정
        setLoadingSymptoms(false);
      }
    };
    // 컴포넌트가 마운트될 때 증상 목록을 가져오기
    getSymptoms();
  }, []); // 한 번만 실행됨

  // 증상 검색 처리
  const handleSearchSymptom = (e) => {
    const keyword = e.target.value; // 입력된 검색어를 가져옴
    setNewSymptom(keyword); // 검색어 상태를 업데이트

    // 검색어가 비어 있는 경우, 필터링된 증상 목록을 비움
    if (keyword.trim() === '') {
      setFilteredSymptoms([]);
      return; // 함수 종료
    }

    // 검색어와 일치하는 증상들을 필터링하여 최대 5개까지만 표시
    setFilteredSymptoms(
      allSymptoms
        // 이름이 검색어로 시작하는 증상 필터링
        .filter((s) => s.name.toLowerCase().startsWith(keyword.toLowerCase()))
        .slice(0, 5) // 최대 5개까지 표시
    );
  };

  // 새 증상 추가 처리
  const handleAddNewSymptom = (name) => {
    // 증상이 비어있지 않고, 이미 목록에 포함되지 않은 경우
    if (name && !symptoms.includes(name)) {
      handleAddSymptom(name); // 증상 추가 함수 호출
      setNewSymptom(''); // 입력창 초기화
      setFilteredSymptoms([]); // 필터링된 증상 목록 초기화
    }
  };

  return (
    <form>
      {/* 질병명 입력 필드 */}
      <InputField label="질병명" value={disease?.name || ''} disabled />
      {/* 진료과 입력 필드 */}
      <InputField label="진료과" value={disease?.specialties.join(', ') || ''} disabled />

      {/* 증상 관리 제목 */}
      <h5>증상 관리</h5>

      {/* 증상 검색 입력창 */}
      <div className="d-flex mb-2">
        <input
          type="text"
          className="form-control me-2"
          placeholder="증상 검색"
          value={newSymptom}
          onChange={handleSearchSymptom} // 검색 시 증상 필터링
        />
      </div>

      {/* 로딩 중 표시 */}
      {loadingSymptoms && (
        <div className="d-flex align-items-center mb-3">
          <div className="spinner-grow text-primary me-2" role="status" style={{ width: '1rem', height: '1rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">증상 데이터를 불러오는 중입니다...</span>
        </div>
      )}

      {/* 추천 검색 결과 */}
      <div className="mb-4">
        {!loadingSymptoms && newSymptom.trim() !== '' && filteredSymptoms.length > 0 && (
          <ul className="list-group">
            {filteredSymptoms.map((symptom) => (
              <li key={symptom.id} className="list-group-item d-flex justify-content-between align-items-center">
                {symptom.name}
                {/* 추가 버튼 클릭 시 증상 추가 */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleAddNewSymptom(symptom.name)}
                >
                  추가
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {/* 일치하는 증상이 없을 경우 */}
        {!loadingSymptoms && newSymptom.trim() !== '' && filteredSymptoms.length === 0 && (
          <p>일치하는 증상이 없습니다.</p>
        )}
      </div>

      {/* 선택된 증상 목록 */}
      <div className="mb-4">
        {symptoms.map((symptom, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            {/* 편집 모드일 경우 */}
            {isEditing ? (
              <>
                {/* 증상 수정 입력 필드 */}
                <input
                  type="text"
                  className="form-control me-2"
                  value={symptom} 
                  onChange={(e) => handleSymptomChange(e, index)} // 입력값 수정 처리
                />
                {/* 수정 완료 버튼 */}
                <button
                  className="btn btn-sm btn-success me-2"
                  type="button"
                  onClick={() => handleSymptomChange({ target: { value: symptom } }, index)}
                >
                  <FaSave />
                </button>
                {/* 삭제 버튼 */}
                <button
                  className="btn btn-sm btn-secondary"
                  type="button"
                  onClick={() => handleDeleteSymptom(index)}
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : (
              <>
                {/* 증상 텍스트 */}
                <span className="me-2">{symptom}</span>
                {/* 수정 버튼 */}
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  type="button"
                  onClick={() => handleSymptomChange({ target: { value: symptom } }, index)} // 수정 시작
                >
                  <FaEdit />
                </button>
                {/* 삭제 버튼 */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  onClick={() => handleDeleteSymptom(index)} // 증상 삭제
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
