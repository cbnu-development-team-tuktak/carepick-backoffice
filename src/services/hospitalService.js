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
  sortBy = 'distance',
  page = 0,
  size = 20
}) => {
  const params = {
    sortBy,
    page,
    size
  };

  // 위치 정보가 있다면 추가
  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
  }

  // 거리 필터가 있다면 추가
  if (distance != null) {
    params.distance = distance;
  }

  // 진료과 필터가 있다면 추가
  if (specialties.length > 0) {
    params.specialties = specialties;
  }

  // axios 요청 (qs를 사용해 specialties[]=x → specialties=x 형식으로 처리)
  const response = await axios.get('/api/hospitals/filter', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  });

  return response.data;
};
