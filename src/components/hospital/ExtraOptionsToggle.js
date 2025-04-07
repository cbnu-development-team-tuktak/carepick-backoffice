// React 관련 import 
import React from 'react'; // React 컴포넌트 기능 사용

// UI 라이브러리 import
import { Button } from 'react-bootstrap'; // Bootstrap의 버튼 컴포넌트 import

function ExtraOptionsToggle({ 
  filters, // 전체 필터 객체 상태 (ex. distance, specialties, diseases 등 포함)
  onChange // 필터 상태를 상위 컴포넌트로 전달하는 콜백 함수
}) {
  return (
    <div className="mt-4">
      <label className="form-label">기타 옵션</label>
      <div className="d-flex gap-2">
        {/* 명의 여부 */}
        <Button
          // 명의 여부가 true면 파란색(primary), 아니면 테두리만 있는 회색(outline-primary)
          variant={filters.isFamousDoctor ? 'primary' : 'outline-primary'}
          // 버튼 클릭 시 명의 여부 상태를 반전시켜 상위로 전달
          onClick={() =>
            onChange({ 
              ...filters, // 기존 필터 값 유지
              isFamousDoctor: !filters.isFamousDoctor // 명의 여부 토글
            })
          }
        >
          명의만
        </Button>

        {/* 야간 진료 여부 */}
        <Button
          // 야간 진료 여부가 true면 파란색(primary), 아니면 테두리만 있는 회색(outline-primary)
          variant={filters.hasNightShift ? 'primary' : 'outline-primary'}
          onClick={() =>
            onChange({ 
              ...filters, // 기존 필터 값 유지
              hasNightShift: !filters.hasNightShift // 야간 진료 여부 토글
            })
          }
        >
          야간 진료
        </Button>
      </div>
    </div>
  );
}

export default ExtraOptionsToggle;
