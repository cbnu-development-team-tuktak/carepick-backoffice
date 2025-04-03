import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSymptomsCount, loadSymptomsPage } from '../store/symptomSlice';
import PageHeader from '../components/common/PageHeader';
import { Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';  // 아이콘 임포트

function Home() {
  const dispatch = useDispatch();
  const symptomLoading = useSelector((state) => state.symptoms.loading);
  const symptomCount = useSelector((state) => state.symptoms.count);
  const symptoms = useSelector((state) => state.symptoms.symptoms);
  const currentPage = useSelector((state) => state.symptoms.page);
  const totalPages = Math.ceil(symptomCount / 20);  // 1 페이지에 20개씩
  const error = useSelector((state) => state.symptoms.error); // 에러 메시지

  // 처음에 증상 개수 로드
  useEffect(() => {
    dispatch(loadSymptomsCount());
  }, [dispatch]);

  // 증상 데이터를 한 번에 모두 로딩
  useEffect(() => {
    if (symptomCount > 0 && symptoms.length === 0) {
      dispatch(loadSymptomsPage({ page: 0, size: symptomCount }));
    }
  }, [dispatch, symptomCount, symptoms.length]);

  return (
    <div className="container mt-4">
      <PageHeader
        title="Carepick 관리자 홈"
        description="관리자 페이지에 오신 것을 환영합니다."
      />

      <div className="mt-4">
        <h6>데이터 로드 상태</h6>
        <ul className="list-unstyled">
          {/* 병원 정보 상태 */}
          <li className="d-flex justify-content-between align-items-center">
            <span><strong>병원 정보</strong></span>
            <span className="text-muted">로드 비활성화</span>
          </li>
          
          {/* 의사 정보 상태 */}
          <li className="d-flex justify-content-between align-items-center">
            <span><strong>의사 정보</strong></span>
            <span className="text-muted">로드 비활성화</span>
          </li>
          
          {/* 질병 정보 상태 */}
          <li className="d-flex justify-content-between align-items-center">
            <span><strong>질병 정보</strong></span>
            <span className="text-muted">로드 비활성화</span>
          </li>

          {/* 증상 정보 상태 */}
          <li className="d-flex justify-content-between align-items-center">
            <span><strong>증상 정보</strong></span>
            {symptomLoading ? (
              <span className="text-primary d-inline-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>불러오는 중...</span>
              </span>
            ) : error ? (
              <span className="text-danger d-inline-flex align-items-center gap-2">
                <FaTimesCircle size={16} className="mr-2" />
                <span>{error}</span>
              </span> 
            ) : (
              symptomCount > 0 && symptoms.length === symptomCount ? (
                <span className="text-success d-inline-flex align-items-center gap-2">
                  <FaCheckCircle size={16} className="mr-2" />
                  <span>{`${symptoms.length} / ${symptomCount} 로드 완료`}</span>
                </span>
              ) : (
                <span className="text-danger d-inline-flex align-items-center gap-2">
                  <FaTimesCircle size={16} className="mr-2" />
                  <span>로드 실패</span>
                </span>
              )
            )}
          </li>
        </ul>

        {/* 증상 페이지 로딩 상태 */}
        {symptomLoading && symptomCount > 0 && (
          <div className="mt-3">
            <span>{currentPage + 1} / {totalPages} 페이지 로드 완료</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
