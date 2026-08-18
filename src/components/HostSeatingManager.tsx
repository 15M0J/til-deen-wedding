import React from 'react';
import { getGuests, updateGuest, type Guest } from '../utils/guestDb';
import { getStoredTables, saveStoredTables, updateTableCapacity, type TableDefinition } from '../utils/tableDb';
import { toast } from 'react-toastify';
import type { Palette } from './Sections';

interface HostSeatingManagerProps {
  palette: Palette;
}

export function HostSeatingManager({ palette }: HostSeatingManagerProps) {
  const { navy, gold, coral } = palette;
  const [guests, setGuests] = React.useState<Guest[]>(() => getGuests());
  const [tables, setTables] = React.useState<TableDefinition[]>(() => getStoredTables());
  const [search, setSearch] = React.useState('');

  // Add Table Modal
  const [showAddTableModal, setShowAddTableModal] = React.useState(false);
  const [newTableName, setNewTableName] = React.useState('');
  const [newTableCapacity, setNewTableCapacity] = React.useState(10);
  const [newTableCategory, setNewTableCategory] = React.useState('FRIEND');

  // Edit Table Modal
  const [editingTable, setEditingTable] = React.useState<TableDefinition | null>(null);
  const [editTableName, setEditTableName] = React.useState('');
  const [editTableCapacity, setEditTableCapacity] = React.useState(10);
  const [editTableCategory, setEditTableCategory] = React.useState('FRIEND');

  // Quick Assign Modal
  const [assigningGuest, setAssigningGuest] = React.useState<Guest | null>(null);

  const loadData = React.useCallback(() => {
    setGuests(getGuests());
    setTables(getStoredTables());
  }, []);

  React.useEffect(() => {
    window.addEventListener('guestDbUpdate', loadData);
    window.addEventListener('tableDbUpdate', loadData);
    return () => {
      window.removeEventListener('guestDbUpdate', loadData);
      window.removeEventListener('tableDbUpdate', loadData);
    };
  }, [loadData]);

  // Handle Assigning guest to a table
  const handleAssignTable = (guestId: string, tableName: string) => {
    try {
      updateGuest(guestId, { tableNumber: tableName.trim() || undefined });
      toast.success('Guest seating updated.');
      setAssigningGuest(null);
      loadData();
    } catch {
      toast.error('Failed to update seating.');
    }
  };

  // Inline table capacity change (+ / -)
  const handleInlineCapacityChange = (tableId: string, delta: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    const newCap = Math.max(1, table.capacity + delta);
    updateTableCapacity(tableId, newCap);
    toast.info(`${table.name} capacity set to ${newCap} seats.`);
  };

  // Direct table capacity number input
  const handleDirectCapacityChange = (tableId: string, val: number) => {
    if (isNaN(val) || val < 1) return;
    updateTableCapacity(tableId, val);
  };

  // Handle Add New Table
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) {
      toast.error('Please provide a table name or number.');
      return;
    }

    const newTable: TableDefinition = {
      id: `t_${Date.now()}`,
      name: newTableName.trim(),
      capacity: Number(newTableCapacity) || 10,
      category: newTableCategory,
    };

    const updated = [...tables, newTable];
    saveStoredTables(updated);
    toast.success(`"${newTableName.trim()}" created with ${newTableCapacity} seats.`);
    setShowAddTableModal(false);
    setNewTableName('');
    setNewTableCapacity(10);
  };

  // Handle Save Edit Table
  const handleSaveEditTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable || !editTableName.trim()) return;

    const oldName = editingTable.name;
    const newName = editTableName.trim();

    const updated = tables.map(t => {
      if (t.id === editingTable.id) {
        return {
          ...t,
          name: newName,
          capacity: Number(editTableCapacity) || 10,
          category: editTableCategory,
        };
      }
      return t;
    });

    saveStoredTables(updated);

    // If table name changed, update guests assigned to this table
    if (oldName !== newName) {
      guests.forEach(g => {
        if (g.tableNumber === oldName) {
          updateGuest(g.id, { tableNumber: newName });
        }
      });
    }

    toast.success(`"${newName}" updated.`);
    setEditingTable(null);
    loadData();
  };

  // Open Edit Table Modal
  const openEditTableModal = (table: TableDefinition) => {
    setEditingTable(table);
    setEditTableName(table.name);
    setEditTableCapacity(table.capacity);
    setEditTableCategory(table.category || 'FRIEND');
  };

  // Handle Remove Table
  const handleDeleteTable = (tableId: string, tableName: string) => {
    if (window.confirm(`Delete "${tableName}"? Guests assigned to this table will become unassigned.`)) {
      const updated = tables.filter(t => t.id !== tableId);
      saveStoredTables(updated);

      // Unassign guests
      guests.forEach(g => {
        if (g.tableNumber === tableName) {
          updateGuest(g.id, { tableNumber: undefined });
        }
      });

      toast.info(`"${tableName}" removed.`);
      loadData();
    }
  };

  // Export Seating Chart to CSV for ushers & venue coordinators
  const handleExportSeatingCsv = () => {
    try {
      const headers = ['Table Name', 'Table Capacity', 'Guest Name', 'Seats Occupied', 'RSVP Status', 'Category', 'Phone', 'Email'];
      const rows: string[][] = [];

      tables.forEach(t => {
        const tableGuests = guests.filter(g => g.tableNumber === t.name);
        if (tableGuests.length === 0) {
          rows.push([`"${t.name}"`, `"${t.capacity}"`, '"[Empty Table]"', '"0"', '""', `"${t.category || ''}"`, '""', '""']);
        } else {
          tableGuests.forEach(g => {
            const seats = g.status === 'ATTENDING' ? (g.attendingCount || 1) : g.maxGuests;
            rows.push([
              `"${t.name}"`,
              `"${t.capacity}"`,
              `"${g.name}"`,
              `"${seats}"`,
              `"${g.status}"`,
              `"${g.tag || 'FRIEND'}"`,
              `"${g.phone || ''}"`,
              `"${g.email || ''}"`
            ]);
          });
        }
      });

      // Unassigned guests
      const unassigned = guests.filter(g => !g.tableNumber && g.status === 'ATTENDING');
      if (unassigned.length > 0) {
        unassigned.forEach(g => {
          rows.push([
            '"[Unassigned / Open Seating]"',
            '"N/A"',
            `"${g.name}"`,
            `"${g.attendingCount || 1}"`,
            `"${g.status}"`,
            `"${g.tag || 'FRIEND'}"`,
            `"${g.phone || ''}"`,
            `"${g.email || ''}"`
          ]);
        });
      }

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Nneka_Opeyemi_Wedding_Seating_Chart_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Seating chart exported to CSV.');
    } catch {
      toast.error('Failed to export seating chart.');
    }
  };

  // Seating calculations
  const attendingGuests = guests.filter(g => g.status === 'ATTENDING');
  const seatedGuests = guests.filter(g => g.tableNumber && g.tableNumber.trim().length > 0);
  const unassignedAttending = attendingGuests.filter(g => !g.tableNumber || g.tableNumber.trim().length === 0);

  const totalSeatsOccupied = seatedGuests.reduce((sum, g) => sum + (g.status === 'ATTENDING' ? g.attendingCount : 1), 0);
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Configured Tables
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                {tables.length}
              </span>
              <span className="text-[11px] opacity-60">tables</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Total Hall Capacity
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: '#2B4530' }}>
                {totalCapacity}
              </span>
              <span className="text-[11px] opacity-60">total seats</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Seated Guests
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: '#2B4530' }}>
                {totalSeatsOccupied}
              </span>
              <span className="text-[11px] opacity-60">of {totalCapacity} seats</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Unassigned Attending
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: coral }}>
                {unassignedAttending.length}
              </span>
              <span className="text-[11px] opacity-60">need seats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div 
        className="rounded-2xl p-4 border flex flex-col sm:flex-row justify-between items-center gap-3 bg-white shadow-xs"
        style={{ borderColor: navy }}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search guest or table name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-lg border outline-none bg-white"
            style={{ borderColor: `${navy}40`, color: navy }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={handleExportSeatingCsv}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer text-navy"
          >
            Export Seating CSV
          </button>

          <button
            type="button"
            onClick={() => setShowAddTableModal(true)}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs"
            style={{ background: coral, color: navy, border: `1.2px solid ${navy}` }}
          >
            + Add New Table &amp; Capacity
          </button>
        </div>
      </div>

      {/* Main Grid: Tables & Unassigned Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left: Table Cards Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
              Reception Tables ({tables.length})
            </h3>
            <span className="text-[11px] opacity-60">Set table capacity and assign seated guests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tables.map(table => {
              const tableGuests = guests.filter(g => 
                g.tableNumber === table.name &&
                (search ? g.name.toLowerCase().includes(search.toLowerCase()) || table.name.toLowerCase().includes(search.toLowerCase()) : true)
              );

              const seatsUsed = tableGuests.reduce((sum, g) => sum + (g.status === 'ATTENDING' ? g.attendingCount : 1), 0);
              const isFull = seatsUsed >= table.capacity;
              const percent = Math.min(100, Math.round((seatsUsed / table.capacity) * 100));

              return (
                <div
                  key={table.id}
                  className="rounded-2xl p-4 border bg-white shadow-xs flex flex-col justify-between hover-lift transition-all"
                  style={{ borderColor: navy }}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded border" style={{ background: `${gold}15`, color: navy, borderColor: `${navy}30` }}>
                          {table.category || 'TABLE'}
                        </span>
                        <h4 className="text-sm font-bold mt-1" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                          {table.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditTableModal(table)}
                          className="text-[10.5px] text-blue-700 hover:underline cursor-pointer bg-transparent border-none font-bold"
                          title="Edit Table Name & Capacity"
                        >
                          Edit
                        </button>
                        <span className="opacity-30">|</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTable(table.id, table.name)}
                          className="text-[10.5px] text-red-600 hover:underline cursor-pointer bg-transparent border-none opacity-60 hover:opacity-100"
                          title="Delete Table"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Table Capacity Inline Controls */}
                    <div className="my-2.5 p-2 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10.5px] font-bold text-navy uppercase tracking-wider">
                          Table Capacity:
                        </span>
                        
                        {/* Inline Stepper / Input */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleInlineCapacityChange(table.id, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer"
                            title="Decrease seats"
                          >
                            -
                          </button>
                          
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={table.capacity}
                            onChange={(e) => handleDirectCapacityChange(table.id, parseInt(e.target.value, 10))}
                            className="w-10 text-center text-xs font-bold py-0.5 border border-gray-300 rounded bg-white"
                            title="Directly enter table capacity"
                          />
                          
                          <span className="text-[10px] text-gray-500 font-medium">seats</span>

                          <button
                            type="button"
                            onClick={() => handleInlineCapacityChange(table.id, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer"
                            title="Increase seats"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex justify-between text-[10px] font-semibold mb-1" style={{ color: navy }}>
                        <span>Occupancy</span>
                        <span style={{ color: isFull ? coral : '#2B4530' }}>
                          {seatsUsed} / {table.capacity} filled {isFull ? '(Full)' : `(${table.capacity - seatsUsed} free)`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percent}%`, 
                            backgroundColor: isFull ? coral : '#2B4530' 
                          }}
                        />
                      </div>
                    </div>

                    {/* Guest list at table */}
                    <div className="mt-2 pt-2 border-t flex flex-col gap-1.5" style={{ borderColor: `${navy}15` }}>
                      {tableGuests.length === 0 ? (
                        <span className="text-[11px] italic opacity-40 py-1 block">No guests assigned yet.</span>
                      ) : (
                        tableGuests.map(g => (
                          <div 
                            key={g.id} 
                            className="flex justify-between items-center text-xs py-1 px-2 rounded-lg bg-gray-50 border border-gray-100"
                          >
                            <div className="min-w-0 pr-1">
                              <div className="font-bold text-xs truncate" style={{ color: navy }}>
                                {g.name}
                              </div>
                              <div className="text-[10px] opacity-60">
                                {g.status === 'ATTENDING' ? `${g.attendingCount} attending` : `${g.maxGuests} seats reserved`}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAssignTable(g.id, '')}
                              className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer bg-transparent border-none flex-shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Guest directly to this table button */}
                  {!isFull && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (unassignedAttending.length === 0) {
                            toast.info('All attending guests have already been assigned tables.');
                            return;
                          }
                          setAssigningGuest(unassignedAttending[0]);
                        }}
                        className="w-full py-1 text-[10.5px] font-bold rounded-lg border text-center transition hover:bg-gray-50 cursor-pointer"
                        style={{ borderColor: `${navy}40`, color: navy }}
                      >
                        + Assign Guest ({table.capacity - seatsUsed} seats left)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unassigned Guests Panel */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
              Unassigned Guests ({unassignedAttending.length})
            </h3>
          </div>

          <div 
            className="rounded-2xl p-4 border bg-white shadow-xs flex flex-col gap-2.5 max-h-[600px] overflow-y-auto"
            style={{ borderColor: navy }}
          >
            <p className="text-[11px] opacity-65">
              Guests who have confirmed attendance but do not have a table assigned yet.
            </p>

            {unassignedAttending.length === 0 ? (
              <div className="p-6 text-center italic text-xs opacity-60 bg-gray-50 rounded-xl border border-gray-100">
                All confirmed guests are assigned to tables.
              </div>
            ) : (
              unassignedAttending.map(g => (
                <div 
                  key={g.id}
                  className="p-2.5 rounded-xl border border-gray-100 flex flex-col gap-2 bg-gray-50/70"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs" style={{ color: navy }}>
                        {g.name}
                      </div>
                      <div className="text-[10px] opacity-60 mt-0.5">
                        {g.attendingCount} attending seats · {g.tag || 'FRIEND'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignTable(g.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                      className="w-full px-2 py-1 text-[10.5px] rounded-lg border bg-white cursor-pointer"
                      style={{ borderColor: `${navy}40`, color: navy }}
                    >
                      <option value="" disabled>Select Table to Seat...</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.name}>
                          {t.name} (cap: {t.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Add Table & Capacity */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn bg-white"
            style={{ border: `1.5px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  Add Reception Table &amp; Set Capacity
                </h4>
                <p className="text-[10.5px] opacity-60">Specify the table name and how many seats are at this table.</p>
              </div>
              <button 
                onClick={() => setShowAddTableModal(false)}
                className="text-lg font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddTable} className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Table Name or Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 7 - Millennium Park"
                  value={newTableName}
                  onChange={e => setNewTableName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Table Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={newTableCapacity}
                    onChange={e => setNewTableCapacity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white font-bold"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                  <span className="text-[9px] text-gray-500">e.g. 8, 10, 12 seats</span>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Category / Group
                  </label>
                  <select
                    value={newTableCategory}
                    onChange={e => setNewTableCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  >
                    <option value="VIP">VIP</option>
                    <option value="FAMILY">Family</option>
                    <option value="BRIDAL_PARTY">Bridal Party</option>
                    <option value="GROOMSMEN">Groomsmen</option>
                    <option value="FRIEND">Friends</option>
                    <option value="COLLEAGUE">Colleagues</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="flex-1 py-1.5 text-xs uppercase font-bold border rounded-lg hover:bg-gray-50 cursor-pointer bg-transparent"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs uppercase font-bold rounded-lg cursor-pointer shadow-xs"
                  style={{ background: coral, color: navy, border: `1.2px solid ${navy}` }}
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Table & Capacity */}
      {editingTable && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn bg-white"
            style={{ border: `1.5px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  Edit Table &amp; Capacity
                </h4>
                <p className="text-[10.5px] opacity-60">Update table name, category, or total seat capacity.</p>
              </div>
              <button 
                onClick={() => setEditingTable(null)}
                className="text-lg font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEditTable} className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Table Name *
                </label>
                <input
                  type="text"
                  required
                  value={editTableName}
                  onChange={e => setEditTableName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Table Capacity (Seats) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={editTableCapacity}
                    onChange={e => setEditTableCapacity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white font-bold"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Category
                  </label>
                  <select
                    value={editTableCategory}
                    onChange={e => setEditTableCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  >
                    <option value="VIP">VIP</option>
                    <option value="FAMILY">Family</option>
                    <option value="BRIDAL_PARTY">Bridal Party</option>
                    <option value="GROOMSMEN">Groomsmen</option>
                    <option value="FRIEND">Friends</option>
                    <option value="COLLEAGUE">Colleagues</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="flex-1 py-1.5 text-xs uppercase font-bold border rounded-lg hover:bg-gray-50 cursor-pointer bg-transparent"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs uppercase font-bold rounded-lg cursor-pointer shadow-xs"
                  style={{ background: coral, color: navy, border: `1.2px solid ${navy}` }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Assign Guest */}
      {assigningGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn bg-white"
            style={{ border: `1.5px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  Assign Table: {assigningGuest.name}
                </h4>
                <p className="text-[10.5px] opacity-60">
                  {assigningGuest.attendingCount || 1} attending seats
                </p>
              </div>
              <button 
                onClick={() => setAssigningGuest(null)}
                className="text-lg font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-2 my-3">
              {tables.map(t => {
                const seatedCount = guests
                  .filter(g => g.tableNumber === t.name)
                  .reduce((sum, g) => sum + (g.status === 'ATTENDING' ? g.attendingCount : 1), 0);
                const isFull = seatedCount >= t.capacity;

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => handleAssignTable(assigningGuest.id, t.name)}
                    className="p-2.5 rounded-xl border text-left flex justify-between items-center transition cursor-pointer hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderColor: `${navy}30` }}
                  >
                    <div>
                      <div className="text-xs font-bold" style={{ color: navy }}>
                        {t.name}
                      </div>
                      <div className="text-[10px] opacity-60">
                        {t.category || 'General'}
                      </div>
                    </div>
                    <span className="text-[10.5px] font-semibold" style={{ color: isFull ? coral : '#2B4530' }}>
                      {seatedCount} / {t.capacity}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setAssigningGuest(null)}
              className="w-full py-1.5 text-xs font-bold border rounded-lg cursor-pointer bg-transparent"
              style={{ border: `1.2px solid ${navy}`, color: navy }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
