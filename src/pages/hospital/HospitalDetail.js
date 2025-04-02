// ✅ src/pages/HospitalDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fromHospitalApiResponse } from '../../dto/HospitalDetailsResponse';
import { fetchSpecialties } from '../../services/specialtyService';
import HospitalForm from '../../components/hospital/HospitalForm';
import PageHeader from '../../components/common/PageHeader';
import FloatingButton from '../../components/common/button/FloatingButton';
import { Modal, Button } from 'react-bootstrap';

function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  useEffect(() => {
    fetchSpecialties().then(setSpecialties);

    fetch(`/api/hospitals/${id}`)
      .then(res => res.json())
      .then(data => {
        const dto = fromHospitalApiResponse(data);
        setHospital(dto);
        setSelectedSpecialties(dto.specialties);
        setLoading(false);
      })
      .catch(err => {
        console.error('병원 정보 불러오기 실패:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center">로딩 중...</div>;
  if (!hospital) return <div className="text-center text-danger">병원 정보를 찾을 수 없습니다.</div>;

  const handleSave = () => setShowModal(true);
  const confirmSave = () => {
    console.log('저장 완료');
    setShowModal(false);
    navigate(-1);
  };
  const cancelSave = () => setShowModal(false);

  const handleInputChange = (e, field) => {
    setHospital(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="container mt-4">
      <PageHeader title="병원 상세 정보" description="병원 정보 및 진료과, 위치, 이미지 등을 수정할 수 있습니다." />

      <HospitalForm
        hospital={hospital}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        specialties={specialties}
        selectedSpecialties={selectedSpecialties}
        setSelectedSpecialties={setSelectedSpecialties}
      />

      <FloatingButton mode="edit" onClick={handleSave} />

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

export default HospitalDetail;