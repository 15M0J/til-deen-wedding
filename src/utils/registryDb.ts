export interface WishlistReservation {
  name: string;
  email?: string;
  isAnonymous?: boolean;
  date: string;
  note?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  category: 'HOME' | 'KITCHEN' | 'EXPERIENCE' | 'LIVING';
  note: string;
  price?: string;
  url?: string;
  imageUrl?: string;
  isUnlimited?: boolean;
  maxReservations: number;
  reservedBy: WishlistReservation[];
}

export interface CustomGiftPledge {
  id: string;
  guestName: string;
  email?: string;
  isAnonymous?: boolean;
  giftDescription: string;
  message?: string;
  date: string;
}

const STORAGE_KEY = 'tildeen_wishlist_reservations';
const CUSTOM_GIFTS_KEY = 'tildeen_custom_gifts';

export const DEFAULT_WISHLIST: WishlistItem[] = [
  // ── Kitchen & Home Essentials ──
  {
    id: 'w1',
    title: 'Barbary & Oak Cast Iron Round Fry Pan (26cm)',
    category: 'KITCHEN',
    note: 'Heavy-duty cast iron pan for delicious homemade dishes and family skillet dinners',
    price: '£25.00',
    url: 'https://www.dunelm.com/product/barbary-and-oak-cast-iron-round-fry-pan-26cm-1000282691',
    imageUrl: 'https://images.dunelm.com/31042628.jpg',
    maxReservations: 1,
    reservedBy: [],
  },
  {
    id: 'w2',
    title: 'Umbrella Stand Rack with Removable Drip Tray',
    category: 'HOME',
    note: 'Clean white modern entryway umbrella organizer with removable water drip tray',
    price: '£16.99',
    url: 'https://www.amazon.co.uk/Umbrella-Removable-plastic-Umbrellas-Organizer/dp/B0BWJJRHHY/',
    imageUrl: 'https://m.media-amazon.com/images/I/316FyVqnM-L.jpg',
    maxReservations: 1,
    reservedBy: [],
  },
  {
    id: 'w3',
    title: 'Amazon Echo Dot 5 Smart Speaker (Black)',
    category: 'LIVING',
    note: 'Compact smart speaker with Alexa for whole-home music, podcasts, and routines',
    price: '£54.99',
    url: 'https://www.argos.co.uk/product/7698697',
    imageUrl: 'https://media.4rgos.it/i/Argos/7698697_R_Z001A',
    maxReservations: 1,
    reservedBy: [],
  },
  {
    id: 'w4',
    title: 'Indoor Botanical House Plant',
    category: 'LIVING',
    note: 'Potted indoor greenery to bring vibrant botanical life and calm to the couple’s home',
    price: '£35.00',
    url: 'https://www.patchplants.com/gb/en/plants/indoor/',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    maxReservations: 1,
    reservedBy: [],
  },

  // ── Gift Cards (Unlimited Pledges & Custom Value) ──
  {
    id: 'w5',
    title: 'HomeSense Shopping Gift Card',
    category: 'HOME',
    note: 'Voucher for unique home furnishings, kitchen accessories, and curated décor treasures',
    price: 'Any Amount / Custom',
    url: 'https://www.tkmaxx.com/uk/en/gift-cards',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },
  {
    id: 'w6',
    title: 'Marks & Spencer (M&S) Gift Card',
    category: 'LIVING',
    note: 'Voucher for M&S luxury food hall dining, home essentials, and pantry treats',
    price: 'Any Amount / Custom',
    url: 'https://www.marksandspencer.com/l/gifts/gift-cards-and-egift-cards',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },
  {
    id: 'w7',
    title: 'Selfridges & Co. Gift Card',
    category: 'LIVING',
    note: 'Luxury department store voucher for home items, scents, and memorable celebration pieces',
    price: 'Any Amount / Custom',
    url: 'https://www.selfridges.com/GB/en/features/info/gift-cards/',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },

  // ── Honeymoon & Couple Experiences ──
  {
    id: 'w8',
    title: 'Couple’s Honeymoon Sunset Cruise & Beachfront Dinner',
    category: 'EXPERIENCE',
    note: 'A private romantic sunset cruise with fresh coastal dinner under the stars on their honeymoon',
    price: 'Open Contribution',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },
  {
    id: 'w9',
    title: 'Couple’s Luxury Day Spa & Thermal Bath Retreat',
    category: 'EXPERIENCE',
    note: 'A full day of restorative relaxation, couples massages, and soothing thermal suites',
    price: 'Open Contribution',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },
  {
    id: 'w10',
    title: 'First Anniversary Weekend Celebration Fund',
    category: 'EXPERIENCE',
    note: 'Helping the couple plan and celebrate their first wedding anniversary getaway',
    price: 'Open Contribution',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    isUnlimited: true,
    maxReservations: 9999,
    reservedBy: [],
  },
];

