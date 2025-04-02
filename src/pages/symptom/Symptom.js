// React 관련 import 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅 추가
import axios from 'axios';

// 컴포넌트 import
import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 제목 및 설명 표시 컴포넌트
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트 (페이지 버튼 렌더링)
import SymptomCard from '../../components/symptom/SymptomCard'; // 증상 정보를 카드 형태로 출력하는 컴포넌트
import InitialFilter from '../../components/common/filter/InitialFilter'; // 초성 필터 버튼 리스트 컴포넌트
import LengthFilter from '../../components/common/filter/LengthFilter'; // ✅ 글자 수 필터 컴포넌트 추가

// 초성 필터에 사용할 한글 자음 리스트
const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
  'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
  'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  '전체', 
  '기타',
];

// 한 페이지에 보여줄 증상 개수
const PAGE_SIZE = 20;

function Symptom() {
  const navigate = useNavigate(); // ✅ 페이지 이동용 훅

  const [symptoms, setSymptoms] = useState([]);
  const [page, setPage] = useState(0);
  const [editingIds, setEditingIds] = useState([]);
  const [selectedInitial, setSelectedInitial] = useState('ㄱ'); 
  const [selectedLength, setSelectedLength] = useState('전체'); // ✅ 글자 수 필터 상태
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
          response = await axios.get('/api/symptoms', {
            params: { page: 0, size: 1000 },
          });
        }

        let filtered = response.data.content;

        // ✅ 글자 수 필터 적용
        if (selectedLength === '1글자') {
          filtered = filtered.filter((s) => s.name.length === 1);
        } else if (selectedLength === '2글자') {
          filtered = filtered.filter((s) => s.name.length === 2);
        } else if (selectedLength === '3글자 이상') {
          filtered = filtered.filter((s) => s.name.length >= 3);
        }

        setSymptoms(filtered);
      } catch (error) {
        console.error('증상 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSymptoms();
  }, [selectedInitial, selectedLength]);

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

      {/* ✅ 글자 수 필터 버튼 */}
      <LengthFilter
        selectedLength={selectedLength}
        onSelectLength={(length) => {
          setSelectedLength(length);
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
                onClickSymptom={() => navigate(`/symptom/${symptom.id}`)}
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