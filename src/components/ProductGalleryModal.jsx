import React, { useRef, useState } from 'react';
import './ProductGallery.css';

const ProductGalleryModal = ({ product }) => {
  const [indexImgModal, setIndexImgModal] = useState(0);
  let galleryModal = product.media.images[indexImgModal].url;
  let { images } = product.media;
  const modalPoster = useRef(null);
  const handleClickModal = (e) => {
    modalPoster.current.src = e.target.src;
  };
  return (
    <article className="gallery">
      <div className="gallery__image-container">
        <img
          src={`https://${galleryModal}`}
          className="gallery__image"
          ref={modalPoster}
        />
      </div>
      <div className="gallery__thumnails">
        {images.map((image, index) => (
          <img
            key={`thumnail_${index}`}
            id={index + 1}
            className="gallery__thumnail"
            src={`https://${image.url}`}
            onClick={handleClickModal}
          />
        ))}
      </div>
    </article>
  );
};

export default ProductGalleryModal;
