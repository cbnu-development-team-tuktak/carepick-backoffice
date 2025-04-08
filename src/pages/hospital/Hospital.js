import React, { useEffect, useState } from 'react'; // 컴포넌트 상태 관리와 생명주기 처리용 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동 처리를 위한 훅

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader';
import FloatingButton from '../../components/common/button/FloatingButton';
import HospitalCard from '../../components/hospital/HospitalCard';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/input/SearchBar';
import SortButton from '../../components/common/button/SortButton';
import FilterButton from '../../components/common/button/FilterButton';
import HospitalFilterModalContent from '../../components/hospital/HospitalFilterModalContent';
import LocationFilterModalContent from '../../components/hospital/LocationFilterModalContent';

// 병원 API 서비스 함수 import
import { fetchHospitalsByFilters } from '../../services/hospitalService';

// 병원 API 응답을 DTO 형식으로 변환하는 함수
import { fromHospitalApiResponse } from '../../dto/HospitalDetailsResponse';

// Redux 관련 import
import { useDispatch, useSelector } from 'react-redux'; // Redux 상태 및 액션 사용
import {
  setSortOption,
  setDistance,
  setSpecialties
} from '../../store/hospitalFilterSlice'; // 병원 필터 slice에서 액션 불러오기

function Hospital() {
  const [hospitals, setHospitals] = useState([]); // 병원 목록
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [searchTerm, setSearchTerm] = useState(''); // 검색어

  const navigate = useNavigate(); // 페이지 이동용
  const dispatch = useDispatch(); // Redux 액션 디스패처

  // Redux에서 상태 가져오기
  const location = useSelector((state) => state.location); // 현재 위치 정보
  const sortOption = useSelector((state) => state.hospitalFilter.sortOption); // 정렬 기준
  const filters = useSelector((state) => state.hospitalFilter.filters); // 필터 상태

  // 컴포넌트 마운트 시 또는 페이지/정렬/위치/필터 변경 시 병원 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const distanceToSend = filters.distance >= 10 ? null : filters.distance;

        const data = await fetchHospitalsByFilters({
          lat: location?.lat,
          lng: location?.lng,
          distance: distanceToSend,
          specialties: filters.specialties,
          sortBy: sortOption === '이름순' ? 'name' : 'distance',
          page,
          size: 20
        });

        console.log('📦 받아온 병원 데이터:', data);
        const processed = data?.content?.map(fromHospitalApiResponse) || [];
        setHospitals(processed);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('병원 목록 불러오기 실패:', err);
      }
    };
    fetchData();
  }, [page, sortOption, location, filters]);

  // 병원 추가 버튼 클릭 시 이동
  const handleAddHospital = () => {
    navigate('/hospital/add');
  };

  // 병원 검색 + 필터 + 정렬 처리
  const filteredHospitals = hospitals
    .filter((hospital) => hospital.name.includes(searchTerm)) // 검색어 필터링
    .sort((a, b) => {
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
          onSelect={(option) => dispatch(setSortOption(option))} // Redux 상태로 정렬 변경
        />

        {/* 병원 필터 버튼 */}
        <FilterButton buttonLabel="필터" modalTitle="병원 필터">
          <HospitalFilterModalContent
            filters={filters}
            onChange={({ distance, specialties }) => {
              dispatch(setDistance(distance));
              dispatch(setSpecialties(specialties));
            }}
          />
        </FilterButton>

        {/* 위치 필터 버튼 */}
        <FilterButton buttonLabel="위치 설정" modalTitle="위치 설정">
          <LocationFilterModalContent
            filters={location}
            onClose={() => console.log('위치 필터 닫기')}
          />
        </FilterButton>
      </div>

      {/* 필터 상태 디버깅용 출력 */}
      <div className="mb-3 p-2 border rounded bg-light">
        <strong>현재 필터 상태:</strong>
        <pre className="mb-0">{JSON.stringify(filters, null, 2)}</pre>
      </div>

      {/* 병원 카드 리스트 영역 */}
      <div className="row">
        {filteredHospitals.length === 0 ? (
          // 검색 결과 없음 메시지
          <div className="col-12 text-center mt-5">
            <p className="text-muted fs-5">검색 결과가 없습니다.</p>
          </div>
        ) : (
          // 병원 카드 목록
          filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="col-md-4 mb-4">
              <HospitalCard hospital={hospital} />
            </div>
          ))
        )}
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
