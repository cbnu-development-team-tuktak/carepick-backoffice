import axios from 'axios';

// 전체 데이터베이스를 백업하는 서비스 함수
export const backupDatabase = async () => {
  try {
    // 백업 실행 요청 (GET)
    const response = await axios.get('/api/backup/database');

    // 백업 성공 메시지 반환
    return response.data;
  } catch (error) {
    console.error('데이터베이스 백업에 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};

// 백업된 파일 목록을 조회하는 서비스 함수
export const fetchBackupFiles = async () => {
  try {
    // 백업 파일 목록 요청 (GET)
    const response = await axios.get('/api/backup/files');

    // 파일 이름 목록 반환 (예: ["backup_20250411_144210.sql", ...])
    return response.data;
  } catch (error) {
    console.error('백업 파일 목록을 불러오는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};
