import axios from 'axios';

// 병원 운영 시간 목록을 가져오는 서비스 함수 (페이지 수를 파라미터로 받음)
export const fetchHospitalOperatingHours = async (maxPage) => {
  try {
    // 병원 운영 시간 데이터를 가져오는 GET 요청 (maxPage 쿼리 파라미터 포함)
    const response = await axios.get(`/api/crawl/hospital/operating-hours?maxPage=${maxPage}`);

    // 응답 받은 병원 운영 시간 목록 반환
    return response.data;
  } catch (error) {
    console.error('병원 운영 시간을 불러오는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};

// 병원 이름을 매개변수로 받아 네이버에서 운영 시간 정보를 가져오는 서비스 함수
export const fetchHospitalOperatingHoursFromNaver = async (hospitalName) => {
  try {
    // 병원 운영 시간 데이터를 가져오는 GET 요청
    const response = await axios.get(`/api/crawl/hospital/operating-hours-from-naver?name=${hospitalName}`);

    // 응답 받은 병원 운영 시간 목록 반환
    return response.data;
  } catch (error) {
    console.error('네이버에서 병원 운영 시간을 불러오는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};
