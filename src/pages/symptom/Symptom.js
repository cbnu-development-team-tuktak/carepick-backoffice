// React 및 Hook 관련 import
import React, { useState, useEffect } from 'react'; // 컴포넌트 생명주기와 상태 관리를 위한 React 훅 사용

// React Router 관련 import
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 사용

// 컴포넌트 관련 import
import PageHeader from '../../components/common/PageHeader'; // 공통 헤더 컴포넌트 import
import Pagination from '../../components/common/Pagination'; // 페이지네이션 컴포넌트 import

function Symptom() {
  // 상태 관련 변수 선언
  const [symptoms, setSymptoms] = useState([]); // 조회된 증상 목록을 저장하는 상태
  const [page, setPage] = useState(0); // 현재 페이지 번호를 저장하는 상태
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수를 저장하는 상태

  // 라우팅 관련 함수 선언
  const navigate = useNavigate(); // 다른 페이지(예: 증상 상세 페이지)로 이동하기 위한 함수

  // 컴포넌트가 마운트되거나 page 상태가 변경될 때 실행되는 사이드 이펙트
  useEffect(() => {
    // 서버에서 증상 데이터를 요청하는 부분은 일단 생략
    // const fetchSymptoms = async () => {
    //   // API 호출 코드
    // };
    // fetchSymptoms();

    // 예시로 더미 데이터를 설정
    setSymptoms([
      { id: 1, name: '기침' },
      { id: 2, name: '두통' },
      { id: 3, name: '발열' },
      // 추가적인 증상 목록을 여기에 추가
    ]);
    setTotalPages(1); // 페이지 수 설정 (예시로 1페이지만 설정)
  }, [page]);

  return (
    <div className="container mt-4">
      {/* 헤더 영역 */}
      <PageHeader
        title="증상 관리"
        description="등록된 증상 정보를 조회하고 자세히 확인할 수 있는 페이지입니다."
      />

      {/* 증상 카드 리스트 영역 */}
      <div className="row">
        {symptoms.map((symptom) => (
          <div key={symptom.id} className="col-12 mb-3">
            <div className="card"> {/* 개별 증상 카드 */}
              <div className="card-body">
                <h5 className="card-title mb-1 fw-bold fs-5">{symptom.name}</h5> {/* 증상 이름 */}
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/symptom/${symptom.id}`)} // 증상 상세 페이지로 이동 
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

export default Symptom;
