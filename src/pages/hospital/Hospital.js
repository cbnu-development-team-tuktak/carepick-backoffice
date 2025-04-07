import React, { useState, useEffect } from 'react'; // 컴포넌트 상태 관리와 생명주기 처리용 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동 처리를 위한 훅

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader'; // 상단 제목 및 설명 표시용 공통 컴포넌트
import FloatingButton from '../../components/common/button/FloatingButton'; // 오른쪽 하단 고정 버튼 (추가/수정 등)
import HospitalCard from '../../components/hospital/HospitalCard'; // 병원 정보를 카드 형태로 보여주는 컴포넌트
import Pagination from '../../components/common/Pagination'; // 병원 목록을 페이지 단위로 나눠 보여주는 컴포넌트
import SearchBar from '../../components/common/input/SearchBar'; // 검색 바 컴포넌트
import SortButton from '../../components/common/button/SortButton'; // 정렬 버튼 컴포넌트
import FilterButton from '../../components/common/button/FilterButton'; // 필터 버튼 컴포넌트
import HospitalFilterModalContent from '../../components/hospital/HospitalFilterModalContent'; // 병원 필터 모달 내부 컴포넌트
import LocationFilterModalContent from '../../components/hospital/LocationFilterModalContent'; // 위치 필터 모달 내부 컴포넌트

// 병원 API 서비스 함수 import
import { fetchHospitals } from '../../services/hospitalService'; // 서버에서 병원 목록을 가져오는 함수

// 병원 API 응답을 DTO 형식으로 변환하는 함수
import { fromHospitalApiResponse } from '../../dto/HospitalDetailsResponse'; // API 응답을 HospitalDetailsResponse 형태로 변환

// Redux 관련 import
import { useSelector } from 'react-redux'; // Redux 상태를 가져오는 훅

function Hospital() {
  const [hospitals, setHospitals] = useState([]); // 병원 목록
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [sortOption, setSortOption] = useState('이름순'); // 정렬 기준
  const [filters, setFilters] = useState({ // 필터 상태
    open24Hours: false,
    emergency: false,
  });

  const navigate = useNavigate(); // 페이지 이동용

  // Redux에서 location 상태 가져오기
  const location = useSelector((state) => state.location); // 현재 위치 정보

  // 컴포넌트 마운트 시 또는 페이지 변경 시 병원 목록 불러오기
  useEffect(() => {
    fetchHospitals(page, 20)
      .then((data) => {
        console.log('📦 받아온 병원 데이터:', data);
        const processed = data?.content?.map(fromHospitalApiResponse) || [];
        setHospitals(processed); // 병원 목록 저장
        setTotalPages(data.totalPages); // 전체 페이지 수 저장
      })
      .catch((err) => {
        console.error('병원 목록 불러오기 실패:', err);
      });
  }, [page]);

  // 병원 추가 버튼 클릭 시 이동
  const handleAddHospital = () => {
    navigate('/hospital/add');
  };

  // 병원 검색 + 필터 + 정렬 처리
  const filteredHospitals = hospitals
    .filter((hospital) => hospital.name.includes(searchTerm)) // 검색어 필터링
    .filter((hospital) => { // 필터 조건 반영
      if (filters.open24Hours && !hospital.open24Hours) return false;
      if (filters.emergency && !hospital.emergency) return false;
      return true;
    })
    .sort((a, b) => { // 정렬 조건 적용
      if (sortOption === '이름순') return a.name.localeCompare(b.name);
      if (sortOption === '거리순') return (a.distance || 0) - (b.distance || 0);
      return 0;
    });

  const sortOptions = ['이름순', '거리순']; // 정렬 기준 목록

  return (
    <div className="container mt-4">
      {/* 상단 페이지 제목 및 설명 출력 */}
      <PageHeader
        title="병원 관리"
        description="병원 정보를 조회하고 수정할 수 있는 페이지입니다."
      />

      {/* 검색창 */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* 정렬/필터 버튼 영역 (수평 배치) */}
      <div className="d-flex gap-2 mb-3">
        {/* 정렬 버튼 */}
        <SortButton
          current={sortOption}
          options={sortOptions}
          onSelect={setSortOption}
        />

        {/* 병원 필터 버튼 */}
        <FilterButton buttonLabel="필터" modalTitle="병원 필터">
          <HospitalFilterModalContent
            filters={filters}
            onChange={setFilters}
          />
        </FilterButton>

        {/* 위치 필터 버튼 추가 */}
        <FilterButton buttonLabel="위치 설정" modalTitle="위치 설정">
          <LocationFilterModalContent
            filters={location} // 위치 상태를 필터로 전달
            onClose={() => console.log('위치 필터 닫기')} // 위치 필터 닫기 처리
          />
        </FilterButton>
      </div>

      {/* 병원 카드 리스트 영역 */}
      <div className="row">
        {filteredHospitals.map((hospital) => (
          <div key={hospital.id} className="col-md-4 mb-4">
            <HospitalCard hospital={hospital} />
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* 병원 추가 버튼 */}
      <FloatingButton 
        mode="add"
        onClick={handleAddHospital}
      />
    </div>
  );
}

export default Hospital;
