// React 관련 import
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * 재사용 가능한 필터 버튼 (모달 오픈 전용)
 *
 * @param {string} buttonLabel - 버튼에 표시할 텍스트
 * @param {string} modalTitle - 모달 상단 제목
 * @param {ReactNode} children - 모달 내부에 렌더링할 내용 (외부에서 전달됨)
 * @param {string | number} modalHeight - 모달 본문 최대 높이 (예: '560px' 또는 숫자 560)
 */
function FilterButton({
  buttonLabel = '필터',
  modalTitle = '필터 설정',
  children,
  modalHeight = '560px'
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* 필터 버튼 */}
      <Button
        variant="outline-secondary"
        className="mb-3 ms-2"
        onClick={() => setShow(true)}
      >
        {buttonLabel}
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
