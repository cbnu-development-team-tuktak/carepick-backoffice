import React, { useEffect, useState } from 'react'; // 컴포넌트 상태 관리와 생명주기 처리용 훅
import { useNavigate } from 'react-router-dom'; // 페이지 이동 처리를 위한 훅

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader'; // 페이지 상단 제목 및 설명 영역 컴포넌트
import FloatingButton from '../../components/common/button/FloatingButton'; // 페이지 하단 우측에 고정된 플로팅 버튼
import Pagination from '../../components/common/Pagination'; // 페이지네이션 UI 컴포넌트
import SearchBar from '../../components/common/input/SearchBar'; // 병원 검색창 입력 컴포넌트
import SortButton from '../../components/common/button/SortButton'; // 정렬 기준 변경 버튼
import FilterButton from '../../components/common/button/FilterButton'; // 필터 모달 오픈 버튼

// 병원 관련 import
import HospitalCard from '../../components/hospital/HospitalCard'; // 병원 정보를 카드 형태로 보여주는 컴포넌트
import HospitalFilterModalContent from '../../components/hospital/HospitalFilterModalContent'; // 진료과/명의 여부 등의 병원 필터 모달 내용
import LocationFilterModalContent from '../../components/hospital/LocationFilterModalContent'; // 위치 기반 병원 필터 모달 내용

// 병원 API 서비스 함수 import
import { fetchHospitalsByFilters } from '../../services/hospitalService'; // 필터 조건에 따라 병원 목록을 가져오는 API 요청

// 병원 API 응답을 DTO 형식으로 변환하는 함수
import { fromHospitalApiResponse } from '../../dto/HospitalDetailsResponse'; // API 응답을 HospitalDetails DTO 형식으로 변환

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
    // 병원 데이터를 API로부터 비동기 함수
    const fetchData = async () => {
      try {
        // 거리 필터가 10km 이상이면 null로 설정 (전체 검색 의미)
        const distanceToSend = filters.distance >= 10 ? null : filters.distance;
        
        // 병원 데이터를 서버로부터 필터 조건을 기반으로 요청
        const data = await fetchHospitalsByFilters({
          lat: location?.lat, // 현재 선택된 위도
          lng: location?.lng, // 현재 선택된 경도
          distance: distanceToSend, // 설정된 거리 필터 값
          specialties: filters.specialties, // 선택된 진료과 필터
          sortBy: sortOption === '이름순' ? 'name' : 'distance', // 정렬 기준 (이름 또는 거리순)
          page, // 현재 페이지 번호
          size: 20 // 한 페이지당 병원 수 
        });
        
        // API 응답 데이터를 HospitalCard용 DTO 형식으로 변환 
        const processed = data?.content?.map(fromHospitalApiResponse) || [];

        // 변환된 병원 데이터를 상태로 저장
        setHospitals(processed);

        // 총 페이지 수 설정 (페이징 처리용)
        setTotalPages(data.totalPages);
      } catch (err) {
        // 오류 발생 시 콘솔에 로그 출력
        console.error('병원 목록 불러오기 실패:', err);
      }
    };

    fetchData(); // useEffect 실행 시 데이터 요청
  }, [page, sortOption, location, filters]); // 값이 변경될 때마다 fetchData 실행

  // 병원 추가 버튼 클릭 시 이동
  const handleAddHospital = () => {
    navigate('/hospital/add');
  };

  // 병원 검색 + 필터 + 정렬 처리
  const filteredHospitals = hospitals
    // 검색어 필터링: 병원 이름에 searchTerm이 포함된 항목만 남김
    .filter((hospital) => hospital.name.includes(searchTerm)) 
    // 정렬 처리
    .sort((a, b) => {
      // 이름순 정렬 (가나다 순)
      if (sortOption === '이름순') return a.name.localeCompare(b.name);
      // 거리순 정렬 (undefined일 경우 0으로 처리)
      if (sortOption === '거리순') return (a.distance || 0) - (b.distance || 0);
      // 정렬 조건이 없으면 원래 순서 유지
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
      <SearchBar 
        value={searchTerm} // 검색어 상태값 (입력 필드에 표시될 값)
        onChange={setSearchTerm} // 사용자가 입력할 때 상태 업데이트 함수
      />

      {/* 정렬/필터 버튼 영역 (수평 배치) */}
      <div className="d-flex gap-2 mb-3">
        {/* 정렬 버튼 */}
        <SortButton
          current={sortOption} // 현재 선택된 정렬 기준 (예: '이름순', '거리순')
          options={sortOptions} // 선택 가능한 정렬 옵션 리스트
          onSelect={(option) => dispatch(setSortOption(option))} // Redux 상태로 정렬 기준 변경
        />

        {/* 병원 필터 버튼 */}
        <FilterButton 
          buttonLabel="필터" // 버튼에 표시될 텍스트
          modalTitle="병원 필터" // 모달 상단 제목
        >
          {/* 모달 내부에 표시될 필터 콘텐츠 (거리 + 진료과 필터) */}
          <HospitalFilterModalContent
            filters={filters} // 현재 필터 상태 (거리, 진료과 등)
            onChange={({ distance, specialties }) => {
              // 거리 필터 Redux 상태 변경
              dispatch(setDistance(distance)); 

              // 진료과 필터 Redux 상태 변경
              dispatch(setSpecialties(specialties)); 
            }}
          />
        </FilterButton>

        {/* 위치 필터 버튼 */}
        <FilterButton
          buttonLabel="위치 설정" // 버튼에 표시될 텍스트
          modalTitle="위치 설정" // 모달 상단 제목
        >
          {/* 모달 내부에 표시될 위치 설정 콘텐츠 */}
          <LocationFilterModalContent
            filters={location} // 현재 선택된 위치 정보 (lat, lng 등)
            onClose={() => console.log('위치 필터 닫기')} // 모달 닫기 이벤트 핸들러 (디버깅용 로그)
          />
        </FilterButton>
      </div>

      {/* 현재 필터 상태를 시각적으로 확인할 수 있는 디버깅용 영역 */}
      <div className="mb-3 p-2 border rounded bg-light">
        <strong>현재 필터 상태:</strong>
        {/* 필터 객체를 JSON 형식으로 보기 좋게 출략 (2칸 들여쓰기) */}
        <pre className="mb-0">{JSON.stringify(filters, null, 2)}</pre>
      </div>

      {/* 병원 카드 리스트 영역 */}
      <div className="row">
        {filteredHospitals.length === 0 ? (
          // 병원 목록이 비어 있는 경우 → '검색 결과 없음' 메시지 출력
          <div className="col-12 text-center mt-5">
            <p className="text-muted fs-5">검색 결과가 없습니다.</p>
          </div>
        ) : (
          // 병원 카드 목록 존재할 경우 → HospitalCard 컴포넌트를 이용하여 병원 카드 출력
          filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="col-md-4 mb-4">
              <HospitalCard hospital={hospital} />
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={page} // 현재 페이지 번호
        totalPages={totalPages} // 전체 페이지 수
        onPageChange={(newPage) => setPage(newPage)} // 페이지 변경 수 상태 업데이트
      />

      {/* 병원 추가 버튼 */}
      <FloatingButton 
        mode="add" // '추가' 모드로 설정 → + 아이콘 표시 
        onClick={handleAddHospital} // 클릭 시 병원 추가 핸들러 호출
      />
    </div>
  );
}

export default Hospital;
