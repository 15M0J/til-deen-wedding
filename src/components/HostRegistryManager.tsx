import React from 'react';
import { toast } from 'react-toastify';
import type { Palette } from './Sections';
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  cancelWishlistReservation,
  resetWishlist,
  type WishlistItem,
  getCustomGifts,
  deleteCustomGiftPledge,
  type CustomGiftPledge,
} from '../utils/registryDb';

interface HostRegistryManagerProps {
  palette: Palette;
}

export function HostRegistryManager({ palette }: HostRegistryManagerProps) {
  const { navy, ivory, gold, coral } = palette;
  const [items, setItems] = React.useState<WishlistItem[]>(() => getWishlist());
  const [customGifts, setCustomGifts] = React.useState<CustomGiftPledge[]>(() => getCustomGifts());
  const [search, setSearch] = React.useState('');
  const [activeView, setActiveView] = React.useState<'all' | 'claimed' | 'available' | 'custom'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('ALL');

  // Add Item Modal State
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<'HOME' | 'KITCHEN' | 'EXPERIENCE' | 'LIVING'>('HOME');
  const [newNote, setNewNote] = React.useState('');
  const [newPrice, setNewPrice] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');
  const [newMaxReservations, setNewMaxReservations] = React.useState(1);

  const loadData = React.useCallback(() => {
    setItems(getWishlist());
    setCustomGifts(getCustomGifts());
  }, []);

  React.useEffect(() => {
    window.addEventListener('registry_updated', loadData);
    window.addEventListener('custom_gifts_updated', loadData);
    return () => {
      window.removeEventListener('registry_updated', loadData);
      window.removeEventListener('custom_gifts_updated', loadData);
    };
  }, [loadData]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please provide an item title.');
      return;
    }

    addWishlistItem({
      title: newTitle.trim(),
      category: newCategory,
      note: newNote.trim(),
      price: newPrice.trim() || undefined,
      url: newUrl.trim() || undefined,
      maxReservations: Number(newMaxReservations) || 1,
    });

    toast.success(`Gift item "${newTitle.trim()}" added to registry.`);
    setShowAddModal(false);
    setNewTitle('');
    setNewNote('');
    setNewPrice('');
    setNewUrl('');
    setNewMaxReservations(1);
    loadData();
  };

  const handleDeleteItem = (itemId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the registry?`)) {
      removeWishlistItem(itemId);
      toast.info(`"${title}" removed from registry.`);
      loadData();
    }
  };

  const handleCancelReservation = (itemId: string, guestName: string) => {
    if (window.confirm(`Cancel reservation for ${guestName}?`)) {
      cancelWishlistReservation(itemId, guestName);
      toast.info(`Reservation for ${guestName} canceled.`);
      loadData();
    }
  };

  const handleDeleteCustomGift = (id: string, name: string) => {
    if (window.confirm(`Remove custom gift pledge by ${name}?`)) {
      deleteCustomGiftPledge(id);
      toast.info(`Custom gift pledge removed.`);
      loadData();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset registry wishlist to default items? All current claims will be reset.')) {
      resetWishlist();
      toast.success('Registry reset to default items.');
      loadData();
    }
  };

  const handleCopyEmail = (email: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      toast.success(`Copied "${email}" to clipboard.`);
    }
  };

  const handleExportSummary = () => {
    const claims = items
      .filter((i) => i.reservedBy.length > 0)
      .flatMap((i) =>
        i.reservedBy.map((r) => ({
          gift: i.title,
          category: i.category,
          price: i.price || 'N/A',
          guestName: r.name,
          guestEmail: r.email || 'None provided',
          isAnonymous: r.isAnonymous ? 'Yes' : 'No',
          date: new Date(r.date).toLocaleString(),
        }))
      );

    const customPledges = customGifts.map((cg) => ({
      gift: `[Custom] ${cg.giftDescription}`,
      category: 'CUSTOM',
      price: 'Custom / Off-List',
      guestName: cg.guestName,
      guestEmail: cg.email || 'None provided',
      isAnonymous: cg.isAnonymous ? 'Yes' : 'No',
      date: new Date(cg.date).toLocaleString(),
    }));

    const all = [...claims, ...customPledges];

    if (all.length === 0) {
      toast.info('No gift reservations or pledges yet to export.');
      return;
    }

    const headers = ['Gift Title', 'Category', 'Price', 'Guest Name', 'Guest Email', 'Anonymous on Card', 'Date Claimed'];
    const rows = all.map((r) => [
      `"${r.gift.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.price}"`,
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.guestEmail.replace(/"/g, '""')}"`,
      `"${r.isAnonymous}"`,
      `"${r.date}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nneka_Opeyemi_Wedding_Gift_Claims_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Gift claims exported to CSV.');
  };

  const totalItems = items.length;
  const totalReservations = items.reduce((acc, item) => acc + item.reservedBy.length, 0);
  const fullyClaimedCount = items.filter((item) => !item.isUnlimited && item.reservedBy.length >= item.maxReservations).length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.note.toLowerCase().includes(search.toLowerCase()) ||
      item.reservedBy.some((r) => r.name.toLowerCase().includes(search.toLowerCase()) || (r.email && r.email.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    if (activeView === 'claimed') {
      return matchesSearch && matchesCategory && item.reservedBy.length > 0;
    }
    if (activeView === 'available') {
      return matchesSearch && matchesCategory && (item.isUnlimited || item.reservedBy.length < item.maxReservations);
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          className="rounded-2xl p-1 shadow-sm hover-lift transition-all"
          style={{ background: '#fff', border: `1.8px solid ${navy}` }}
        >
          <div className="p-4 rounded-xl flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: gold }}>
              Total Registry Items
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                {totalItems}
              </span>
              <span className="text-xs opacity-60">listed</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="rounded-2xl p-1 shadow-sm hover-lift transition-all"
          style={{ background: '#fff', border: `1.8px solid ${navy}` }}
        >
          <div className="p-4 rounded-xl flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: gold }}>
              Reservations &amp; Claims
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: '#2B4530' }}>
                {totalReservations}
              </span>
              <span className="text-xs opacity-60">pledged</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="rounded-2xl p-1 shadow-sm hover-lift transition-all"
          style={{ background: '#fff', border: `1.8px solid ${navy}` }}
        >
          <div className="p-4 rounded-xl flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: gold }}>
              Fully Reserved
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: coral }}>
                {fullyClaimedCount}
              </span>
              <span className="text-xs opacity-60">items</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="rounded-2xl p-1 shadow-sm hover-lift transition-all"
          style={{ background: '#fff', border: `1.8px solid ${navy}` }}
        >
          <div className="p-4 rounded-xl flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: gold }}>
              Off-List Gifts
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                {customGifts.length}
              </span>
              <span className="text-xs opacity-60">surprises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar & Filters */}
      <div
        className="rounded-2xl p-5 border flex flex-col gap-4 shadow-sm"
        style={{ background: '#fff', borderColor: navy }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {/* View Filter Switcher */}
          <div className="flex flex-wrap gap-1 p-1 bg-gray-100/80 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveView('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'all' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-gray-200'
              }`}
              style={{ backgroundColor: activeView === 'all' ? navy : undefined }}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setActiveView('claimed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'claimed' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-gray-200'
              }`}
              style={{ backgroundColor: activeView === 'claimed' ? navy : undefined }}
            >
              Claimed Only ({items.filter((i) => i.reservedBy.length > 0).length})
            </button>
            <button
              onClick={() => setActiveView('available')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'available' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-gray-200'
              }`}
              style={{ backgroundColor: activeView === 'available' ? navy : undefined }}
            >
              Available Only
            </button>
            <button
              onClick={() => setActiveView('custom')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'custom' ? 'bg-navy text-white shadow-xs' : 'text-navy hover:bg-gray-200'
              }`}
              style={{ backgroundColor: activeView === 'custom' ? navy : undefined }}
            >
              Off-List Pledges ({customGifts.length})
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={handleExportSummary}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 text-navy"
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer text-gray-700"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer shadow-sm hover-lift flex items-center gap-1.5"
              style={{ background: coral, color: navy, border: `1.5px solid ${navy}` }}
            >
              Add Gift
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        {activeView !== 'custom' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-100">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by gift title, store, or reserving guest name / email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border outline-none bg-gray-50/50 focus:bg-white"
                style={{ borderColor: `${navy}30`, color: navy }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer bg-gray-50/50"
              style={{ borderColor: `${navy}30`, color: navy }}
            >
              <option value="ALL">All Categories</option>
              <option value="HOME">Home</option>
              <option value="KITCHEN">Kitchen</option>
              <option value="EXPERIENCE">Experience</option>
              <option value="LIVING">Living</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB CONTENT: OFF-LIST / CUSTOM GIFTS */}
      {activeView === 'custom' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
              Off-List &amp; Surprise Gift Pledges ({customGifts.length})
            </h3>
            <span className="text-xs opacity-60">Submitted via custom registry tab</span>
          </div>

          {customGifts.length === 0 ? (
            <div className="p-10 rounded-2xl border text-center opacity-60 italic bg-white" style={{ borderColor: `${navy}30`, color: navy }}>
              No custom gift pledges have been submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customGifts.map((cg) => (
                <div
                  key={cg.id}
                  className="rounded-2xl p-5 border shadow-sm flex flex-col justify-between hover-lift transition-all"
                  style={{ background: '#fff', borderColor: navy }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border" style={{ background: coral, color: navy, borderColor: navy }}>
                        Custom Gift
                      </span>
                      <span className="text-xs opacity-60" style={{ color: navy }}>
                        {new Date(cg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                      {cg.giftDescription}
                    </h4>

                    <div className="text-xs mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Guest:</strong> {cg.guestName}{' '}
                          {cg.isAnonymous && <span className="text-amber-700 italic font-semibold text-[11px]">(Anonymous on card)</span>}
                        </div>
                        {cg.email && (
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(cg.email!)}
                            className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1 border-none bg-transparent"
                          >
                            Copy Email
                          </button>
                        )}
                      </div>
                      {cg.email && <div className="opacity-75 text-[11px]">Email: {cg.email}</div>}
                    </div>

                    {cg.message && (
                      <p className="text-xs italic opacity-85 mt-2.5 p-2 rounded-lg bg-amber-50/60 border border-amber-100" style={{ color: navy }}>
                        "{cg.message}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomGift(cg.id, cg.guestName)}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Delete Pledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB CONTENT: WISHLIST ITEMS */
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
              {activeView === 'claimed' ? 'Claimed Gifts' : activeView === 'available' ? 'Available Gifts' : 'Wishlist Items'} ({filteredItems.length})
            </h3>
            <span className="text-xs opacity-60">Showing {filteredItems.length} of {items.length} items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isUnlimited = !!item.isUnlimited;
              const isFullyClaimed = !isUnlimited && item.reservedBy.length >= item.maxReservations;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 border shadow-sm flex flex-col justify-between hover-lift transition-all"
                  style={{ background: '#fff', borderColor: navy }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border"
                          style={{
                            background: item.category === 'EXPERIENCE' ? coral : item.category === 'KITCHEN' ? '#E8C5A0' : gold,
                            color: navy,
                            borderColor: navy,
                          }}
                        >
                          {item.category}
                        </span>
                        {item.price && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded border" style={{ color: navy, borderColor: `${navy}30` }}>
                            {item.price}
                          </span>
                        )}
                      </div>

                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{
                          background: item.reservedBy.length > 0 ? (isFullyClaimed ? '#fee2e2' : '#dcfce7') : '#f3f4f6',
                          color: item.reservedBy.length > 0 ? (isFullyClaimed ? '#991b1b' : '#166534') : `${navy}80`,
                        }}
                      >
                        {isFullyClaimed
                          ? 'Fully Claimed'
                          : isUnlimited
                          ? `${item.reservedBy.length} Pledged`
                          : `${item.reservedBy.length} / ${item.maxReservations} Claimed`}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start mt-2">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-lg border flex-shrink-0"
                          style={{ borderColor: `${navy}30` }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold leading-snug" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                          {item.title}
                        </h4>
                        <p className="text-xs opacity-75 mt-1 line-clamp-2" style={{ color: navy }}>
                          {item.note}
                        </p>
                      </div>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold hover:underline mt-2"
                        style={{ color: navy }}
                      >
                        Retailer Store Page →
                      </a>
                    )}
                  </div>

                  {/* Reserved by Guest List */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: `${navy}15` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider opacity-65" style={{ color: navy }}>
                        Guest Reservations ({item.reservedBy.length}):
                      </span>
                    </div>

                    {item.reservedBy.length === 0 ? (
                      <span className="text-xs italic opacity-40 block py-1">No reservations yet.</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {item.reservedBy.map((res, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs px-3 py-2 rounded-xl border border-gray-100"
                            style={{ background: `${navy}06` }}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <strong>{res.name}</strong>
                                {res.isAnonymous && (
                                  <span className="px-1.5 py-0.2 rounded text-[9.5px] bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                                    Anonymous
                                  </span>
                                )}
                              </div>
                              {res.email && (
                                <div className="opacity-70 text-[11px] mt-0.5 flex items-center gap-1">
                                  Email: {res.email}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyEmail(res.email!)}
                                    className="text-[10px] text-blue-700 hover:underline cursor-pointer ml-1 font-bold bg-transparent border-none"
                                  >
                                    (Copy)
                                  </button>
                                </div>
                              )}
                              <div className="opacity-45 text-[10px]">
                                {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCancelReservation(item.id, res.name)}
                              className="text-red-600 hover:underline text-xs cursor-pointer font-bold flex-shrink-0 bg-transparent border-none"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Delete Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Add New Gift Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            className="rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn"
            style={{ background: ivory, border: `2px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md" style={{ background: gold, color: navy }}>
                  ADD GIFT ITEM
                </span>
                <h3 className="text-xl font-bold mt-2" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  New Registry Item
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xl font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddItem} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Espresso Coffee Maker"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white"
                  style={{ borderColor: `${navy}40`, color: navy }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white cursor-pointer"
                    style={{ borderColor: `${navy}40`, color: navy }}
                  >
                    <option value="HOME">Home</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="EXPERIENCE">Experience</option>
                    <option value="LIVING">Living</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                    Price / Badge (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. £50.00 or Any Amount"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white"
                    style={{ borderColor: `${navy}40`, color: navy }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                  Description / Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for guests..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white"
                  style={{ borderColor: `${navy}40`, color: navy }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                  Store URL / Where to Buy (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white"
                  style={{ borderColor: `${navy}40`, color: navy }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: navy }}>
                  Max Reservations Allowed
                </label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={newMaxReservations}
                  onChange={(e) => setNewMaxReservations(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none bg-white"
                  style={{ borderColor: `${navy}40`, color: navy }}
                />
                <span className="text-[11px] opacity-60 mt-0.5 block">
                  Use 1 for single gifts, or 9999 for experiences/funds.
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer bg-transparent"
                  style={{ borderColor: navy, color: navy }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-extrabold rounded-lg cursor-pointer shadow-sm"
                  style={{ background: coral, color: navy, border: `1.5px solid ${navy}` }}
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
