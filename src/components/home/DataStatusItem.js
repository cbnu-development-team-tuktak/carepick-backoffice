import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';  // 아이콘 임포트
import { Spinner } from 'react-bootstrap';

function DataStatusItem({ label, loading, error, count, loaded }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span><strong>{label}</strong></span>
      {loading ? (
        <span className="text-primary d-inline-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>불러오는 중...</span>
        </span>
      ) : error ? (
        <span className="text-danger d-inline-flex align-items-center gap-2">
          <FaTimesCircle size={16} className="mr-2" />
          <span>{error}</span>
        </span>
      ) : (
        count > 0 && loaded === count ? (
          <span className="text-success d-inline-flex align-items-center gap-2">
            <FaCheckCircle size={16} className="mr-2" />
            <span>{`${loaded} 개 로드 완료`}</span>
          </span>
        ) : (
          <span className="text-danger d-inline-flex align-items-center gap-2">
            <FaTimesCircle size={16} className="mr-2" />
            <span>로드 실패</span>
          </span>
        )
      )}
    </li>
  );
}

export default DataStatusItem;
