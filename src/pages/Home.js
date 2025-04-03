// src/pages/Home.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadHospitalsCount, loadHospitalsPage } from '../store/hospitalSlice'; // 병원 정보 로드
import { loadSymptomsCount, loadSymptomsPage } from '../store/symptomSlice'; // 증상 정보 로드
import { loadDoctorsCount, loadDoctorsPage } from '../store/doctorSlice'; // 의사 정보 로드
import { loadDiseasesCount, loadDiseasesPage } from '../store/diseaseSlice'; // 질병 정보 로드
import PageHeader from '../components/common/PageHeader';
import DataStatusList from '../components/home/DataStatusList';

function Home() {
  const dispatch = useDispatch();

  // 증상 관련 변수
  const symptomCount = useSelector((state) => state.symptoms.count);
  const symptoms = useSelector((state) => state.symptoms.symptoms);

  // 병원 관련 변수
  const hospitalCount = useSelector((state) => state.hospitals.count);
  const hospitals = useSelector((state) => state.hospitals.hospitals);

  // 의사 관련 변수
  const doctorCount = useSelector((state) => state.doctors.count);
  const doctors = useSelector((state) => state.doctors.doctors);

  // 질병 관련 변수
  const diseaseCount = useSelector((state) => state.diseases.count);
  const diseases = useSelector((state) => state.diseases.diseases);

  // 처음에 증상 개수, 병원 개수, 의사 개수, 질병 개수 로드
  useEffect(() => {
    dispatch(loadSymptomsCount());
    dispatch(loadHospitalsCount());
    dispatch(loadDoctorsCount());  // 의사 개수 로드
    dispatch(loadDiseasesCount()); // 질병 개수 로드
  }, [dispatch]);

  // 증상 데이터를 한 번에 모두 로딩
  useEffect(() => {
    if (symptomCount > 0 && symptoms.length === 0) {
      dispatch(loadSymptomsPage({ page: 0, size: symptomCount }));
    }
  }, [dispatch, symptomCount, symptoms.length]);

  // 병원 데이터를 한 번에 모두 로딩
  useEffect(() => {
    if (hospitalCount > 0 && hospitals.length === 0) {
      dispatch(loadHospitalsPage({ page: 0, size: hospitalCount }));
    }
  }, [dispatch, hospitalCount, hospitals.length]);

  // 의사 데이터를 한 번에 모두 로딩
  useEffect(() => {
    if (doctorCount > 0 && doctors.length === 0) {
      dispatch(loadDoctorsPage({ page: 0, size: doctorCount }));
    }
  }, [dispatch, doctorCount, doctors.length]);

  // 질병 데이터를 한 번에 모두 로딩
  useEffect(() => {
    if (diseaseCount > 0 && diseases.length === 0) {
      dispatch(loadDiseasesPage({ page: 0, size: diseaseCount }));
    }
  }, [dispatch, diseaseCount, diseases.length]);

  return (
    <div className="container mt-4">
      <PageHeader
        title="Carepick 관리자 홈"
        description="관리자 페이지에 오신 것을 환영합니다."
      />
      <DataStatusList />
    </div>
  );
}

export default Home;
