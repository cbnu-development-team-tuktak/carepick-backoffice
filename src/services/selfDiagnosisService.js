import axios from 'axios';

/**
 * 자가진단을 위한 증상 키워드를 전송하고, 응답 메시지를 받아오는 함수
 * @param {string[]} symptoms - 추출된 증상 키워드 목록
 * @returns {Promise<string>} - 백엔드 응답 메시지 (예: "입력한 증상 키워드: ...")
 */
export const submitSymptomsForDiagnosis = async (symptoms) => {
  try {
    const response = await axios.post('/api/self-diagnosis/keywords', symptoms);
    return response.data; // 응답 메시지 문자열
  } catch (error) {
    console.error('자가진단 요청 중 오류 발생:', error);
    throw error;
  }
};
