import axios from 'axios';
import qs from 'qs'; // 배열 쿼리 파라미터 포맷팅을 위한 유틸

/**
 * 이름순 병원 목록 조회 (기본 정렬)
 */
export const fetchHospitalsByName = async (page = 0, size = 20) => {
  const response = await axios.get('/api/hospitals', {
    params: { page, size }
  });
  return response.data;
};

/**
 * 거리순 병원 목록 조회 (위치 기반)
 */
export const fetchHospitalsByLocation = async (lat, lng, page = 0, size = 20) => {
  const response = await axios.get('/api/hospitals/location', {
    params: { lat, lng, page, size }
  });
  return response.data;
};

/**
 * 필터 조건 기반 병원 목록 조회 (거리 + 진료과 등)
 */
export const fetchHospitalsByFilters = async ({
  lat = null,
  lng = null,
  distance = null,
  specialties = [],
  selectedDays = [],    
  startTime = null,        
  endTime = null,         
  sortBy = 'distance',
  page = 0,
  size = 20
}) => {
  const params = {
    sortBy,
    page,
    size
  };

  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
  }

  if (distance != null) {
    params.distance = distance;
  }

  if (specialties.length > 0) {
    params.specialties = specialties;
  }

  // ✅ 요일 필터가 있다면 추가
  if (selectedDays.length > 0) {
    params.selectedDays = selectedDays;
  }

  // ✅ 시작 시간 필터
  if (startTime) {
    params.startTime = startTime;
  }

  // ✅ 종료 시간 필터
  if (endTime) {
    params.endTime = endTime;
  }

  const response = await axios.get('/api/hospitals/filter', {
    params,
    paramsSerializer: params =>
      qs.stringify(params, { arrayFormat: 'repeat' }) // 배열을 repeat 형식으로 직렬화
  });

  return response.data;
};
