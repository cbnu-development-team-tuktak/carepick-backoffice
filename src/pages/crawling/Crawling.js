import React, { useState } from 'react';

// 컴포넌트 import
import PageHeader from '../../components/common/PageHeader';
import {
  fetchHospitalOperatingHours,
  fetchHospitalOperatingHoursFromNaver,
} from '../../services/crawling/crawlingService';

function Crawling() {
  const [responseData, setResponseData] = useState(null); // 서버 응답 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const [maxPage, setMaxPage] = useState(1); // 요청할 페이지 수
  const [selectedEndpoint, setSelectedEndpoint] = useState('test'); // 선택된 엔드포인트
  const [hospitalName, setHospitalName] = useState(''); // 병원 이름 (네이버용)

  // 데이터 요청 함수
  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (selectedEndpoint === 'test') {
        data = {
          hospital: '병원 A',
          operating_hours: '09:00 - 18:00',
          address: '서울시 강남구',
        };
      } else if (selectedEndpoint === 'operating-hours') {
        data = await fetchHospitalOperatingHours(maxPage);
      } else if (selectedEndpoint === 'operating-hours-from-naver' && hospitalName) {
        data = await fetchHospitalOperatingHoursFromNaver(hospitalName);
      }

      setResponseData(data);
    } catch (err) {
      setError('데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <PageHeader
        title="크롤링 테스트"
        description="백엔드의 병원 · 의사 크롤링 기능을 테스트하고 결과를 확인하는 페이지입니다."
      />

      {/* 요청할 페이지 수 입력 */}
      <div className="form-group">
        <label htmlFor="maxPage">요청할 페이지 수</label>
        <input
          type="number"
          className="form-control"
          id="maxPage"
          value={maxPage}
          onChange={(e) => setMaxPage(Number(e.target.value))}
          min="1"
          max="10"
        />
      </div>

      {/* 엔드포인트 선택 */}
      <div className="form-group">
        <label htmlFor="endpoint">데이터 요청 엔드포인트</label>
        <select
          className="form-control"
          id="endpoint"
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
        >
          <option value="test">테스트</option>
          <option value="operating-hours">운영 시간</option>
          <option value="operating-hours-from-naver">네이버 운영 시간</option>
        </select>
      </div>

      {/* 병원 이름 입력 (네이버 검색용) */}
      {selectedEndpoint === 'operating-hours-from-naver' && (
        <div className="form-group">
          <label htmlFor="hospitalName">병원 이름</label>
          <input
            type="text"
            className="form-control"
            id="hospitalName"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            placeholder="병원 이름을 입력하세요"
          />
        </div>
      )}

      {/* 전송 버튼 */}
      <button
        className="btn btn-primary mt-3"
        onClick={handleFetchData}
        disabled={loading || (selectedEndpoint === 'operating-hours-from-naver' && !hospitalName)}
      >
        {loading ? '로딩 중...' : '데이터 가져오기'}
      </button>

      {/* 에러 메시지 */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* 응답 결과 출력 */}
      <div className="mt-4">
        {responseData ? (
          <pre
            style={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '20px',
              height: '320px',
              overflowY: 'scroll',
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 #333',
            }}
          >
            {JSON.stringify(responseData, null, 2)}
          </pre>
        ) : (
          <p>데이터가 아직 로드되지 않았습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Crawling;
