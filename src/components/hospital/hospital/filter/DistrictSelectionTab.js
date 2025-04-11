// React 및 상태 관리 관련 import
import React, { useState, useEffect } from 'react'; // 컴포넌트 상태 관리와 생명주기 처리용 훅
import { useDispatch } from 'react-redux'; // Redux 상태 접근 및 액션 디스패치

// BootStrap 컴포넌트 관련 import
import { Form, Row, Col, Spinner, Button } from 'react-bootstrap'; // UI 컴포넌트 import

// 서비스 관련 import
import { fetchSidoNames, fetchDistrictsByCity } from '../../../../services/hospital/administrativeRegionsService'; // 행정구역 API 서비스
import { getCoordinatesByAddress } from '../../../../services/hospital/geolocationService';

// Redux 액션 import
import { setLocation } from '../../../../store/locationSlice'; // location 저장 액션

function DistrictSelectionTab({ 
  onClose // 모달 닫기 함수
}) {
  const dispatch = useDispatch(); // Redux 디스패치 함수

  const [cities, setCities] = useState([]); // 시도 목록
  const [districts, setDistricts] = useState({}); // 시도별 읍면동 목록
  const [loading, setLoading] = useState(false); // 로딩 상태

  const [selectedCity, setSelectedCity] = useState(''); // 선택한 시도
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 선택한 읍면동
  const [addressSearchResult, setAddressSearchResult] = useState(null); // 주소 검색 결과

  // 시·도 목록 불러오기
  useEffect(() => {
    const loadCities = async () => {
      try {
        // services에서 불러온 시·도 목록 요청 함수 호출
        const cities = await fetchSidoNames(); 
        
        // 응답 받은 시·도 목록을 상태에 저장
        setCities(cities);
      } catch (error) {
        console.error('시도 목록을 불러오는 데 실패했습니다:', error);
      }
    };

    loadCities(); // 위에서 정의한 함수 실행
  }, []);

  // 시·도 선택 시 실행
  const handleCityChange = async (e) => {
    const city = e.target.value; // 선택된 시·도 값 추출
    
    setSelectedCity(city); // 선택된 시·도 상태 업데이트
    setSelectedDistrict(''); // 기존 선택된 읍면동 초기화
    setAddressSearchResult(null); // 주소 검색 결과 초기화

    // 해당 시·도에 대한 읍·면·동 목록이 아직 로드되지 않았다면 요청 실행
    if (!districts[city]) { 
      await fetchDistricts(city); // 비동기 요청으로 읍·면·동 목록 가져오기
    }
  };

  // 읍·면·동 목록 불러오기 (시·도 선택 시 실행)
  const fetchDistricts = async (city) => {
    setLoading(true); // 로딩 시작
    try {
      // services에서 시·도에 해당하는 읍·면·동 데이터 가져오기
      const districtsData = await fetchDistrictsByCity(city);

      // 해당 시·도의 읍·면·동 목록을 상태에 저장 (기존 데이터와 병합)
      setDistricts((prev) => ({
        ...prev,
        [city]: districtsData,
      }));
    } catch (error) {
      // 오류는 fetchDistrictsByCity 내부에서 콘솔로 로깅
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 읍·면·동 선택 시 실행
  const handleDistrictChange = (e) => {
    const district = e.target.value; // 선택된 읍·면·동 값 추출
    setSelectedDistrict(district); // 선택한 읍·면·동 상태 업데이트
  };

  useEffect(() => {
    // selectedCity와 selectedDistrict가 모두 존재할 때만 실행
    if (selectedCity && selectedDistrict) {
      // 전체 주소 문자열 생성
      const fullAddress = `${selectedCity} ${selectedDistrict}`;
      // 공공주소 API 키
      const CONFIRM_KEY = 'devU01TX0FVVEgyMDI1MDQwNDIwNTIxMTExNTYxNTc=';
  
      const fetchAddress = async () => {
        try {
          // 공공주소 API를 통해 도로명 주소 검색 요청
          const response = await fetch(
            `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${CONFIRM_KEY}&currentPage=1&countPerPage=5&keyword=${encodeURIComponent(
              fullAddress
            )}&resultType=json`
          );
          const data = await response.json(); // JSON 형태로 파싱
          
          // 검색 결과가 존재할 경우
          if (data.results.juso && data.results.juso.length > 0) {
            setAddressSearchResult(data.results.juso); // 주소 리스트 상태에 저장
          } else {
            setAddressSearchResult([]); // 결과가 없을 경우 빈 배열 저장
          }
        } catch (error) {
          // API 요청 실패 시 상태 초기화
          setAddressSearchResult([]);
        }
      };
      
      fetchAddress(); // 주소 검색 함수 호출
    } else {
      setAddressSearchResult(null); // 시·도와 읍·면·동이 모두 선택되지 않으면 검색 결과 초기화
    }
  }, [selectedCity, selectedDistrict]); // selectedCity와 selectedDistrict가 변경될 때마다 실행
  
  // 저장 버튼 클릭 시 실행
  const handleSaveLocation = async () => {
    if (!selectedCity || !selectedDistrict) {
      alert('시·도와 읍·면·동을 선택해주세요.');
      return;
    }
    // 주소 검색 결과가 없으면 종료
    if (!addressSearchResult || addressSearchResult.length === 0) {
      alert('도로명 주소 검색 결과가 없습니다.');
      return;
    }
  
    // 첫 번째 주소로 좌표를 가져오는 비동기 처리
    const address = addressSearchResult[0].roadAddr;
    try {
      const coordinates = await getCoordinatesByAddress(address);
  
      // 좌표가 없으면 종료
      if (!coordinates) {
        alert('위치를 선택할 수 없습니다.');
        return;
      }
  
      // Redux 상태에 주소와 좌표 저장
      dispatch(setLocation({
        address,
        lat: coordinates.lat,
        lng: coordinates.lng,
      }));
  
      alert('위치가 저장되었습니다.');
      onClose(); // 모달 닫기
    } catch (error) {
      alert('좌표 변환 중 오류가 발생했습니다.');
      console.error('좌표 변환 실패:', error);
    }
  };
  

  return (
    <>
      <Row className="mb-3">
        {/* 시도 선택 */}
        <Col md={6}>
          <Form.Group controlId="citySelect">
            <Form.Label>시도 선택</Form.Label>
            <Form.Select value={selectedCity} onChange={handleCityChange}>
              <option value="">시도를 선택하세요</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* 읍면동 선택 */}
        <Col md={6}>
          <Form.Group controlId="districtSelect">
            <Form.Label>읍면동 선택</Form.Label>
            {loading ? (
              <div className="d-flex align-items-center" style={{ height: '38px' }}>
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <Form.Select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedCity}
              >
                <option value="">읍면동을 선택하세요</option>
                {selectedCity &&
                  districts[selectedCity]?.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* 도로명 주소 검색 결과 */}
      {addressSearchResult && (
        <div className="mb-3">
          <strong>도로명 주소 검색 결과:</strong>
          {addressSearchResult.length > 0 ? (
            <ul className="mt-2">
              {addressSearchResult.map((item, idx) => (
                <li key={idx}>{item.roadAddr}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">검색 결과가 없습니다.</p>
          )}
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleSaveLocation}>
          저장
        </Button>
      </div>
    </>
  );
}

export default DistrictSelectionTab;
