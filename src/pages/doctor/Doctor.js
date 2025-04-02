// src/pages/Doctor.js
import React, { useEffect, useState } from 'react'; // 컴포넌트 생명주기와 상태 관리를 위한 React 훅 사용
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 사용
import { fetchDoctors } from '../../services/doctorService'; // 백엔드에서 가공된 의사 목록 데이터를 조회하는 함수
import { fromDoctorApiResponse } from '../../dto/DoctorDetailsResponse'; // 백엔드 응답 데이터를 프론트엔드에서 사용할 Doctor DTO 형태로 변환하는 함수
import PageHeader from '../../components/common/PageHeader'; // 공통 헤더 컴포넌트 import
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트 import
import DoctorCard from '../../components/doctor/DoctorCard'; // 재사용 가능한 의사 카드 컴포넌트 import
import FloatingButton from '../../components/common/button/FloatingButton'; // FloatingButton 컴포넌트 가져오기

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors(page, 20)
      .then((data) => {
        const parsedDoctors = data.content.map(fromDoctorApiResponse); 
        setDoctors(parsedDoctors);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        console.error('의사 데이터 로딩 실패', err);
      });
  }, [page]);

  const handleAddDoctor = () => {
    // 의사 추가 페이지로 이동 (예: 의사 추가 폼을 가진 페이지로 이동)
    navigate('/doctor/add');
  };

  return (
    <div className="container mt-4">
      {/* 헤더 영역 */}
      <PageHeader
        title="의사 관리"
        description="의사 정보를 조회하고 수정할 수 있는 페이지입니다."
      />

      {/* 의사 카드 리스트 */}
      <div className="row">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            name={doctor.name}
            profileImage={doctor.profileImage}
            hospitalName={doctor.hospitalName}
            specialties={doctor.specialties}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* 플로팅 버튼 (플러스 아이콘, 의사 추가 클릭 시 동작) */}
      <FloatingButton mode="add" onClick={handleAddDoctor} />
    </div>
  );
}

export default Doctor;
