function HospitalImageList({ imageUrls = [] }) {
  return (
    <div className="hospital-image-file-list">
      {imageUrls.map((url, index) => (
        <div className="hospital-image-file-item d-flex align-items-center justify-content-between" key={index}>
          <div className="hospital-image-info">
            <div className="hospital-image-url text-truncate" title={url}>{url}</div>
            <div className="hospital-image-alt text-muted">alt: 병원 이미지 {index + 1}</div>
          </div>
          <div className="hospital-image-actions">
            <button className="btn btn-sm btn-outline-secondary me-2">수정</button>
            <button className="btn btn-sm btn-outline-danger">삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HospitalImageList;
