// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 공통 컴포넌트 import
import Navbar from './components/common/Navbar';

// 페이지 컴포넌트 import
import Home from './pages/Home';
import Hospital from './pages/hospital/Hospital';
import HospitalDetail from './pages/hospital/HospitalDetail'; 
import Doctor from './pages/doctor/Doctor';
import DoctorDetail from './pages/doctor/DoctorDetail'; // ✅ 의사 상세 페이지
import DoctorAdd from './pages/doctor/DoctorAdd'; // ✅ 의사 상세 페이지
import Disease from './pages/disease/Disease';
import DiseaseDetail from './pages/disease/DiseaseDetail'; // ✅ 질병 상세 페이지

function App() {
  return (
    <Router>
      {/* 상단 내비게이션 */}
      <Navbar />

      {/* 본문 영역 */}
      <div className="container py-4">
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Home />} />

          {/* 병원 목록 페이지 */}
          <Route path="/hospital" element={<Hospital />} />

          {/* 의사 상세 페이지 */}
          <Route path="/hospital/:id" element={<HospitalDetail />} /> {/* ✅ 의사 상세 경로 추가 */}

          {/* 의사 목록 페이지 */}
          <Route path="/doctor" element={<Doctor />} />

          {/* 의사 상세 페이지 */}
          <Route path="/doctor/:id" element={<DoctorDetail />} /> {/* ✅ 의사 상세 경로 추가 */}

          {/* 의사 추가 페이지 */}
          <Route path="/doctor/add" element={<DoctorAdd />} /> {/* /doctor/add 경로 추가 */} 

          {/* 질병 목록 페이지 */}
          <Route path="/disease" element={<Disease />} />

          {/* 질병 상세 페이지 */}
          <Route path="/disease/:id" element={<DiseaseDetail />} /> {/* ✅ 질병 상세 경로 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
