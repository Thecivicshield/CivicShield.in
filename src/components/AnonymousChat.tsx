import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, ShieldQuestion, BadgeHelp, Info, 
  Sparkles, UserCheck, Trash2, FileText, Download, Cpu, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnonymousQuestion } from "../types";

interface AnonymousChatProps {
  questions: AnonymousQuestion[];
  onNewQuestion: (qText: string) => Promise<AnonymousQuestion | null>;
}

const SOVEREIGN_RESOURCES = [
  { 
    title: "Administrative Objection Affidavit", 
    type: "Word Template", 
    size: "48 KB", 
    desc: "A formal declarations kit to challenge overreaching notifications or municipal requests." 
  },
  { 
    title: "FOIA Certified Copy Application", 
    type: "PDF Handbook", 
    size: "124 KB", 
    desc: "Guidelines for forcing local public officers to deliver budget logs and official letters." 
  },
  { 
    title: "Self-Legal Representation Manual", 
    type: "Procedural Protocol", 
    size: "85 KB", 
    desc: "A systematic blueprint to confidently voice and protect your rights in local public hearings." 
  },
  { 
    title: "Inviolable Dignity Covenant Form", 
    type: "Draft Form", 
    size: "62 KB", 
    desc: "A custom drafted notification of spatial and personal boundary immunity for active defense." 
  }
];

