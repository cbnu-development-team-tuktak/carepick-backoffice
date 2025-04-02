// src/pages/DiseaseDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fromDiseaseApiResponse } from '../../dto/DiseaseDetailsResponse'; // DTO
import { fetchSpecialties } from '../../services/specialtyService'; // 진료과 서비스
import DiseaseForm from '../../components/disease/DiseaseForm'; // 증상 폼
import PageHeader from '../../components/common/PageHeader'; // 페이지 헤더
import FloatingButton from '../../components/common/button/FloatingButton'; // 수정 버튼
import { Modal, Button } from 'react-bootstrap'; // 모달


function DiseaseDetail() {
  const { id } = useParams(); // URL 파라미터에서 id 추출
  const navigate = useNavigate(); // 네비게이션 훅

  const [disease, setDisease] = useState(null); // 질병 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isEditing, setIsEditing] = useState(false); // 편집 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [symptoms, setSymptoms] = useState([]); // 증상 상태

  // 질병 상세 조회
  useEffect(() => {
    fetch(`/api/diseases/processed/${id}`)
      .then(res => res.json())
      .then(data => {
        const dto = fromDiseaseApiResponse(data);
        setDisease(dto);
        setSymptoms(dto.symptoms || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('질병 정보 불러오기 실패:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center">로딩 중...</div>;
  if (!disease) return <div className="text-center text-danger">질병 정보를 찾을 수 없습니다.</div>;

  const handleSave = () => setShowModal(true); // 저장 버튼 클릭 시
  const confirmSave = () => {
    console.log('저장 완료');
    setShowModal(false); // 모달 닫기
    navigate(-1); // 이전 페이지로 돌아가기
  };
  const cancelSave = () => setShowModal(false); // 취소 버튼 클릭 시

  const handleSymptomChange = (e, index) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index] = e.target.value;
    setSymptoms(updatedSymptoms);
  };

  const handleAddSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]); // 증상 추가 후 symptoms 상태 갱신
    }
  };
  

  const handleDeleteSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      <PageHeader title="질병 상세 정보" description="질병 정보 및 증상, 진료과 등을 수정할 수 있습니다." />

      {/* 증상 수정 폼 */}
      <DiseaseForm 
        disease={disease}
        isEditing={isEditing}
        symptoms={symptoms}
        handleSymptomChange={handleSymptomChange}
        handleAddSymptom={handleAddSymptom}
        handleDeleteSymptom={handleDeleteSymptom}
      />

      {/* 수정 버튼 */}
      <FloatingButton mode="edit" onClick={() => setIsEditing(!isEditing)} />

      {/* 저장 모달 */}
      <Modal show={showModal} onHide={cancelSave}>
        <Modal.Header closeButton>
          <Modal.Title>변경 사항 저장</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 변경 사항을 저장하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelSave}>취소</Button>
          <Button variant="primary" onClick={confirmSave}>저장</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DiseaseDetail;