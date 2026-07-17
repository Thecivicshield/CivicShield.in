import React, { useRef } from "react";
import { useScroll, useSpring, motion } from "motion/react";
import { 
  CheckCircle2, Circle, Landmark, Trash2, Plus, 
  Gavel, Scale, ShieldCheck, FileText, Compass, Cpu 
} from "lucide-react";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TimelineSectionProps {
  key?: string;
  events: TimelineEvent[];
  isAdmin: boolean;
  onUpdateEvent: (index: number, updated: TimelineEvent) => void;
  onAddEvent?: () => void;
  onDeleteEvent?: (index: number) => void;
  accentColor: string;
}

export default function TimelineSection({ 
  events, 
  isAdmin, 
  onUpdateEvent, 
  onAddEvent, 
  onDeleteEvent, 
  accentColor 
}: TimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire timeline section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 80%"]
  });

  // Springy scale factor for the scroll line path
  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001
  });

  const handleFieldChange = (index: number, key: keyof TimelineEvent, val: any) => {
    const updated = { ...events[index], [key]: val };
    onUpdateEvent(index, updated);
  };

  // Select a rich icon based on event content
  const getTimelineIcon = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes("court") || t.includes("judge") || t.includes("tribunal")) {
      return <Landmark className="w-4 h-4" />;
    }
    if (t.includes("gavel") || t.includes("verdict") || t.includes("ruling")) {
      return <Gavel className="w-4 h-4" />;
    }
    if (t.includes("audit") || t.includes("file") || t.includes("document") || t.includes("handbook")) {
      return <FileText className="w-4 h-4" />;
    }
    if (t.includes("shield") || t.includes("protect") || t.includes("citizen") || t.includes("constitution")) {
      return <ShieldCheck className="w-4 h-4" />;
    }
    
    // Fallbacks
    const fallbacks = [
      <Scale className="w-4 h-4" />,
      <Landmark className="w-4 h-4" />,
      <Gavel className="w-4 h-4" />,
      <ShieldCheck className="w-4 h-4" />
    ];
    return fallbacks[index % fallbacks.length];
  };

  // Card staggered animation settings
  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 16,
        mass: 0.9,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.section 
      ref={sectionRef}
      id="timeline" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Background blueprint decorative lines */}
      <div className="absolute inset-0 bg-grid-lines opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-[#d4af37] leading-none mb-4">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Sovereign Flightpath & Chronicles
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-2">
            The Jurisdictional <span className="text-[#d4af37] font-serif not-italic font-bold">Shield Ascent</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-light font-sans">
            Our constitutional watch list and de-escalation actions are cataloged chronologically. Watch our progress as each milestone dynamically locks into place.
          </p>
        </motion.div>

        {/* Timeline Path Container */}
        <div className="relative max-w-2xl mx-auto pl-8 sm:pl-12 space-y-16">
          
          {/* 1. FAINT BACKGROUND BLUEPRINT TRACK */}
          <div className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-[2px] bg-[#d4af37]/15 border-l border-dashed border-[#d4af37]/20" />
          
          {/* 2. GLOWING GOLD DRAWING LINE (SCROLL-DRIVEN) */}
          <motion.div 
            style={{ scaleY: lineScaleY }}
            className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#d4af37] via-[#ffd754] to-[#b89423] origin-top shadow-[0_0_12px_rgba(212,175,55,0.7)]"
          />

          {/* Timeline Events List */}
          {events.map((event, idx) => {
            return (
              <motion.div 
                key={idx} 
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                className="relative group"
              >
                {/* 3. NODE MARKER (ILLUMINATES) */}
                <div className="absolute -left-[27px] sm:-left-[31px] top-2 focus:outline-none shrink-0 z-20 flex items-center justify-center">
                  {isAdmin ? (
                    <button
                      onClick={() => handleFieldChange(idx, "completed", !event.completed)}
                      className={`w-[24px] h-[24px] rounded-sm border cursor-pointer flex items-center justify-center transition-all shadow-[0_0_8px_rgba(212,175,55,0.2)] ${
                        event.completed 
                          ? "bg-[#d4af37] border-[#d4af37] text-[#001a4d] shadow-[0_0_12px_#d4af37]" 
                          : "bg-[#001a4d] border-[#d4af37]/50 text-[#d4af37]"
                      }`}
                      title="Toggle milestone state"
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </button>
                  ) : (
                    <motion.div 
                      className="relative w-8 h-8 flex items-center justify-center"
                      whileHover={{ scale: 1.15 }}
                    >
                      {/* Spinning golden coordinate tick for active/completed */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-0 border border-dashed rounded-full pointer-events-none ${
                          event.completed ? "border-[#d4af37]/50" : "border-gray-700"
                        }`}
                      />
                      
                      <div className={`w-5 h-5 rounded-sm border flex items-center justify-center z-10 transition-all duration-500 bg-[#001233] ${
                        event.completed 
                          ? "border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.35)]" 
                          : "border-gray-700 text-gray-500"
                      }`}>
                        {event.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 4. THE TIMELINE CARD (BUILDS ITSELF WITH CORNER BLUEPRINT DETAILS) */}
                <motion.div 
                  whileHover={{ 
                    x: 6, 
                    scale: 1.015, 
                    boxShadow: "0 15px 35px -10px rgba(212, 175, 55, 0.15)",
                    borderColor: "rgba(212, 175, 55, 0.5)"
                  }}
                  className={`bg-[#001233]/95 rounded-sm border p-6 shadow-xl transition-all h-auto relative overflow-hidden flex flex-col justify-between ${
                    event.completed 
                      ? "border-[#d4af37]/25 shadow-[0_4px_20px_rgba(212,175,55,0.03)]" 
                      : "border-gray-800/80"
                  }`}
                >
                  {/* Decorative technical corner brackets */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]/35" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4af37]/35" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4af37]/35" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]/35" />

                  {/* Faint technical catalog label on back */}
                  <div className="absolute right-5 bottom-4 font-mono text-[7px] text-gray-600 tracking-wider uppercase select-none pointer-events-none">
                    M_REF: CS-0{idx + 1}
                  </div>

                  {/* HEADER AREA WITH DATES (ANIMATES INTO PLACE) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <motion.div 
                      variants={itemVariants}
                      className="flex items-center gap-2"
                    >
                      {/* 5. COURT ICONS APPEAR */}
                      <div className={`p-1.5 rounded-sm border ${
                        event.completed 
                          ? "bg-[#d4af37]/10 border-[#d4af37]/35 text-[#d4af37]" 
                          : "bg-[#001a4d] border-gray-800 text-gray-500"
                      }`}>
                        {getTimelineIcon(event.title, idx)}
                      </div>

                      {isAdmin ? (
                        <input
                          type="text"
                          value={event.date}
                          onChange={(e) => handleFieldChange(idx, "date", e.target.value)}
                          className="bg-[#001a4d] border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-[11px] font-bold text-[#d4af37] px-2 py-1 rounded-sm font-mono uppercase"
                        />
                      ) : (
                        <span className="text-[#d4af37] font-mono font-bold text-xs tracking-wider uppercase">
                          {event.date}
                        </span>
                      )}
                    </motion.div>

                    <motion.span 
                      variants={itemVariants}
                      className={`text-[8.5px] uppercase font-mono font-bold tracking-[0.2em] px-2 py-0.5 rounded-sm border w-fit ${
                        event.completed 
                          ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30 shadow-[0_0_8px_rgba(212,175,55,0.1)]' 
                          : 'bg-black/30 text-gray-500 border-gray-800'
                      }`}
                    >
                      {event.completed ? "DECRYPTED / ARCHIVED" : "PENDING COVENANT"}
                    </motion.span>
                  </div>

                  {/* TITLE AREA */}
                  <motion.div variants={itemVariants} className="mb-2.5">
                    {isAdmin ? (
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                        className="w-full bg-[#001a4d] text-sm font-serif font-bold text-white mb-2 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2 py-1"
                      />
                    ) : (
                      <h3 className="text-sm sm:text-base font-serif font-semibold text-white group-hover:text-[#d4af37] transition-colors leading-snug tracking-tight">
                        {event.title}
                      </h3>
                    )}
                  </motion.div>

                  {/* DESCRIPTION AREA */}
                  <motion.div variants={itemVariants}>
                    {isAdmin ? (
                      <textarea
                        value={event.description}
                        onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
                        rows={2}
                        className="w-full bg-[#001a4d] text-xs text-gray-200 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2 py-1 font-sans leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-gray-300 leading-relaxed font-sans font-light">
                        {event.description}
                      </p>
                    )}
                  </motion.div>

                  {/* ADMIN OPERATIONS */}
                  {isAdmin && (
                    <motion.div 
                      variants={itemVariants}
                      className="mt-4 pt-3 border-t border-gray-800 flex justify-end"
                    >
                      <button
                        onClick={() => {
                          if (confirm("Permanently delete this roadmap milestone?")) {
                            onDeleteEvent && onDeleteEvent(idx);
                          }
                        }}
                        className="p-1.5 rounded-sm bg-red-500/10 border border-red-500/15 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[9px] font-mono uppercase font-bold"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> delete
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ADD ROADMAP EVENT BUTTON FOR ADMINS */}
        {isAdmin && onAddEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-14"
          >
            <button
              onClick={onAddEvent}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-[#d4af37] text-[#001a4d] hover:bg-[#b08f25] text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:scale-[1.03] active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Campaign Target Milestone
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
