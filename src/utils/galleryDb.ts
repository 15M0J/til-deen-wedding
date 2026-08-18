export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption?: string;
  category: 'ALL' | 'DATES' | 'MILESTONES' | 'TRAVELS' | 'SUNSET' | 'PORTRAITS';
  date?: string;
  featured?: boolean;
}

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  // ── First Dates & Beginnings ──
  { id: 'p01', src: '/images/gallery/moment_01.jpeg', title: 'Where It All Began', caption: 'Our very first date at Sea Life Birmingham by the jellyfish tank', category: 'DATES', date: '23 March 2024', featured: true },
  { id: 'p02', src: '/images/gallery/moment_04.jpeg', title: 'Cozy Noodle Date', caption: 'Sharing warm ramen bowls and laughter on an early dinner date', category: 'DATES', date: 'Spring 2024' },
  
  // ── Milestones & Heritage ──
  { id: 'p03', src: '/images/gallery/moment_05.jpeg', title: 'Deen’s Graduation Day', caption: 'Academic cap & gown milestone celebrating hard-earned success', category: 'MILESTONES', date: 'Summer 2024', featured: true },
  { id: 'p04', src: '/images/gallery/moment_27.jpeg', title: 'Royal Emerald Banquet', caption: 'Til in a stunning emerald green kaftan & Deen in a traditional tartan shawl', category: 'MILESTONES', date: 'Autumn 2024', featured: true },
  { id: 'p05', src: '/images/gallery/moment_30.jpeg', title: 'Christmas Morning Tartan', caption: 'Matching red & black tartan pajamas by the holiday tree', category: 'MILESTONES', date: '25 December 2024', featured: true },
  { id: 'p06', src: '/images/gallery/moment_32.jpeg', title: 'Aso-Oke Heritage Harmony', caption: 'Intimate heritage portrait celebrating Nigerian tradition and culture', category: 'MILESTONES', date: 'Heritage 2024', featured: true },

  // ── Adventures & Travels ──
  { id: 'p07', src: '/images/gallery/moment_08.jpeg', title: 'Cardiff Castle, Wales', caption: 'Exploring the historic stone fortress bridge on our summer getaway', category: 'TRAVELS', date: 'Summer 2024', featured: true },
  { id: 'p08', src: '/images/gallery/moment_11.jpeg', title: 'English Countryside Escape', caption: 'Charming stone cottage retreat and classic red telephone box', category: 'TRAVELS', date: 'Autumn 2024', featured: true },
  { id: 'p09', src: '/images/gallery/moment_19.jpeg', title: 'Berat Overlook, Albania', caption: 'Panoramic mountain view high above the historic City of a Thousand Windows', category: 'TRAVELS', date: 'Albania 2024', featured: true },
  { id: 'p10', src: '/images/gallery/moment_25.jpeg', title: 'Lake Windermere Boat Hire', caption: 'Captaining our own motorboat across the serene waters of Lake Windermere', category: 'TRAVELS', date: 'Lake District 2024', featured: true },
  { id: 'p11', src: '/images/gallery/moment_35.jpeg', title: 'Marrakech Quad Safari', caption: 'ATV desert trail expedition through the Palmeraie of Marrakech', category: 'TRAVELS', date: 'Morocco 2024', featured: true },
  { id: 'p12', src: '/images/gallery/moment_36.jpeg', title: 'Ben Youssef Palace Arches', caption: 'Marveling at the Moorish architecture and intricate plasterwork in Marrakech', category: 'TRAVELS', date: 'Morocco 2024', featured: true },

  // ── Dates, Sports & Fine Dining ──
  { id: 'p13', src: '/images/gallery/moment_15.jpeg', title: 'Full Throttle Go-Kart Racing', caption: 'Suiting up in racing jumpsuits & helmets at the track', category: 'DATES', date: 'Autumn 2024', featured: true },
  { id: 'p14', src: '/images/gallery/moment_37.jpeg', title: 'Crystal Chandelier Fine Dining', caption: 'Romantic dinner date beneath grand chandeliers and autumn leaves', category: 'DATES', date: 'Fine Dining 2024', featured: true },
  { id: 'p15', src: '/images/gallery/moment_40.jpeg', title: 'Hospitality Lounge Smiles', caption: 'Matching crisp white outfits enjoying cocktails and stadium hospitality', category: 'PORTRAITS', date: 'Wembley 2024', featured: true },
  { id: 'p16', src: '/images/gallery/moment_44.jpeg', title: 'Emirates Stadium Matchday', caption: 'Arsenal matchday loyalty — Til in the Away kit & Deen in the Home jersey', category: 'DATES', date: 'London 2024', featured: true },
  { id: 'p17', src: '/images/gallery/moment_47.jpeg', title: 'Shakespeare’s Birthplace', caption: 'Historic stroll in Stratford-upon-Avon outside the 16th-century timber house', category: 'TRAVELS', date: 'Stratford 2024' },

  // ── Romantic Sunset & Meadow Shoot ──
  { id: 'p18', src: '/images/gallery/moment_24.jpeg', title: 'Golden Coast Piggyback', caption: 'Pure sunset bliss and laughing rides along the coastal path', category: 'SUNSET', date: 'Golden Hour 2024', featured: true },
  { id: 'p19', src: '/images/gallery/moment_45.jpeg', title: 'TILDEEN In The Sand', caption: 'Our names etched forever in the golden sand washed by gentle waves', category: 'SUNSET', date: 'Coastline 2024', featured: true },
  { id: 'p20', src: '/images/gallery/moment_51.jpeg', title: 'Summer Meadow Embrace', caption: 'Rustic garden bench portrait surrounded by lush greenery', category: 'PORTRAITS', date: 'Summer 2024', featured: true },
  { id: 'p21', src: '/images/gallery/moment_54.jpeg', title: 'Sun-Kissed Laughs', caption: 'Radiant summer meadow photoshoot surrounded by wild tall grasses', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p22', src: '/images/gallery/moment_58.jpeg', title: 'Wildflower Forehead Kiss', caption: 'Gentle sunset kiss as the golden sun dips behind the treeline', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p23', src: '/images/gallery/moment_63.jpeg', title: 'Forever Til & Deen', caption: 'Counting down to December 18th, 2026 at The Nest at Guzape Hills', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
];

