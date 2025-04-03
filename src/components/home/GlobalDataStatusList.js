// src/components/common/GlobalDataStatusList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadHospitals, loadDoctors, loadDiseases } from '../../store/dataSlice'; // 데이터 불러오는 액션들

function GlobalDataStatusList() {
  const dispatch = useDispatch();

  // 데이터 로딩 상태들
  const symptomLoading = useSelector((state) => state.symptoms.loading);
  const hospitalLoading = useSelector((state) => state.hospitals.loading);
  const doctorLoading = useSelector((state) => state.doctors.loading);
  const diseaseLoading = useSelector((state) => state.diseases.loading);

  useEffect(() => {
    dispatch(loadHospitals());
    dispatch(loadDoctors());
    dispatch(loadDiseases());
  }, [dispatch]);

  return (
    <div className="mt-4">
      <h6 className="fs-5 fw-semibold mb-3">데이터 로드 상태</h6>

      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>병원 정보</strong></span>
          {hospitalLoading ? (
            <span className="text-primary d-inline-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>불러오는 중...</span>
            </span>
          ) : (
            <span className="text-success">완료됨 ✅</span>
          )}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>의사 정보</strong></span>
          {doctorLoading ? (
            <span className="text-primary d-inline-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>불러오는 중...</span>
            </span>
          ) : (
            <span className="text-success">완료됨 ✅</span>
          )}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>질병 정보</strong></span>
          {diseaseLoading ? (
            <span className="text-primary d-inline-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>불러오는 중...</span>
            </span>
          ) : (
            <span className="text-success">완료됨 ✅</span>
          )}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>증상 정보</strong></span>
          {symptomLoading ? (
            <span className="text-primary d-inline-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>불러오는 중...</span>
            </span>
          ) : (
            <span className="text-success">완료됨 ✅</span>
          )}
        </li>
      </ul>
    </div>
  );
}

export default GlobalDataStatusList;
