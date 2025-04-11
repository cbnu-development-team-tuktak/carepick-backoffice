// React 관련 import
import React from 'react';

// 공통 InputField 컴포넌트 import
import InputField from '../../../components/common/input/InputField';

function HospitalBasicInfoSection({ 
  hospital, // 병원 데이터 객체
  onChange, // 입력 변경 시 호출되는 핸들러
  disabled // 입력 필드 비활성화 여부
}) {
  return (
    <>
      {/* 병원명 입력 필드 */}
      <InputField
        label="병원명" // 입력 필드에 표시될 라벨 텍스트
        value={hospital?.name || ''} // 병원명 값 (없을 경우 빈 문자열 처리)
        onChange={(e) => onChange(e, 'name')} // 'name' 필드 변경 핸들러
        disabled={disabled} // 비활성화 여부
      />

      {/* 전화번호 입력 필드 */}
      <InputField
        label="전화번호" // 입력 필드에 표시될 라벨 텍스트
        value={hospital?.phoneNumber || ''} // 전화번호 값 
        onChange={(e) => onChange(e, 'phoneNumber')} // 'phoneNumber' 필드 변경 핸들러
        disabled={disabled} // 비활성화 여부
      />

      {/* 홈페이지 주소 입력 필드 */}
      <InputField
        label="홈페이지" // 입력 필드에 표시될 라벨 텍스트
        value={hospital?.homepage || ''} // 홈페이지 라벨
        onChange={(e) => onChange(e, 'homepage')} // 'homepage' 필드 변경 핸들러
        disabled={disabled} // 비활성화 여부
      />

      {/* 병원 주소 입력 필드 */}
      <InputField
        label="주소" // 입력 필드에 표시될 라벨 텍스트
        value={hospital?.address || ''} // 주소 값
        onChange={(e) => onChange(e, 'address')} // 'address' 필드 변경 핸들러
        disabled={disabled} // 비활성화 여부
      />

      {/* 외부 URL 입력 필드 */}
      <InputField
        label="외부 URL" // 입력 필드에 표시될 라벨 텍스트
        value={hospital?.url || ''} // 외부 URL 라벨
        onChange={(e) => onChange(e, 'url')} // 'url' 필드 변경 핸들러
        disabled={disabled} // 비활성화 여부
      />
    </>
  );
}

export default HospitalBasicInfoSection;