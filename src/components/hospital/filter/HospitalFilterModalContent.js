// React 관련 import
import React, { useState } from 'react'; // React 및 상태 관리 훅
import { Button } from 'react-bootstrap'; // Bootstrap 버튼 컴포넌트

// 컴포넌트 import
import DistanceSlider from './DistanceSlider'; // 거리 필터 슬라이더
import OperatingHoursRange from './OperatingHoursRange'; // 진료 시간 범위 설정
import SpecialtySelector from '../SpecialtySelector'; // 진료과 선택 필터
import SearchBar from '../../common/input/SearchBar'; // 질병 검색 입력창
import ExtraOptionsToggle from './ExtraOptionsToggle'; // 명의/야간진료 여부 등 토글 필터

function HospitalFilterModalContent({ 
  filters, // 현재 필터 상태 객체
  onChange, // 필터 상태 변경 핸들러
  onClose // 모달 닫기 핸들러
}) {
  const [diseaseKeyword, setDiseaseKeyword] = useState(''); // 질병 검색 입력값 상태
  const [selectedDiseases, setSelectedDiseases] = useState(filters.diseases || []); // 선택된 질병 목록 상태

  // 질병 선택 시 실행
  const handleDiseaseSelect = (name) => {
    if (!selectedDiseases.includes(name)) { // 이미 선택된 항목이 아닌 경우
      const updated = [...selectedDiseases, name]; // 새로운 질병 리스트 생성
      setSelectedDiseases(updated); // 로컬 상태 업데이트 
      onChange({ ...filters, diseases: updated }); // 부모 컴포넌트로 상태 전달
    }
    setDiseaseKeyword(''); // 입력창 초기화
  };

  // 질병 제거 시 실행
  const handleRemoveDisease = (name) => {
    const updated = selectedDiseases.filter(d => d !== name); // 질병명과 일치하지 않는 항목만 남김
    setSelectedDiseases(updated); // 로컬 상태 업데이트
    onChange({ ...filters, diseases: updated }); // 부모 필터 상태도 반영
  };

  return (
    <>
      {/* 거리 필터 */}
      <DistanceSlider
        distance={filters.distance || 1} // 현재 선택된 거리 값 (기본값 1km)
        onChange={(value) => onChange({ ...filters, distance: value })} // 거리 변경 시 필터 상태 갱신
      />

      {/* 진료과 필터 */}
      <SpecialtySelector
        selectedSpecialties={filters.specialties || []} // 현재 선택된 진료과 배열
        onChange={(updated) => onChange({ ...filters, specialties: updated })} // 진료과 변경 시 필터 상태 갱신
      />

      {/* 진료 시간 범위 설정 */}
      <OperatingHoursRange />
      {/* 질병 검색 라벨 */}
      <label className="form-label">질병 선택</label>

      {/* 질병 검색 및 선택 표시 */}
      <SearchBar
        value={diseaseKeyword} // 검색값 입력 상태
        onChange={setDiseaseKeyword} // 입력값 변경 핸들러
        type="diseases" // 검색 대상 타입은 질병으로 설정 
        onSelect={handleDiseaseSelect} // 질병 선택 시 처리 
        selectedItems={selectedDiseases} // 선택된 질병 리스트
        onRemove={handleRemoveDisease} // 질병 제거 시 처리
      />

      {/* 기타 옵션 토글 */}
      <ExtraOptionsToggle 
        filters={filters} // 필터 전체 상태
        onChange={onChange} // 상태 변경 핸들러
      />

      {/* 닫기 버튼 */}
      <div className="mt-4 text-end">
        <Button 
          variant="secondary" 
          onClick={onClose} // 모달 닫기 핸들러 
        >
          닫기
        </Button>
      </div>
    </>
  );
}

export default HospitalFilterModalContent;
