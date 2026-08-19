import React from 'react';
import { getGalleryPhotos, type GalleryPhoto } from '../utils/galleryDb';
import type { Palette } from './Sections';

interface GalleryProps {
  palette: Palette;
}

type ColorFilter = 'warm-gold' | 'film-35mm' | 'classic-bw' | 'natural';

const INITIAL_COUNT = 6;
const STEP_COUNT = 6;

export function Gallery({ palette }: GalleryProps) {
  const { navy, gold, coral, ivory, ivoryDeep } = palette;
  
  const [photos, setPhotos] = React.useState<GalleryPhoto[]>(() => getGalleryPhotos());
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [activeFilter, setActiveFilter] = React.useState<ColorFilter>('warm-gold');
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_COUNT);
  const [activePhotoIndex, setActivePhotoIndex] = React.useState<number | null>(null);

  const loadData = React.useCallback(() => {
    setPhotos(getGalleryPhotos());
  }, []);

  React.useEffect(() => {
    window.addEventListener('galleryDbUpdate', loadData);
    return () => window.removeEventListener('galleryDbUpdate', loadData);
  }, [loadData]);

  // Filtered photos
  const filteredPhotos = React.useMemo(() => {
    if (selectedCategory === 'ALL') return photos;
    return photos.filter(p => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  // Filter styling maps
  const getFilterStyle = (filter: ColorFilter): React.CSSProperties => {
    switch (filter) {
      case 'warm-gold':
        return { filter: 'sepia(0.16) contrast(1.05) brightness(1.02) saturate(1.08)' };
      case 'film-35mm':
        return { filter: 'contrast(1.03) brightness(1.03) saturate(0.92) sepia(0.08)' };
      case 'classic-bw':
        return { filter: 'grayscale(1) contrast(1.18) brightness(0.96)' };
      case 'natural':
      default:
        return { filter: 'none' };
    }
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <section 
      id="gallery" 
      style={{ 
        padding: '52px 20px 64px', 
        background: ivory, 
        color: navy, 
        fontFamily: "'DM Sans', sans-serif" 
      }}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div 
            style={{ 
              fontFamily: "'Manrope', sans-serif", 
              fontSize: 10, 
              fontWeight: 800, 
              color: gold, 
              letterSpacing: 2.5, 
              textTransform: 'uppercase' 
            }}
          >
            Cherished Memories
          </div>
          <h2 
            style={{ 
              fontFamily: "'DM Serif Display', serif", 
              fontSize: 34, 
              color: navy, 
              marginTop: 4,
              letterSpacing: -0.5
            }}
          >
            Photo Gallery
          </h2>
          <p 
            style={{ 
              fontFamily: "'Caveat', cursive", 
              fontSize: 20, 
              color: coral, 
              marginTop: 2 
            }}
          >
            A glimpse into our journey · From first dates to forever
          </p>
        </div>

        {/* Category Pills & Color Filter Control Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Categories */}
          <div 
            className="flex gap-1 p-1 rounded-full border bg-white/80 shadow-xs flex-wrap justify-center"
            style={{ borderColor: `${navy}30` }}
          >
            {[
              { id: 'ALL', label: `All Moments (${photos.length})` },
              { id: 'DATES', label: 'First Dates & Sea Life' },
              { id: 'MILESTONES', label: 'Graduation & Milestones' },
              { id: 'TRAVELS', label: 'Travels & Countryside' },
              { id: 'SUNSET', label: 'Sunset Walks' },
              { id: 'PORTRAITS', label: 'Love Story Portraits' },
            ].map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setVisibleCount(INITIAL_COUNT);
                  }}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? navy : 'transparent',
                    color: isSelected ? ivory : navy,
                    border: 'none',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Color Grade Preset Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60" style={{ color: navy }}>
              Look:
            </span>
            <div 
              className="inline-flex p-0.5 rounded-lg border bg-white"
              style={{ borderColor: `${navy}30` }}
            >
              {[
                { id: 'warm-gold', label: 'Warm Gold' },
                { id: 'film-35mm', label: '35mm Film' },
                { id: 'classic-bw', label: 'B&W Classic' },
                { id: 'natural', label: 'Natural' },
              ].map(f => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as ColorFilter)}
                    className="px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                    style={{
                      backgroundColor: isActive ? gold : 'transparent',
                      color: isActive ? navy : navy,
                      border: 'none',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {displayedPhotos.map((photo, index) => {
            const tilt = ((index % 5) - 2) * 1.2;
            return (
              <div
                key={photo.id}
                onClick={() => setActivePhotoIndex(index)}
                className="group cursor-pointer hover-lift relative transition-all duration-300"
                style={{
                  transform: `rotate(${tilt}deg)`,
                }}
              >
                <div 
                  className="rounded-2xl p-2.5 bg-white shadow-sm border transition-all duration-300 group-hover:shadow-xl group-hover:border-gold"
                  style={{ 
                    borderColor: `${navy}20`,
                    borderWidth: '1.5px'
                  }}
                >
                  {/* Photo frame */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-4/5">
                    <img 
                      src={photo.src} 
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={getFilterStyle(activeFilter)}
                    />
                    
                    {/* Category pill */}
                    <span 
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.85)', 
                        color: navy,
                        border: `1px solid ${navy}20` 
                      }}
                    >
                      {photo.category}
                    </span>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-navy/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                        style={{ backgroundColor: ivory, color: navy }}
                      >
                        View Fullscreen
                      </span>
                    </div>
                  </div>

                  {/* Caption & Date */}
                  <div className="pt-3 pb-1 px-1">
                    <div className="flex justify-between items-baseline">
                      <h4 
                        className="font-bold text-sm truncate" 
                        style={{ fontFamily: "'DM Serif Display', serif", color: navy }}
                      >
                        {photo.title}
                      </h4>
                      {photo.date && (
                        <span 
                          style={{ 
                            fontFamily: "'Caveat', cursive", 
                            fontSize: 14, 
                            color: gold, 
                            fontWeight: 700 
                          }}
                        >
                          {photo.date}
                        </span>
                      )}
                    </div>
                    {photo.caption && (
                      <p className="text-[11.5px] opacity-75 mt-0.5 line-clamp-2" style={{ color: navy }}>
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More / Show Less Controls */}
        {hasMore ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + STEP_COUNT)}
              className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover-lift shadow-sm cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: navy,
                color: ivory,
                border: `1.5px solid ${navy}`,
              }}
            >
              <span>View More Moments</span>
              <span style={{ opacity: 0.8, fontSize: 11 }}>
                (+{Math.min(STEP_COUNT, filteredPhotos.length - visibleCount)} of {filteredPhotos.length - visibleCount} left)
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <button
              onClick={() => setVisibleCount(filteredPhotos.length)}
              className="px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-black/5 cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                color: navy,
                border: `1.2px dashed ${navy}60`,
              }}
            >
              View All ({filteredPhotos.length})
            </button>
          </div>
        ) : filteredPhotos.length > INITIAL_COUNT ? (
          <div className="text-center mt-10">
            <button
              onClick={() => {
                setVisibleCount(INITIAL_COUNT);
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-black/5 cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                color: navy,
                border: `1px solid ${navy}40`,
              }}
            >
              Show Less ↑
            </button>
          </div>
        ) : null}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ position: 'fixed', zIndex: 999 }}
        >
          {/* Backdrop */}
          <div 
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 transition-opacity duration-300"
            style={{ 
              backgroundColor: 'rgba(22, 39, 79, 0.88)', 
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          {/* Modal Content */}
          <div 
            className="relative z-10 max-w-4xl w-full max-h-[94vh] flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
            style={{ border: `1.5px solid ${navy}` }}
          >
            {/* Image Container */}
            <div className="relative flex-1 bg-black/95 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
              <img 
                src={activePhoto.src} 
                alt={activePhoto.title}
                className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain"
                style={getFilterStyle(activeFilter)}
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition cursor-pointer bg-white/80 hover:bg-white text-navy border-none shadow-md"
                title="Previous Photo (Left Arrow)"
              >
                ←
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition cursor-pointer bg-white/80 hover:bg-white text-navy border-none shadow-md"
                title="Next Photo (Right Arrow)"
              >
                →
              </button>
            </div>

            {/* Side Details Panel */}
            <div 
              className="w-full md:w-80 p-6 flex flex-col justify-between"
              style={{ backgroundColor: ivoryDeep }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
                    style={{ background: `${gold}25`, color: navy, border: `1px solid ${navy}20` }}
                  >
                    {activePhoto.category}
                  </span>
                  
                  <button
                    onClick={() => setActivePhotoIndex(null)}
                    className="text-xl font-bold cursor-pointer text-gray-500 hover:text-black bg-transparent border-none"
                  >
                    ×
                  </button>
                </div>

                <h3 
                  className="text-xl font-bold" 
                  style={{ fontFamily: "'DM Serif Display', serif", color: navy }}
                >
                  {activePhoto.title}
                </h3>

                {activePhoto.date && (
                  <div 
                    className="mt-1 font-bold"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: gold }}
                  >
                    {activePhoto.date}
                  </div>
                )}

                {activePhoto.caption && (
                  <p className="text-xs opacity-80 mt-3 leading-relaxed" style={{ color: navy }}>
                    {activePhoto.caption}
                  </p>
                )}
              </div>

              {/* Navigation Counter & Controls */}
              <div className="pt-4 border-t border-gray-200 mt-6 flex justify-between items-center text-xs">
                <span className="text-[11px] font-semibold opacity-60">
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 1} of {filteredPhotos.length}
                </span>

                <a
                  href={activePhoto.src}
                  download
                  className="px-3 py-1 text-[11px] font-bold rounded-lg border text-center transition hover:bg-white cursor-pointer no-underline"
                  style={{ borderColor: `${navy}40`, color: navy }}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
