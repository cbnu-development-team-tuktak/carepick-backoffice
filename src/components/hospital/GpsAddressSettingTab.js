import React from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import AddressSearchInput from '../../components/settings/AddressSearchInput'; 
import { setLocation } from '../../store/locationSlice'; 
import { Button } from 'react-bootstrap'; 

function GpsAddressSettingTab({ onClose }) {
  const dispatch = useDispatch(); 
  const location = useSelector((state) => state.location);

  const handleAddressSelect = ({ address, lat, lng }) => {
    dispatch(setLocation({ lat, lng, address }));
  };

  const handleAddressChange = (newAddress) => {
    dispatch(setLocation({ ...location, address: newAddress }));
  };
  
  const handleSaveLocation = () => {
    if (!location.address || !location.lat || !location.lng) {
      alert("위치를 선택해주세요.");
    } else {
      alert('위치가 저장되었습니다.');
      console.log('저장된 위치:', location);
      onClose(); // 모달 닫기
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h3>GPS 주소 설정</h3>
      <p>주소를 검색하여 사용자의 위치를 설정합니다.</p>
      <AddressSearchInput 
        value={location.address} 
        onChange={handleAddressChange} 
        onSelect={handleAddressSelect} 
      />
      <div className="text-end mt-3">
        <Button variant="primary" onClick={handleSaveLocation}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default GpsAddressSettingTab;
