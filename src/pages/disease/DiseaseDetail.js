import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DiseaseDetail() {
  const { id } = useParams();
  const [disease, setDisease] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [newSymptom, setNewSymptom] = useState('');

  // 질병 상세 조회
  useEffect(() => {
    axios.get(`/api/diseases/processed/${id}`).then((res) => {
      setDisease(res.data);
      setSymptoms(res.data.symptoms || []);
    });
  }, [id]);

  // 증상 리스트 백엔드에 저장
  const updateSymptomsOnServer = async (updatedSymptoms) => {
    try {
      await axios.put(`/api/diseases/processed/${id}/symptoms`, updatedSymptoms);
      alert('증상이 수정되었습니다!');
    } catch (error) {
      console.error('증상 수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 수정 모드 진입
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedValue(symptoms[index]);
  };

  // 수정 저장
  const saveEditedSymptom = () => {
    const updated = [...symptoms];
    updated[editingIndex] = editedValue.trim();
    setSymptoms(updated);
    setEditingIndex(null);
    setEditedValue('');
    updateSymptomsOnServer(updated);
  };

  // 삭제
  const deleteSymptom = (index) => {
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
    updateSymptomsOnServer(updated);
  };

  // 추가
  const addSymptom = () => {
    if (newSymptom.trim() === '') return;
    const updated = [...symptoms, newSymptom.trim()];
    setSymptoms(updated);
    setNewSymptom('');
    updateSymptomsOnServer(updated);
  };

  if (!disease) return <div className="container mt-4">로딩 중...</div>;

  return (
    <div className="container mt-4">
      <h2>{disease.name}</h2>
      <p><strong>신체 계통:</strong> {disease.bodySystem}</p>
      <p><strong>증상:</strong> {disease.symptoms.join(', ')}</p>
      <p><strong>진료과:</strong> {disease.specialties.join(', ')}</p>

      <hr />
      <h5>증상 수정</h5>
      <div className="mb-3">
        {symptoms.map((symptom, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  className="form-control me-2"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
                <button
                    className="btn btn-sm btn-success me-2 px-3 py-1"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={saveEditedSymptom}
                >
                    저장
                </button>
                <button
                    className="btn btn-sm btn-secondary px-3 py-1"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setEditingIndex(null)}
                >
                    취소
                </button>
              </>
            ) : (
              <>
                <span className="me-2">{symptom}</span>
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditing(index)}>
                  수정
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSymptom(index)}>
                  삭제
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 새 증상 추가 */}
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="새 증상 입력"
          value={newSymptom}
          onChange={(e) => setNewSymptom(e.target.value)}
        />
        <button
            className="btn btn-outline-success btn-sm px-3 py-1"
            style={{ whiteSpace: 'nowrap' }}
            onClick={addSymptom}
        >
            추가
        </button>
      </div>
    </div>
  );
}

export default DiseaseDetail;
