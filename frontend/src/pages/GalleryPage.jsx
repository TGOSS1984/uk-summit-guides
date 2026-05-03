import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaExpand, FaXmark } from "react-icons/fa6";
import { galleryFilters, getGalleryImages } from "../data/galleryImages";

const INITIAL_VISIBLE_IMAGES = 30;
const LOAD_MORE_AMOUNT = 12;

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "winter";
}

function GalleryPage() {
  const [theme, setTheme] = useState(getCurrentTheme);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_IMAGES);
  const touchStartX = useRef(null);

  const galleryImages = useMemo(() => getGalleryImages(theme), [theme]);

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") return galleryImages;

    return galleryImages.filter(
      (image) =>
        image.location === activeFilter ||
        image.category === activeFilter ||
        image.season === activeFilter
    );
  }, [activeFilter, galleryImages]);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const featuredImage = visibleImages[0];
  const gridImages = visibleImages.slice(1);
  const hasMoreImages = visibleCount < filteredImages.length;

  const activeImage =
    activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  function openLightbox(index) {
    setActiveImageIndex(index);
  }

  function closeLightbox() {
    setActiveImageIndex(null);
  }

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1
    );
  }

  function handleImageLoaded(imageId) {
    setLoadedImages((currentImages) => ({
      ...currentImages,
      [imageId]: true,
    }));
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    touchStartX.current = null;
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
      setActiveFilter("All");
      setActiveImageIndex(null);
      setLoadedImages({});
      setVisibleCount(INITIAL_VISIBLE_IMAGES);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeImage ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (activeImageIndex === null) return;

      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, filteredImages.length]);

  return (
    <>
      <section className="gallery-hero">
        <motion.div
          className="gallery-hero__image"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <div className="gallery-hero__overlay" />

        <div className="container gallery-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-kicker">Tour archive</p>
            <h1 className="page-title gallery-hero__title">
              Previous days in the mountains.
            </h1>
            <p className="gallery-hero__copy">
              A visual record of guided summit days, quiet ridgelines, winter
              conditions, summer traverses, and memorable moments from previous
              UK mountain tours.
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
                <span className="gallery-hero__meta-label">Viewing</span>
                <strong className="gallery-hero__meta-value">Lightbox</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section gallery-shell">
        <div className="container">
          <motion.div
            className="feature-band__card gallery-intro-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          >
            <span className="feature-band__accent" aria-hidden="true" />
            <p className="feature-band__eyebrow">Seasonal gallery</p>
            <h2 className="feature-band__title">
              The gallery changes with the site theme.
            </h2>
            <p className="feature-band__text">
              Switch between winter and summer to view a season-specific archive.
              Use the filters below to browse by region, terrain type, or tour
              moment.
            </p>
          </motion.div>

          <div className="gallery-toolbar">
            <div>
              <p className="gallery-toolbar__eyebrow">Browse archive</p>
              <h2 className="gallery-toolbar__title">
                {filteredImages.length} images showing
              </h2>
            </div>

            <div className="gallery-filters" aria-label="Gallery filters">
              {galleryFilters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={
                    activeFilter === filter
                      ? "gallery-filter is-active"
                      : "gallery-filter"
                  }
                  onClick={() => {
                    setActiveFilter(filter);
                    setActiveImageIndex(null);
                    setVisibleCount(INITIAL_VISIBLE_IMAGES);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {featuredImage ? (
            <motion.button
              type="button"
              className="gallery-featured"
              onClick={() => openLightbox(0)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
            >
              <span className="gallery-featured__media">
                <img src={featuredImage.src} alt={featuredImage.alt} />
              </span>

              <span className="gallery-featured__content">
                <span className="gallery-featured__eyebrow">
                  Featured frame
                </span>
                <strong className="gallery-featured__title">
                  {featuredImage.title}
                </strong>
                <span className="gallery-featured__copy">
                  {featuredImage.location} / {featuredImage.season} /{" "}
                  {featuredImage.category}
                </span>
                <span className="gallery-featured__cta">
                  Open full screen <FaExpand aria-hidden="true" />
                </span>
              </span>
            </motion.button>
          ) : null}

          <motion.div
            key={`${theme}-${activeFilter}-${visibleCount}`}
            className="gallery-grid gallery-grid--premium"
            aria-label="Previous tour photo gallery"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.045,
                },
              },
            }}
          >
            {gridImages.map((image, index) => (
              <motion.button
                type="button"
                key={image.id}
                className={
                  image.featured
                    ? "gallery-card gallery-card--featured"
                    : "gallery-card"
                }
                onClick={() => openLightbox(index + 1)}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className={
                    loadedImages[image.id]
                      ? "gallery-card__image-wrap is-loaded"
                      : "gallery-card__image-wrap"
                  }
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    onLoad={() => handleImageLoaded(image.id)}
                    onError={() => handleImageLoaded(image.id)}
                  />
                </span>

                <span className="gallery-card__overlay">
                  <span>
                    <span className="gallery-card__kicker">
                      {image.season} / {image.category}
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
              </motion.button>
            ))}
          </motion.div>

          {hasMoreImages ? (
            <div className="gallery-load-more">
              <button
                type="button"
                className="gallery-load-more__button"
                onClick={() =>
                  setVisibleCount((currentCount) =>
                    Math.min(currentCount + LOAD_MORE_AMOUNT, filteredImages.length)
                  )
                }
              >
                Load more images
                <span>
                  {Math.min(visibleCount, filteredImages.length)} /{" "}
                  {filteredImages.length}
                </span>
              </button>
            </div>
          ) : null}

        </div>
      </section>

      {activeImage ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
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
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </button>

          <motion.div
            className="gallery-lightbox__content"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28 }}
          >
            <img src={activeImage.src} alt={activeImage.alt} />

            <div className="gallery-lightbox__caption">
              <p>
                Image {activeImageIndex + 1} of {filteredImages.length}
              </p>
              <h2>{activeImage.title}</h2>
              <span>
                {activeImage.location} / {activeImage.season} /{" "}
                {activeImage.category}
              </span>
            </div>
          </motion.div>

          <button
            type="button"
            className="gallery-lightbox__nav gallery-lightbox__nav--next"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
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