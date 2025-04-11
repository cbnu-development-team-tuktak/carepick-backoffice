import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFileAlt } from 'react-icons/fa'; // 아이콘 import

// 파일명에서 백업 생성 시간을 파싱해 로컬 포맷 문자열로 반환
function getFormattedBackupTime(filename) {
  const match = filename.match(/backup_(\d{8})_(\d{6})\.sql/);
  if (!match) return null;

  const [_, date, time] = match;
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6)) - 1; // JS는 0-indexed month
  const day = Number(date.slice(6, 8));
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(2, 4));
  const second = Number(time.slice(4, 6));

  const localDate = new Date(year, month, day, hour, minute, second);
  return `${localDate.getFullYear()}년 ${localDate.getMonth() + 1}월 ${localDate.getDate()}일 ` +
         `${localDate.getHours()}시 ${localDate.getMinutes()}분 ${localDate.getSeconds()}초`;
}

function BackupFileList({ files = [] }) {
  const [expandedIndex, setExpandedIndex] = useState({});

  const toggleIndex = (index) => {
    setExpandedIndex((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="backup-file-list mt-4">
      <div className="d-flex align-items-center mb-3">
        <FaFileAlt className="me-2 text-secondary" />
        <h5 className="mb-0">백업 파일 목록</h5>
      </div>

      {files.length > 0 ? (
        <div
          className="backup-file-scroll-wrapper"
          style={{
            maxHeight: '300px',
            minHeight: '300px',
            overflowY: 'scroll',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '0.25rem',
          }}
        >
          <div className="list-group">
            {files.map((file, index) => (
              <div key={index} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className="text-truncate" title={file}>{file}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => toggleIndex(index)}
                  >
                    {expandedIndex[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {expandedIndex[index] && (
                  <div className="mt-2 ps-4 text-muted">
                    <div>백업 생성 시간: {getFormattedBackupTime(file) || '정보 없음'}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            height: '300px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '0.25rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#6c757d',
          }}
        >
          백업 파일이 없습니다.
        </div>
      )}
    </div>
  );
}

export default BackupFileList;
