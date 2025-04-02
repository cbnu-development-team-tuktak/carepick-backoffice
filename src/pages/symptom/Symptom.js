// src/pages/Symptom.jsx

// React 관련 import 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 컴포넌트 import
import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 제목 및 설명 표시 컴포넌트
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트 (페이지 버튼 렌더링)
import SymptomCard from '../../components/symptom/SymptomCard'; // 증상 정보를 카드 형태로 출력하는 컴포넌트
import InitialFilter from '../../components/common/InitialFilter'; // 초성 필터 버튼 리스트 컴포넌트

// 초성 필터에 사용할 한글 자음 리스트
const INITIAL_CONSONANTS = [
  // 쌍자음 포함 자음
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
  'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
  'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',

  // 모든 항목 표시
  '전체', 

  // 예외사항 (숫자, 특수문자)
  '기타',
];

// 한 페이지에 보여줄 증상 개수
const PAGE_SIZE = 20;

function Symptom() {
  // 전체 증상 목록 상태
  const [symptoms, setSymptoms] = useState([]);

  // 현재 페이지 번호 상태 (0부터 시작)
  const [page, setPage] = useState(0);

  // 수정 중인 증상의 ID 목록 (여러 개 가능)
  const [editingIds, setEditingIds] = useState([]);

  // 선택된 초성 (기본값 'ㄱ')
  const [selectedInitial, setSelectedInitial] = useState('ㄱ'); 

  // 선택된 증상의 ID (상세 조회용)
  const [selectedSymptomId, setSelectedSymptomId] = useState(null);

  // 선택된 증상과 연결된 질병 목록
  const [linkedDiseases, setLinkedDiseases] = useState([]);

  // 로딩 상태 표시 (데이터 불러오는 중 여부)
  const [loading, setLoading] = useState(true);

  // 초성별 유니코드 문자 범위 매핑
  // 예: 초성 'ㄱ'에 해당하는 글자는 '가'부터 '나' 이전까지
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

  // 선택된 초성이 변경될 때마다 증상 데이터를 서버에서 로드 
  useEffect(() => {
    const loadSymptoms = async () => {
      setLoading(true); // 로딩 시작

      try {
        let response;
        
        // 선택된 초성이 초성 범위(INITIAL_RANGES)에 포함되어 있는 경우
        if (INITIAL_RANGES[selectedInitial]) {
          const [start, end] = INITIAL_RANGES[selectedInitial]; // 해당 초성의 유니코드 범위
          response = await axios.get('/api/symptoms/filter', {
            params: { start, end, page: 0, size: 1000 },
          });
        } else {
          // '전체' 또는 '기타' 선택 시 → 모든 증상 데이터 요청
          // 추후 '기타'는 다른 엔드포인트에 접근하도록 수정할 예정
          response = await axios.get('/api/symptoms', {
            params: { page: 0, size: 1000 },
          });
        }
        
        // 서버로부터 받아온 증상 데이터를 상태에 저장
        setSymptoms(response.data.content);
      } catch (error) {
        // 에러 발생 시 콘솔에 출력
        console.error('증상 목록 조회 실패:', error);
      } finally {
        // 로딩 종료
        setLoading(false);
      }
    };
    
    // 비동기 함수 종료
    loadSymptoms();
  }, [selectedInitial]); // 선택된 초성이 변경될 때마다 실행됨

  // 증상 카드의 수정 모드를 토글하는 함수
  const toggleEdit = (id) => {
    setEditingIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // 증상명 입력 필드의 값이 변경되었을 때 상태 업데이트
  const handleNameChange = (id, newName) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  // 특정 증상을 클릭했을 때 연결된 질병 목록을 요청하여 상태에 저장
  const handleSymptomClick = async (symptomId) => {
    setSelectedSymptomId(symptomId); // 선택된 증상 ID 상태로 설정
    try {
      // 해당 증상 ID에 연결된 질병 목록 요청
      const response = await axios.get(`/api/symptom/${symptomId}/diseases`);
      setLinkedDiseases(response.data); // 받아온 질병 목록 저장
    } catch (error) {
      console.error('질병 목록 조회 실패:', error);
      setLinkedDiseases([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  // 현재 페이지에 표시할 증상 목록 추출
  const pagedSymptoms = symptoms.slice(
    page * PAGE_SIZE, // 시작 인덱스
    (page + 1) * PAGE_SIZE // 끝 인덱스 (exclusive)
  );

  // 필터링된 전체 증상 목록 기준으로 총 페이지 수 계산
  const filteredTotalPages = Math.ceil(symptoms.length / PAGE_SIZE);

  return (
    <div className="container px-0">
      {/* 페이지 상단 제목과 설명 표시 */}
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 초성 필터 버튼 영역 */}
      <InitialFilter
        initials={INITIAL_CONSONANTS} // 전체 초성 리스트 전달
        selected={selectedInitial} // 현재 선택된 초성
        onSelect={(initial) => {
          setSelectedInitial(initial); // 선택된 초성 상태 변경
          setPage(0); // 페이지 번호 초기화
        }}
      />

      {/* 로딩 중일 경우 텍스트 출력 */}
      {loading ? (
        <div className="text-center my-4">증상 데이터를 불러오는 중입니다...</div>
      ) : (
        <>
          {/* 증상 카드 리스트 출력*/}
          <div className="d-flex flex-wrap gap-2">
            {pagedSymptoms.map((symptom) => (
              <SymptomCard
                key={symptom.id} // 고유 키
                symptom={symptom} // 중심 객체
                isEditing={editingIds.includes(symptom.id)} // 수정 중인지 여부
                onToggleEdit={toggleEdit} // 수정 토글 함수
                onNameChange={handleNameChange} // 이름 변경 핸들러
                onClickSymptom={handleSymptomClick} // 질병 연동 클릭 처리
              />
            ))}
          </div>

          <Pagination
            page={page} // 현재 페이지 번호 
            totalPages={filteredTotalPages} // 전체 페이지 수
            onPageChange={(newPage) => setPage(newPage)} // 페이지 변경 핸들러
          />
        </>
      )}
    </div>
  );
}

export default Symptom;
