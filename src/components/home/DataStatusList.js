import React from 'react';
import { useSelector } from 'react-redux';
import DataStatusItem from './DataStatusItem';

function DataStatusList() {
  const hospitalLoading = useSelector((state) => state.hospitals.loading);
  const hospitalCount = useSelector((state) => state.hospitals.count);
  const hospitals = useSelector((state) => state.hospitals.hospitals);
  const hospitalError = useSelector((state) => state.hospitals.error); 

  const doctorLoading = useSelector((state) => state.doctors.loading);
  const doctorCount = useSelector((state) => state.doctors.count);
  const doctors = useSelector((state) => state.doctors.doctors);
  const doctorError = useSelector((state) => state.doctors.error);

  const diseaseLoading = useSelector((state) => state.diseases.loading);
  const diseaseCount = useSelector((state) => state.diseases.count);
  const diseases = useSelector((state) => state.diseases.diseases);
  const diseaseError = useSelector((state) => state.diseases.error); 

  const symptomLoading = useSelector((state) => state.symptoms.loading);
  const symptomCount = useSelector((state) => state.symptoms.count);
  const symptoms = useSelector((state) => state.symptoms.symptoms);
  const symptomError = useSelector((state) => state.symptoms.error); 

  return (
    <div className="mt-4">
      <h5 className="fw-bold">데이터 로드 상태</h5>
      <ul className="list-group">
        {/* 병원 정보 상태 */}
        <DataStatusItem 
          label="병원 정보" 
          loading={hospitalLoading} 
          error={hospitalError} 
          count={hospitalCount} 
          loaded={hospitals.length} 
        />
        
        {/* 의사 정보 상태 */}
        <DataStatusItem 
          label="의사 정보" 
          loading={doctorLoading} 
          error={doctorError} 
          count={doctorCount} 
          loaded={doctors.length} 
        />

        {/* 질병 정보 상태 */}
        <DataStatusItem 
          label="질병 정보" 
          loading={diseaseLoading} 
          error={diseaseError} 
          count={diseaseCount} 
          loaded={diseases.length} 
        />

        {/* 증상 정보 상태 */}
        <DataStatusItem 
          label="증상 정보" 
          loading={symptomLoading} 
          error={symptomError} 
          count={symptomCount} 
          loaded={symptoms.length} 
        />
      </ul>
    </div>
  );
}

export default DataStatusList;
