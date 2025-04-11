// React 관련 import
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa'; // 필터 아이콘
import { FaMapMarkerAlt } from 'react-icons/fa'; // 위치 마커 아이콘

function FilterButton({
  buttonLabel = '필터',
  modalTitle = '필터 설정',
  children,
  modalHeight = '560px'
}) {
  const [show, setShow] = useState(false);

  // 버튼 레이블에 따라 아이콘을 선택
  const renderIcon = () => {
    if (buttonLabel === '위치 설정') {
      return <FaMapMarkerAlt className="me-2" />; // 위치 설정일 경우 마커 아이콘
    }
    return <FaFilter className="me-2" />; // 기본 필터 아이콘
  };

  return (
    <>
      {/* 필터 버튼 */}
      <Button
        variant="primary"
        className="mb-3 ms-2" // 외부 스타일 클래스 적용
        onClick={() => setShow(true)}
      >
        {/* 아이콘 선택 후 표시 */}
        {renderIcon()}
        {buttonLabel} {/* 매개변수로 받은 텍스트 표시 */}
      </Button>

      {/* 필터 설정 모달 */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            maxHeight: typeof modalHeight === 'number' ? `${modalHeight}px` : modalHeight,
            overflowY: 'auto',
          }}
        >
          {/* 자식 컴포넌트에 모달 닫기 기능 전달 */}
          {React.cloneElement(children, {
            onClose: () => setShow(false),
          })}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FilterButton;
