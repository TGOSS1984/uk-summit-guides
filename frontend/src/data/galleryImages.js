const winterGalleryImages = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;

  return {
    id: `winter-${number}`,
    src: `/images/gallery/winter/gallery-${number}.jpg`,
    alt: `Winter guided mountain tour photograph ${number}`,
    title: `Winter Mountain Day ${number}`,
    location: "UK Mountains",
    season: "Winter",
    featured: number % 7 === 0 || number % 11 === 0,
  };
});

const summerGalleryImages = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;

  return {
    id: `summer-${number}`,
    src: `/images/gallery/summer/gallery-${number}.jpg`,
    alt: `Summer guided mountain tour photograph ${number}`,
    title: `Summer Mountain Day ${number}`,
    location: "UK Mountains",
    season: "Summer",
    featured: number % 7 === 0 || number % 11 === 0,
  };
});

export function getGalleryImages(theme) {
  return theme === "summer" ? summerGalleryImages : winterGalleryImages;
}