import React from 'react';
import { getGalleryPhotos, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, resetGalleryPhotos, type GalleryPhoto } from '../utils/galleryDb';
import { toast } from 'react-toastify';
import type { Palette } from './Sections';

interface HostGalleryManagerProps {
  palette: Palette;
}

export function HostGalleryManager({ palette }: HostGalleryManagerProps) {
  const { navy, ivory, gold, coral } = palette;
  const [photos, setPhotos] = React.useState<GalleryPhoto[]>(() => getGalleryPhotos());
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

  // Add Photo Modal
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newCaption, setNewCaption] = React.useState('');
  const [newSrc, setNewSrc] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<GalleryPhoto['category']>('DATES');
  const [newDate, setNewDate] = React.useState('');

  // Edit Photo Modal
  const [editingPhoto, setEditingPhoto] = React.useState<GalleryPhoto | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editCaption, setEditCaption] = React.useState('');
  const [editCategory, setEditCategory] = React.useState<GalleryPhoto['category']>('DATES');
  const [editDate, setEditDate] = React.useState('');

  const loadData = React.useCallback(() => {
    setPhotos(getGalleryPhotos());
  }, []);

  React.useEffect(() => {
    window.addEventListener('galleryDbUpdate', loadData);
    return () => window.removeEventListener('galleryDbUpdate', loadData);
  }, [loadData]);

  // Filtered photos
  const filteredPhotos = React.useMemo(() => {
    return photos.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.caption && p.caption.toLowerCase().includes(search.toLowerCase())) ||
        (p.date && p.date.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [photos, search, selectedCategory]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewSrc(base64);
    };
    reader.readAsDataURL(file);
  };

  // Add Photo Submit
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSrc.trim()) {
      toast.error('Please provide a photo title and image source.');
      return;
    }

    addGalleryPhoto({
      title: newTitle.trim(),
      caption: newCaption.trim() || undefined,
      src: newSrc.trim(),
      category: newCategory,
      date: newDate.trim() || undefined,
    });

    toast.success(`"${newTitle}" added to photo gallery.`);
    setShowAddModal(false);
    setNewTitle('');
    setNewCaption('');
    setNewSrc('');
    setNewDate('');
    loadData();
  };

  // Open Edit Modal
  const openEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title);
    setEditCaption(photo.caption || '');
    setEditCategory(photo.category);
    setEditDate(photo.date || '');
  };

  // Save Edit Photo
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editTitle.trim()) return;

    updateGalleryPhoto(editingPhoto.id, {
      title: editTitle.trim(),
      caption: editCaption.trim() || undefined,
      category: editCategory,
      date: editDate.trim() || undefined,
    });

    toast.success(`Photo "${editTitle}" updated.`);
    setEditingPhoto(null);
    loadData();
  };

  // Delete Photo
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from the gallery?`)) {
      deleteGalleryPhoto(id);
      toast.success(`Photo "${title}" removed.`);
      loadData();
    }
  };

  // Reset Photos
  const handleReset = () => {
    if (window.confirm('Reset gallery to the 63 original photos?')) {
      resetGalleryPhotos();
      toast.success('Gallery reset to default collections.');
      loadData();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Total Gallery Photos
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                {photos.length}
              </span>
              <span className="text-[11px] opacity-60">photos</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              First Dates &amp; Sea Life
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: '#2B4530' }}>
                {photos.filter(p => p.category === 'DATES').length}
              </span>
              <span className="text-[11px] opacity-60">photos</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Travels &amp; Sunsets
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: coral }}>
                {photos.filter(p => p.category === 'TRAVELS' || p.category === 'SUNSET').length}
              </span>
              <span className="text-[11px] opacity-60">photos</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl shadow-xs p-1 bg-white" style={{ border: `1.5px solid ${navy}` }}>
          <div className="p-3.5 rounded-lg flex flex-col justify-between h-full" style={{ border: `1px solid ${gold}80` }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: gold }}>
              Love Story Portraits
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: gold }}>
                {photos.filter(p => p.category === 'PORTRAITS').length}
              </span>
              <span className="text-[11px] opacity-60">photos</span>
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
            placeholder="Search photo titles or captions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-lg border outline-none bg-white"
            style={{ borderColor: `${navy}40`, color: navy }}
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border bg-white cursor-pointer"
            style={{ borderColor: `${navy}40`, color: navy }}
          >
            <option value="ALL">All Categories</option>
            <option value="DATES">First Dates &amp; Sea Life</option>
            <option value="MILESTONES">Graduation &amp; Milestones</option>
            <option value="TRAVELS">Travels &amp; Countryside</option>
            <option value="SUNSET">Sunset Walks</option>
            <option value="PORTRAITS">Portraits &amp; Love Story</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:underline cursor-pointer bg-transparent border-none"
          >
            Reset to 63 Original
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs"
            style={{ background: coral, color: navy, border: `1.2px solid ${navy}` }}
          >
            + Upload New Photo
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="rounded-xl border bg-white overflow-hidden shadow-xs flex flex-col justify-between hover-lift transition-all"
            style={{ borderColor: `${navy}30` }}
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img 
                src={photo.src} 
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span 
                className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[8.5px] font-extrabold uppercase bg-white/90 shadow-xs"
                style={{ color: navy }}
              >
                {photo.category}
              </span>
            </div>

            <div className="p-2 flex flex-col justify-between flex-1">
              <div>
                <h5 className="font-bold text-xs truncate" style={{ color: navy }}>
                  {photo.title}
                </h5>
                {photo.date && (
                  <span className="text-[10px] text-gold font-bold block" style={{ color: gold }}>
                    {photo.date}
                  </span>
                )}
                {photo.caption && (
                  <p className="text-[10.5px] opacity-60 line-clamp-1 mt-0.5">
                    {photo.caption}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={() => openEditModal(photo)}
                  className="text-[10.5px] text-blue-700 hover:underline font-bold cursor-pointer bg-transparent border-none"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id, photo.title)}
                  className="text-[10.5px] text-red-600 hover:underline cursor-pointer bg-transparent border-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Upload Photo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn bg-white"
            style={{ border: `1.5px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  Upload Gallery Photo
                </h4>
                <p className="text-[10.5px] opacity-60">Add a memorable photo to the live wedding gallery.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-lg font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset in Lagos"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Photo File or Image URL *
                </label>
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. /images/gallery/moment_01.jpeg)"
                    value={newSrc}
                    onChange={e => setNewSrc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border text-xs rounded-lg bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  >
                    <option value="DATES">First Dates</option>
                    <option value="MILESTONES">Milestones</option>
                    <option value="TRAVELS">Travels</option>
                    <option value="SUNSET">Sunset</option>
                    <option value="PORTRAITS">Portraits</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Date / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Autumn 2024"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Caption / Story (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe this special moment..."
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Photo */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn bg-white"
            style={{ border: `1.5px solid ${navy}` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: navy }}>
                  Edit Photo Details
                </h4>
                <p className="text-[10.5px] opacity-60">Update caption, category, or milestone date.</p>
              </div>
              <button 
                onClick={() => setEditingPhoto(null)}
                className="text-lg font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg cursor-pointer bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  >
                    <option value="DATES">First Dates</option>
                    <option value="MILESTONES">Milestones</option>
                    <option value="TRAVELS">Travels</option>
                    <option value="SUNSET">Sunset</option>
                    <option value="PORTRAITS">Portraits</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                    Date / Season
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                    style={{ border: `1.2px solid ${navy}`, color: navy }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] uppercase tracking-wider font-bold block" style={{ color: gold }}>
                  Caption / Story
                </label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="w-full px-2.5 py-1.5 border mt-0.5 text-xs rounded-lg bg-white"
                  style={{ border: `1.2px solid ${navy}`, color: navy }}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
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

    </div>
  );
}