/**
 * Retrieve current wishlist from storage or default
 */
export function getWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WISHLIST;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.error('Failed to load wishlist from storage', e);
  }
  return DEFAULT_WISHLIST;
}

/**
 * Save wishlist items to storage
 */
export function saveWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('registry_updated', { detail: items }));
  } catch (e) {
    console.error('Failed to save wishlist to storage', e);
  }
}

/**
 * Reserve a gift under a guest's name / email
 */
export function reserveWishlistItem(
  itemId: string,
  guestName: string,
  email?: string,
  isAnonymous?: boolean,
  note?: string
): { success: boolean; message: string; updatedItem?: WishlistItem } {
  const list = getWishlist();
  const index = list.findIndex((i) => i.id === itemId);

  if (index === -1) {
    return { success: false, message: 'Item not found in registry.' };
  }

  const item = list[index];
  if (!item.isUnlimited && item.reservedBy.length >= item.maxReservations) {
    return { success: false, message: 'This item has already reached its reservation limit.' };
  }

  const displayName = guestName.trim() || (isAnonymous ? 'A Well-Wisher' : 'Guest');

  const newReservation: WishlistReservation = {
    name: displayName,
    email: email?.trim(),
    isAnonymous: !!isAnonymous,
    date: new Date().toISOString(),
    note: note?.trim(),
  };

  const updatedItem: WishlistItem = {
    ...item,
    reservedBy: [...item.reservedBy, newReservation],
  };

  list[index] = updatedItem;
  saveWishlist(list);

  return {
    success: true,
    message: `Thank you, ${displayName}! Your reservation for "${item.title}" is confirmed.`,
    updatedItem,
  };
}

/**
 * Cancel or remove a reservation by guest name
 */
export function cancelWishlistReservation(itemId: string, guestName: string): boolean {
  const list = getWishlist();
  const index = list.findIndex((i) => i.id === itemId);
  if (index === -1) return false;

  const item = list[index];
  const updatedReservations = item.reservedBy.filter(
    (r) => r.name.toLowerCase() !== guestName.trim().toLowerCase()
  );

  if (updatedReservations.length === item.reservedBy.length) return false;

  list[index] = { ...item, reservedBy: updatedReservations };
  saveWishlist(list);
  return true;
}

/**
 * Add a new item to the registry (host action)
 */
export function addWishlistItem(
  item: Omit<WishlistItem, 'id' | 'reservedBy'>
): WishlistItem {
  const list = getWishlist();
  const newItem: WishlistItem = {
    ...item,
    id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    reservedBy: [],
  };
  list.push(newItem);
  saveWishlist(list);
  return newItem;
}

/**
 * Remove an item from the registry (host action)
 */
export function removeWishlistItem(itemId: string): void {
  const list = getWishlist().filter((i) => i.id !== itemId);
  saveWishlist(list);
}

/**
 * Reset wishlist back to original default
 */
export function resetWishlist(): void {
  saveWishlist(DEFAULT_WISHLIST);
}

// ─────────────────────────────────────────────────────────────
// CUSTOM / OFF-LIST GIFTS (For guests bringing a special unlisted item)
// ─────────────────────────────────────────────────────────────
export function getCustomGifts(): CustomGiftPledge[] {
  try {
    const raw = localStorage.getItem(CUSTOM_GIFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.error('Failed to load custom gifts', e);
  }
  return [];
}

export function saveCustomGifts(gifts: CustomGiftPledge[]): void {
  try {
    localStorage.setItem(CUSTOM_GIFTS_KEY, JSON.stringify(gifts));
    window.dispatchEvent(new CustomEvent('custom_gifts_updated', { detail: gifts }));
  } catch (e) {
    console.error('Failed to save custom gifts', e);
  }
}

export function addCustomGiftPledge(
  guestName: string,
  giftDescription: string,
  email?: string,
  isAnonymous?: boolean,
  message?: string
): CustomGiftPledge {
  const list = getCustomGifts();
  const displayName = guestName.trim() || (isAnonymous ? 'A Well-Wisher' : 'Guest');

  const newGift: CustomGiftPledge = {
    id: `cg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    guestName: displayName,
    email: email?.trim(),
    isAnonymous: !!isAnonymous,
    giftDescription: giftDescription.trim(),
    message: message?.trim(),
    date: new Date().toISOString(),
  };
  list.push(newGift);
  saveCustomGifts(list);
  return newGift;
}

export function deleteCustomGiftPledge(id: string): void {
  const list = getCustomGifts().filter((g) => g.id !== id);
  saveCustomGifts(list);
}
