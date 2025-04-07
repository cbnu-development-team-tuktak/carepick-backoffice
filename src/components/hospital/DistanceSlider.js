// React 관련 import
import React from 'react'; // React 컴포넌트 기능 사용

// UI 라이브러리 import
import { Form } from 'react-bootstrap'; // Bootstrap의 폼 컴포넌트 import

function DistanceSlider({ 
  distance = 1, // 현재 선택된 거리 값 (기본값 1km)
  onChange // 거리 값 변경 시 호출되는 콜백 함수
}) {
  return (
    <Form.Group className="mb-4">
      {/* 라벨 텍스트 */}
      <Form.Label>
        거리 설정 <span className="text-muted">(단위: km)</span>
      </Form.Label>

      {/* 슬라이더 입력 (1~5km, 1km 단위)*/}
      <input
        type="range" // 입력 타입: 슬라이더 (범위 조절)
        min={1} // 최소 값: 1km
        max={5} // 최대 값: 5km
        step={1} // 증가 단위: 1km
        value={distance} // 현재 선택된 거리 값
        onChange={(e) => // 값 변경 시 이벤트 핸들러 실행
          onChange(parseInt(e.target.value, 10)) // 문자열을 정수로 변환 후 콜백 실행
        }
        className="form-range" // Bootstrap 슬라이더 스타일 클래스 
      />

      {/* 거리 값 표시 */}
      <div className="text-center">{distance}km 이내</div>
    </Form.Group>
  );
}

export default DistanceSlider;
