export interface Guest {
  id: string;
  name: string;
  code: string;
  maxGuests: number;
  status: 'PENDING' | 'ATTENDING' | 'DECLINED';
  attendingCount: number;
  eventsAttending: 'both' | 'ceremony' | 'reception' | 'none';
  phone?: string;
  email?: string;
  tableNumber?: string;
  dietaryRestrictions?: string;
  guestNames?: string[];
  tag?: 'VIP' | 'FAMILY' | 'BRIDAL_PARTY' | 'GROOMSMEN' | 'FRIEND' | 'COLLEAGUE';
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = 'tildeen_guest_list';

export const SEED_GUESTS: Guest[] = [
  {
    id: '1',
    name: 'Adaeze Obi',
    code: 'adaeze',
    maxGuests: 2,
    status: 'ATTENDING',
    attendingCount: 2,
    eventsAttending: 'both',
    phone: '+234 803 123 4567',
    email: 'adaeze@example.com',
    tableNumber: 'Table 1 - Guzape Gold',
    tag: 'BRIDAL_PARTY',
    updatedAt: new Date('2026-06-20T10:30:00Z').toISOString(),
  },
  {
    id: '2',
    name: 'Kola Ademola',
    code: 'kola',
    maxGuests: 1,
    status: 'DECLINED',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'FRIEND',
    updatedAt: new Date('2026-06-21T14:15:00Z').toISOString(),
  },
  {
    id: '3',
    name: 'Amina Bello',
    code: 'amina',
    maxGuests: 3,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'FAMILY',
    updatedAt: new Date('2026-06-19T08:00:00Z').toISOString(),
  },
  {
    id: '4',
    name: 'Obinna Okechukwu',
    code: 'obinna',
    maxGuests: 2,
    status: 'ATTENDING',
    attendingCount: 1,
    eventsAttending: 'ceremony',
    tableNumber: 'Table 3 - Zuma Rock',
    tag: 'GROOMSMEN',
    updatedAt: new Date('2026-06-22T09:45:00Z').toISOString(),
  },
  {
    id: '5',
    name: 'Tunde Bakare',
    code: 'tunde',
    maxGuests: 2,
    status: 'ATTENDING',
    attendingCount: 2,
    eventsAttending: 'reception',
    tableNumber: 'Table 2 - Aso Rock',
    tag: 'VIP',
    updatedAt: new Date('2026-06-22T18:20:00Z').toISOString(),
  },
  {
    id: '6',
    name: 'Chioma Nwosu',
    code: 'chioma',
    maxGuests: 4,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'FAMILY',
    updatedAt: new Date('2026-06-18T11:12:00Z').toISOString(),
  },
  {
    id: '7',
    name: 'Femi Otedola',
    code: 'femi',
    maxGuests: 2,
    status: 'DECLINED',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'VIP',
    updatedAt: new Date('2026-06-20T16:05:00Z').toISOString(),
  },
  {
    id: '8',
    name: 'Halima Ibrahim',
    code: 'halima',
    maxGuests: 1,
    status: 'ATTENDING',
    attendingCount: 1,
    eventsAttending: 'both',
    tableNumber: 'Table 1 - Guzape Gold',
    tag: 'BRIDAL_PARTY',
    updatedAt: new Date('2026-06-23T11:40:00Z').toISOString(),
  },
  {
    id: '9',
    name: 'Yusuf Musa',
    code: 'yusuf',
    maxGuests: 2,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'FRIEND',
    updatedAt: new Date('2026-06-19T13:22:00Z').toISOString(),
  },
  {
    id: '10',
    name: 'Nnamdi Kanu',
    code: 'nnamdi',
    maxGuests: 2,
    status: 'ATTENDING',
    attendingCount: 2,
    eventsAttending: 'both',
    tableNumber: 'Table 4 - Millenium Park',
    tag: 'FAMILY',
    updatedAt: new Date('2026-06-22T15:55:00Z').toISOString(),
  },
  {
    id: '11',
    name: 'Yetunde Alabi',
    code: 'yetunde',
    maxGuests: 1,
    status: 'ATTENDING',
    attendingCount: 1,
    eventsAttending: 'reception',
    tableNumber: 'Table 5 - Maitama View',
    tag: 'COLLEAGUE',
    updatedAt: new Date('2026-06-23T08:10:00Z').toISOString(),
  },
  {
    id: '12',
    name: 'Emeka Anyaoku',
    code: 'emeka',
    maxGuests: 2,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'VIP',
    updatedAt: new Date('2026-06-20T09:00:00Z').toISOString(),
  },
  {
    id: '13',
    name: 'Fatimah Abubakar',
    code: 'fatimah',
    maxGuests: 3,
    status: 'ATTENDING',
    attendingCount: 3,
    eventsAttending: 'both',
    tableNumber: 'Table 2 - Aso Rock',
    tag: 'FAMILY',
    updatedAt: new Date('2026-06-23T14:30:00Z').toISOString(),
  },
  {
    id: '14',
    name: 'Chinedu Ikedieze',
    code: 'chinedu',
    maxGuests: 2,
    status: 'DECLINED',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'FRIEND',
    updatedAt: new Date('2026-06-21T17:50:00Z').toISOString(),
  },
  {
    id: '15',
    name: 'Bisi Adeleye-Fayemi',
    code: 'bisi',
    maxGuests: 2,
    status: 'PENDING',
    attendingCount: 0,
    eventsAttending: 'none',
    tag: 'VIP',
    updatedAt: new Date('2026-06-22T10:15:00Z').toISOString(),
  }
];

export function getGuests(): Guest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_GUESTS));
      return SEED_GUESTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse guests from localStorage', e);
    return SEED_GUESTS;
  }
}

