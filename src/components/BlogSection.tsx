import React, { useState } from "react";
import { MessageSquare, Calendar, User, ArrowRight, X, Sparkles, Send, Trash2 } from "lucide-react";
import { BlogPost } from "../types";
import SocialShare from "./SocialShare";

interface BlogSectionProps {
  key?: string;
  posts: BlogPost[];
  onAddComment: (postId: string, name: string, commentText: string) => Promise<any>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<void>;
  isAdmin: boolean;
  onDeletePost: (id: string) => Promise<void>;
}

export default function BlogSection({ posts, onAddComment, onDeleteComment, isAdmin, onDeletePost }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCommentName("");
    setCommentText("");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await onAddComment(selectedPost.id, commentName || "Anonymous Supporter", commentText);
      if (newComment) {
        setSelectedPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            comments: [...(prev.comments || []), newComment]
          };
        });
      }
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#001233] border-t border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Direct Campaign Journalism
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white">
              Decrypted <span className="text-[#d4af37] font-serif not-italic font-bold">Intel Dossiers</span>
            </h2>
            <p className="mt-2 text-gray-200 text-sm max-w-2xl leading-relaxed font-light">
              We log daily developer maps, legal inquiries, public hearings, and local ecology developments here. Direct accountability updates from the front lines.
            </p>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group bg-[#001a4d] border border-[#d4af37]/20 hover:border-[#d4af37]/50 rounded-sm overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 h-auto"
            >
              <div>
                {/* Cover Image */}
                {post.imageUrl && (
                  <div className="h-52 w-full overflow-hidden relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#001a4d] to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 mb-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3" /> {post.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="mt-3 text-xs text-gray-300/80 leading-relaxed font-sans font-light line-clamp-3">
                    {post.content}
                  </p>
                  
                  {/* Social sharing integrated inside blog dispatches */}
                  <div className="mt-4 pt-3.5 border-t border-[#d4af37]/10 flex justify-between items-center">
                    <SocialShare 
                      title={post.title} 
                      text={post.content.slice(0, 100) + "..."}
                      shareUrl={`${window.location.origin}/#blog?post=${post.id}`}
                      inline={true}
                    />
                  </div>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="p-6 pt-0 border-t border-[#d4af37]/10 mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleOpenPost(post)}
                  className="text-xs font-bold uppercase tracking-wider text-[#d4af37] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Read Dispatch & Comments ({post.comments?.length || 0})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                {isAdmin && (
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-1.5 rounded-sm text-red-400 hover:text-white hover:bg-red-950/40 border border-red-500/15 hover:border-transparent transition-all cursor-pointer"
                    title="Delete blog post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#001233]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001a4d] rounded-sm w-full max-w-4xl h-[90vh] border border-[#d4af37]/30 flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#001233] px-6 py-4 border-b border-[#d4af37]/15 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
                Detailed Dispatch Update
              </span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-sm text-gray-400 hover:text-white hover:bg-[#002366]/40 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Document Area */}
            <div className="flex-1 overflow-y-auto space-y-8 p-6 sm:p-8">
              {/* Blog Main */}
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1 leading-none"><Calendar className="w-3 text-[#d4af37]" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1 leading-none"><User className="w-3 text-[#d4af37]" /> {selectedPost.author}</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-wide leading-tight">
                  {selectedPost.title}
                </h3>

                {selectedPost.imageUrl && (
                  <div className="rounded-sm overflow-hidden border border-[#d4af37]/20 h-64 sm:h-80 w-full relative">
                    <img 
                      src={selectedPost.imageUrl} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="text-sm text-gray-200 leading-relaxed font-sans font-light space-y-4 pt-2">
                  {selectedPost.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Main Detailed Social Share Widget */}
                <div className="mt-6 pt-6 border-t border-[#d4af37]/15">
                  <SocialShare 
                    title={selectedPost.title} 
                    text={selectedPost.content.slice(0, 140) + "..."}
                    shareUrl={`${window.location.origin}/#blog?post=${selectedPost.id}`}
                  />
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-[#d4af37]/15 pt-8 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Community Discussion ({selectedPost.comments?.length || 0})
                </h4>

                {/* Comment input form */}
                <form onSubmit={handleCommentSubmit} className="space-y-3 bg-[#001233] p-4 rounded-sm border border-[#d4af37]/15">
                  <span className="text-[10px] uppercase font-mono text-gray-400">Write anonymous feedback/comment</span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Display Name (eg. Supporter)"
                      className="bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white sm:w-1/3 placeholder-gray-500"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write constructive community feedback..."
                        required
                        className="bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white flex-1 placeholder-gray-500"
                      />
                      <button
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                        className="p-2 px-4 rounded-sm bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-[#002366]/40 text-[#001a4d] font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                    <p className="text-xs text-gray-400 italic pl-1">No comments posted yet. Be the first to join the conversation!</p>
                  ) : (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="p-3.5 rounded-sm bg-[#001233]/40 border border-[#d4af37]/10 relative">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                          <span className="text-[#d4af37] font-bold hover:text-white transition-colors">{comment.author}</span>
                          <div className="flex items-center gap-2">
                            <span>{comment.date}</span>
                            {isAdmin && (
                              <button
                                onClick={async () => {
                                  if (confirm("Delete this comment permanently?")) {
                                    if (onDeleteComment) {
                                      await onDeleteComment(selectedPost.id, comment.id);
                                      setSelectedPost(prev => {
                                        if (!prev) return null;
                                        return {
                                          ...prev,
                                          comments: prev.comments.filter(c => c.id !== comment.id)
                                        };
                                      });
                                    }
                                  }
                                }}
                                className="p-1 rounded-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                                title="Delete comment permanently"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 font-sans mt-1.5 leading-relaxed font-light">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
