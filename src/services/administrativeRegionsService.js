// services/administrativeRegionsService.js

import axios from 'axios';

// 시·도 목록을 가져오는 서비스 함수
export const fetchSidoNames = async () => {
  try {
    // 행정구역(시·도) 이름 목록을 가져오는 GET 요청
    const response = await axios.get('/api/administrative-regions/sido-names');

    // 응답 받은 시·도 목록 반환
    return response.data;
  } catch (error) {
    console.error('시도 목록을 불러오는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};

// 시·도에 해당하는 읍면동 목록을 가져오는 서비스 함수
export const fetchDistrictsByCity = async (city) => {
  try {
    // 서버로부터 해당 시·도에 대한 읍면동 목록을 가져오는 GET 요청
    const response = await axios.get(`/api/administrative-regions/sido/umd?sido=${city}`);

    // 응답받은 읍면동 데이터만 반환
    return response.data;
  } catch (error) {
    // 요청 실패 시 콘솔에 상세한 에러 출력
    console.error(`읍면동 목록(${city})을 가져오는 데 실패했습니다:`, error);

    // 호출한 쪽에서 에러를 핸들링할 수 있도록 예외 다시 throw
    throw error;
  }
};