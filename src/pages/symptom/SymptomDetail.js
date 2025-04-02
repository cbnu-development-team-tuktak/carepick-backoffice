// src/pages/SymptomDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// DTO 변환 함수
import { fromSymptomApiResponse } from '../../dto/SymptomDetailsResponse';
import { fromDiseaseApiResponse } from '../../dto/DiseaseDetailsResponse';

// 공통 컴포넌트
import PageHeader from '../../components/common/PageHeader';

function SymptomDetail() {
  const { id } = useParams(); // 현재 URL에서 증상 ID 추출
  const navigate = useNavigate(); // 페이지 이동용

  const [symptom, setSymptom] = useState(null); // 현재 증상 정보
  const [diseases, setDiseases] = useState([]); // 연결된 질병 리스트
  const [loading, setLoading] = useState(true); // 로딩 여부
  const [symptomMap, setSymptomMap] = useState({}); // { id: name } 형태의 증상 이름 맵

  useEffect(() => {
    const fetchSymptomAndDiseases = async () => {
      try {
        // 증상 자체 조회
        const res = await fetch(`/api/symptoms/${id}`);
        const data = await res.json();
        const dto = fromSymptomApiResponse(data);
        setSymptom(dto);

        // 질병 데이터 (병렬 처리)
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
        const validDiseases = diseaseData.filter((d) => d !== null);
        setDiseases(validDiseases);

        // 질병 내 모든 증상 ID 수집
        const uniqueSymptomIds = new Set(validDiseases.flatMap((d) => d.symptoms));

        // ID → 이름 맵핑
        const symptomResponses = await Promise.all(
          Array.from(uniqueSymptomIds).map(async (symptomId) => {
            try {
              const res = await fetch(`/api/symptoms/${symptomId}`);
              const json = await res.json();
              return [symptomId, json.name];
            } catch {
              return [symptomId, '이름 없음'];
            }
          })
        );

        setSymptomMap(Object.fromEntries(symptomResponses));
        setLoading(false);
      } catch (err) {
        console.error('증상 정보 조회 실패:', err);
        setLoading(false);
      }
    };

    fetchSymptomAndDiseases();
  }, [id]);

  if (loading) return <div className="text-center mt-4">로딩 중...</div>;
  if (!symptom) return <div className="text-center mt-4 text-danger">증상 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="container mt-4">
      {/* 페이지 상단 제목 */}
      <PageHeader
        title="증상 상세 정보"
        description="해당 증상과 연결된 질병 정보를 확인할 수 있습니다."
      />

      {/* 증상 상세 카드 */}
      <div className="card shadow-sm p-4">
        <p className="fw-bold fs-4 mb-4">{symptom.name}</p>

        {/* 연결된 질병 리스트 */}
        <h6 className="fw-bold">관련 질병</h6>
        {diseases.length > 0 ? (
          <ul className="list-group mt-2">
            {diseases.map((disease) => (
              <li
                key={disease.id}
                className="list-group-item d-flex justify-content-between align-items-start mb-3"
              >
                <div className="ms-2 me-auto w-100">
                  <div className="fw-bold mb-2">{disease.name}</div>

                  <div className="d-flex flex-wrap gap-2">
                    {disease.symptoms.map((symptomId) => {
                      const symptomName = symptomMap[symptomId] || '이름 없음';
                      const isCurrent = symptomId === Number(id);

                      return (
                        <span
                          key={symptomId}
                          className={`px-2 py-1 rounded ${
                            isCurrent ? 'bg-primary text-white fw-bold' : 'bg-light text-muted'
                          }`}
                          style={{
                            flex: '0 0 calc(20% - 0.5rem)',
                            minWidth: 'fit-content',
                            textAlign: 'center',
                            cursor: isCurrent ? 'default' : 'pointer',
                          }}
                          onClick={() => {
                            if (!isCurrent) {
                              navigate(`/symptom/${symptomId}`);
                            }
                          }}
                        >
                          {symptomName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <span className="badge text-bg-primary rounded-pill ms-3">
                  {disease.symptoms.length}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-2">연결된 질병이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SymptomDetail;
