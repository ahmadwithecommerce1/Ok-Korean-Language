import { useState, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Play,
  ExternalLink,
  X,
  Maximize2,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  subscribeToGallery,
  SAMPLE_GALLERY_ITEMS,
  seedSampleGalleryItems,
  type GalleryItem,
  type GalleryCategory,
} from '../utils/firebaseRtdb';

type FilterTab = 'All' | 'Results' | 'Photos' | 'Videos';

const FILTER_TABS: { id: FilterTab; label: string; icon: any }[] = [
  { id: 'All', label: 'All Media', icon: Layers },
  { id: 'Results', label: 'Results & Pass Lists', icon: FileText },
  { id: 'Photos', label: 'Photos', icon: ImageIcon },
  { id: 'Videos', label: 'Videos', icon: VideoIcon },
];

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
    : null;
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time synchronization from Firebase RTDB node /website_gallery
    const unsubscribe = subscribeToGallery((data) => {
      if (data.length > 0) {
        setItems(data);
      } else {
        // Fallback to sample items if Firebase is empty initially
        setItems(
          SAMPLE_GALLERY_ITEMS.map((item, idx) => ({
            ...item,
            id: `sample-${idx}`,
          }))
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter items based on activeTab
  const filteredItems = items.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category.toLowerCase() === activeTab.toLowerCase();
  });

  // Close lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  const handleSeedSamplesIfEmpty = async () => {
    try {
      await seedSampleGalleryItems();
    } catch (err) {
      console.error('Failed to seed gallery:', err);
    }
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden">
      {/* Background radial gradient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D2F865]/[0.03] blur-[160px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#1A1A1A]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#242424] text-xs font-semibold text-[#D2F865] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase text-[11px]">Official Media &amp; Results</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Center <span className="text-[#D2F865]">Gallery</span> &amp; Achievements
            </h2>
            <p className="text-sm sm:text-base text-[#8E8E93] max-w-xl mt-3 leading-relaxed">
              Explore real classroom sessions, visa celebrations, student testimonials, and official
              EPS-TOPIK examination results directly from the OK Korean Language Center archives.
            </p>
          </div>

          {/* Media Count Pill & Live Sync Indicator */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs text-[#A0A0A0]">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              <span>Live Firebase Sync ({filteredItems.length} items)</span>
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 py-8 overflow-x-auto no-scrollbar">
          <div className="text-xs text-[#666666] uppercase font-mono tracking-wider mr-2 hidden sm:flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === 'All'
                ? items.length
                : items.filter((i) => i.category.toLowerCase() === tab.id.toLowerCase()).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#D2F865] text-[#0A0A0A] shadow-[0_0_20px_rgba(210,248,101,0.35)] scale-[1.02]'
                    : 'bg-[#141414] hover:bg-[#1C1C1C] text-[#8E8E93] hover:text-white border border-[#262626]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A0A0A]' : 'text-[#8E8E93]'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/15 text-black' : 'bg-[#222222] text-[#A0A0A0]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-[#111214] border border-[#22242a] p-4 h-80 animate-pulse flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-[#1e2026] rounded-2xl" />
                <div className="space-y-2 mt-4">
                  <div className="w-3/4 h-4 bg-[#1e2026] rounded" />
                  <div className="w-1/2 h-3 bg-[#1e2026] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty Filter State */
          <div className="text-center py-20 px-4 rounded-3xl bg-[#101114]/80 border border-[#222] backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mx-auto text-[#666666] mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No media in this category yet</h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] max-w-md mx-auto mb-6">
              New items uploaded via the OEC Admin Console will immediately sync here in real time.
            </p>
            <button
              onClick={handleSeedSamplesIfEmpty}
              className="px-5 py-2.5 rounded-full bg-[#181818] hover:bg-[#222] text-xs font-semibold text-[#D2F865] border border-[#333] transition-colors cursor-pointer"
            >
              Load Sample Gallery Media
            </button>
          </div>
        ) : (
          /* Media Responsive Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const isPdf = item.fileType === 'pdf' || item.category === 'Results';
              const isVideo = item.fileType === 'video' || item.category === 'Videos';
              const isImage = !isPdf && !isVideo;

              return (
                <div
                  key={item.id}
                  className="group relative rounded-3xl bg-[#101114]/80 backdrop-blur-md border border-[#22252c] hover:border-[#D2F865]/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(210,248,101,0.12)] hover:-translate-y-1"
                >
                  {/* Media Visual Area */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0A0A0A]">
                    {isPdf ? (
                      /* PDF / Results Thumbnail representation */
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#121316] to-[#0A0A0A]">
                        {item.thumbnailUrl ? (
                          <>
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                          </>
                        ) : null}
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-[#D2F865]/10 border border-[#D2F865]/30 flex items-center justify-center text-[#D2F865] shadow-[0_0_20px_rgba(210,248,101,0.2)] mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-7 h-7" />
                          </div>
                          <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                            OFFICIAL RESULT DOCUMENT
                          </span>
                          <span className="text-[11px] text-[#8E8E93] mt-1">Verified PDF Gazette</span>
                        </div>
                      </div>
                    ) : isVideo ? (
                      /* Video Thumbnail representation */
                      <div
                        onClick={() => setSelectedItem(item)}
                        className="relative w-full h-full cursor-pointer"
                      >
                        <img
                          src={
                            item.thumbnailUrl ||
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-[#D2F865] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_25px_rgba(210,248,101,0.6)] group-hover:scale-115 transition-transform duration-300">
                            <Play className="w-6 h-6 ml-1 fill-[#0A0A0A]" />
                          </div>
                        </div>

                        {/* Video pill tag */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
                          <VideoIcon className="w-3 h-3 text-[#D2F865]" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : (
                      /* Photo Thumbnail representation */
                      <div
                        onClick={() => setSelectedItem(item)}
                        className="relative w-full h-full cursor-pointer"
                      >
                        <img
                          src={item.mediaUrl || item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                          <span className="p-2 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                          item.category === 'Results'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : item.category === 'Videos'
                            ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                            : 'bg-[#D2F865]/15 border-[#D2F865]/40 text-[#D2F865]'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {item.date && (
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#A0A0A0] flex items-center gap-1 z-10">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{item.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D2F865] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8E8E93] mt-2 line-clamp-2 leading-relaxed">
                        {item.description || 'Official media publication from OK Korean Language Center.'}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-[#1C1F26] flex items-center justify-between gap-3">
                      {isPdf ? (
                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D2F865] hover:bg-[#c2e855] text-black font-semibold text-xs transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(210,248,101,0.25)]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Result (PDF)</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : isVideo ? (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1F26] hover:bg-[#252830] text-white hover:text-[#D2F865] border border-[#2E323D] font-semibold text-xs transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-[#D2F865]" />
                          <span>Watch Video</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1F26] hover:bg-[#252830] text-white hover:text-[#D2F865] border border-[#2E323D] font-semibold text-xs transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#D2F865]" />
                          <span>View Full Photo</span>
                          <Maximize2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox / Video Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-[#111216] border border-[#262832] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#22242e] bg-[#0C0D10]/90">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    selectedItem.category === 'Results'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : selectedItem.category === 'Videos'
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      : 'bg-[#D2F865]/20 border-[#D2F865]/40 text-[#D2F865]'
                  }`}
                >
                  {selectedItem.category}
                </span>
                <span className="text-xs text-[#8E8E93] font-mono">{selectedItem.date}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedItem.mediaUrl && (
                  <a
                    href={selectedItem.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#181A20] hover:bg-[#252832] text-[#A0A0A0] hover:text-white border border-[#2E323E] transition-colors"
                    title="Open original link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full bg-[#181A20] hover:bg-[#252832] text-[#A0A0A0] hover:text-white border border-[#2E323E] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Display Area */}
            <div className="relative bg-black flex items-center justify-center overflow-hidden flex-1 min-h-[300px] max-h-[65vh]">
              {selectedItem.fileType === 'video' || selectedItem.category === 'Videos' ? (
                (() => {
                  const ytUrl = getYoutubeEmbedUrl(selectedItem.mediaUrl);
                  if (ytUrl) {
                    return (
                      <iframe
                        src={ytUrl}
                        title={selectedItem.title}
                        className="w-full h-full aspect-video min-h-[360px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      src={selectedItem.mediaUrl}
                      controls
                      autoPlay
                      className="w-full max-h-[65vh] object-contain"
                    />
                  );
                })()
              ) : selectedItem.fileType === 'pdf' || selectedItem.category === 'Results' ? (
                <div className="py-16 px-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#D2F865]/10 border border-[#D2F865]/30 flex items-center justify-center text-[#D2F865] mb-5 shadow-[0_0_30px_rgba(210,248,101,0.25)]">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{selectedItem.title}</h4>
                  <p className="text-sm text-[#8E8E93] max-w-md mb-6">{selectedItem.description}</p>
                  <a
                    href={selectedItem.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D2F865] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(210,248,101,0.4)] hover:scale-105 transition-all"
                  >
                    <span>Open Official PDF Document</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <img
                  src={selectedItem.mediaUrl || selectedItem.thumbnailUrl}
                  alt={selectedItem.title}
                  className="w-full max-h-[65vh] object-contain select-none"
                />
              )}
            </div>

            {/* Modal Caption Footer */}
            <div className="p-5 sm:p-6 bg-[#0E0F12] border-t border-[#1C1F26]">
              <h3 className="text-base sm:text-lg font-bold text-white">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-xs sm:text-sm text-[#8E8E93] mt-1.5 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