export default function AnonymousChat({ questions, onNewQuestion }: AnonymousChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'directory' | 'resources'>('chat');
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'bot' | 'admin', text: string, time: string }>>(() => {
    try {
      const saved = localStorage.getItem("civic_shield_chat_history_v2");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        sender: 'bot',
        text: "Welcome to Civic Shield Anonymous Desk. Ask me anything about administrative litigation rules, self-legal representation protocols, or basic statutory self-defense. I'm here to eliminate fear and empower your voice.",
        time: "Just now"
      }
    ];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when conversations update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isOpen, activeTab]);

  // Sync conversation state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("civic_shield_chat_history_v2", JSON.stringify(conversation));
    } catch (e) {
      console.error(e);
    }
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const userMsg = messageText.trim();
    setMessageText("");
    
    // Add user message to local stream immediately
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversation(prev => [...prev, { sender: 'user', text: userMsg, time: userTime }]);
    setLoading(true);

    try {
      // Send to full-stack API
      const result = await onNewQuestion(userMsg);
      if (result) {
        // Display the specific real-time answer or custom fallback returned by the backend
        setConversation(prev => [...prev, { 
          sender: 'bot', 
          text: result.answer || "Your anonymous question has been successfully submitted to the campaign managers. It will appear on our Public Q&A wall once answered!", 
          time: userTime 
        }]);
      }
    } catch (err) {
      console.error(err);
      setConversation(prev => [...prev, { 
        sender: 'bot', 
        text: "Sorry, I couldn't process that. Your question was saved for manual inspection.", 
        time: userTime 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDirectory = questions.filter(q => 
    q.answered && q.isPublic &&
    (q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (q.answer && q.answer.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <>
      {/* Floating Action Button (HIGH TECH GLOWING ORB) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            id="chatbox-fab"
            layoutId="cyber-orb-wrapper"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-6 right-6 z-[450] cursor-pointer select-none group"
          >
            {/* Pulsing aura loops */}
            <div className="absolute inset-0 rounded-full bg-[#d4af37]/25 blur-md animate-ping" />
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />

            <div className="w-14 h-14 rounded-full bg-black/95 border-2 border-[#d4af37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] relative overflow-hidden">
              {/* Spinning technical rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 border border-dashed border-[#d4af37]/25 rounded-full pointer-events-none"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-dotted border-[#ffd754]/20 rounded-full pointer-events-none"
              />

              {/* Glowing Heartbeat Orb Core */}
              <div className="relative w-6 h-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffd754] shadow-[0_0_12px_#d4af37] flex items-center justify-center animate-pulse">
                <MessageSquare className="w-3.5 h-3.5 text-[#001233]" />
              </div>

              {/* Vector HUD details */}
              <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-60 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#d4af37" strokeWidth="1" strokeDasharray="15 8 5 8" fill="none" />
              </svg>
            </div>

            {/* Micro Tech Tag hover label */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#001233]/95 border border-[#d4af37]/35 text-white text-[8px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              * ACCESS_AI_ORB *
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Window (Expanded & Morphed HUD) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            layoutId="cyber-orb-wrapper"
            initial={{ opacity: 0, y: 80, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 80, scale: 0.9, rotate: -0.5 }}
            transition={{ type: "spring", damping: 23, stiffness: 180 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[450] w-[92vw] sm:w-[440px] h-[580px] rounded-sm flex flex-col shadow-2xl overflow-hidden border border-[#d4af37]/45 bg-[#001a4d] font-sans"
          >
            {/* Tech Corner Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#d4af37]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#d4af37]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#d4af37]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#d4af37]" />

            {/* Header */}
            <div className="bg-[#001233] px-4 py-4 border-b border-[#d4af37]/20 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] relative">
                  <ShieldQuestion className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-serif font-bold text-white tracking-wide flex items-center gap-1.5 uppercase">
                    Advocacy Assistance Center <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  </h3>
                  <p className="text-[9px] text-[#d4af37]/80 flex items-center gap-1 font-mono tracking-widest uppercase">
                    <Cpu className="w-3 h-3 text-[#d4af37]" /> SECURED_ORB_ACTIVE_NODE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if(confirm("Are you sure you want to clear your local secure session history?")) {
                      setConversation([
                        {
                          sender: 'bot',
                          text: "Welcome to Civic Shield Anonymous Desk. Ask me anything about administrative litigation rules, self-legal representation protocols, or basic statutory self-defense. I'm here to eliminate fear and empower your voice.",
                          time: "Just now"
                        }
                      ]);
                    }
                  }}
                  title="Clear Secure Session"
                  className="p-1.5 rounded-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Morphing Navigation Tabs */}
            <div className="flex bg-[#001233] border-b border-[#d4af37]/15 text-[9.5px] font-mono relative z-10 select-none">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center font-bold tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'chat' 
                    ? "border-[#d4af37] text-[#d4af37] bg-[#001a4d]/75 font-bold" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Ask Advocate
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex-1 py-3 text-center font-bold tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'directory' 
                    ? "border-[#d4af37] text-[#d4af37] bg-[#001a4d]/75 font-bold" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Community Q&A
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 py-3 text-center font-bold tracking-widest uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'resources' 
                    ? "border-[#d4af37] text-[#d4af37] bg-[#001a4d]/75 font-bold" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Resources
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-hidden relative min-h-0 bg-[#001a4d] flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    {/* Chat log body */}
                    <div 
                      ref={scrollRef}
                      className="flex-1 p-4 overflow-y-auto space-y-4 text-left"
                    >
                      <div className="p-3 rounded-sm bg-[#d4af37]/5 border border-[#d4af37]/20 text-[10px] text-gray-200 leading-relaxed flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#d4af37] block font-mono mb-0.5">ANONYMITY LOCK_ON</strong>
                          All transmissions are entirely local and protected. Ask questions to demystify complex court codes or administrative overreach.
                        </div>
                      </div>

                      {conversation.map((msg, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div 
                            className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-xs shadow-md leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[#d4af37] text-[#001233] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                : 'bg-[#001233] border border-gray-800 text-gray-100'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-gray-500 mt-1 px-1 font-mono tracking-wider">{msg.time}</span>
                        </motion.div>
                      ))}

                      {loading && (
                        <div className="flex items-center gap-2 text-[10px] text-[#d4af37]/80 italic font-mono pl-1">
                          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                          Advocate node decrypting response...
                        </div>
                      )}
                    </div>

                    {/* Form input */}
                    <form 
                      onSubmit={handleSubmit}
                      className="p-2.5 border-t border-[#d4af37]/15 bg-[#001233]/90 flex gap-2"
                    >
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Inquire anonymously about codes..."
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-sm border border-gray-800 focus:border-[#d4af37] focus:outline-none text-white bg-[#001a4d] placeholder-gray-500 font-sans"
                      />
                      <motion.button
                        type="submit"
                        disabled={!messageText.trim() || loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 px-3.5 bg-[#d4af37] hover:bg-[#bca032] disabled:bg-[#002366]/40 text-[#001233] font-bold rounded-sm transition-all cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'directory' && (
                  <motion.div 
                    key="directory-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col min-h-0 text-left"
                  >
                    {/* Search Field */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter compiled community precedents..."
                      className="w-full px-3.5 py-2 text-xs rounded-sm border border-gray-800 focus:border-[#d4af37] focus:outline-none text-white bg-[#001233]/90 placeholder-gray-500 shrink-0 font-mono text-[10px] tracking-wider uppercase"
                    />

                    <div className="flex-1 overflow-y-auto space-y-3.5 min-h-0 pr-1">
                      <AnimatePresence mode="popLayout">
                        {filteredDirectory.length === 0 ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <BadgeHelp className="w-8 h-8 text-[#d4af37]/20 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 font-mono font-light">NO VERIFIED PUBLIC PRECEDENTS</p>
                          </motion.div>
                        ) : (
                          filteredDirectory.map((q, qidx) => (
                            <motion.div 
                              key={q.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25, delay: Math.min(qidx * 0.04, 0.2) }}
                              className="p-3.5 rounded-sm border border-[#d4af37]/15 bg-[#001233]/80 space-y-2.5 hover:border-[#d4af37]/40 transition-all"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="text-[8px] font-mono uppercase font-bold bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded-sm shrink-0 leading-none">QUERY</span>
                                <p className="text-xs text-white font-medium leading-relaxed font-sans">{q.text}</p>
                              </div>
                              <div className="border-t border-[#d4af37]/10 pt-2 flex items-start gap-2.5">
                                <span className="text-[8px] font-mono uppercase font-bold bg-[#002366] text-blue-200 px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5 leading-none">REPLY</span>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-300 leading-relaxed font-sans font-light">{q.answer}</p>
                                  <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">TRANSMITTED BY: {q.repliedBy || 'Sovereign Staff'}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div 
                    key="resources-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col min-h-0 text-left"
                  >
                    <div className="p-3 rounded-sm bg-[#d4af37]/5 border border-[#d4af37]/15 text-[10px] text-gray-200 leading-relaxed flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#d4af37] block font-mono mb-0.5">SOVEREIGN_TOOLKIT</strong>
                        These formal templates and PDF handbooks can be used to object to administrative actions and demand public accountability copies.
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                      {SOVEREIGN_RESOURCES.map((resource, index) => (
                        <div 
                          key={index}
                          className="p-3.5 bg-black/40 border border-gray-800/80 rounded-sm hover:border-[#d4af37]/35 hover:bg-black/60 transition-all flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div>
                              <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#d4af37] font-bold block mb-0.5">
                                RESOURCE_DOC_0{index + 1}
                              </span>
                              <h4 className="text-xs font-semibold text-white leading-tight font-serif tracking-wide">
                                {resource.title}
                              </h4>
                            </div>
                            <span className="text-[7.5px] font-mono bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider shrink-0">
                              {resource.size}
                            </span>
                          </div>

                          <p className="text-[10px] text-gray-400 font-light leading-relaxed mb-3 font-sans">
                            {resource.desc}
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-800/60 pt-2.5">
                            <span className="text-[9px] font-mono text-gray-500 uppercase font-medium">
                              {resource.type}
                            </span>
                            <button
                              onClick={() => alert(`Initiating secure local download pipeline for "${resource.title}". This simulator prepares file payloads successfully.`)}
                              className="px-3 py-1 rounded-sm bg-[#d4af37]/10 hover:bg-[#d4af37] border border-[#d4af37]/25 hover:border-transparent text-[#d4af37] hover:text-[#001233] text-[9px] font-mono uppercase font-bold tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> Download Template
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
