import React from "react";
import { CheckCircle2, Circle, Landmark, Settings, Flame, Trash2, Plus } from "lucide-react";
import { motion } from "motion/react";

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

export default function TimelineSection({ events, isAdmin, onUpdateEvent, onAddEvent, onDeleteEvent, accentColor }: TimelineSectionProps) {

  const handleFieldChange = (index: number, key: keyof TimelineEvent, val: any) => {
    const updated = { ...events[index], [key]: val };
    onUpdateEvent(index, updated);
  };

  return (
    <motion.section 
      id="timeline" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-[#d4af37] leading-none mb-4">
            <Landmark className="w-3.5 h-3.5" /> Campaign Milestones
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-2">
            Active Roadmap for <span className="text-[#d4af37] font-serif not-italic">Compliance</span>
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Our daily efforts are cataloged chronologically. We coordinate watchers and deliver files until civic compliance is reinstated.
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-[#d4af37]/25 max-w-2xl mx-auto pl-6 sm:pl-8 space-y-12">
          {events.map((event, idx) => {
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Node marker */}
                <div className="absolute -left-[35px] sm:-left-[41px] top-1.5 focus:outline-none shrink-0 z-20">
                  {isAdmin ? (
                    <button
                      onClick={() => handleFieldChange(idx, "completed", !event.completed)}
                      className={`w-[20px] h-[20px] rounded-sm border cursor-pointer flex items-center justify-center transition-all ${
                        event.completed 
                          ? "bg-[#d4af37] border-[#d4af37] text-[#001a4d]" 
                          : "bg-[#001a4d] border-[#d4af37]/60 text-[#d4af37]"
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
                      whileHover={{ scale: 1.2 }}
                      className="rounded-sm bg-[#001a4d] border border-[#d4af37]/20 p-0.5 shadow-xl"
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500 bg-[#001a4d]" />
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Event block card */}
                <motion.div 
                  whileHover={{ x: 4, scale: 1.01, boxShadow: "0 15px 30px -10px rgba(212, 175, 55, 0.1)" }}
                  className="bg-[#001233] rounded-sm border border-[#d4af37]/20 hover:border-[#d4af37]/40 p-5 shadow-xl transition-all h-auto"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 font-mono text-[10px]">
                    {isAdmin ? (
                      <input
                        type="text"
                        value={event.date}
                        onChange={(e) => handleFieldChange(idx, "date", e.target.value)}
                        className="bg-[#001a4d] border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-[11px] font-bold text-[#d4af37] px-2 py-1 rounded-sm"
                      />
                    ) : (
                      <span className="text-[#d4af37] font-bold text-xs">{event.date}</span>
                    )}

                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm border border-[#d4af37]/20 w-fit ${
                      event.completed 
                        ? 'bg-[#d4af37]/15 text-[#d4af37]' 
                        : 'bg-[#001a4d] text-gray-400 border-transparent'
                    }`}>
                      {event.completed ? "Archived" : "Queued"}
                    </span>
                  </div>

                  {/* Title */}
                  {isAdmin ? (
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                      className="w-full bg-[#001a4d] text-sm font-serif font-bold text-white mb-2 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2 py-1"
                    />
                  ) : (
                    <h3 className="text-sm sm:text-base font-serif font-semibold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                      {event.title}
                    </h3>
                  )}

                  {/* Description */}
                  {isAdmin ? (
                    <textarea
                      value={event.description}
                      onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
                      rows={2}
                      className="w-full bg-[#001a4d] text-xs text-gray-200 focus:border-[#d4af37] focus:outline-none border border-[#d4af37]/30 rounded-sm px-2 py-1 font-sans leading-relaxed"
                    />
                  ) : (
                    <p className="text-xs text-gray-300/80 leading-relaxed font-sans font-light mt-1.5">{event.description}</p>
                  )}

                  {isAdmin && (
                    <div className="mt-3 pt-2.5 border-t border-[#d4af37]/15 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm("Permanently delete this roadmap milestone?")) {
                            onDeleteEvent && onDeleteEvent(idx);
                          }
                        }}
                        className="p-1.5 rounded-sm bg-red-500/10 border border-red-500/15 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono uppercase font-bold"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> delete
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {isAdmin && onAddEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={onAddEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#d4af37] text-[#001a4d] hover:bg-[#b08f25] text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Campaign Target Milestone
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
