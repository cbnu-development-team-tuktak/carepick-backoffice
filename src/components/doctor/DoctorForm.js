import React from 'react';

// 커스텀 입력 필드 컴포넌트들
import InputField from '../common/input/InputField';
import InputList from '../common/input/InputList';
import DoctorImage from './DoctorImage';

const DoctorForm = ({
  doctor,
  isEditing,
  handleInputChange,
  handleListChange,
  handleFileChange,
  imagePreview,
  specialties = [], // 기본값: 빈 배열 (map 에러 방지)
  selectedSpecialties = [],
  setSelectedSpecialties = () => {}, // 기본값: 빈 함수
}) => {
  // 체크박스 클릭 시 진료과 추가/제거
  const handleCheckboxChange = (specialtyName) => {
    if (selectedSpecialties.includes(specialtyName)) {
      setSelectedSpecialties(selectedSpecialties.filter(name => name !== specialtyName));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyName]);
    }
  };

  return (
    <form>
      {/* 프로필 이미지 */}
      <DoctorImage
        imageUrl={imagePreview || doctor?.profileImage}
        isEditing={isEditing}
        onFileChange={handleFileChange}
      />

      {/* 이름 필드 */}
      <InputField
        label="이름"
        value={doctor?.name || ''}
        onChange={(e) => handleInputChange(e, 'name')}
      />

      {/* 진료과 체크박스 */}
      <div className="mb-4">
        <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          진료과
        </label>
        <div className="d-flex flex-wrap gap-2">
          {specialties.map((specialty, idx) => (
            <div key={idx} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`specialty-${specialty.id}`}
                disabled={!isEditing}
                checked={selectedSpecialties.includes(specialty.name)}
                onChange={() => handleCheckboxChange(specialty.name)}
              />
              <label className="form-check-label" htmlFor={`specialty-${specialty.id}`}>
                {specialty.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 소속 병원 */}
      <InputField
        label="소속 병원"
        value={doctor?.hospitalName || '정보 없음'}
        onChange={(e) => handleInputChange(e, 'hospitalName')}
      />

      {/* 자격면허 목록 */}
      <InputList
        label="자격면허"
        values={doctor?.educationLicenses || []}
        onChange={(e, idx) => handleListChange(e, idx, 'educationLicenses')}
        placeholder="정보 없음"
      />

      {/* 경력 목록 */}
      <InputList
        label="경력"
        values={doctor?.careers || []}
        onChange={(e, idx) => handleListChange(e, idx, 'careers')}
        placeholder="정보 없음"
      />
    </form>
  );
};

export default DoctorForm;
