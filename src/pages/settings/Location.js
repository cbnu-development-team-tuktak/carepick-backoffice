import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import AddressSearchInput from '../../components/settings/AddressSearchInput';
import PageHeader from '../../components/common/PageHeader';
import { setLocation } from '../../store/locationSlice'; // setLocation 액션 import

function Location() {
  const dispatch = useDispatch(); // dispatch 함수 생성
  const location = useSelector((state) => state.location); // Redux에서 위치 상태 가져오기
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 지도 초기화
  useEffect(() => {
    const map = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(location.lat, location.lng),
      zoom: 10,
    });

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(location.lat, location.lng),
      map: map,
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.setMap(null); // 컴포넌트 언마운트 시 제거
    };
  }, [location]);

  // 주소 선택 시 호출
  const handleAddressSelect = ({ address, lat, lng }) => {
    const newLatLng = new window.naver.maps.LatLng(lat, lng);
    
    // Redux로 선택한 위치와 주소 업데이트
    dispatch(setLocation({ lat, lng, address }));

    if (mapRef.current && markerRef.current) {
      markerRef.current.setPosition(newLatLng); // 마커 이동
      mapRef.current.setCenter(newLatLng); // 지도 중심 이동
    }
  };

  // 주소 변경 시 호출 (onChange)
  const handleAddressChange = (newAddress) => {
    dispatch(setLocation({ ...location, address: newAddress })); // 주소 변경 시 Redux 상태 업데이트
  };

  const handleSaveLocation = () => {
    console.log('선택된 위치:', location);
    alert('위치가 저장되었습니다.');
    window.history.back();
  };

  return (
    <div className="container mt-4 mb-5">
      <PageHeader
        title="위치 설정"
        description="주소를 검색하여 사용자의 위치를 설정합니다."
      />
      {/* 입력창 */}
      <AddressSearchInput 
        value={location.address} // 기본값으로 주소 설정
        onChange={handleAddressChange} // 주소 변경 시 호출되는 onChange 함수 전달
        onSelect={handleAddressSelect} 
      />

      {/* 지도 */}
      <div id="map" style={{ width: '100%', height: '400px', marginTop: '1rem' }}></div>

      {/* 버튼 */}
      <div className="text-end mt-3">
        <button className="btn btn-secondary me-2" onClick={() => window.history.back()}>
          취소
        </button>
        <button className="btn btn-primary" onClick={handleSaveLocation}>
          저장
        </button>
      </div>
    </div>
  );
}

export default Location;
