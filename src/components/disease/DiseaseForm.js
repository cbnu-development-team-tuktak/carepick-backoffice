// React 관련 import
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa'; // 아이콘 임포트
import { fetchSymptoms } from '../../services/symptomService'; // 증상 조회 API
import InputField from '../common/input/InputField'; // 공통 입력 필드
import { fromSymptomApiResponse } from '../../dto/SymptomDetailsResponse'; // DTO 변환 함수

// 증상 관리 컴포넌트
const DiseaseForm = ({
  disease,
  isEditing,
  symptoms = [],
  handleSymptomChange,
  handleAddSymptom,
  handleDeleteSymptom,
}) => {
  const [newSymptom, setNewSymptom] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  // 전체 증상 목록 불러오기
  useEffect(() => {
    const getSymptoms = async () => {
      try {
        const response = await fetchSymptoms(0, 1000);
        const parsed = response.content.map(fromSymptomApiResponse);
        setAllSymptoms(parsed);
      } catch (error) {
        console.error('증상 목록을 가져오는 데 실패했습니다:', error);
      } finally {
        setLoadingSymptoms(false);
      }
    };
    getSymptoms();
  }, []);

  // 증상 검색 처리
  const handleSearchSymptom = (e) => {
    const keyword = e.target.value;
    setNewSymptom(keyword);

    if (keyword.trim() === '') {
      setFilteredSymptoms([]);
      return;
    }

    setFilteredSymptoms(
      allSymptoms
        .filter((s) => s.name.toLowerCase().startsWith(keyword.toLowerCase()))
        .slice(0, 5)
    );
  };

  // 증상 추가 처리
  const handleAddNewSymptom = (name) => {
    if (name && !symptoms.includes(name)) {
      handleAddSymptom(name);
      setNewSymptom('');
      setFilteredSymptoms([]);
    }
  };

  return (
    <form>
      <InputField label="질병명" value={disease?.name || ''} disabled />
      <InputField label="진료과" value={disease?.specialties.join(', ') || ''} disabled />

      <h5>증상 관리</h5>

      <div className="d-flex mb-2">
        <input
          type="text"
          className="form-control me-2"
          placeholder="증상 검색"
          value={newSymptom}
          onChange={handleSearchSymptom}
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

        {!loadingSymptoms && newSymptom.trim() !== '' && filteredSymptoms.length === 0 && (
          <p>일치하는 증상이 없습니다.</p>
        )}
      </div>

      {/* 선택된 증상 목록 */}
      <div className="mb-4">
        {symptoms.map((symptom, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="form-control me-2"
                  value={symptom}
                  onChange={(e) => handleSymptomChange(e, index)}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  type="button"
                  onClick={() => handleSymptomChange({ target: { value: symptom } }, index)}
                >
                  <FaSave />
                </button>
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
                <span className="me-2">{symptom}</span>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  type="button"
                  onClick={() => handleSymptomChange({ target: { value: symptom } }, index)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  onClick={() => handleDeleteSymptom(index)}
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
