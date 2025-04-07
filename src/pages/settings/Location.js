// pages/settings/Location.js
import React, { useState, useEffect, useRef } from 'react';
import AddressSearchInput from '../../components/settings/AddressSearchInput';
import PageHeader from '../../components/common/PageHeader';

function Location() {
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본 서울
  const mapRef = useRef(null);   // map 객체 저장
  const markerRef = useRef(null); // marker 객체 저장

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
  }, []);

  // 주소 선택 시 호출
  const handleAddressSelect = ({ address, lat, lng }) => {
    const newLatLng = new window.naver.maps.LatLng(lat, lng);
    setLocation({ lat, lng });
  
    if (mapRef.current && markerRef.current) {
      markerRef.current.setPosition(newLatLng);    // 마커 이동
      mapRef.current.setCenter(newLatLng);         // ✅ 지도 중심 이동 ← 이게 꼭 필요
    }
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
      <AddressSearchInput onSelect={handleAddressSelect} />

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
