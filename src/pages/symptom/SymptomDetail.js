// src/pages/symptom/SymptomDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 증상 ID를 추출하기 위한 React Router 훅

const SymptomDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 증상 ID 추출
  const [symptom, setSymptom] = useState(null); // 증상 상세 정보를 저장할 상태

  useEffect(() => {
    // 데이터 가져오는 부분은 나중에 구현할 부분입니다.
  }, [id]); // 증상 ID가 변경될 때마다 데이터 새로 가져오기

  return (
    <div className="container mt-4">
      <h3>증상 상세 페이지</h3>
      {/* 나중에 실제 데이터가 들어가면 아래 부분을 채우세요 */}
      <p><strong>증상 이름:</strong> {/* 증상 이름 */}</p>
      <p><strong>설명:</strong> {/* 증상 설명 */}</p>
      <p><strong>원인:</strong> {/* 증상 원인 */}</p>
      <p><strong>치료법:</strong> {/* 증상 치료법 */}</p>
    </div>
  );
};

export default SymptomDetail;
