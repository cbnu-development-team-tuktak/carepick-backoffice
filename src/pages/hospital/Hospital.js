// src/pages/HospitalPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 컴포넌트
import PageHeader from '../../components/common/PageHeader';
import FloatingButton from '../../components/common/button/FloatingButton';
import HospitalCard from '../../components/hospital/HospitalCard';
import Pagination from '../../components/common/Pagination'; // ✅ 페이지네이션 import

// 서비스
import { fetchHospitals } from '../../services/hospitalService';

// DTO
import { fromHospitalApiResponse } from '../../dto/HospitalDetailsResponse';

function Hospital() {
  const [hospitals, setHospitals] = useState([]);
  const [page, setPage] = useState(0); // ✅ 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // ✅ 전체 페이지 수
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals(page, 20)
      .then((data) => {
        console.log('📦 받아온 병원 데이터:', data);
        const processed = data?.content?.map(fromHospitalApiResponse) || [];
        setHospitals(processed);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        console.error('병원 목록 불러오기 실패:', err);
      });
  }, [page]); // ✅ 페이지 변경 시 다시 호출

  const handleAddHospital = () => {
    navigate('/hospital/add');
  };

  return (
    <div className="container mt-4">
      <PageHeader
        title="병원 관리"
        description="병원 정보를 조회하고 수정할 수 있는 페이지입니다."
      />

      <div className="row">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="col-md-4 mb-4">
            <HospitalCard hospital={hospital} />
          </div>
        ))}
      </div>

      {/* ✅ 페이지네이션 추가 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <FloatingButton mode="add" onClick={handleAddHospital} />
    </div>
  );
}

export default Hospital;
