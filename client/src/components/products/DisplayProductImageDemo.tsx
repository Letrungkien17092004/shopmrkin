import React, { useState, useRef, useEffect, useCallback } from 'react';
// import './ImageSlider.css'; // Import file CSS

// Định nghĩa kiểu cho dữ liệu ảnh
interface Image {
  url: string;
  alt: string;
}

interface ImageSliderProps {
  images: Image[];
  autoPlay?: boolean; // Tùy chọn: Tự động trượt
  interval?: number; // Tùy chọn: Khoảng thời gian tự động trượt (ms)
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoPlay = false, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;
  const slideRef = useRef<HTMLDivElement>(null);

  // Hàm chuyển đến ảnh tiếp theo
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  }, [totalImages]);

  // Hàm chuyển đến ảnh trước đó
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  // Logic Tự động trượt (AutoPlay)
  useEffect(() => {
    if (autoPlay) {
      const slideInterval = setInterval(goToNext, interval);
      return () => clearInterval(slideInterval); // Cleanup khi component unmount hoặc thay đổi
    }
  }, [autoPlay, interval, goToNext]);

  // Cập nhật vị trí trượt bằng cách thay đổi CSS `transform: translateX()`
  useEffect(() => {
    if (slideRef.current) {
      const offset = -currentIndex * 100; // Mỗi ảnh chiếm 100% chiều rộng container
      slideRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentIndex]);

  if (totalImages === 0) {
    return <div>No images to display.</div>;
  }

  return (
    <div className="slider-container">
      {/* Nút Previous */}
      <button className="nav-btn prev-btn" onClick={goToPrevious}>
        &lt;
      </button>

      {/* Container chứa tất cả ảnh. Phần tử này sẽ được trượt */}
      <div className="slider-track-wrapper">
        <div 
          className="slider-track" 
          ref={slideRef}
          style={{ width: `${totalImages * 100}%` }} // Tổng chiều rộng của tất cả ảnh
        >
          {images.map((image, index) => (
            <div key={index} className="slide">
              <img src={image.url} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>

      {/* Nút Next */}
      <button className="nav-btn next-btn" onClick={goToNext}>
        &gt;
      </button>

      {/* Các chỉ báo (dots/pagination) */}
      <div className="dots-container">
        {images.map((_, index) => (
          <span 
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;