// src/pages/Disease.js

// React 및 Hook 관련 import
import React, { useEffect, useState } from 'react'; // 컴포넌트 생명주기와 상태 관리를 위한 React 훅 사용

// React Router 관련 import
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 사용

// 서비스 (API 호출) 관련 import
import { fetchProcessedDiseases } from '../../services/diseaseService'; // 백엔드에서 가공된 질병 목록 데이터를 조회하는 함수

// DTO 변환 관련 import
import { fromDiseaseApiResponse } from '../../dto/diseaseDetailsResponse'; // 백엔드 응답 데이터를 프론트엔드에서 사용할 Disease DTO 형태로 변환하는 함수

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader'; // 공통 헤더 컴포넌트 import
import Pagination from '../../components/common/Pagination'; 

function Disease() {
  // 상태 관련 변수 선언
  const [diseases, setDiseases] = useState([]); // 조회된 질병 목록을 저장하는 상태
  const [page, setPage] = useState(0); // 현재 페이지 번호를 저장하는 상태 
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수를 저장하는 상태

  // 라우팅 관련 함수 선언
  const navigate = useNavigate(); // 다른 페이지(예: 질병 상세 페이지)로 이동하기 위한 함수
 
  // 컴포넌트가 마운트되거나 page 상태가 변경될 때 실행되는 사이드 이펙트
  useEffect(() => {
    // 현재 페이지 번호(page)와 페이지 크기(20)를 기준으로 질병 데이터를 서버에서 요청
    fetchProcessedDiseases(page, 20)
      .then((data) => {
        // 서버로부터 받은 응답 데이터를 DTO 형식으로 매핑하여 상태에 저장
        const parsedDiseases = data.content.map(fromDiseaseApiResponse); 
        setDiseases(parsedDiseases); // 질병 목록 상태 업데이트
        setTotalPages(data.totalPages); // 전체 페이지 수 상태 업데이트
      })
      .catch((err) => {
        // 데이터 요청 실패 시 콘솔에 에러 출력
        console.error('데이터 로딩 실패', err);
      });
  }, [page]); // page 상태가 변경될 때마다 useEffect 재실행

  return (
    <div className="container mt-4">
      {/* 헤더 영역 */}
      <PageHeader
        title="질병 관리"
        description="등록된 질병 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 질병 카드 리스트 영역 */}
      <div className="row">
        {diseases.map((disease) => (
          <div key={disease.id} className="col-12 mb-3">
            <div className="card"> {/* 개별 질병 카드 */}
              <div className="card-body">
                <h5 className="card-title mb-1 fw-bold fs-5">{disease.name}</h5> {/* 질병 이름 */}
                <h6 className="card-subtitle mb-3 fw-light text-secondary fs-6">
                  {disease.bodySystem} {/* 질병의 신체 계통 */}
                </h6>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/disease/${disease.id}`)} // 질병 상세 페이지로 이동 
                >
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}

export default Disease;
