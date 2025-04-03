// src/pages/Disease.js

// React 및 Hook 관련 import
import React, { useEffect, useState } from 'react';

// React Router 관련 import
import { useNavigate } from 'react-router-dom';

// 서비스 (API 호출) 관련 import
import { fetchProcessedDiseases } from '../../services/diseaseService';

// DTO 변환 관련 import
import { fromDiseaseApiResponse } from '../../dto/DiseaseDetailsResponse';

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import BodySystemFilter from '../../components/filter/BodySystemFilter'; // ✅ 추가
import { Spinner } from 'react-bootstrap'; // ✅ 로딩 스피너 import

function Disease() {
  const [diseases, setDiseases] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBodySystem, setSelectedBodySystem] = useState(null); // ✅ 신체계통 필터 상태

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProcessedDiseases(page, 20);
        const parsedDiseases = data.content.map(fromDiseaseApiResponse);
        setDiseases(parsedDiseases);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('데이터 로딩 실패', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page]);

  // ✅ 필터링된 질병 리스트
  const filteredDiseases = selectedBodySystem
    ? diseases.filter((d) => d.bodySystem === selectedBodySystem)
    : diseases;

  return (
    <div className="container mt-4">
      <PageHeader
        title="질병 관리"
        description="등록된 질병 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* ✅ 신체계통 필터 */}
      <BodySystemFilter
        selectedCode={selectedBodySystem}
        onSelect={(code) => {
          setSelectedBodySystem((prev) => (prev === code ? null : code)); // 다시 클릭 시 해제
          setPage(0);
        }}
      />

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <div className="mt-2">질병 정보를 불러오는 중입니다...</div>
        </div>
      ) : (
        <>
          {/* 질병 카드 리스트 (3칸 레이아웃) */}
          <div className="d-flex flex-wrap gap-2">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="card p-2 d-flex flex-column justify-content-between"
                style={{
                  flex: '0 0 calc(33.333% - 0.5rem)',
                  minWidth: '200px',
                }}
              >
                <div>
                  <p className="fw-bold mb-1">{disease.name}</p>
                  <p className="text-muted mb-2">{disease.bodySystem}</p>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary align-self-end"
                  onClick={() => navigate(`/disease/${disease.id}`)}
                >
                  자세히 보기
                </button>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default Disease;
