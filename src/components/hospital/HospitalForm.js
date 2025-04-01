// ✅ src/components/hospital/HospitalForm.jsx
import React from 'react';
import InputField from '../common/input/InputField';
import InputList from '../common/input/InputList';
import InputGroupField from '../common/input/InputGroup';

const HospitalForm = ({
  hospital,
  isEditing,
  handleInputChange,
  handleFileChange,
  imagePreview,
  specialties = [],
  selectedSpecialties = [],
  setSelectedSpecialties = () => {},
}) => {
  const thumbnailUrl = imagePreview || hospital?.images?.[0]?.url || '/img/hospital/default-thumbnail.jpg';

  const handleCheckboxChange = (specialtyName) => {
    if (selectedSpecialties.includes(specialtyName)) {
      setSelectedSpecialties(selectedSpecialties.filter(name => name !== specialtyName));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyName]);
    }
  };

  return (
    <form>
      {/* 썸네일 */}
      <div className="mb-4 text-center">
        <img
          src={thumbnailUrl}
          alt="병원 썸네일"
          style={{ width: '184px', height: '184px', objectFit: 'cover', borderRadius: '12px' }}
        />
        {isEditing && (
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}
      </div>

      {/* 기본 정보 */}
      <InputField label="병원명" value={hospital?.name || ''} onChange={(e) => handleInputChange(e, 'name')} />
      <InputField label="전화번호" value={hospital?.phoneNumber || ''} onChange={(e) => handleInputChange(e, 'phoneNumber')} />
      <InputField label="홈페이지" value={hospital?.homepage || ''} onChange={(e) => handleInputChange(e, 'homepage')} />
      <InputField label="주소" value={hospital?.address || ''} onChange={(e) => handleInputChange(e, 'address')} />
      <InputField label="운영 시간" value={hospital?.operatingHours || ''} onChange={(e) => handleInputChange(e, 'operatingHours')} />
      <InputField label="외부 URL" value={hospital?.url || ''} onChange={(e) => handleInputChange(e, 'url')} />

      {/* 진료과 */}
      <div className="mb-4">
        <label className="form-label fw-bold" style={{ fontSize: '1.2rem' }}>진료과</label>
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

      {/* 소속 의사 ID */}
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