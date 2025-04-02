import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { fromDoctorApiResponse } from '../../dto/DoctorDetailsResponse';

// UI 컴포넌트 import
import { Modal, Button } from 'react-bootstrap'; 
import FloatingButton from '../../components/common/button/FloatingButton'; 
import DoctorForm from '../../components/doctor/DoctorForm'; 
import PageHeader from '../../components/common/PageHeader'; 

// 서비스 import
import { fetchSpecialties } from '../../services/specialtyService'; 

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  const [imagePreview, setImagePreview] = useState(null); 
  const [specialties, setSpecialties] = useState([]); 
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); 

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchSpecialties()
      .then((data) => {
        setSpecialties(data); 
      })
      .catch((err) => {
        console.error('진료과 목록 불러오기 실패:', err);
      });

    fetch(`/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const doctorData = fromDoctorApiResponse(data);
        console.log('받아온 의사 정보:', doctorData); // 콘솔 출력
        setDoctor(doctorData);
        setLoading(false);
        setSelectedSpecialties(doctorData.specialties); 
      })
      .catch((err) => {
        console.error('의사 정보 불러오기 실패:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center">로딩 중...</div>;
  if (!doctor) return <div className="text-center text-danger">의사 정보를 찾을 수 없습니다.</div>;

  const handleSave = () => {
    setShowModal(true); 
  };

  const confirmSave = () => {
    console.log('저장 완료');
    setShowModal(false);
    navigate(-1); // 이전 페이지로 이동
  };

  const cancelSave = () => {
    setShowModal(false);
  };

  const handleInputChange = (e, field) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [field]: e.target.value,
    }));
  };

  const handleListChange = (e, idx, field) => {
    const updatedList = [...doctor[field]];
    updatedList[idx] = e.target.value;
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [field]: updatedList,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); 
    }
  };

  return (
    <div className="container mt-4">
      <PageHeader title="의사 상세 정보" description="의사 정보 및 진료과, 소속 병원 등을 수정할 수 있습니다." />

      <DoctorForm
        doctor={doctor}
        isEditing={isEditing} 
        handleInputChange={handleInputChange}
        handleListChange={handleListChange}
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

export default DoctorDetail;
