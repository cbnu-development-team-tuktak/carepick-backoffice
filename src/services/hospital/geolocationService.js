import axios from 'axios'; // HTTP 요청을 위한 axios 라이브러리 import

// 주소를 통해 좌표 정보를 가져오는 서비스 함수
export const getCoordinatesByAddress = async (address) => {
  try {
    const response = await axios.get('/api/geolocation', {
      params: { address },
    });

    // 응답에서 경도(longitude), 위도(latitude)를 받아서 반환
    return {
      lng: response.data.x,
      lat: response.data.y,
    };
  } catch (error) {
    console.error('주소 좌표 조회 실패:', error);
    throw new Error('좌표 정보를 가져오는 데 실패했습니다.');
  }
};
