import React, { useState } from "react";
import { FileText, Video, Table, Eye, Download, Users, Trash2, Calendar, FileCheck, Search, Database, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EvidenceItem } from "../types";
import SocialShare from "./SocialShare";

const isYouTubeUrl = (url: string) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string) => {
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split(/[?#]/)[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split(/[?#]/)[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) {
    return url;
  }
};

interface EvidenceSectionProps {
  key?: string;
  evidence: EvidenceItem[];
  isAdmin: boolean;
  onDeleteEvidence: (id: string) => Promise<void>;
  accentColor: string;
}

export default function EvidenceSection({ evidence, isAdmin, onDeleteEvidence, accentColor }: EvidenceSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'video' | 'spreadsheet'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingPdf, setViewingPdf] = useState<EvidenceItem | null>(null);
  const [viewingVideo, setViewingVideo] = useState<EvidenceItem | null>(null);

  // Filter items
  const filteredItems = evidence.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.fileName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-6 h-6 text-[#d4af37]" />;
      case 'spreadsheet':
        return <Table className="w-6 h-6 text-[#d4af37]" />;
      default:
        return <FileText className="w-6 h-6 text-[#d4af37]" />;
    }
  };

  const handleOpenDoc = (item: EvidenceItem) => {
    if (item.type === 'video') {
      setViewingVideo(item);
    } else {
      setViewingPdf(item);
    }
  };

  return (
    <motion.section 
      id="evidence" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#002366] border-t border-[#d4af37]/25"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            <Database className="w-3.5 h-3.5" /> Defense Resource Locker
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white">
            Uncompromising <span className="text-[#d4af37] font-serif not-italic">Documentation</span>
          </h2>
          <p className="mt-4 text-gray-200 text-sm leading-relaxed max-w-xl mx-auto font-light">
            All handbooks, legal filing templates, and de-escalation guides are archived transparently. We rely on verified constitutional facts and administrative rules to empower you.
          </p>
        </motion.div>

        {/* Filters and Search toolbar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#001233]/90 p-4 rounded-sm border border-[#d4af37]/20"
        >
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'pdf', 'video', 'spreadsheet'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-[#d4af37] text-[#001a4d] shadow-md' 
                    : 'bg-[#002366]/60 text-gray-300 hover:text-[#d4af37]'
                }`}
              >
                {filter === 'all' ? 'All Records' : filter.toUpperCase() + 's'}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence index..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-sm border border-[#d4af37]/35 bg-[#002366] text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </motion.div>

        {/* Grid List */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div 
                layout
                key={item.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                whileHover={{ y: -5, scale: 1.01, boxShadow: "0 20px 30px -15px rgba(212, 175, 55, 0.1)" }}
                className="bg-[#001233] rounded-sm border border-[#d4af37]/20 hover:border-[#d4af37]/60 shadow-xl p-5 flex flex-col justify-between transition-colors duration-300 group h-auto"
              >
                <div className="space-y-4">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    {getIcon(item.type)}
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] bg-[#d4af37]/10 px-2 py-0.5 rounded-sm border border-[#d4af37]/10">
                      {item.fileSize}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors tracking-wide leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-300/80 leading-relaxed font-sans font-light">{item.description}</p>
                  </div>
                </div>

                {/* Verified badge & actions */}
                <div className="border-t border-[#d4af37]/10 pt-4 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#d4af37]" />
                      <span>{item.uploadedAt}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#d4af37] leading-none">
                      <FileCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{item.verifiedBy}</span>
                    </div>
                  </div>

                  {/* Inline sharing for files to empower legal literacy dissemination */}
                  <div className="py-2 border-t border-b border-[#d4af37]/10 flex items-center justify-between">
                    <SocialShare 
                      title={item.title} 
                      text={item.description} 
                      shareUrl={item.fileUrl.startsWith("http") ? item.fileUrl : `${window.location.origin}${item.fileUrl}`}
                      inline={true}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDoc(item)}
                      className="flex-1 py-2 bg-[#002366]/40 hover:bg-[#d4af37] hover:text-[#001233] text-[#d4af37] rounded-sm text-[11px] font-bold tracking-wider uppercase border border-[#d4af37]/20 hover:border-transparent transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#002366]/40 hover:bg-[#d4af37] text-gray-300 hover:text-[#001a4d] rounded-sm border border-[#d4af37]/10 hover:border-transparent transition-all flex items-center justify-center"
                      title="Download document raw data file"
                      referrerPolicy="no-referrer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    {isAdmin && (
                      <button
                        onClick={() => onDeleteEvidence(item.id)}
                        className="p-2 bg-red-950/20 hover:bg-red-900/60 text-red-400 hover:text-white rounded-sm border border-red-500/15 hover:border-transparent transition-all flex items-center justify-center cursor-pointer"
                        title="Erase evidence documentation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-[#d4af37]/25 rounded-sm bg-[#001233]/40">
              <Database className="w-10 h-10 text-[#d4af37]/30 mx-auto mb-3" />
              <p className="text-xs text-gray-400 font-light">No logs found matching your search values.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* PDF View Mock Modal */}
      <AnimatePresence>
        {viewingPdf && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#001233]/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#001a4d] rounded-sm w-full max-w-5xl h-[85vh] border border-[#d4af37]/30 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="bg-[#001233] px-4 py-3 border-b border-[#d4af37]/15 flex items-center justify-between font-serif">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="text-sm font-bold text-white truncate max-w-[60vw]">
                    {viewingPdf.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setViewingPdf(null)}
                  className="p-1 rounded-sm text-gray-400 hover:text-white hover:bg-[#002366]/40 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Native iframe to render pdf, fall back to link */}
              <div className="flex-1 bg-[#001233] relative">
                <iframe
                  src={viewingPdf.fileUrl}
                  className="w-full h-full border-none"
                  title={viewingPdf.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#001233]/95 border border-[#d4af37]/30 p-3 rounded-sm flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-300 gap-2">
                  <span>Authentic source: <span className="text-[#d4af37] font-mono">{viewingPdf.fileName}</span></span>
                  <a 
                    href={viewingPdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold rounded-sm uppercase tracking-wider transition-colors flex items-center gap-1"
                    referrerPolicy="no-referrer"
                  >
                    <ExternalLink className="w-3 h-3" /> External Link
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video View Modal */}
      <AnimatePresence>
        {viewingVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#001233]/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#001a4d] rounded-sm w-full max-w-3xl border border-[#d4af37]/30 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="bg-[#001233] px-4 py-3 border-b border-[#d4af37]/15 flex items-center justify-between font-serif">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="text-sm font-bold text-white truncate max-w-[60vw]">
                    {viewingVideo.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setViewingVideo(null)}
                  className="p-1 rounded-sm text-gray-400 hover:text-white hover:bg-[#002366]/40 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-black aspect-video flex items-center justify-center text-center">
                {isYouTubeUrl(viewingVideo.fileUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(viewingVideo.fileUrl)}
                    title={viewingVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video 
                    src={viewingVideo.fileUrl} 
                    controls 
                    autoPlay
                    className="w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              
              <div className="p-4 bg-[#001233] text-xs text-gray-200 border-t border-[#d4af37]/10 space-y-1">
                <p className="font-semibold text-white font-serif">{viewingVideo.description}</p>
                <div className="flex gap-4 font-mono text-[10px] text-gray-400 pt-1">
                  <span>Size: {viewingVideo.fileSize}</span>
                  <span>Logged by: {viewingVideo.verifiedBy}</span>
                  <span>Date: {viewingVideo.uploadedAt}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
