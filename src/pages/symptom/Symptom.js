import React, { useState, useEffect } from 'react'; // React 관련 라이브러리
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import { useDispatch, useSelector } from 'react-redux'; // Redux 상태 관리
import { deleteSymptom } from '../../services/symptomService'; // 증상 삭제 서비스
import SymptomCard from '../../components/symptom/SymptomCard'; // 증상 카드 컴포넌트
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트
import PageHeader from '../../components/common/PageHeader'; // 페이지 헤더 컴포넌트
import { Spinner } from 'react-bootstrap'; // 로딩 스피너 컴포넌트
import InitialFilter from '../../components/filter/InitialFilter'; // 초성 필터 컴포넌트
import LengthFilter from '../../components/filter/LengthFilter'; // 글자 수 필터 컴포넌트

function Symptom() {
  const navigate = useNavigate(); // 페이지 이동 훅
  const dispatch = useDispatch(); // Redux의 dispatch 훅

  // Redux store에서 증상 관련 데이터 가져오기
  const symptoms = useSelector((state) => state.symptoms.symptoms); // 증상 목록
  const loading = useSelector((state) => state.symptoms.loading); // 로딩 상태
  const totalPages = useSelector((state) => state.symptoms.count); // 증상 총 개수

  const [selectedInitial, setSelectedInitial] = useState('ㄱ'); // 초성 필터 상태
  const [selectedLength, setSelectedLength] = useState('전체'); // 글자 수 필터 상태
  const [page, setPage] = useState(0); // 현재 페이지 상태

  // 상태로 filteredSymptoms 관리
  const [filteredSymptoms, setFilteredSymptoms] = useState([]); // 필터링된 증상 상태

  // 초성 범위를 유니코드로 계산
  const getHangulRange = (start, end) => {
    const startCode = start.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    return [startCode, endCode];
  };

  // 초성 범위 설정 (가~나, etc.)
  const INITIAL_RANGES = {
    'ㄱ': getHangulRange('가', '나'),
    'ㄲ': getHangulRange('까', '나'),
    'ㄴ': getHangulRange('나', '다'),
    'ㄷ': getHangulRange('다', '라'),
    'ㄸ': getHangulRange('따', '라'),
    'ㄹ': getHangulRange('라', '마'),
    'ㅁ': getHangulRange('마', '바'),
    'ㅂ': getHangulRange('바', '사'),
    'ㅃ': getHangulRange('빠', '사'),
    'ㅅ': getHangulRange('사', '아'),
    'ㅆ': getHangulRange('싸', '아'),
    'ㅇ': getHangulRange('아', '자'),
    'ㅈ': getHangulRange('자', '차'),
    'ㅉ': getHangulRange('짜', '차'),
    'ㅊ': getHangulRange('차', '카'),
    'ㅋ': getHangulRange('카', '타'),
    'ㅌ': getHangulRange('타', '파'),
    'ㅍ': getHangulRange('파', '하'),
    'ㅎ': getHangulRange('하', '힣'),
    '전체': getHangulRange('가', '힣'),
    '기타': getHangulRange('기타', '기타'),
  };

  // 필터링된 증상 리스트를 상태로 관리
  useEffect(() => {
    const filtered = symptoms.filter((s) => {
      const symptomCode = s.name.charCodeAt(0);
      const matchesInitial = symptomCode >= INITIAL_RANGES[selectedInitial][0] && symptomCode < INITIAL_RANGES[selectedInitial][1];
      const matchesLength =
        selectedLength === '전체' ||
        (selectedLength === '1글자' && s.name.length === 1) ||
        (selectedLength === '2글자' && s.name.length === 2) ||
        (selectedLength === '3글자 이상' && s.name.length >= 3);
      return matchesInitial && matchesLength;
    });
    setFilteredSymptoms(filtered); // 필터링된 상태 업데이트
  }, [symptoms, selectedInitial, selectedLength]); // 증상 목록, 초성, 글자 수 필터 변경 시 필터링 업데이트

  // 페이지네이션을 위한 증상 목록
  const pagedSymptoms = filteredSymptoms.slice(page * 20, (page + 1) * 20);
  const filteredTotalPages = Math.ceil(filteredSymptoms.length / 20);

  // 증상 삭제 후 상태 업데이트
  const handleDelete = async (id) => {
    try {
      await deleteSymptom(id); // symptomService에서 삭제 요청
      // 삭제 후 증상 목록에서 해당 항목 제거
      const updatedSymptoms = filteredSymptoms.filter((symptom) => symptom.id !== id);
      setFilteredSymptoms(updatedSymptoms); // 필터링된 증상 상태 업데이트
      dispatch({ type: 'DELETE_SYMPTOM', payload: updatedSymptoms }); // Redux 상태 업데이트
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="container px-0">
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 초성 필터 */}
      <InitialFilter
        initials={['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', '전체', '기타']}
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
            {pagedSymptoms.map((symptom) => (
              <SymptomCard
                key={symptom.id}
                symptom={symptom}
                onDelete={handleDelete} // 삭제 처리 함수 전달
                onClickSymptom={() => navigate(`/symptom/${symptom.id}`)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={filteredTotalPages}
            onPageChange={(newPage) => setPage(newPage)} // 페이지 변경 시 상태 업데이트
          />
        </>
      )}
    </div>
  );
}

export default Symptom;
