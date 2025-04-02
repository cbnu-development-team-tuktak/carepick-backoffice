import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fromSymptomApiResponse } from '../../dto/SymptomDetailsResponse';
import { fromDiseaseApiResponse } from '../../dto/DiseaseDetailsResponse';
import PageHeader from '../../components/common/PageHeader';

function SymptomDetail() {
  const { id } = useParams();

  const [symptom, setSymptom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diseases, setDiseases] = useState([]); // ✅ 병합된 질병 정보

  useEffect(() => {
    const fetchSymptom = async () => {
      try {
        const res = await fetch(`/api/symptoms/${id}`);
        const data = await res.json();
        const dto = fromSymptomApiResponse(data);
        setSymptom(dto);

        // 병렬로 질병 정보 가져오기
        const diseaseData = await Promise.all(
          dto.diseaseIds.map(async (diseaseId) => {
            try {
              const res = await fetch(`/api/diseases/processed/${diseaseId}`);
              const json = await res.json();
              return fromDiseaseApiResponse(json);
            } catch {
              return null;
            }
          })
        );

        // null 필터링
        setDiseases(diseaseData.filter((d) => d !== null));
        setLoading(false);
      } catch (err) {
        console.error('증상 정보 조회 실패:', err);
        setLoading(false);
      }
    };

    fetchSymptom();
  }, [id]);

  if (loading) return <div className="text-center mt-4">로딩 중...</div>;
  if (!symptom) return <div className="text-center mt-4 text-danger">증상 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="container mt-4">
      <PageHeader
        title="증상 상세 정보"
        description="해당 증상과 연결된 질병 정보를 확인할 수 있습니다."
      />

      <div className="card shadow-sm p-3">
        <h5 className="fw-bold">증상 이름</h5>
        <p>{symptom.name}</p>

        <h6 className="fw-bold mt-3">연결된 질병</h6>
        {diseases.length > 0 ? (
          <ul className="list-group">
            {diseases.map((disease) => (
              <li key={disease.id} className="list-group-item">
                <strong>{disease.name}</strong> <br />
                증상 수: {disease.symptoms.length}개 <br />
                다른 증상: {disease.symptoms.join(', ')}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">연결된 질병이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SymptomDetail;
