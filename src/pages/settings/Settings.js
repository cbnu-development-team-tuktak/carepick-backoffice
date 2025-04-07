// pages/settings/Settings.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 페이지 이동을 위한 훅
import PageHeader from '../../components/common/PageHeader';

function Settings() {
  const navigate = useNavigate();

  // 위치 설정 페이지로 이동
  const handleLocationSettings = () => {
    navigate('/settings/location');
  };

  return (
    <div className="container mt-4 mb-5">
      <PageHeader 
        title="설정" 
        description="설정 페이지입니다."
      />

      <div className="card mb-4">
        <div className="card-header">
          <h5>일반 설정</h5>
        </div>
        <div className="card-body">
          <p>여기에서 일반적인 설정을 할 수 있습니다.</p>
          <ul>
            <li>위치 설정</li>
            <p>사용자의 현재 위치를 설정합니다.</p>
            <button 
              className="btn btn-primary"
              onClick={handleLocationSettings} // 페이지 이동
            >
              위치 설정
            </button>
            <hr />
            <li>의사 평가 기준 설정</li>
            <p>의사의 평가 기준을 설정합니다.</p>
            <button className="btn btn-primary">의사 평가 기준 설정</button>
          </ul>
        </div>
      </div>

      <div className="card danger mb-4">
        <div className="card-header">
          <h5>위험 구역</h5>
        </div>
        <div className="card-body">
          <p>이 영역에서의 설정은 매우 위험하므로 신중하게 처리하십시오.</p>
          <ul>
            <li>DB 초기화</li>
            <p>전체 데이터베이스를 초기화합니다. 이 작업은 되돌릴 수 없습니다.</p>
            <button className="btn btn-danger">DB 초기화</button>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
