import React, { useState, useEffect } from 'react'; // React 관련 라이브러리
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅
import { useDispatch } from 'react-redux'; // Redux 상태 관리
import { deleteSymptom, fetchSymptoms, fetchSymptomsCount } from '../../services/symptomService'; // 증상 서비스

import SymptomCard from '../../components/symptom/SymptomCard'; // 증상 카드 컴포넌트
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트
import PageHeader from '../../components/common/PageHeader'; // 페이지 헤더 컴포넌트
import InitialFilter from '../../components/filter/InitialFilter'; // 초성 필터 컴포넌트
import LengthFilter from '../../components/filter/LengthFilter'; // 글자 수 필터 컴포넌트

function Symptom() {
  const navigate = useNavigate(); // 페이지 이동 훅
  const dispatch = useDispatch(); // Redux의 dispatch 훅

  const [selectedInitial, setSelectedInitial] = useState('ㄱ'); // 초성 필터 상태
  const [selectedLength, setSelectedLength] = useState('전체'); // 글자 수 필터 상태
  const [page, setPage] = useState(0); // 현재 페이지 상태
  const [filteredSymptoms, setFilteredSymptoms] = useState([]); // 필터링된 증상 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [totalSymptomsCount, setTotalSymptomsCount] = useState(0); // 증상 총 개수

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
    '전체': ['가', '힣'],
    '기타': ['기타', '기타'],
  };

  useEffect(() => {
    const fetchFilteredSymptoms = async () => {
      setLoading(true);
      try {
        const [start, end] = INITIAL_RANGES[selectedInitial]; // 초성 범위 가져오기
        const data = await fetchSymptoms(page, 20, start, end); // 증상 API 호출
        setFilteredSymptoms(data.content); // 필터링된 증상 상태 업데이트

        // 증상 개수 조회 (page로 전체 개수를 계산)
        const countData = await fetchSymptomsCount(start, end); // 필터에 맞는 증상의 총 개수
        setTotalSymptomsCount(countData.count); // 총 증상 개수 업데이트
      } catch (error) {
        console.error('증상 목록을 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredSymptoms();
  }, [page, selectedInitial, selectedLength]);

  const handleDelete = async (id) => {
    try {
      await deleteSymptom(id); // symptomService에서 삭제 요청
      const [start, end] = INITIAL_RANGES[selectedInitial];
      const data = await fetchSymptoms(page, 20, start, end);
      setFilteredSymptoms(data.content); // 필터링된 증상 상태 업데이트
      dispatch({ type: 'DELETE_SYMPTOM', payload: data.content }); // Redux 상태 업데이트
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const filteredTotalPages = Math.ceil(totalSymptomsCount / 20); // totalSymptomsCount에서 페이지 수 계산
  console.log(totalSymptomsCount)
  console.log(filteredTotalPages)
  return (
    <div className="container px-0">
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 초성 필터 */}
      <InitialFilter
        initials={Object.keys(INITIAL_RANGES)}
        selected={selectedInitial}
        onSelect={(initial) => {
          setSelectedInitial(initial);
          setPage(0); // 필터 변경 시 페이지 리셋
        }}
      />

      {/* 글자 수 필터 */}
      <LengthFilter
        selectedLength={selectedLength}
        onSelectLength={(length) => {
          setSelectedLength(length);
          setPage(0); // 필터 변경 시 페이지 리셋
        }}
      />

      {loading ? (
        <div className="text-center my-4">증상 데이터를 불러오는 중입니다...</div>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-2">
            {filteredSymptoms.map((symptom) => (
              <SymptomCard
                key={symptom.id}
                symptom={symptom}
                onDelete={handleDelete}
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
