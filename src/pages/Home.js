// src/pages/Home.jsx

// React 관련 import
import React from 'react'; // React 컴포넌트 기본 기능 사용

// 컴포넌트 import
import PageHeader from '../components/common/PageHeader'; // 공통 페이지 헤더 컴포넌트 (타이틀/설명 표시)

// 관리자용 Carepick 대시보드 홈 화면
function Home() {
  return (
    <div className="container mt-4">
      {/* 페이지 헤더 */}
      <PageHeader
        title="Carepick 관리자 홈"
        description="관리자 페이지에 오신 것을 환영합니다."
      />
    </div>
  );
}

export default Home;