const regions = ["Scotland", "Lake District", "Snowdonia", "Peak District"];
const categories = ["Summit", "Ridge", "Client Day", "Conditions"];

function buildGalleryImages(season) {
  return Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    const region = regions[index % regions.length];
    const category = categories[index % categories.length];

    return {
      id: `${season.toLowerCase()}-${number}`,
      src: `/images/gallery/${season.toLowerCase()}/gallery-${number}.jpeg`,
      alt: `${season} guided mountain tour photograph ${number}`,
      title: `${season} ${category} ${number}`,
      location: region,
      season,
      category,
      featured: number % 7 === 0 || number % 11 === 0,
    };
  });
}

const winterGalleryImages = buildGalleryImages("Winter");
const summerGalleryImages = buildGalleryImages("Summer");

export function getGalleryImages(theme) {
  return theme === "summer" ? summerGalleryImages : winterGalleryImages;
}

export const galleryFilters = [
  "All",
  "Scotland",
  "Lake District",
  "Snowdonia",
  "Peak District",
  "Summit",
  "Ridge",
  "Client Day",
  "Conditions",
];