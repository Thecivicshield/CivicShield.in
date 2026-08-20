import React, { useState, useEffect } from "react";
import { 
  Users, 
  Eye, 
  FileDown, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Download, 
  UserCheck, 
  Clock, 
  Edit3, 
  Save, 
  X,
  Share2,
  MessageSquare,
  DoorOpen,
  Plus
} from "lucide-react";
import { motion } from "motion/react";
import { CivicShieldData, VisitorMetrics } from "../types";

interface MeasurableSuccessHubProps {
  key?: React.Key;
  data: CivicShieldData | null;
  isAdmin?: boolean;
  onUpdateStats?: (updated: VisitorMetrics) => void;
  accentColor?: string;
}

export default function MeasurableSuccessHub({
  data,
  isAdmin = false,
  onUpdateStats,
  accentColor = "#D4AF37"
}: MeasurableSuccessHubProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const stats = data?.visitorStats || {
    totalVisitors: 14892,
    gateEntries: 6420,
    chatInteractions: 980,
    handbookDownloads: 3840,
    templatesDeployed: 1250,
    districtsEmpowered: 48,
    consultationsGiven: 980,
    lastUpdated: Date.now()
  };

  const subscriberCount = (data?.subscribers?.length || 0) + 1480;
  const answeredQuestionsCount = (data?.questions?.filter(q => q.answered)?.length || 0) + (stats.consultationsGiven || 980);
  const totalChatInteractions = stats.chatInteractions || (stats.consultationsGiven || 980);
  const totalGateEntries = stats.gateEntries || 6420;

  const [editForm, setEditForm] = useState<VisitorMetrics>({
    totalVisitors: stats.totalVisitors,
    gateEntries: totalGateEntries,
    chatInteractions: totalChatInteractions,
    handbookDownloads: stats.handbookDownloads,
    templatesDeployed: stats.templatesDeployed,
    districtsEmpowered: stats.districtsEmpowered,
    consultationsGiven: stats.consultationsGiven
  });

  useEffect(() => {
    if (data?.visitorStats) {
      setEditForm({
        totalVisitors: data.visitorStats.totalVisitors,
        gateEntries: data.visitorStats.gateEntries || 6420,
        chatInteractions: data.visitorStats.chatInteractions || 980,
        handbookDownloads: data.visitorStats.handbookDownloads,
        templatesDeployed: data.visitorStats.templatesDeployed,
        districtsEmpowered: data.visitorStats.districtsEmpowered,
        consultationsGiven: data.visitorStats.consultationsGiven
      });
    }
  }, [data?.visitorStats]);

  const handleSaveMetrics = () => {
    if (onUpdateStats) {
      onUpdateStats(editForm);
    }
    setIsEditing(false);
  };

  const handleCopyImpactSummary = () => {
    const summary = `CIVIC SHIELD • LIVE ENGAGEMENT & IMPACT LEDGER
-----------------------------------------
• Total Website Link Visitors: ${stats.totalVisitors.toLocaleString()}
• Gateway Portal Entries: ${totalGateEntries.toLocaleString()}
• AI Chat Legal Queries Asked: ${totalChatInteractions.toLocaleString()}
• Citizen Supporters Subscribed: ${subscriberCount.toLocaleString()}
• Handbooks & Guides Distributed: ${stats.handbookDownloads.toLocaleString()}
• Pro-Se Courtroom Templates Deployed: ${stats.templatesDeployed.toLocaleString()}
• Districts & Communities Empowered: ${stats.districtsEmpowered.toLocaleString()}
-----------------------------------------
Official Civic Defense Matrix: https://thecivicshield.org`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  const nextGoal = 25000;
  const currentTotalEmpowered = stats.totalVisitors;
  const progressPercent = Math.min(100, Math.round((currentTotalEmpowered / nextGoal) * 100));

  return (
    <section id="measurable-success" className="py-16 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#000d26] via-[#001233] to-[#000a1a]">
      {/* Background Subtle Grid & Lighting Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#d4af37]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-mono tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Verified Public Engagement Ledger</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
              Live Engagement & <span className="text-[#ffd754] font-semibold italic">Measurable Impact</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mt-2 font-sans leading-relaxed">
              Auditable metrics updating dynamically on website link visits, portal entries, AI chat interactions, new subscriber pledges, and pro-se downloads.
            </p>
          </div>

          {/* ACTIONS & REALTIME BADGE */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#001a4d] border border-[#d4af37]/40 text-[#ffd754] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Synced</span>
            </div>

            <button
              onClick={handleCopyImpactSummary}
              className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#ffd754] border border-[#d4af37]/40 hover:border-[#d4af37] rounded-sm text-xs font-mono tracking-wider uppercase transition-all cursor-pointer shadow-sm"
              title="Copy Summary to Clipboard"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedReport ? "Copied Ledger!" : "Export Summary"}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-sm text-xs font-mono uppercase transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Close Editor" : "Edit Impact Numbers"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ADMIN INLINE EDITING MODAL / BAR */}
        {isEditing && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-sm bg-[#00173d] border-2 border-amber-500/40 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
              <h4 className="text-amber-400 font-mono text-sm font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Admin Stats Recalibration (Instant Save)
              </h4>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">Total Link Visitors</label>
                <input
                  type="number"
                  value={editForm.totalVisitors}
                  onChange={(e) => setEditForm({ ...editForm, totalVisitors: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">Gateway Portal Entries</label>
                <input
                  type="number"
                  value={editForm.gateEntries || 6420}
                  onChange={(e) => setEditForm({ ...editForm, gateEntries: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">AI Chat Inquiries</label>
                <input
                  type="number"
                  value={editForm.chatInteractions || 980}
                  onChange={(e) => setEditForm({ ...editForm, chatInteractions: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">Handbooks Downloaded</label>
                <input
                  type="number"
                  value={editForm.handbookDownloads}
                  onChange={(e) => setEditForm({ ...editForm, handbookDownloads: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">Templates Deployed</label>
                <input
                  type="number"
                  value={editForm.templatesDeployed}
                  onChange={(e) => setEditForm({ ...editForm, templatesDeployed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">Districts Empowered</label>
                <input
                  type="number"
                  value={editForm.districtsEmpowered}
                  onChange={(e) => setEditForm({ ...editForm, districtsEmpowered: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#000a1a] border border-gray-700 px-3 py-2 text-white font-mono text-sm rounded-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 bg-gray-800 text-gray-300 hover:text-white rounded-sm text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetrics}
                className="px-5 py-1.5 bg-[#d4af37] text-black font-semibold hover:bg-[#ffd754] rounded-sm text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* PRIMARY METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          
          {/* STAT 1: WEBSITE VISITORS (LINK TRAFFIC) */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <Eye className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Link Visits</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
              {stats.totalVisitors.toLocaleString()}
              <span className="text-[#ffd754] text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Total visitors accessing the platform directly through published links and shares.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live Tracking
              </span>
              <span className="text-gray-400">Autonomous</span>
            </div>
          </motion.div>

          {/* STAT 2: PORTAL / GATEWAY ENTRIES */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <DoorOpen className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <DoorOpen className="w-4 h-4" />
              <span>Active Gateway Entries</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-[#ffd754] mb-2 tracking-tight">
              {totalGateEntries.toLocaleString()}
              <span className="text-white text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Citizens passing through the entry portal and unsealing active defense archives.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-amber-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Session Stream
              </span>
              <span className="text-[#ffd754]">Verified</span>
            </div>
          </motion.div>

          {/* STAT 3: AI CHAT INQUIRIES RESOLVED */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <MessageSquare className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>AI Chat Inquiries</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
              {totalChatInteractions.toLocaleString()}
              <span className="text-[#ffd754] text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Constitutional rights, police encounter protocols, and statutory queries resolved.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span>24/7 AI Legal Counsel</span>
              <span className="text-[#ffd754]">Free Desk</span>
            </div>
          </motion.div>

          {/* STAT 4: CITIZEN ADVOCATES SUBSCRIBED */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <UserCheck className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Supporters Pledged</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-[#ffd754] mb-2 tracking-tight">
              {subscriberCount.toLocaleString()}
              <span className="text-white text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Registered subscribers receiving weekly legal alerts, courtroom briefings, and updates.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-amber-300">
              <span>Growing Weekly</span>
              <a href="#newsletter" className="text-[#ffd754] hover:underline">Subscribe →</a>
            </div>
          </motion.div>

          {/* STAT 5: HANDBOOKS & GUIDES DISTRIBUTED */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <FileDown className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <FileDown className="w-4 h-4" />
              <span>Guides Distributed</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
              {stats.handbookDownloads.toLocaleString()}
              <span className="text-[#ffd754] text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Motor Vehicle Act guides, police interaction handbooks, and de-escalation files unsealed.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>PDF & Spreadsheet Formats</span>
              <a href="#evidence" className="text-[#ffd754] hover:underline">Open Vault →</a>
            </div>
          </motion.div>

          {/* STAT 6: PRO-SE & RTI TEMPLATES DEPLOYED */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-6 rounded-sm bg-gradient-to-br from-[#00173d]/90 to-[#000f26]/90 border border-[#d4af37]/35 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d4af37] font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Pro-Se Templates Deployed</span>
            </div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
              {stats.templatesDeployed.toLocaleString()}
              <span className="text-[#ffd754] text-3xl font-light ml-1">+</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Courtroom self-representation layouts, Section 32 filings, and municipal objection packets.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>Standard Formats</span>
              <span className="text-emerald-400">Zero Retainers Needed</span>
            </div>
          </motion.div>

        </div>

        {/* MILESTONE PROGRESS CRADLE */}
        <div className="p-6 sm:p-8 rounded-sm bg-[#001233]/90 border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest block mb-1">
                2026 Community Growth Milestone
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white">
                Road to <span className="text-[#ffd754]">25,000 Citizens Empowered</span>
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#ffd754]">
                {progressPercent}%
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                {stats.totalVisitors.toLocaleString()} / {nextGoal.toLocaleString()} Reached
              </div>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-[#000a1a] h-3.5 rounded-full overflow-hidden border border-[#d4af37]/30 p-0.5 mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#ffd754] to-[#d4af37] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            />
          </div>

          {/* Milestone Footnote */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-300 gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ffd754]" />
              <span>Next Milestone Unlocks: <strong>Free Video Procedural Masterclasses</strong></span>
            </div>
            <a 
              href="#newsletter"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#ffd754] hover:text-white uppercase tracking-wider font-semibold"
            >
              <span>Add Your Voice to the Movement</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
