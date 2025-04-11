import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function HospitalImageCarousel({ imageUrls = [] }) {
  const fileInputRef = useRef();

  // + 버튼 클릭 시 파일 업로더 열기
  const handleAddImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // 파일 선택 시 상위로 전달
  const handleFileChange = (e) => {

  };

  return (
    <>
      <Swiper
        loop={imageUrls.length > 1}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        spaceBetween={16}
        pagination={{ clickable: true }}
        navigation={true}
        className="hospital-carousel"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} className="hospital-slide">
            <img src={url} alt={`병원 이미지 ${index + 1}`} className="carousel-image" />
          </SwiperSlide>
        ))}

        {/* + 버튼 */}
        <SwiperSlide className="hospital-slide add-slide" onClick={handleAddImageClick}>
          <div className="add-image-card">+</div>
        </SwiperSlide>
      </Swiper>

      {/* 실제 파일 선택 인풋 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: 'none' }}
      />
    </>
  );
}

export default HospitalImageCarousel;
