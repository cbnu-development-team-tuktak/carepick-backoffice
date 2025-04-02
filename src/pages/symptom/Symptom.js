// src/pages/Symptom.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 컴포넌트 import
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import SymptomCard from '../../components/symptom/SymptomCard';
import InitialFilter from '../../components/common/InitialFilter';

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
  const [selectedInitial, setSelectedInitial] = useState('ㄱ'); // 기본값을 ㄱ으로 설정
  const [selectedSymptomId, setSelectedSymptomId] = useState(null);
  const [linkedDiseases, setLinkedDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  const INITIAL_RANGES = {
    'ㄱ': ['가', '나'],
    'ㄲ': ['까', '나'],
    'ㄴ': ['나', '다'],
    'ㄷ': ['다', '라'],
    'ㄸ': ['따', '라'],
    'ㄹ': ['라', '마'],
    'ㅁ': ['마', '바'],
    'ㅂ': ['바', '사'],
    'ㅃ': ['빠', '사'],
    'ㅅ': ['사', '아'],
    'ㅆ': ['싸', '아'],
    'ㅇ': ['아', '자'],
    'ㅈ': ['자', '차'],
    'ㅉ': ['짜', '차'],
    'ㅊ': ['차', '카'],
    'ㅋ': ['카', '타'],
    'ㅌ': ['타', '파'],
    'ㅍ': ['파', '하'],
    'ㅎ': ['하', '힣'],
  };

  useEffect(() => {
    const loadSymptoms = async () => {
      setLoading(true);

      try {
        let response;

        if (INITIAL_RANGES[selectedInitial]) {
          const [start, end] = INITIAL_RANGES[selectedInitial];
          response = await axios.get('/api/symptoms/filter', {
            params: { start, end, page: 0, size: 1000 },
          });
        } else {
          // 전체 or 기타는 모든 데이터 요청
          response = await axios.get('/api/symptoms', {
            params: { page: 0, size: 1000 },
          });
        }

        setSymptoms(response.data.content);
      } catch (error) {
        console.error('증상 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSymptoms();
  }, [selectedInitial]);

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

  const pagedSymptoms = symptoms.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );
  const filteredTotalPages = Math.ceil(symptoms.length / PAGE_SIZE);

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
          setPage(0);
        }}
      />

      {loading ? (
        <div className="text-center my-4">증상 데이터를 불러오는 중입니다...</div>
      ) : (
        <>
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

          <Pagination
            page={page}
            totalPages={filteredTotalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default Symptom;