const STORAGE_KEY_GALLERY = 'tildeen_custom_gallery';
const STORAGE_KEY_VERSION = 'tildeen_gallery_schema_version';
const CURRENT_VERSION = 'v3_curated_highlights_23';

export function getGalleryPhotos(): GalleryPhoto[] {
  try {
    const version = localStorage.getItem(STORAGE_KEY_VERSION);
    if (version !== CURRENT_VERSION) {
      // Migrate / reset to fresh authentic labels
      localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(INITIAL_GALLERY_PHOTOS));
      return INITIAL_GALLERY_PHOTOS;
    }

    const raw = localStorage.getItem(STORAGE_KEY_GALLERY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_GALLERY_PHOTOS;
}

export function saveGalleryPhotos(photos: GalleryPhoto[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
    localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(photos));
    window.dispatchEvent(new Event('galleryDbUpdate'));
  } catch {
    // ignore
  }
}

export function addGalleryPhoto(photo: Omit<GalleryPhoto, 'id'>): GalleryPhoto {
  const photos = getGalleryPhotos();
  const newPhoto: GalleryPhoto = {
    ...photo,
    id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  };
  const updated = [newPhoto, ...photos];
  saveGalleryPhotos(updated);
  return newPhoto;
}

export function updateGalleryPhoto(id: string, updates: Partial<GalleryPhoto>): void {
  const photos = getGalleryPhotos();
  const updated = photos.map(p => p.id === id ? { ...p, ...updates } : p);
  saveGalleryPhotos(updated);
}

export function deleteGalleryPhoto(id: string): void {
  const photos = getGalleryPhotos();
  const updated = photos.filter(p => p.id !== id);
  saveGalleryPhotos(updated);
}

export function resetGalleryPhotos(): GalleryPhoto[] {
  localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
  saveGalleryPhotos(INITIAL_GALLERY_PHOTOS);
  return INITIAL_GALLERY_PHOTOS;
}

