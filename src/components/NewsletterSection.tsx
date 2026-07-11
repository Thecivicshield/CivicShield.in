import React, { useState } from "react";
import { Send, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsletterSectionProps {
  key?: string;
  onSubscribe: (email: string) => Promise<{ success: boolean; message: string }>;
}

export default function NewsletterSection({ onSubscribe }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await onSubscribe(email.trim());
      setStatus('success');
      setMessage(res.message);
      setEmail("");
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      id="newsletter" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#002366]/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        
        {/* Animated Mail Icon with subtle float */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm inline-flex text-[#d4af37]"
        >
          <Mail className="w-6 h-6" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-2xl sm:text-4xl font-serif font-normal italic tracking-tight text-white flex items-center justify-center gap-2">
            Subscribe to the <span className="text-[#d4af37] font-serif not-italic">Shield Chronicle</span> <Sparkles className="w-5 h-5 text-[#d4af37]" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed font-light">
            Register your email. We send direct legal hearing notices, unedited council video logs, and patrol schedules. No spam, premium privacy.
          </p>
        </motion.div>

        {/* Input Form with Hover Scaling */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 bg-[#001233]/90 p-2 rounded-sm border border-[#d4af37]/25"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voter-email@community.org"
            required
            className="flex-1 px-4 py-3 text-xs bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-[#002366] text-[#001a4d] font-bold text-xs tracking-wider uppercase rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <span>Registering...</span>
            ) : (
              <>
                <span>Secure Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <p className={`text-xs font-semibold px-4 py-2.5 rounded-sm border ${
                status === 'success' 
                  ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/35' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
