// React 및 Hook 관련 import
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// DTO import
import { fromSymptomApiResponse } from '../../dto/SymptomDetailsResponse';

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import SymptomCard from '../../components/symptom/SymptomCard';
import InitialFilter from '../../components/common/InitialFilter';

// 초성 리스트 (쌍자음 포함 + 전체 + 기타)
const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
  'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
  'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  '전체', '기타',
];

const PAGE_SIZE = 20;

function Symptom() {
  const [symptoms, setSymptoms] = useState([]);
  const [page, setPage] = useState(0);
  const [editingIds, setEditingIds] = useState([]);
  const [selectedInitial, setSelectedInitial] = useState('전체');
  const [selectedSymptomId, setSelectedSymptomId] = useState(null);
  const [linkedDiseases, setLinkedDiseases] = useState([]);

  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        const response = await axios.get('/api/symptoms', {
          params: { page: 0, size: 1000 }, // 전체 다 가져와서 프론트 필터링
        });

        const converted = Array.isArray(response.data.content)
          ? response.data.content.map(fromSymptomApiResponse)
          : [];

        setSymptoms(converted);
      } catch (error) {
        console.error('증상 목록 조회 실패:', error);
      }
    };

    loadSymptoms();
  }, []);

  const toggleEdit = (id) => {
    setEditingIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleNameChange = (id, newName) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const handleSymptomClick = async (symptomId) => {
    setSelectedSymptomId(symptomId);
    try {
      const response = await axios.get(`/api/symptom/${symptomId}/diseases`);
      setLinkedDiseases(response.data);
    } catch (error) {
      console.error('질병 목록 조회 실패:', error);
      setLinkedDiseases([]);
    }
  };

  const getInitialConsonant = (char) => {
    const initialTable = [
      'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
      'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
      'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ];
    const code = char.charCodeAt(0) - 44032;
    if (code < 0 || code > 11171) return '';
    const index = Math.floor(code / 588);
    return initialTable[index] || '';
  };

  const filteredSymptoms = symptoms.filter((symptom) => {
    const firstChar = symptom.name.charAt(0);
    const initial = getInitialConsonant(firstChar);
    if (selectedInitial === '전체') return true;
    if (selectedInitial === '기타') {
      const isKnownInitial = INITIAL_CONSONANTS.includes(initial);
      return !isKnownInitial || initial === '';
    }
    return initial === selectedInitial;
  });

  const pagedSymptoms = filteredSymptoms.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );
  const filteredTotalPages = Math.ceil(filteredSymptoms.length / PAGE_SIZE);

  return (
    <div className="container px-0">
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      <InitialFilter
        initials={INITIAL_CONSONANTS}
        selected={selectedInitial}
        onSelect={(initial) => {
          setSelectedInitial(initial);
          setPage(0); // 필터 선택 시 페이지 초기화
        }}
      />

      <div className="d-flex flex-wrap gap-2">
        {pagedSymptoms.map((symptom) => (
          <SymptomCard
            key={symptom.id}
            symptom={symptom}
            isEditing={editingIds.includes(symptom.id)}
            onToggleEdit={toggleEdit}
            onNameChange={handleNameChange}
            onClickSymptom={handleSymptomClick}
          />
        ))}
      </div>

      {selectedSymptomId && (
        <div className="mt-4">
          <h6 className="fw-bold mb-2">연결된 질병 목록</h6>
          {linkedDiseases.length > 0 ? (
            <ul className="list-group">
              {linkedDiseases.map((disease) => (
                <li key={disease.id} className="list-group-item py-1 px-2">
                  {disease.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">연결된 질병이 없습니다.</p>
          )}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={filteredTotalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default Symptom;
