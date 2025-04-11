// src/components/hospital/HospitalForm.jsx

// React 관련 import
import React, { useState } from 'react'; // React 라이브러리 임포트

// 커스텀 컴포넌트 관련 import
import InputField from '../../common/input/InputField'; // 기본 입력 필드 컴포넌트
import InputList from '../../common/input/InputList'; // 리스트 입력 필드 컴포넌트
import InputGroupField from '../../common/input/InputGroup'; // 좌우 입력 필드 컴포넌트
import HospitalBasicInfoSection from './HospitalBasicInfoSection';
import SpecialtySelector from './SpecialtySelector';

import HospitalImageViewer from './HospitalImageViewer'
const HospitalForm = ({
  hospital, // 병원 정보 객체 (HospitalDetailsResponse DTO)
  isEditing, // 편집 가능 여부
  handleInputChange, // 입력값 변경 처리 함수 (예: 병원명, 전화번호)
  handleFileChange, // 이미지 파일 변경 처리 함수
  imagePreview, // 이미지 미리보기 URL 
  specialties = [], // 진료과 목록
  selectedSpecialties = [], // 선택된 진료과 목록
  setSelectedSpecialties = () => {}, // 선택된 진료과 목록 업데이트 함수 
}) => {
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' 또는 'list'

  // 병원 이미지 URL 리스트 (imagePreview가 있으면 그것부터 보여줌)
  const imageUrls = imagePreview
  ? [imagePreview]
  : hospital?.images?.map((img) => img.url) || ['/img/hospital/default-thumbnail.jpg'];


  // 진료과 체크박스 클릭 시 선택/해제 처리
  const handleCheckboxChange = (specialtyName) => {
    if (selectedSpecialties.includes(specialtyName)) {
      setSelectedSpecialties(selectedSpecialties.filter(name => name !== specialtyName));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyName]);
    }
  };

  return (
    <form>
      {/* 병원 이미지 리스트 */}  
      <HospitalImageViewer imageUrls={imageUrls} />
      
      {/* 기본 정보 입력 필드*/}
      <HospitalBasicInfoSection
        hospital={hospital}
        onChange={handleInputChange}
        disabled={true}
      />

      {/* 진료과 체크박스 */}
      <SpecialtySelector
        specialties={specialties} // 진료과 리스트 (배열)
        selected={selectedSpecialties} // 현재 선택된 진료과 (배열)
        onChange={handleCheckboxChange} // 체크박스 변경 핸들러
        isEditing={isEditing} // 체크 가능 여부
      />

      {/* 소속 의사 ID 입력 리스트 */}
      <InputList
        label="소속 의사 ID"
        values={hospital?.doctors || []}
        onChange={(e, idx) => handleInputChange(e, `doctors[${idx}]`)}
        placeholder="예: U000012345"
      />

      {/* 위치 정보 */}
      <InputGroupField
        label="위치 (Latitude / Longitude)"
        leftLabel="위도"
        leftValue={hospital?.location?.latitude || ''}
        rightLabel="경도"
        rightValue={hospital?.location?.longitude || ''}
      />

      {/* 추가 정보 */}
      <InputField
        label="추가 정보 (JSON)"
        value={hospital?.additionalInfo ? JSON.stringify(hospital.additionalInfo, null, 2) : ''}
        onChange={(e) => handleInputChange(e, 'additionalInfo')}
      />
    </form>
  );
};

export default HospitalForm;
