import axios from 'axios';

/**
 * 증상 목록(페이지 단위)을 가져오는 함수
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지당 항목 수
 * @param {string} start - 초성 범위 시작 문자
 * @param {string} end - 초성 범위 끝 문자
 * @returns {Promise<{ content: object[], totalElements: number, totalPages: number }>} - 증상 페이지 결과
 */
export const fetchSymptoms = async (page = 0, size = 10, start, end) => {
  try {
    const response = await axios.get('/api/symptoms/filter', {
      params: { page, size, start, end }
    });
    return response.data; // { content, totalElements, totalPages }
  } catch (error) {
    console.error('증상 목록 조회 중 오류 발생:', error);
    throw error;
  }
};


/**
 * 증상 목록의 개수 조회 (초성 범위에 맞는 증상 개수)
 * @param {string} start - 초성 범위 시작 문자
 * @param {string} end - 초성 범위 끝 문자
 * @returns {Promise<{ count: number }>} - 증상 개수
 */
export const fetchSymptomsCount = async (start, end) => {
  try {
    const response = await axios.get('/api/symptoms/filter/count', {
      params: { start, end }
    });
    return response.data; // { count }
  } catch (error) {
    console.error('증상 개수 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 증상 삭제 함수
 * @param {number} id - 삭제할 증상 ID
 * @returns {Promise<void>} - 삭제 완료
 */
export const deleteSymptom = async (id) => {
  try {
    const response = await axios.delete(`/api/symptoms/${id}`);
    if (response.status === 200) {
      console.log(`증상(ID: ${id}) 삭제 완료`);
      return response.data;
    }
  } catch (error) {
    console.error('증상 삭제 중 오류 발생:', error.response || error);
    throw error; // 여기에서 오류를 처리하고 상위 컴포넌트로 전달
  }
};