export function saveGuests(guests: Guest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    // Dispatch storage event manually for same-window updates
    window.dispatchEvent(new Event('guestDbUpdate'));
  } catch (e) {
    console.error('Failed to save guests to localStorage', e);
  }
}

export function addGuest(
  name: string,
  code: string,
  maxGuests: number = 2,
  options?: Partial<Omit<Guest, 'id' | 'name' | 'code' | 'maxGuests' | 'updatedAt'>>
): Guest {
  const guests = getGuests();
  const cleanedCode = code.trim().toLowerCase().replace(/\s+/g, '-');
  
  // Check if code already exists
  const exists = guests.some(g => g.code === cleanedCode);
  if (exists) {
    throw new Error(`Invitation code "${cleanedCode}" is already in use.`);
  }

  const newGuest: Guest = {
    id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim(),
    code: cleanedCode,
    maxGuests: Number(maxGuests) || 1,
    status: options?.status || 'PENDING',
    attendingCount: options?.attendingCount || 0,
    eventsAttending: options?.eventsAttending || 'none',
    phone: options?.phone?.trim(),
    email: options?.email?.trim(),
    tableNumber: options?.tableNumber?.trim(),
    dietaryRestrictions: options?.dietaryRestrictions?.trim(),
    tag: options?.tag,
    notes: options?.notes?.trim(),
    updatedAt: new Date().toISOString()
  };

  guests.push(newGuest);
  saveGuests(guests);
  return newGuest;
}

export function updateGuest(id: string, updates: Partial<Guest>): Guest {
  const guests = getGuests();
  const idx = guests.findIndex(g => g.id === id);
  if (idx === -1) {
    throw new Error('Guest not found');
  }

  const updatedGuest = {
    ...guests[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // If code is updated, clean it
  if (updates.code) {
    const cleanedCode = updates.code.trim().toLowerCase().replace(/\s+/g, '-');
    const duplicate = guests.some(g => g.code === cleanedCode && g.id !== id);
    if (duplicate) {
      throw new Error(`Invitation code "${cleanedCode}" is already in use.`);
    }
    updatedGuest.code = cleanedCode;
  }

  guests[idx] = updatedGuest;
  saveGuests(guests);
  return updatedGuest;
}

export function deleteGuest(id: string): void {
  const guests = getGuests();
  const filtered = guests.filter(g => g.id !== id);
  saveGuests(filtered);
}

export function resetGuests(): Guest[] {
  saveGuests(SEED_GUESTS);
  return SEED_GUESTS;
}

export function clearAllGuests(): void {
  saveGuests([]);
}

export function findGuestByCode(code: string): Guest | undefined {
  const guests = getGuests();
  const cleaned = code.trim().toLowerCase();
  return guests.find(g => g.code.toLowerCase() === cleaned);
}

/**
 * Batch import guests from CSV text
 * Format supported: Name, Code, MaxGuests, Tag, TableNumber, Phone, Email
 */
export function importGuestsFromCsv(csvText: string): { imported: number; skipped: number; errors: string[] } {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return { imported: 0, skipped: 0, errors: ['CSV content is empty'] };

  const currentGuests = getGuests();
  const existingCodes = new Set(currentGuests.map(g => g.code.toLowerCase()));
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Check if first line is header
  const firstLine = lines[0].toLowerCase();
  const startIndex = firstLine.includes('name') || firstLine.includes('code') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (row.length < 1 || !row[0]) continue;

    const name = row[0];
    let code = (row[1] || name).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const maxGuests = parseInt(row[2], 10) || 2;
    const tag = (row[3] as Guest['tag']) || 'FRIEND';
    const tableNumber = row[4] || undefined;
    const phone = row[5] || undefined;
    const email = row[6] || undefined;

    // Handle code collision by appending a number
    let finalCode = code;
    let counter = 1;
    while (existingCodes.has(finalCode)) {
      finalCode = `${code}-${counter}`;
      counter++;
    }

    const newGuest: Guest = {
      id: `g_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      code: finalCode,
      maxGuests,
      status: 'PENDING',
      attendingCount: 0,
      eventsAttending: 'none',
      tag: ['VIP', 'FAMILY', 'BRIDAL_PARTY', 'GROOMSMEN', 'FRIEND', 'COLLEAGUE'].includes(tag) ? tag : 'FRIEND',
      tableNumber,
      phone,
      email,
      updatedAt: new Date().toISOString()
    };

    currentGuests.push(newGuest);
    existingCodes.add(finalCode);
    imported++;
  }

  saveGuests(currentGuests);
  return { imported, skipped, errors };
}
