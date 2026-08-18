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
  // Sea Life & First Dates
  { id: 'p01', src: '/images/gallery/moment_01.jpeg', title: 'Where It All Began', caption: 'Our very first date at Sea Life Birmingham by the jellyfish tank', category: 'DATES', date: '23 March 2024', featured: true },
  { id: 'p02', src: '/images/gallery/moment_02.jpeg', title: 'Ocean Tunnel Adventures', caption: 'Exploring the underwater ocean tunnel and sea life together in Birmingham', category: 'DATES', date: 'March 2024', featured: true },
  { id: 'p03', src: '/images/gallery/moment_03.jpeg', title: 'Sunny Sidewalk Silhouettes', caption: 'Playful hand-in-hand shadow selfies on a bright spring walk', category: 'PORTRAITS', date: 'Spring 2024' },
  { id: 'p04', src: '/images/gallery/moment_04.jpeg', title: 'Steaming Noodle Date', caption: 'Cozy ramen & chopstick dinner date sharing delicious bowls', category: 'DATES', date: 'Spring 2024' },
  
  // Graduation & Milestones
  { id: 'p05', src: '/images/gallery/moment_05.jpeg', title: 'Deen’s University Graduation', caption: 'Academic regalia, cap & gown milestone celebrating hard-earned success', category: 'MILESTONES', date: 'Summer 2024', featured: true },
  { id: 'p06', src: '/images/gallery/moment_06.jpeg', title: 'Treetop Adventure Golf', caption: 'Competitive fun & mini-golf laughs — "No Ordinary Summer"', category: 'DATES', date: 'Summer 2024' },
  { id: 'p07', src: '/images/gallery/moment_07.jpeg', title: 'Vintage Train Journey', caption: 'Kodak Portra vintage film aesthetic on our cross-country rail trip', category: 'TRAVELS', date: 'Summer 2024' },
  { id: 'p08', src: '/images/gallery/moment_08.jpeg', title: 'Cardiff Castle, Wales', caption: 'Castell Caerdydd bridge selfie exploring the historic fortress', category: 'TRAVELS', date: 'Summer 2024', featured: true },
  { id: 'p09', src: '/images/gallery/moment_09.jpeg', title: 'Coastal Pebble Beach Walk', caption: 'Gentle sea breeze, rocky shores, and ocean waves', category: 'TRAVELS', date: 'Summer 2024' },
  { id: 'p10', src: '/images/gallery/moment_10.jpeg', title: 'Christmas Rose Bouquet', caption: 'Lush red roses and celebratory blooms beside the holiday tree', category: 'MILESTONES', date: 'December 2024' },

  // Countryside, Go-Karting & Dining
  { id: 'p11', src: '/images/gallery/moment_11.jpeg', title: 'English Countryside Escape', caption: 'Charming stone cottage retreat and classic red telephone box', category: 'TRAVELS', date: 'Autumn 2024', featured: true },
  { id: 'p12', src: '/images/gallery/moment_12.jpeg', title: 'Monochrome Study Portrait', caption: 'Intimate black and white cozy portrait in our study', category: 'PORTRAITS', date: 'Autumn 2024' },
  { id: 'p13', src: '/images/gallery/moment_13.jpeg', title: 'Kitchen Date Night', caption: 'Cooking homemade dinners and laughing together over the stove', category: 'DATES', date: 'Autumn 2024' },
  { id: 'p14', src: '/images/gallery/moment_14.jpeg', title: 'Masterchefs in the Making', caption: 'Playful kitchen prep selfies before serving our favorite meal', category: 'DATES', date: 'Autumn 2024' },
  { id: 'p15', src: '/images/gallery/moment_15.jpeg', title: 'Full Throttle Go-Kart Racing', caption: 'Suiting up in racing jumpsuits & helmets at FTR Stourbridge track', category: 'DATES', date: 'Autumn 2024', featured: true },
  { id: 'p16', src: '/images/gallery/moment_16.jpeg', title: 'Evening Glamour Mirror Selfie', caption: 'Dressed to impress with 3D floral textures and sleek evening wear', category: 'PORTRAITS', date: 'Autumn 2024' },
  { id: 'p17', src: '/images/gallery/moment_17.jpeg', title: 'Sunny European Plaza', caption: 'Exploring lively city squares, red landmarks, and sunny cafes in sunglasses', category: 'TRAVELS', date: 'Autumn 2024' },
  { id: 'p18', src: '/images/gallery/moment_18.jpeg', title: 'Dusk Heart Silhouette', caption: 'Framing our love with heart hands against the golden dusk skyline', category: 'SUNSET', date: 'Sunset 2024' },

  // Albania Holiday & Lake District
  { id: 'p19', src: '/images/gallery/moment_19.jpeg', title: 'Berat Mountain Overlook, Albania', caption: 'Panoramic mountain overlook above the historic City of a Thousand Windows', category: 'TRAVELS', date: 'Albania 2024', featured: true },
  { id: 'p20', src: '/images/gallery/moment_20.jpeg', title: 'Ottoman Valley Views', caption: 'Matching neutral loungewear overlooking the historic white rooftops and river', category: 'TRAVELS', date: 'Albania 2024' },
  { id: 'p21', src: '/images/gallery/moment_21.jpeg', title: 'Albanian Mountain Vista', caption: 'Breathtaking high-altitude peaks and fresh Balkan mountain air', category: 'TRAVELS', date: 'Albania 2024' },
  { id: 'p22', src: '/images/gallery/moment_22.jpeg', title: 'Airport Departure Lounge', caption: 'Ready for takeoff — boarding gates and new stamps in our passports', category: 'TRAVELS', date: 'Travels 2024' },
  { id: 'p23', src: '/images/gallery/moment_23.jpeg', title: 'Green Truss River Bridge', caption: 'Scenic stroll across the historic green steel bridge over the river', category: 'TRAVELS', date: 'Travels 2024' },
  { id: 'p24', src: '/images/gallery/moment_24.jpeg', title: 'Golden Coast Piggyback Ride', caption: 'Pure sunset bliss and laughing rides on the coastal cliff path', category: 'SUNSET', date: 'Golden Hour 2024', featured: true },
  { id: 'p25', src: '/images/gallery/moment_25.jpeg', title: 'Lake Windermere Boat Hire', caption: 'Captaining our own motorboat across Lake Windermere in life jackets', category: 'TRAVELS', date: 'Lake District 2024', featured: true },
  { id: 'p26', src: '/images/gallery/moment_26.jpeg', title: 'Cruising in the English Mist', caption: 'Laughing through the light Lake District drizzle as Til takes the helm', category: 'TRAVELS', date: 'Lake District 2024' },
  { id: 'p27', src: '/images/gallery/moment_27.jpeg', title: 'Royal Emerald Banquet', caption: 'Til in a stunning emerald green kaftan & Deen in a tartan shawl', category: 'MILESTONES', date: 'Celebration 2024', featured: true },
  { id: 'p28', src: '/images/gallery/moment_28.jpeg', title: 'Lake District Waters', caption: 'Serene mountain reflections on the open water of Windermere', category: 'TRAVELS', date: 'Lake District 2024' },

  // Christmas Celebrations & Heritage
  { id: 'p29', src: '/images/gallery/moment_29.jpeg', title: 'Holiday Hearth & Crimson Gown', caption: 'Festive elegance by the glowing fireplace and sparkling holiday tree', category: 'MILESTONES', date: 'December 2024', featured: true },
  { id: 'p30', src: '/images/gallery/moment_30.jpeg', title: 'Christmas Morning Plaid Pajamas', caption: 'Matching red and black tartan pajamas cuddled beneath the Christmas tree', category: 'MILESTONES', date: '25 December 2024', featured: true },
  { id: 'p31', src: '/images/gallery/moment_31.jpeg', title: 'Holiday Movie Marathon', caption: 'Cozy floor cushions, warm blankets, and holiday cheer all morning', category: 'MILESTONES', date: 'December 2024' },
  { id: 'p32', src: '/images/gallery/moment_32.jpeg', title: 'Aso-Oke Heritage Harmony', caption: 'Intimate heritage portrait in traditional Nigerian woven textures', category: 'MILESTONES', date: 'Heritage 2024', featured: true },

  // Morocco Expedition & Fine Dining
  { id: 'p33', src: '/images/gallery/moment_33.jpeg', title: 'Welcome to Morocco · AFCON 2025', caption: 'Touching down in Morocco beside the giant Africa Cup of Nations trophy', category: 'TRAVELS', date: 'Morocco 2024', featured: true },
  { id: 'p34', src: '/images/gallery/moment_34.jpeg', title: 'Marrakech Riad Courtyard', caption: 'Relaxing on plush velvet cushions in a tranquil Moroccan riad', category: 'TRAVELS', date: 'Morocco 2024' },
  { id: 'p35', src: '/images/gallery/moment_35.jpeg', title: 'Marrakech Quad Biking Safari', caption: 'ATV desert trail expedition through the Palmeraie of Marrakech', category: 'TRAVELS', date: 'Morocco 2024', featured: true },
  { id: 'p36', src: '/images/gallery/moment_36.jpeg', title: 'Ben Youssef Palace Arches', caption: 'Marveling at intricate Islamic architecture and carved Moorish plasterwork', category: 'TRAVELS', date: 'Morocco 2024', featured: true },
  { id: 'p37', src: '/images/gallery/moment_37.jpeg', title: 'Crystal Chandelier Fine Dining', caption: 'Luxury date night dining beneath grand chandeliers and autumn leaves', category: 'DATES', date: 'Fine Dining 2024', featured: true },
  { id: 'p38', src: '/images/gallery/moment_38.jpeg', title: 'A Single Red Rose', caption: 'Til on the mirrored grand staircase in black off-shoulder gown & red rose', category: 'DATES', date: 'Fine Dining 2024', featured: true },

  // Wembley VIP, Safari & Emirates Stadium
  { id: 'p39', src: '/images/gallery/moment_39.jpeg', title: 'Wembley Stadium VIP Suite', caption: 'LiftWorks elevator access to The FA Royal Box & Inner Circle at Wembley', category: 'DATES', date: 'Wembley 2024', featured: true },
  { id: 'p40', src: '/images/gallery/moment_40.jpeg', title: 'BT Hospitality Lounge Date', caption: 'Matching crisp white outfits enjoying stadium hospitality and cocktails', category: 'DATES', date: 'Wembley 2024' },
  { id: 'p41', src: '/images/gallery/moment_41.jpeg', title: 'Matchday High Above Wembley', caption: 'Cheering from the iconic red stands overlooking the Wembley pitch', category: 'DATES', date: 'Wembley 2024' },
  { id: 'p42', src: '/images/gallery/moment_42.jpeg', title: 'West Midland Safari Park Mammoths', caption: 'Holding hands beneath giant prehistoric mammoth tusks', category: 'DATES', date: 'Safari Park 2024' },
  { id: 'p43', src: '/images/gallery/moment_43.jpeg', title: 'Prehistoric Safari Hugs', caption: 'Laughing and hugging among the Ice Age exhibit animatronics', category: 'DATES', date: 'Safari Park 2024' },
  { id: 'p44', src: '/images/gallery/moment_44.jpeg', title: 'Emirates Stadium Matchday', caption: 'Arsenal matchday loyalty — Til in the Away kit & Deen in the Home jersey', category: 'DATES', date: 'London 2024', featured: true },
  { id: 'p45', src: '/images/gallery/moment_45.jpeg', title: 'TILDEEN In The Sand', caption: 'Our names etched forever in the golden sand washed by gentle waves', category: 'SUNSET', date: 'Coastline 2024', featured: true },
  { id: 'p46', src: '/images/gallery/moment_46.jpeg', title: 'Mint Moto Leather & Plaid', caption: 'Playful elevator candid with Til’s chic mint green biker jacket', category: 'PORTRAITS', date: 'Autumn 2024' },

  // Stratford-upon-Avon & Garden Picnic
  { id: 'p47', src: '/images/gallery/moment_47.jpeg', title: 'Shakespeare’s Birthplace', caption: 'Stratford-upon-Avon history outside the iconic 16th-century timber-framed house', category: 'TRAVELS', date: 'Stratford 2024', featured: true },
  { id: 'p48', src: '/images/gallery/moment_48.jpeg', title: 'River Avon Canal Teddy Bears', caption: 'Holding British Union Jack souvenir teddy bears along the Stratford canal locks', category: 'TRAVELS', date: 'Stratford 2024' },
  { id: 'p49', src: '/images/gallery/moment_49.jpeg', title: 'Stratford Lock Promenade', caption: 'Sunny waterside walk along the River Avon basin with narrowboats', category: 'TRAVELS', date: 'Stratford 2024' },
  { id: 'p50', src: '/images/gallery/moment_50.jpeg', title: 'Weeping Willow Park Bench', caption: 'Cuddling under the willow trees on a summer park bench in Stratford', category: 'DATES', date: 'Stratford 2024' },
  { id: 'p51', src: '/images/gallery/moment_51.jpeg', title: 'Summer Meadow Garden Bench', caption: 'Rustic wooden bench embrace with Til in off-shoulder black & Deen in plum', category: 'PORTRAITS', date: 'Summer 2024', featured: true },
  { id: 'p52', src: '/images/gallery/moment_52.jpeg', title: 'Meadow Picnic & Instax Camera', caption: 'Capturing instant film memories surrounded by lush green hedgerows', category: 'PORTRAITS', date: 'Summer 2024' },
  { id: 'p53', src: '/images/gallery/moment_53.jpeg', title: 'Sweet Garden Bench Smiles', caption: 'Laughing together on the timber table before the sunset shoot', category: 'PORTRAITS', date: 'Summer 2024' },

  // Golden Meadow Photoshoot
  { id: 'p54', src: '/images/gallery/moment_54.jpeg', title: 'Golden Meadow Sun-Kissed Laughs', caption: 'Radiant summer meadow photoshoot surrounded by wild tall grasses', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p55', src: '/images/gallery/moment_55.jpeg', title: 'Meadow Sunset Stroll', caption: 'Walking hand-in-hand through the golden wildflower fields', category: 'SUNSET', date: 'Golden Meadow 2024' },
  { id: 'p56', src: '/images/gallery/moment_56.jpeg', title: 'Golden Hour Radiance', caption: 'Tender embrace under the soft warm amber light of dusk', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p57', src: '/images/gallery/moment_57.jpeg', title: 'Meadow Romance', caption: 'Til smiling warmly resting her head on Deen in the countryside breeze', category: 'SUNSET', date: 'Golden Meadow 2024' },
  { id: 'p58', src: '/images/gallery/moment_58.jpeg', title: 'Wildflower Forehead Kiss', caption: 'Gentle sunset kiss as the golden sun dips behind the treeline', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p59', src: '/images/gallery/moment_59.jpeg', title: 'Sunlit Grass Serenade', caption: 'Sitting side-by-side in the sun-drenched pastoral landscape', category: 'SUNSET', date: 'Golden Meadow 2024' },
  { id: 'p60', src: '/images/gallery/moment_60.jpeg', title: 'Sunset Countryside Horizon', caption: 'Looking out over the rolling green hills into our future together', category: 'SUNSET', date: 'Golden Meadow 2024' },
  { id: 'p61', src: '/images/gallery/moment_61.jpeg', title: 'Golden Hour Joy', caption: 'Candid smiles and joyful laughter in the evening warmth', category: 'SUNSET', date: 'Golden Meadow 2024' },
  { id: 'p62', src: '/images/gallery/moment_62.jpeg', title: 'Whispers in the Meadow', caption: 'Quiet, intimate moments nestled in the heart of nature', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
  { id: 'p63', src: '/images/gallery/moment_63.jpeg', title: 'Forever Til & Deen', caption: 'Sealing our story with love — counting down to December 18th, 2026', category: 'SUNSET', date: 'Golden Meadow 2024', featured: true },
];

const STORAGE_KEY_GALLERY = 'tildeen_custom_gallery';
const STORAGE_KEY_VERSION = 'tildeen_gallery_schema_version';
const CURRENT_VERSION = 'v2_authentic_labels_63';

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

