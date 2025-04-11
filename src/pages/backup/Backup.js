import React, { useEffect, useState } from 'react';

// 컴포넌트 import
import PageHeader from '../../components/common/PageHeader';
import BackupFileList from '../../components/backup/BackupFileList'; // 방금 만든 컴포넌트
import { fetchBackupFiles } from '../../services/backup/backupService';

function Backup() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 백업 파일 목록 불러오기
    fetchBackupFiles()
      .then(setFiles)
      .catch((error) => {
        console.error('백업 파일 로딩 실패:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <PageHeader
        title="백업"
        description="현재 저장된 데이터베이스를 백업하고, 이전 백업 파일 목록을 확인할 수 있습니다."
      />

      <BackupFileList files={files} />
    </div>
  );
}

export default Backup;
