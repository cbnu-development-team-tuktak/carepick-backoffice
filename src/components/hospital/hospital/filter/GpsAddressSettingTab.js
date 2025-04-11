// React 및 상태 관리 관련 import
import React from 'react'; // React 라이브러리 import
import { useDispatch, useSelector } from 'react-redux'; // Redux 상태 관리 및 디스패치 기능 제공

// 컴포넌트 관련 import 
import AddressSearchInput from '../../../settings/AddressSearchInput'; // 주소 검색 입력 컴포넌트 import

// Redux 액션 관련 import 
import { setLocation } from '../../../../store/locationSlice'; // location 저장 액션 import 

// UI 및 컴포넌트 관련 import 
import { Button } from 'react-bootstrap'; // 버튼 컴포넌트 import 

function GpsAddressSettingTab({ 
  onClose
}) {
  const dispatch = useDispatch(); // Redux의 디스패치 함수 사용
  const location = useSelector((state) => state.location); // Redux에서 사용자 위치 상태 가져오기 
  
  // 주소 선택 시 실행
  const handleAddressSelect = ({ address, lat, lng }) => {
    // 선택한 주소, 위도(lat), 경도(lng)를 Redux 상태로 저장
    dispatch(setLocation({ lat, lng, address }));
  };

  // 주소 변경 시 실행
  const handleAddressChange = (newAddress) => {
    // 주소가 변경될 때, 기존 상태에 변경되 주소를 덮어쓰고 Redux 상태로 저장 
    dispatch(setLocation({ ...location, address: newAddress }));
  };
  
  // 위치 저장 버튼 클릭 시 실행 
  const handleSaveLocation = () => {
    // 위치가 선택되지 않은 경우 
    if (!location.address || !location.lat || !location.lng) {
      alert("위치를 선택해주세요."); // 경고 메시지 출력
    } else { // 위치가 선택된 경우 
      alert('위치가 저장되었습니다.'); // 위치 저장 완료 메시지 출력
      onClose(); // 모달 닫기
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* GPS 주소 설정 제목 */}
      <h3>GPS 주소 설정</h3>

      {/* GPS 주소 설정에 대한 설명 */}
      <p>주소를 검색하여 사용자의 위치를 설정합니다.</p>

      {/* 주소 입력 컴포넌트 */}
      <AddressSearchInput 
        value={location.address} 
        onChange={handleAddressChange} 
        onSelect={handleAddressSelect} 
      />

      {/* 저장 버튼, 클릭 시 위치 저장 함수 호출 */}
      <div className="text-end mt-3">
        <Button variant="primary" onClick={handleSaveLocation}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default GpsAddressSettingTab;
