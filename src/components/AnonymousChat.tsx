import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ShieldQuestion, BadgeHelp, Info, Sparkles, UserCheck, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnonymousQuestion } from "../types";

interface AnonymousChatProps {
  questions: AnonymousQuestion[];
  onNewQuestion: (qText: string) => Promise<AnonymousQuestion | null>;
}

export default function AnonymousChat({ questions, onNewQuestion }: AnonymousChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'directory'>('chat');
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
      {/* Floating Action Button */}
      <motion.button
        id="chatbox-fab"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#001233] text-[#d4af37] hover:text-white border border-[#d4af37]/45 hover:border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer flex items-center gap-2 group"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          Ask Civic Shield
        </span>
      </motion.button>

      {/* Chat Window Mockup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.92, rotate: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.95, rotate: 0.5 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] rounded-sm flex flex-col shadow-2xl overflow-hidden border border-[#d4af37]/35 bg-[#001a4d] font-sans"
          >
            {/* Header */}
            <div className="bg-[#001233] px-4 py-4 border-b border-[#d4af37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37]">
                  <ShieldQuestion className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-serif font-bold text-white tracking-wide flex items-center gap-1.5">
                    Assistance Desk <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  </h3>
                  <p className="text-[10px] text-gray-300 flex items-center gap-1 font-mono">
                    <UserCheck className="w-3 h-3 text-[#d4af37]" /> SECURE ANONYMOUS
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setConversation([
                      {
                        sender: 'bot',
                        text: "Welcome to Civic Shield Anonymous Desk. Ask me anything about administrative litigation rules, self-legal representation protocols, or basic statutory self-defense. I'm here to eliminate fear and empower your voice.",
                        time: "Just now"
                      }
                    ]);
                  }}
                  title="Clear Chat Conversation"
                  className="p-1 rounded-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-sm text-gray-400 hover:text-white hover:bg-[#002366]/40 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-[#001233] border-b border-[#d4af37]/15 text-[10px]">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'chat' 
                    ? "border-[#d4af37] text-[#d4af37] bg-[#001a4d]/60" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Ask AI Advocate
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex-1 py-3 text-center font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'directory' 
                    ? "border-[#d4af37] text-[#d4af37] bg-[#001a4d]/60" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Public Q&A ({questions.filter(q => q.answered).length})
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div 
                  key="chat-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0 bg-[#001a4d]"
                >
                  {/* Message History */}
                  <div 
                    ref={scrollRef}
                    className="flex-1 p-4 overflow-y-auto space-y-4"
                  >
                    <div className="p-3 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[11px] text-gray-200 leading-relaxed flex items-start gap-2 text-left">
                      <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      Your identity is protected. None of your data is tracked. General questions may be published to the Public Q&A list.
                    </div>

                    {conversation.map((msg, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-xs h-auto shadow-md leading-relaxed text-left ${
                            msg.sender === 'user'
                              ? 'bg-[#d4af37] text-[#001a4d] font-bold'
                              : 'bg-[#001233] border border-[#d4af37]/15 text-white'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 px-1 font-mono">{msg.time}</span>
                      </motion.div>
                    ))}

                    {loading && (
                      <div className="flex items-center gap-2 text-xs text-[#d4af37]/80 italic font-mono pl-1">
                        <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                        Civic Advocate is drafting...
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form 
                    onSubmit={handleSubmit}
                    className="p-2 border-t border-[#d4af37]/15 bg-[#001233]/90 flex gap-2"
                  >
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your anonymous inquiry..."
                      className="flex-1 px-3 py-2 text-xs rounded-sm border border-[#d4af37]/20 focus:border-[#d4af37] focus:outline-none text-white bg-[#001a4d] placeholder-gray-500"
                    />
                    <motion.button
                      type="submit"
                      disabled={!messageText.trim() || loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 px-3 bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-[#002366]/40 text-[#001a4d] font-bold rounded-sm transition-all cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                /* Q&A Directory */
                <motion.div 
                  key="directory-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#001a4d] flex flex-col min-h-0"
                >
                  {/* Search Bar */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search community questions & answers..."
                    className="w-full px-3.5 py-2 text-xs rounded-sm border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-white bg-[#001233]/90 placeholder-gray-500 shrink-0"
                  />

                  <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                    <AnimatePresence mode="popLayout">
                      {filteredDirectory.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-10"
                        >
                          <BadgeHelp className="w-8 h-8 text-[#d4af37]/30 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 font-light">No answered questions found.</p>
                        </motion.div>
                      ) : (
                        filteredDirectory.map((q, qidx) => (
                          <motion.div 
                            key={q.id} 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: Math.min(qidx * 0.05, 0.3) }}
                            className="p-3.5 rounded-sm border border-[#d4af37]/15 bg-[#001233]/60 transition-all space-y-2 h-auto text-left"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-[9px] font-mono uppercase font-semibold bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded-sm leading-none shrink-0">Q</span>
                              <p className="text-xs text-white font-medium leading-relaxed">{q.text}</p>
                            </div>
                            <div className="border-t border-[#d4af37]/10 pt-2 flex items-start gap-2">
                              <span className="text-[9px] font-mono uppercase font-semibold bg-[#002366] text-blue-200 px-1.5 py-0.5 rounded-sm leading-none shrink-0 mt-0.5">A</span>
                              <div>
                                <p className="text-xs text-gray-300 leading-relaxed font-sans">{q.answer}</p>
                                <p className="text-[9px] font-mono text-gray-400 mt-1">Answered by {q.repliedBy || 'Staff'}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
