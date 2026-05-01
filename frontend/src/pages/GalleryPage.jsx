import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaExpand, FaXmark } from "react-icons/fa6";
import { getGalleryImages } from "../data/galleryImages";

function GalleryPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const theme =
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "winter"
      : "winter";

  const galleryImages = useMemo(() => getGalleryImages(theme), [theme]);

  const activeImage =
    activeImageIndex !== null ? galleryImages[activeImageIndex] : null;

  function openLightbox(index) {
    setActiveImageIndex(index);
  }

  function closeLightbox() {
    setActiveImageIndex(null);
  }

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (activeImageIndex === null) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, galleryImages.length]);

  return (
    <>
      <section className="gallery-hero">
        <div className="gallery-hero__image" />
        <div className="gallery-hero__overlay" />

        <div className="container gallery-hero__content">
          <p className="section-kicker">Tour archive</p>
          <h1 className="page-title gallery-hero__title">
            Previous days in the mountains.
          </h1>
          <p className="gallery-hero__copy">
            A visual record of guided summit days, quiet ridgelines, winter
            conditions, summer traverses, and memorable moments from previous UK
            mountain tours.
          </p>

          <div className="gallery-hero__meta">
            <div className="gallery-hero__meta-item">
              <span className="gallery-hero__meta-label">Images</span>
              <strong className="gallery-hero__meta-value">
                {galleryImages.length}
              </strong>
            </div>

            <div className="gallery-hero__meta-item">
              <span className="gallery-hero__meta-label">Season</span>
              <strong className="gallery-hero__meta-value">
                {theme === "summer" ? "Summer" : "Winter"}
              </strong>
            </div>

            <div className="gallery-hero__meta-item">
              <span className="gallery-hero__meta-label">Format</span>
              <strong className="gallery-hero__meta-value">Full screen</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section gallery-shell">
        <div className="container">
          <div className="feature-band__card gallery-intro-card">
            <span className="feature-band__accent" aria-hidden="true" />
            <p className="feature-band__eyebrow">Seasonal gallery</p>
            <h2 className="feature-band__title">
              The gallery changes with the site theme.
            </h2>
            <p className="feature-band__text">
              Switch between winter and summer to view a season-specific archive.
              Images are loaded from a simple scalable data file, so the gallery
              can grow from 30 images to 100+ without changing the layout.
            </p>
          </div>

          <div className="gallery-grid" aria-label="Previous tour photo gallery">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image.id}
                className={
                  image.featured
                    ? "gallery-card gallery-card--featured"
                    : "gallery-card"
                }
                onClick={() => openLightbox(index)}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />

                <span className="gallery-card__overlay">
                  <span>
                    <span className="gallery-card__kicker">
                      {image.season}
                    </span>
                    <strong className="gallery-card__title">
                      {image.title}
                    </strong>
                    <span className="gallery-card__location">
                      {image.location}
                    </span>
                  </span>

                  <span className="gallery-card__icon" aria-hidden="true">
                    <FaExpand />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeImage ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={closeLightbox}
            aria-label="Close image preview"
          >
            <FaXmark />
          </button>

          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--prev"
            onClick={showPreviousImage}
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </button>

          <div className="gallery-lightbox__content">
            <img src={activeImage.src} alt={activeImage.alt} />

            <div className="gallery-lightbox__caption">
              <p>{activeImage.season}</p>
              <h2>{activeImage.title}</h2>
              <span>{activeImage.location}</span>
            </div>
          </div>

          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--next"
            onClick={showNextImage}
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>
        </div>
      ) : null}
    </>
  );
}

export default GalleryPage;