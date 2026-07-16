import React, { useEffect, useState } from "react";
import { Shield, ShieldAlert, Lock, Unlock, Eye, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  primaryColor: string;
  accentColor: string;
}

export default function Header({ isAdminMode, setIsAdminMode, primaryColor, accentColor }: HeaderProps) {
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [typedKey, setTypedKey] = useState("");
  const [wrongKey, setWrongKey] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load administrative passkey from localStorage, defaulting to lol12ymn
  const [adminPasskey, setAdminPasskey] = useState(() => {
    try {
      return localStorage.getItem("civic_shield_admin_passkey") || "lol12ymn";
    } catch {
      return "lol12ymn";
    }
  });

  // State to manage changing administrative passcode
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [newPasskey, setNewPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState(false);

  // Track scroll position to trigger shrinkage & frosted enhancement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which section is currently active via scroll Intersection Observer
  useEffect(() => {
    const sections = ["pillars", "impact-metrics", "justice-shield", "evidence", "blog", "timeline"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when section dominates screen
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleToggleClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setIsLockOpen(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedKey === adminPasskey) {
      setIsAdminMode(true);
      setIsLockOpen(false);
      setTypedKey("");
      setWrongKey(false);
    } else {
      setWrongKey(true);
      setTimeout(() => setWrongKey(false), 600);
    }
  };

  const handleChangePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskey.trim()) {
      setChangeError("Passkey cannot be empty.");
      return;
    }
    if (newPasskey !== confirmPasskey) {
      setChangeError("New passkey and confirmation do not match.");
      return;
    }

    try {
      localStorage.setItem("civic_shield_admin_passkey", newPasskey);
      setAdminPasskey(newPasskey);
      setChangeSuccess(true);
      setChangeError(null);
      setTimeout(() => {
        setIsChangePassOpen(false);
        setChangeSuccess(false);
        setNewPasskey("");
        setConfirmPasskey("");
      }, 1500);
    } catch (err: any) {
      setChangeError("Failed to save to local storage: " + err.message);
    }
  };

  const navLinks = [
    { name: "Sovereign Axioms", href: "#pillars", targetId: "pillars" },
    { name: "Empowerment Ledger", href: "#impact-metrics", targetId: "impact-metrics" },
    { name: "Justice Shield", href: "#justice-shield", targetId: "justice-shield" },
    { name: "Evidentiary Vault", href: "#evidence", targetId: "evidence" },
    { name: "Decrypted Briefs", href: "#blog", targetId: "blog" },
    { name: "Mobilization Roadmap", href: "#timeline", targetId: "timeline" }
  ];

  const handleNavClick = (e: React.MouseEvent, targetId: string, label: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("trigger-cabinet-nav", {
      detail: { targetId, label }
    }));
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 border-b transition-all duration-500 ease-out backdrop-blur-md ${
        isScrolled 
          ? "h-16 bg-[#001233]/85 border-[#d4af37]/25 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]" 
          : "h-22 bg-[#001233]/95 border-[#d4af37]/15 shadow-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Logo Shield */}
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 45, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 bg-[#d4af37] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer shrink-0"
          >
            <div className="-rotate-45 font-serif font-bold text-[#001a4d] text-lg select-none">CS</div>
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#d4af37] flex items-center gap-1 leading-none">
              CIVIC <span className="text-white">SHIELD</span>
            </h1>
            <p className="text-[8.5px] font-mono uppercase tracking-[0.25em] text-gray-400 mt-1">Citizen Legal Literacy</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 h-full">
          {navLinks.map((link) => {
            const isActive = activeSection === link.targetId;
            return (
              <a 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.targetId, link.name)}
                className={`relative text-[11px] font-bold tracking-wider uppercase h-full flex items-center transition-colors duration-300 ${
                  isActive ? "text-[#d4af37]" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                
                {/* Underline Slide and Active indicator using Framer Motion */}
                {isActive && (
                  <motion.span 
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Campaign Admin Switch & Hamburger Icon */}
        <div className="flex items-center gap-3">
          {isAdminMode && (
            <motion.button
              onClick={() => setIsChangePassOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-sm text-[10px] font-bold tracking-wider uppercase bg-transparent text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3 text-[#d4af37]" />
              <span>Change Passkey</span>
            </motion.button>
          )}

          <motion.button
            id="admin-mode-toggle"
            onClick={handleToggleClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-sm text-[10.5px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
              isAdminMode 
                ? "bg-[#d4af37] text-[#001a4d] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.35)]" 
                : "bg-transparent text-[#d4af37] hover:bg-[#d4af37] hover:text-[#001a4d] border-[#d4af37]/45"
            }`}
          >
            {isAdminMode ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Manager Active</span>
                <span className="inline xs:hidden">Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Manager Login</span>
                <span className="inline xs:hidden">Login</span>
              </>
            )}
          </motion.button>

          {/* Hamburger Mobile Menu Toggle */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm md:hidden cursor-pointer"
            whileTap={{ scale: 0.92 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer menu animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-[#001233]/98 border-b border-[#d4af37]/25 overflow-hidden md:hidden shadow-2xl z-40 backdrop-blur-lg"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.targetId;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, link.targetId, link.name);
                    }}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`text-xs font-bold uppercase tracking-wider py-1 border-l-2 pl-3 ${
                      isActive 
                        ? "text-[#d4af37] border-[#d4af37]" 
                        : "text-gray-300 border-transparent hover:text-white"
                    }`}
                  >
                    {link.name}
                  </motion.a>
                );
              })}
              
              {isAdminMode && (
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsChangePassOpen(true);
                  }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-left text-gray-400 uppercase tracking-widest pt-2 border-t border-gray-800"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d4af37]" /> Change Passkey
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PASSPHRASE AUTHENTICATION modal overlay */}
      <AnimatePresence>
        {isLockOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ 
                scale: 1, 
                y: 0,
                x: wrongKey ? [0, -10, 10, -10, 10, 0] : 0
              }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ 
                type: "spring", 
                duration: wrongKey ? 0.4 : 0.4,
                bounce: wrongKey ? 0.5 : 0.15
              }}
              className="w-full max-w-sm bg-[#001233] border-2 border-[#d4af37]/80 rounded-sm p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] space-y-6 text-center mx-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-[#d4af37]/10 border border-[#d4af37] rounded-sm flex items-center justify-center mx-auto text-[#d4af37]">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-serif text-white tracking-wider uppercase">Manager Console Restricted</h3>
                <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                  Enter authorized credential passkey below to manage evidence locker records and customize campaign metrics.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="password"
                    required
                    placeholder="Insert authorization key..."
                    value={typedKey}
                    onChange={(e) => setTypedKey(e.target.value)}
                    className={`w-full bg-[#001a4d] text-center border text-xs tracking-widest text-[#d4af37] placeholder-gray-600 rounded-sm py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${
                      wrongKey ? "border-red-500 text-red-400" : "border-[#d4af37]/35"
                    }`}
                    autoFocus
                  />
                </div>

                {wrongKey && (
                  <p id="auth-error-msg" className="text-center text-[10px] text-red-400 font-mono animate-pulse">
                    ✖ ACCESS DENIED: Invalid administrative passkey.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsLockOpen(false);
                      setTypedKey("");
                      setWrongKey(false);
                    }}
                    className="py-2 border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Abstain
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer shadow-md"
                  >
                    Authenticate
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSPHRASE modal overlay */}
      <AnimatePresence>
        {isChangePassOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-sm bg-[#001233] border-2 border-[#d4af37]/80 rounded-sm p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] space-y-6 text-center mx-4"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-[#d4af37]/10 border border-[#d4af37] rounded-sm flex items-center justify-center mx-auto text-[#d4af37]">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-base font-serif text-white tracking-wider uppercase">Set New Access Passkey</h3>
                <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                  Provide a secure, private administrative key for managing layout, uploads and postings. This will persist on system refreshes.
                </p>
              </div>

              <form onSubmit={handleChangePasskeySubmit} className="space-y-4">
                <div className="space-y-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block pb-0.5">New Administrative Passkey</label>
                    <input
                      type="password"
                      required
                      placeholder="E.g., lol12ymn"
                      value={newPasskey}
                      onChange={(e) => setNewPasskey(e.target.value)}
                      className="w-full bg-[#001a4d] border border-[#d4af37]/35 text-xs text-white rounded-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#d4af37] placeholder-gray-600"
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block pb-0.5">Verify Passkey</label>
                    <input
                      type="password"
                      required
                      placeholder="Verify passkey..."
                      value={confirmPasskey}
                      onChange={(e) => setConfirmPasskey(e.target.value)}
                      className="w-full bg-[#001a4d] border border-[#d4af37]/35 text-xs text-white rounded-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#d4af37] placeholder-gray-600"
                    />
                  </div>
                </div>

                {changeError && (
                  <p className="text-center text-[10px] text-red-400 font-mono bg-red-950/20 py-1.5 px-2.5 rounded-sm border border-red-500/20">
                    {changeError}
                  </p>
                )}

                {changeSuccess && (
                  <p className="text-center text-[10px] text-emerald-400 font-mono bg-emerald-950/20 py-1.5 px-2.5 rounded-sm border border-emerald-500/20 animate-pulse">
                    ✓ Successful: Passkey updated and indexed!
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsChangePassOpen(false);
                      setNewPasskey("");
                      setConfirmPasskey("");
                      setChangeError(null);
                    }}
                    className="py-2 border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={changeSuccess}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-[#002366] text-[#001a4d] font-bold rounded-sm text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer shadow-md"
                  >
                    Apply Key
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
