import React, { useState } from "react";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, MessageSquare, Heart, Share2, Sparkles, Plus, Trash2 } from "lucide-react";
import { SocialPost } from "../types";

interface SocialFeedSectionProps {
  key?: string;
  posts: SocialPost[];
  isAdmin: boolean;
  onAddPost?: (platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube", content: string, imageUrl?: string) => Promise<void>;
  onDeletePost?: (id: string) => Promise<void>;
}

export default function SocialFeedSection({ posts, isAdmin, onAddPost, onDeletePost }: SocialFeedSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "twitter" | "instagram" | "facebook" | "linkedin" | "youtube">("all");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCountDiff, setLikeCountDiff] = useState<Record<string, number>>({});

  // Sorting: newest first
  const filteredPosts = posts
    .filter((post) => activeTab === "all" || post.platform === activeTab)
    .sort((a, b) => b.id.localeCompare(a.id));

  const getPlatformIcon = (platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube") => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4 text-sky-400" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-blue-400" />;
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPlatformClass = (platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube") => {
    switch (platform) {
      case "twitter":
        return "border-sky-500/20 bg-sky-950/10";
      case "linkedin":
        return "border-blue-500/20 bg-blue-950/10";
      case "youtube":
        return "border-red-500/20 bg-red-950/10";
      case "instagram":
        return "border-pink-500/20 bg-pink-950/10";
      case "facebook":
        return "border-blue-500/20 bg-blue-950/10";
    }
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCountDiff((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1),
    }));
  };

  return (
    <section id="social-feed" className="py-24 bg-[#001a4d] border-t border-[#d4af37]/25 relative">
      <div className="absolute inset-0 bg-radial-gradient(from 50% 50%, #002366 0%, #001233 100%) opacity-30 select-none pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Live Social Feed
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white">
            Civic Shield <span className="text-[#d4af37] font-serif not-italic">Broadcast Network</span>
          </h2>
          <p className="mt-4 text-gray-200 text-sm leading-relaxed max-w-xl mx-auto font-light">
            Stay aligned with our primary social broadcast accounts. Real-time community alerts, basic legal guides, and transparency bulletins compiled in one single hub.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-11">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "all"
                ? "bg-[#d4af37] text-[#001a4d] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                : "bg-[#002366]/40 text-gray-300 hover:text-white border border-gray-500/10 hover:border-[#d4af37]/25"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setActiveTab("twitter")}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "twitter"
                ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.25)]"
                : "bg-[#002366]/40 text-gray-300 hover:text-white border border-gray-500/10 hover:border-sky-500/25"
            }`}
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter/X</span>
          </button>
          <button
            onClick={() => setActiveTab("instagram")}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "instagram"
                ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.25)]"
                : "bg-[#002366]/40 text-gray-300 hover:text-white border border-gray-500/10 hover:border-pink-500/25"
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setActiveTab("linkedin")}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "linkedin"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                : "bg-[#002366]/40 text-gray-300 hover:text-white border border-gray-500/10 hover:border-blue-500/25"
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "youtube"
                ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                : "bg-[#002366]/40 text-gray-300 hover:text-white border border-gray-500/10 hover:border-red-600/25"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </button>
        </div>

        {/* Feed Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const isLiked = likedPosts[post.id];
            const displayLikes = post.likes + (likeCountDiff[post.id] || 0);

            return (
              <article
                key={post.id}
                className={`border rounded-sm p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-4px] relative bg-[#001233]/90 ${getPlatformClass(
                  post.platform
                )}`}
              >
                <div>
                  {/* Account Metadata */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center font-serif text-[#d4af37] text-xs font-bold uppercase select-none">
                        CS
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white flex items-center gap-1 heading-font">
                          {post.username}
                        </div>
                        <div className="text-[9px] font-mono text-gray-400">
                          {post.handle}
                        </div>
                      </div>
                    </div>
                    {getPlatformIcon(post.platform)}
                  </div>

                  {/* Body Content */}
                  <p className="text-xs text-gray-200 leading-relaxed font-light font-sans mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Optional Post Image */}
                  {post.imageUrl && (
                    <div className="rounded-sm overflow-hidden border border-gray-500/10 mt-3 mb-4 h-44 w-full relative bg-black/20">
                      <img
                        src={post.imageUrl}
                        alt="Social update"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between border-t border-gray-500/10 pt-4 mt-2">
                  <span className="text-[9px] font-mono text-gray-400 uppercase">
                    {post.timestamp}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 text-[10px] uppercase font-mono transition-colors cursor-pointer ${
                        isLiked ? "text-red-400" : "text-gray-400 hover:text-[#d4af37]"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                      <span>{displayLikes}</span>
                    </button>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{post.shares}</span>
                    </div>

                    {/* Admin Delete */}
                    {isAdmin && onDeletePost && (
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1 text-red-400 hover:text-white hover:bg-red-950/30 rounded-sm ml-2 transition-all cursor-pointer"
                        title="Delete social post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-[#d4af37]/25 rounded-sm bg-[#001233]/40">
              <MessageSquare className="w-10 h-10 text-[#d4af37]/35 mx-auto mb-3" />
              <p className="text-xs text-gray-400 font-light">
                No recent social broadcasts available under this platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
