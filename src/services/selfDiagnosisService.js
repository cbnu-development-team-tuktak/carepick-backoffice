import axios from 'axios';

/**
 * 자가진단을 위한 증상 키워드를 전송하고, 응답 메시지를 받아오는 함수
 * @param {string[]} symptoms - 추출된 증상 키워드 목록
 * @returns {Promise<Object>} - 백엔드 응답 객체 (message, suggestedSymptoms, suggestedSpecialties)
 */
export const submitSymptomsForDiagnosis = async (symptoms) => {
  try {
    const response = await axios.post('/api/self-diagnosis/symptoms', symptoms);
    return response.data;
  } catch (error) {
    console.error('증상 기반 자가진단 요청 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 자가진단을 위한 질병명 목록을 전송하고, 관련 진료과를 받아오는 함수
 * @param {string[]} diseases - 입력된 질병 배열
 * @returns {Promise<Object>} - 백엔드 응답 객체 (message, suggestedSymptoms, suggestedSpecialties)
 */
export const submitDiseasesForDiagnosis = async (diseases) => {
  try {
    const response = await axios.post('/api/self-diagnosis/disease', diseases);
    return response.data;
  } catch (error) {
    console.error('질병명 기반 자가진단 요청 중 오류 발생:', error);
    throw error;
  }
};


/**
 * 자연어 입력을 기반으로 자가진단을 요청하는 함수 (향후 구현 예정)
 * @param {string} inputText - 사용자 입력 문장
 * @returns {Promise<Object>} - 백엔드 응답 객체 (message, suggestedSymptoms, suggestedSpecialties)
 */
export const submitNaturalTextForDiagnosis = async (inputText) => {
  try {
    const response = await axios.post('/api/self-diagnosis/natural', inputText);
    return response.data;
  } catch (error) {
    console.error('자연어 기반 자가진단 요청 중 오류 발생:', error);
    throw error;
  }
};
