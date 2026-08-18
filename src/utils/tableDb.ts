export interface TableDefinition {
  id: string;
  name: string;
  capacity: number;
  category?: string;
}

export const DEFAULT_TABLES: TableDefinition[] = [
  { id: 't1', name: 'Table 1 - High Table / VIP', capacity: 10, category: 'VIP' },
  { id: 't2', name: 'Table 2 - Aso Rock', capacity: 10, category: 'FAMILY' },
  { id: 't3', name: 'Table 3 - Zuma Rock', capacity: 10, category: 'GROOMSMEN' },
  { id: 't4', name: 'Table 4 - Guzape Gold', capacity: 10, category: 'BRIDAL_PARTY' },
  { id: 't5', name: 'Table 5 - Friends & Alumni', capacity: 10, category: 'FRIEND' },
  { id: 't6', name: 'Table 6 - Colleagues & Well-Wishers', capacity: 10, category: 'COLLEAGUE' },
];

export const STORAGE_KEY_TABLES = 'tildeen_tables_config';

export function getStoredTables(): TableDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TABLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_TABLES;
}

export function saveStoredTables(tables: TableDefinition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(tables));
    window.dispatchEvent(new Event('tableDbUpdate'));
  } catch {
    // ignore
  }
}

export function updateTableCapacity(tableId: string, newCapacity: number): void {
  const tables = getStoredTables();
  const updated = tables.map(t => t.id === tableId ? { ...t, capacity: Math.max(1, newCapacity) } : t);
  saveStoredTables(updated);
}
