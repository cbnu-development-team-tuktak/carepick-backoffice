// React 및 Hook 관련 import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import SymptomCard from '../../components/symptom/SymptomCard';

// 초성 리스트 (쌍자음 포함 + 전체 + 기타)
const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
  'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
  'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  '전체', '기타',
];

function Symptom() {
  const [symptoms, setSymptoms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingIds, setEditingIds] = useState([]);
  const [selectedInitial, setSelectedInitial] = useState('전체');

  const navigate = useNavigate();

  // 더미 데이터 세팅
  useEffect(() => {
    setSymptoms([
      { id: 1, name: '기침' },
      { id: 2, name: '두통' },
      { id: 3, name: '1번' },
      { id: 4, name: 'Apple' },
      { id: 5, name: '복통' },
      { id: 6, name: '@복통' },
    ]);
    setTotalPages(1);
  }, [page]);

  // 수정 토글
  const toggleEdit = (id) => {
    setEditingIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // 인풋 변경
  const handleNameChange = (id, newName) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  // 초성 추출
  const getInitialConsonant = (char) => {
    const initialTable = [
      'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
      'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
      'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ];
    const code = char.charCodeAt(0) - 44032;
    if (code < 0 || code > 11171) return ''; // 한글 아님
    const index = Math.floor(code / 588);
    return initialTable[index] || '';
  };

  // 필터링 적용
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

  return (
    <div className="container px-0">
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 초성 필터 버튼 */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        {INITIAL_CONSONANTS.map((char) => (
          <button
            key={char}
            className={`btn btn-sm ${selectedInitial === char ? 'btn-dark text-white' : 'btn-light'}`}
            onClick={() => setSelectedInitial(char)}
          >
            {char}
          </button>
        ))}
      </div>

      {/* 증상 카드 목록 */}
      <div className="d-flex flex-wrap gap-2">
        {filteredSymptoms.map((symptom) => (
          <SymptomCard
            key={symptom.id}
            symptom={symptom}
            isEditing={editingIds.includes(symptom.id)}
            onToggleEdit={toggleEdit}
            onNameChange={handleNameChange}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default Symptom;
