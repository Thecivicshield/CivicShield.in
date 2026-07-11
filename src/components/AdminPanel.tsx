import React, { useState } from "react";
import { 
  ArrowUp, ArrowDown, Eye, EyeOff, Layout, FileUp, ShieldAlert,
  Users, HelpCircle, Check, FileCheck, Trash2, Mail, Sparkles, Download, Copy,
  Github, RefreshCw, LogOut, CheckCircle2, AlertTriangle, Key
} from "lucide-react";
import { LayoutBlock, BlogPost, AnonymousQuestion, NewsletterSub, SocialPost, SentNewsletter, NotificationLog } from "../types";

interface AdminPanelProps {
  blocks: LayoutBlock[];
  subscribers: NewsletterSub[];
  questions: AnonymousQuestion[];
  socialPosts: SocialPost[];
  newsletters: SentNewsletter[];
  notificationLogs?: NotificationLog[];
  onSaveBlocks: (newBlocks: LayoutBlock[]) => Promise<void>;
  onAddBlogPost: (title: string, content: string, author: string, imageUrl: string) => Promise<void>;
  onUploadFile: (payload: {
    fileName: string;
    fileType: string;
    fileData: string; // base64
    title: string;
    description: string;
    verifiedBy: string;
  }) => Promise<void>;
  onAnswerQuestion: (id: string, answer: string, repliedBy: string, isPublic: boolean) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onAddSocialPost: (platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube", content: string, imageUrl?: string) => Promise<void>;
  onDeleteSocialPost: (id: string) => Promise<void>;
  onSendNewsletter: (subject: string, badge: string, body: string) => Promise<string>;
  onAddSubscriber: (email: string) => Promise<{ success: boolean; message: string }>;
  onDeleteSubscriber: (id: string) => Promise<void>;
  accentColor: string;
}

export default function AdminPanel({
  blocks,
  subscribers,
  questions,
  socialPosts,
  newsletters,
  notificationLogs = [],
  onSaveBlocks,
  onAddBlogPost,
  onUploadFile,
  onAnswerQuestion,
  onDeleteQuestion,
  onAddSocialPost,
  onDeleteSocialPost,
  onSendNewsletter,
  onAddSubscriber,
  onDeleteSubscriber,
  accentColor
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'upload' | 'blog' | 'qna' | 'social' | 'newsletters' | 'subs' | 'mails' | 'backup'>('layout');

  // Social feed states
  const [socialPlatform, setSocialPlatform] = useState<"twitter" | "instagram" | "facebook" | "linkedin" | "youtube">("twitter");
  const [socialContent, setSocialContent] = useState("");
  const [socialImageUrl, setSocialImageUrl] = useState("");
  const [socialStatus, setSocialStatus] = useState<string | null>(null);

  // Newsletter broadcast states
  const [newsSubject, setNewsSubject] = useState("");
  const [newsBadge, setNewsBadge] = useState("Campaign Bulletin");
  const [newsBody, setNewsBody] = useState("");
  const [newsStatus, setNewsStatus] = useState<string | null>(null);
  const [isSendingNews, setIsSendingNews] = useState(false);

  // Subscriber management states
  const [newSubEmail, setNewSubEmail] = useState("");
  const [subAddStatus, setSubAddStatus] = useState<string | null>(null);
  const [isAddingSub, setIsAddingSub] = useState(false);
  
  // Blog form states
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogStatus, setBlogStatus] = useState<string | null>(null);

  // Upload states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadVerified, setUploadVerified] = useState("Campaign Coordinator");
  const [uploadType, setUploadType] = useState<'pdf' | 'video' | 'spreadsheet' | 'image'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [uploadLinkUrl, setUploadLinkUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Q&A reply states
  const [replies, setReplies] = useState<{ [qId: string]: string }>({});
  const [replyStatus, setReplyStatus] = useState<{ [qId: string]: string }>({});

  // Layout order drag states (draggable)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // GitHub integration states
  const [gitToken, setGitToken] = useState<string>(() => localStorage.getItem("civic_shield_github_token") || "");
  const [gitUser, setGitUser] = useState<{ username: string; avatarUrl: string } | null>(() => {
    const saved = localStorage.getItem("civic_shield_github_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [patInput, setPatInput] = useState("");
  const [gitRepos, setGitRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [gitPath, setGitPath] = useState("civic_data.json");
  const [gitSyncStatus, setGitSyncStatus] = useState<string | null>(null);
  const [isGitSyncing, setIsGitSyncing] = useState(false);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [gitSyncSuccessUrl, setGitSyncSuccessUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'github') {
        const { token, user } = event.data;
        if (token && user) {
          setGitToken(token);
          setGitUser(user);
          localStorage.setItem("civic_shield_github_token", token);
          localStorage.setItem("civic_shield_github_user", JSON.stringify(user));
          setGitSyncStatus(`Connected to GitHub as ${user.username}!`);
          setTimeout(() => setGitSyncStatus(null), 4000);
          fetchGitHubRepos(token);
        }
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  React.useEffect(() => {
    if (gitToken) {
      fetchGitHubRepos(gitToken);
    }
  }, [gitToken]);

  const fetchGitHubRepos = async (token: string) => {
    setIsFetchingRepos(true);
    try {
      const res = await fetch(`/api/github/repos?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const repos = await res.json();
        setGitRepos(repos);
        if (repos.length > 0) {
          setSelectedRepo(repos[0].fullName);
          setGitBranch(repos[0].defaultBranch || "main");
        }
      } else {
        const errData = await res.json();
        console.error("Failed to fetch repos:", errData.error);
      }
    } catch (e) {
      console.error("Fetch repos request failed:", e);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const handleConnectOAuth = async () => {
    setGitSyncStatus("Requesting GitHub OAuth flow URL...");
    setGitSyncSuccessUrl(null);
    try {
      const res = await fetch("/api/auth/github-url");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "OAuth is not configured on the server yet.");
      }
      const { url } = await res.json();
      setGitSyncStatus(null);
      
      const popup = window.open(url, "github_oauth_popup", "width=600,height=700");
      if (!popup) {
        alert("Popup blocker active. Please allow popups to connect to GitHub.");
      }
    } catch (err: any) {
      setGitSyncStatus("OAuth Connection Failed: " + err.message + ". Please set GITHUB_CLIENT_ID or try connecting with a Personal Access Token below.");
    }
  };

  const handleConnectPAT = async () => {
    if (!patInput.trim()) {
      alert("Please enter a valid Personal Access Token.");
      return;
    }
    setGitSyncStatus("Verifying Personal Access Token...");
    setGitSyncSuccessUrl(null);
    try {
      const res = await fetch("/api/github/validate-pat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: patInput })
      });
      if (!res.ok) {
        throw new Error("Invalid token or connection error.");
      }
      const user = await res.json();
      setGitToken(patInput);
      setGitUser({ username: user.username, avatarUrl: user.avatarUrl });
      localStorage.setItem("civic_shield_github_token", patInput);
      localStorage.setItem("civic_shield_github_user", JSON.stringify({ username: user.username, avatarUrl: user.avatarUrl }));
      setPatInput("");
      setGitSyncStatus(`✓ Successfully connected to GitHub as ${user.username}!`);
      setTimeout(() => setGitSyncStatus(null), 4000);
      fetchGitHubRepos(patInput);
    } catch (err: any) {
      setGitSyncStatus("Validation failed: " + err.message);
    }
  };

  const handleDisconnectGit = () => {
    setGitToken("");
    setGitUser(null);
    setGitRepos([]);
    localStorage.removeItem("civic_shield_github_token");
    localStorage.removeItem("civic_shield_github_user");
    setGitSyncStatus("Disconnected from GitHub.");
    setGitSyncSuccessUrl(null);
    setTimeout(() => setGitSyncStatus(null), 3000);
  };

  const handleSyncToGitHub = async () => {
    if (!gitToken || !selectedRepo) return;
    setIsGitSyncing(true);
    setGitSyncStatus("Pushing civic_data.json to GitHub...");
    setGitSyncSuccessUrl(null);
    
    const [owner, repoName] = selectedRepo.split("/");
    try {
      const res = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: gitToken,
          owner,
          repo: repoName,
          branch: gitBranch,
          path: gitPath
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setGitSyncStatus(`✓ Success! Database backup was successfully pushed to branch '${gitBranch}'!`);
        if (data.commitUrl) {
          setGitSyncSuccessUrl(data.commitUrl);
        }
      } else {
        throw new Error(data.error || "Failed to sync to GitHub.");
      }
    } catch (err: any) {
      setGitSyncStatus("Sync failed: " + err.message);
    } finally {
      setIsGitSyncing(false);
    }
  };

  // Block handlers
  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    // Swap
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;

    // Reconstruct orders
    const updated = newBlocks.map((b, i) => ({ ...b, order: i + 1 }));
    await onSaveBlocks(updated);
  };

  const handleToggleBlockVisibility = async (index: number) => {
    const newBlocks = [...blocks];
    newBlocks[index].visible = !newBlocks[index].visible;
    await onSaveBlocks(newBlocks);
  };

  // Drag handles (HTML 5 native drag and drop)
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newBlocks = [...blocks];
    const itemToMove = newBlocks[draggedIdx];
    
    // Remove from old slot, put in new
    newBlocks.splice(draggedIdx, 1);
    newBlocks.splice(index, 0, itemToMove);

    // Reorder
    const updated = newBlocks.map((b, i) => ({ ...b, order: i + 1 }));
    setDraggedIdx(null);
    await onSaveBlocks(updated);
  };

  // Blog publishing handler
  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    try {
      await onAddBlogPost(
        blogTitle,
        blogContent,
        blogAuthor || "Campaign Coordinator",
        blogImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
      );
      setBlogStatus("Blog post successfully published to home space!");
      setBlogTitle("");
      setBlogAuthor("");
      setBlogImage("");
      setBlogContent("");
      setTimeout(() => setBlogStatus(null), 4000);
    } catch (err: any) {
      setBlogStatus("Error publishing: " + err.message);
    }
  };

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto detect category from file type extensions
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'mp4' || ext === 'mkv' || ext === 'avi' || ext === 'mov') {
        setUploadType('video');
      } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        setUploadType('spreadsheet');
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || ext === 'svg') {
        setUploadType('image');
      } else {
        setUploadType('pdf');
      }
    }
  };

  // Upload file or link handler
  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadMethod === 'link') {
      if (!uploadLinkUrl || !uploadLinkUrl.startsWith("http")) {
        setUploadStatus("Please enter a valid HTTP/HTTPS web address URL first.");
        return;
      }
      setIsUploading(true);
      setUploadStatus("Indexing external resource link...");
      try {
        await onUploadFile({
          fileName: uploadLinkUrl,
          fileType: uploadType,
          fileData: uploadLinkUrl,
          title: uploadTitle || "External Resource Link",
          description: uploadDesc,
          verifiedBy: uploadVerified || "Campaign Lead"
        });
        
        setUploadStatus(`Resource successfully indexed! Link is now live inside critical records.`);
        setUploadLinkUrl("");
        setUploadTitle("");
        setUploadDesc("");
        setTimeout(() => setUploadStatus(null), 4500);
      } catch (err: any) {
        setUploadStatus("Link indexing failed: " + err.message);
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!selectedFile) {
      setUploadStatus("Please choose a file from your device first.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Converting file byte array to server streams...");
    
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string; // base64 URI
        await onUploadFile({
          fileName: selectedFile.name,
          fileType: uploadType,
          fileData,
          title: uploadTitle || selectedFile.name,
          description: uploadDesc,
          verifiedBy: uploadVerified || "Campaign Lead"
        });
        
        setUploadStatus(`File compiled and successfully indexed! ${selectedFile.name} is now public.`);
        setSelectedFile(null);
        setUploadTitle("");
        setUploadDesc("");
        setTimeout(() => setUploadStatus(null), 4000);
      } catch (err: any) {
        setUploadStatus("Upload failed: " + err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Answer anonymous question
  const handleSendAnswer = async (qId: string, isPublic: boolean) => {
    const textReply = replies[qId];
    if (!textReply || !textReply.trim()) return;

    try {
      await onAnswerQuestion(qId, textReply.trim(), "Campaign Lead", isPublic);
      setReplyStatus(prev => ({ ...prev, [qId]: "Answer validated & saved." }));
      setTimeout(() => setReplyStatus(prev => ({ ...prev, [qId]: "" })), 3000);
    } catch (err: any) {
      setReplyStatus(prev => ({ ...prev, [qId]: "Error: " + err.message }));
    }
  };

  // Trigger Gemini Draft assistance within Admin Panel
  const handleDraftGeminiAnswer = async (qId: string, originalQuestionText: string) => {
    setReplies(prev => ({ ...prev, [qId]: "Drafting smart campaign advocate stance..." }));
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Submitting same text will re-query Gemini block, which responds back
        body: JSON.stringify({ text: originalQuestionText })
      });
      const data = await response.json();
      if (data.answer) {
        setReplies(prev => ({ ...prev, [qId]: data.answer }));
      } else {
        setReplies(prev => ({ ...prev, [qId]: "Gemini API drafted. Could not parse answer part. Please write custom text." }));
      }
    } catch (err: any) {
      setReplies(prev => ({ ...prev, [qId]: "Offline draft assistance. Please compose manual response: " + err.message }));
    }
  };

  const handleExportSubs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Email", "Subscribed At"].join(",") + "\n"
      + subscribers.map(s => `"${s.email}","${s.subscribedAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "civic_shield_newsletter_subs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSocialPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialContent.trim()) return;
    setSocialStatus("Publishing stream dispatch...");
    try {
      await onAddSocialPost(socialPlatform, socialContent.trim(), socialImageUrl.trim() || undefined);
      setSocialContent("");
      setSocialImageUrl("");
      setSocialStatus("Success: Shared broadcast onto feed!");
      setTimeout(() => setSocialStatus(null), 3500);
    } catch (err: any) {
      setSocialStatus("Error: " + err.message);
    }
  };

  const handleCreateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsSubject.trim() || !newsBody.trim()) return;
    setIsSendingNews(true);
    setNewsStatus("Broadcasting update to supporter pool...");
    try {
      const confirmMsg = await onSendNewsletter(newsSubject.trim(), newsBadge.trim(), newsBody.trim());
      setNewsSubject("");
      setNewsBody("");
      setNewsStatus(confirmMsg || "Broadcast successfully transmitted!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setNewsStatus(null), 5000);
    } catch (err: any) {
      setNewsStatus("Transmission failed: " + err.message);
    } finally {
      setIsSendingNews(false);
    }
  };

  const handleManualAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes("@")) return;
    setIsAddingSub(true);
    setSubAddStatus("Registering supporter...");
    try {
      const res = await onAddSubscriber(newSubEmail.trim());
      setNewSubEmail("");
      setSubAddStatus(res.message || "Supporter email registered successfully!");
      setTimeout(() => setSubAddStatus(null), 4000);
    } catch (err: any) {
      setSubAddStatus("Registration failed: " + err.message);
    } finally {
      setIsAddingSub(false);
    }
  };

  return (
    <div className="bg-[#001233] rounded-sm border border-[#d4af37]/25 shadow-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#d4af37]/20 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold tracking-tight text-white uppercase flex items-center gap-2">
              Civic Shield <span className="text-[#d4af37] font-serif not-italic">Operations Center</span>
            </h2>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-gray-400">ADMIN CONTROL BOARD</p>
          </div>
        </div>

        {/* Toolbar tabs */}
        <div className="flex flex-wrap gap-2">
          {(['layout', 'upload', 'blog', 'qna', 'social', 'newsletters', 'subs', 'mails', 'backup'] as const).map(tab => {
            const labels = {
              layout: "Layout Sorter",
              upload: "Upload locker",
              blog: "Publish blog",
              qna: "Answer Desk",
              social: "Social Stream",
              newsletters: "Broadcast Newsletters",
              subs: "Supporter Emails",
              mails: "Mail Alerts & Logs ✉️",
              backup: "Backup & Sync 🔄"
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-3.5 rounded-sm text-xs font-bold whitespace-nowrap tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? "bg-[#d4af37] text-[#001a4d] shadow-md" 
                    : "bg-[#001a4d] hover:bg-[#002366]/40 text-[#d4af37] border border-[#d4af37]/25"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* 1. Layout Editor */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
              <Layout className="w-4 h-4" /> Layout Block Customization (Drag & Drop Active)
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              We respect your campaign hierarchy. Order has direct impact on design. To change, grab a card and drag & drop it, or use the arrow controls. toggle visibility fields dynamically.
            </p>
          </div>

          <div className="space-y-3">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className="bg-[#001a4d] border border-[#d4af37]/15 hover:border-[#d4af37]/40 p-4 rounded-sm flex items-center justify-between gap-4 transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden group select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#001233] border border-[#d4af37]/20 rounded-sm text-gray-400 font-mono text-[10px] w-8 text-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide font-sans">{block.title}</h5>
                    <p className="text-[10px] text-gray-400 font-mono">Identifier: {block.id} | Status: <span className={block.visible ? 'text-[#d4af37] bg-[#d4af37]/5 px-1 py-0.5 rounded':'text-red-400'}>{block.visible ? 'Visible' : 'Hidden'}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleMoveBlock(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-sm bg-[#001233] border border-[#d4af37]/20 hover:border-[#d4af37] disabled:opacity-30 transition-all cursor-pointer text-[#d4af37]"
                    title="Move Layout Item Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    onClick={() => handleMoveBlock(idx, 'down')}
                    disabled={idx === blocks.length - 1}
                    className="p-1.5 rounded-sm bg-[#001233] border border-[#d4af37]/20 hover:border-[#d4af37] disabled:opacity-30 transition-all cursor-pointer text-[#d4af37]"
                    title="Move Layout Item Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleBlockVisibility(idx)}
                    className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                      block.visible 
                        ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#001a4d]' 
                        : 'bg-[#001233] border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                    }`}
                    title={block.visible ? "Hide Block" : "Make Visible"}
                  >
                    {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. File Upload Locker */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUploadItem} className="space-y-4 max-w-xl animate-in fade-in duration-200">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
              <FileUp className="w-4 h-4" /> Defense Resource Upload Locker
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              Add verified files or external resources directly to the legal index. Videos can be linked directly from YouTube/Vimeo to fit within device stream requirements cleanly.
            </p>
          </div>

          <div className="flex select-none border border-[#d4af37]/35 p-1 rounded-sm bg-[#001a4d]/60">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 text-center py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-sm transition-all cursor-pointer ${
                uploadMethod === 'file'
                  ? 'bg-[#d4af37] text-[#001a4d]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Local File Upload (PDF / Video)
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('link')}
              className={`flex-1 text-center py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-sm transition-all cursor-pointer ${
                uploadMethod === 'link'
                  ? 'bg-[#d4af37] text-[#001a4d]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              External Hyperlink / Video URL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Resource Title</label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="E.g., self-representation handbook"
                className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-600 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Verified Signature Agency</label>
              <input
                type="text"
                required
                value={uploadVerified}
                onChange={(e) => setUploadVerified(e.target.value)}
                placeholder="E.g., Civic Shield Legal Alliance"
                className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650 font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={uploadDesc}
              onChange={(e) => setUploadDesc(e.target.value)}
              placeholder="Provide a compelling descriptive baseline context for this asset..."
              className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-655 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Category override</label>
              <select
                value={uploadType}
                onChange={(e: any) => setUploadType(e.target.value)}
                className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white font-sans"
              >
                <option value="pdf">Document (PDF)</option>
                <option value="video">Construction Log (MP4 / YouTube Video)</option>
                <option value="spreadsheet">Financial Sheet (XLS/CSV)</option>
                <option value="image">Violation Photograph (JPG/PNG)</option>
              </select>
            </div>

            {uploadMethod === 'file' ? (
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Select File Stream</label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="w-full bg-[#001a4d] border border-[#d4af37]/20 focus:outline-none text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:font-semibold file:bg-[#d4af37]/20 file:text-[#d4af37] file:hover:bg-[#d4af37]/35 file:cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Resource URL / Video Link</label>
                <input
                  type="url"
                  required
                  value={uploadLinkUrl}
                  onChange={(e) => setUploadLinkUrl(e.target.value)}
                  placeholder="E.g., https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-600 font-sans"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || (uploadMethod === 'file' ? !selectedFile : !uploadLinkUrl)}
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-[#002366] text-[#001a4d] font-bold text-xs tracking-wider uppercase rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isUploading ? "Indexing streams..." : (uploadMethod === 'file' ? "Upload & Index Evidence Material" : "Index Link Resource")}</span>
          </button>

          {uploadStatus && (
            <p className="text-xs font-semibold text-[#d4af37] bg-[#d4af37]/5 px-3 py-2 rounded-sm border border-[#d4af37]/25 animate-pulse">
              {uploadStatus}
            </p>
          )}
        </form>
      )}

      {/* 3. Blog Publisher */}
      {activeTab === 'blog' && (
        <form onSubmit={handlePublishBlog} className="space-y-4 max-w-xl">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
              Publish Dispatch Update Daily
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              Draft formal announcements on city hall activities, legal briefs, community assembly notices, etc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Post Title</label>
              <input
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="E.g., Court filings template instruction"
                className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Author Post Signature</label>
              <input
                type="text"
                value={blogAuthor}
                onChange={(e) => setBlogAuthor(e.target.value)}
                placeholder="E.g., Citizen Advocate Council"
                className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Header Image URL</label>
            <input
              type="url"
              value={blogImage}
              onChange={(e) => setBlogImage(e.target.value)}
              placeholder="E.g., https://images.unsplash.com/photo-1448375240586..."
              className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-gray-400">Article Content</label>
            <textarea
              required
              rows={5}
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="Type dispatch content..."
              className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650 font-sans leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold text-xs tracking-wider uppercase rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-[#001a4d]" />
            <span>Publish Dispatch Entry</span>
          </button>

          {blogStatus && (
            <p className="text-xs font-semibold text-[#d4af37] bg-[#d4af37]/5 px-3 py-2 rounded-sm border border-[#d4af37]/25">
              {blogStatus}
            </p>
          )}
        </form>
      )}

      {/* 4. Anonymous Questions Moderation Panel */}
      {activeTab === 'qna' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
              <HelpCircle className="w-4 h-4" /> Anonymous Assistance Moderation Deck
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              Compose custom campaign responses to citizen queries. Once answered, setting `Pin` will publicly append them to the public directory.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div 
                key={q.id}
                className="bg-[#001a4d] border border-[#d4af37]/15 rounded-sm p-4 space-y-3 hover:border-[#d4af37]/35 transition-all h-auto"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/15 font-bold">Anonymous Q</span>
                    <p className="text-xs text-white font-medium italic leading-relaxed">"{q.text}"</p>
                    <span className="text-[9px] font-mono text-gray-400 block pt-1">Logged: {q.timestamp}</span>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteQuestion(q.id)}
                    className="p-1 px-1.5 rounded-sm border border-red-500/15 hover:border-transparent hover:bg-red-950/40 text-red-400 hover:text-white transition-all cursor-pointer"
                    title="Remove Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reply section */}
                <div className="bg-[#001233] rounded-sm p-3 space-y-3 border border-[#d4af37]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-gray-400">Advocate Response Outline</span>
                    <button
                      type="button"
                      onClick={() => handleDraftGeminiAnswer(q.id, q.text)}
                      className="px-2.5 py-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-extrabold uppercase rounded-sm border border-[#d4af37]/25 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#d4af37]" />
                      <span>Gemini-AI Draft</span>
                    </button>
                  </div>

                  <textarea
                    value={replies[q.id] !== undefined ? replies[q.id] : (q.answer || "")}
                    onChange={(e) => setReplies(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Type official reply or click Gemini-AI Draft above..."
                    rows={3}
                    className="w-full bg-[#001a4d] border border-[#d4af37]/25 focus:border-[#d4af37] focus:outline-none text-xs rounded-sm px-3 py-2 text-white placeholder-gray-650 font-sans leading-relaxed"
                  />

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d4af37]/10 pt-3">
                    <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-gray-300 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        defaultChecked={q.isPublic}
                        onChange={(e) => {
                          const pub = e.target.checked;
                          onAnswerQuestion(q.id, replies[q.id] || q.answer || "", "Campaign Lead", pub);
                        }}
                        className="rounded-sm border-[#d4af37]/35 text-[#d4af37] focus:ring-[#d4af37]"
                      />
                      <span>Pin publicly to visitor directory</span>
                    </label>

                    <div className="flex items-center gap-2 shrink-0">
                      {replyStatus[q.id] && (
                        <span className="text-[10px] font-semibold text-[#d4af37] font-mono pr-2">{replyStatus[q.id]}</span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleSendAnswer(q.id, q.isPublic)}
                        className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold text-xs rounded-sm uppercase tracking-wide transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Answer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <p className="text-center py-10 text-xs text-gray-400 italic">No community questions received yet.</p>
            )}
          </div>
        </div>
      )}

      {/* 5. Subscribers Directory */}
      {activeTab === 'subs' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
                <Users className="w-4 h-4" /> Registered Supporter Email Roster ({subscribers.length})
              </h4>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
                Secure subscriber directory who receive official hearing outlines daily.
              </p>
            </div>

            <button 
              onClick={handleExportSubs}
              className="px-3.5 py-1.5 rounded-sm border border-[#d4af37]/25 bg-[#001a4d] text-[#d4af37] hover:text-[#001a4d] hover:bg-[#d4af37] font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export as CSV
            </button>
          </div>

          <div className="bg-[#001a4d] rounded-sm border border-[#d4af37]/20 overflow-hidden">
            <div className="grid grid-cols-12 bg-[#001233] px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              <span className="col-span-8">Email Address</span>
              <span className="col-span-4 text-right">Registered On</span>
            </div>
            
            <div className="divide-y divide-[#d4af37]/10 max-h-[300px] overflow-y-auto">
              {subscribers.map((sub) => (
                <div key={sub.id} className="grid grid-cols-12 px-4 py-3 text-xs text-gray-200">
                  <div className="col-span-8 flex items-center gap-2 overflow-hidden truncate">
                    <Mail className="w-3.5 h-3.5 text-[#d4af37]/60 shrink-0" />
                    <span className="truncate pr-4">{sub.email}</span>
                  </div>
                  <span className="col-span-4 text-right overflow-hidden text-gray-450 text-[10px] font-mono leading-relaxed truncate">{sub.subscribedAt}</span>
                </div>
              ))}

              {subscribers.length === 0 && (
                <p className="p-4 text-center text-xs text-gray-400 italic">No newsletter supporters yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Social Feed management */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none mb-1">
              <Sparkles className="w-4 h-4" /> Live Broadcast Stream Manager
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              Submit micro-briefings, legal tips, or roadside stop protocol advice directly into the public dynamic feeds.
            </p>
          </div>

          <form onSubmit={handleCreateSocialPost} className="bg-[#001a4d] border border-[#d4af37]/15 p-5 sm:p-6 rounded-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Select Feed Channel</label>
                <select
                  value={socialPlatform}
                  onChange={(e: any) => setSocialPlatform(e.target.value)}
                  className="w-full bg-[#001233] border border-[#d4af37]/20 text-white rounded-sm text-xs p-2 focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                >
                  <option value="twitter">Twitter / X Protocol</option>
                  <option value="instagram">Instagram Showcase</option>
                  <option value="linkedin">LinkedIn Professional Network</option>
                  <option value="youtube">YouTube Video Channel</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Optional Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={socialImageUrl}
                  onChange={(e) => setSocialImageUrl(e.target.value)}
                  className="w-full bg-[#001233] border border-[#d4af37]/20 text-white placeholder-gray-500 rounded-sm text-xs p-2 focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Broadcast Description Content</label>
              <textarea
                placeholder="Compose brief compliance advice or legal citation notes (markdown content permitted)..."
                rows={4}
                required
                value={socialContent}
                onChange={(e) => setSocialContent(e.target.value)}
                className="w-full bg-[#001233] border border-[#d4af37]/20 text-white placeholder-gray-500 rounded-sm text-xs p-2.5 focus:ring-1 focus:ring-[#d4af37] focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <p className="text-[11px] text-gray-400 font-sans italic">{socialStatus}</p>
              <button
                type="submit"
                className="px-5 py-2 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
              >
                Publish Broadcast Post
              </button>
            </div>
          </form>

          {/* List existing social posts to delete */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Active Social Stream History ({socialPosts.length})</h5>
            <div className="divide-y divide-[#d4af37]/10 bg-[#001a4d] border border-[#d4af37]/15 rounded-sm max-h-[300px] overflow-y-auto">
              {socialPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-sans">{post.username}</span>
                      <span className="text-[10px] font-mono text-gray-400">({post.platform})</span>
                    </div>
                    <p className="text-gray-300 line-clamp-2 pr-4">{post.content}</p>
                  </div>
                  <button
                    onClick={() => onDeleteSocialPost(post.id)}
                    className="p-1.5 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-500/15 rounded-sm transition-all cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {socialPosts.length === 0 && (
                <p className="p-4 text-center text-xs text-gray-400 italic">No social feeds inside stream database.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Newsletter broadcasts */}
      {activeTab === 'newsletters' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
                <Mail className="w-4 h-4" /> Supporter Broadcast Dispatcher
              </h4>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
                Launch notifications and detailed legal pamphlets to all <span className="text-white font-bold">{subscribers.length}</span> verified newsletter subscribers simultaneously.
              </p>
            </div>
            <div className="bg-[#001233] px-3 py-1.5 border border-[#d4af37]/25 text-[#d4af37] rounded-sm font-mono text-xs text-center">
              Active Pool: {subscribers.length} Emails
            </div>
          </div>

          <form onSubmit={handleCreateNewsletter} className="bg-[#001a4d] border border-[#d4af37]/15 p-5 sm:p-6 rounded-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Newsletter Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Legal Alert: Roadblock consent procedures updated!"
                  required
                  value={newsSubject}
                  onChange={(e) => setNewsSubject(e.target.value)}
                  className="w-full bg-[#001233] border border-[#d4af37]/20 text-white rounded-sm text-xs p-2 focus:ring-1 focus:ring-[#d4af37] focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Header Tag Badge</label>
                <input
                  type="text"
                  placeholder="e.g., Urgent Alert, Weekly Memo"
                  required
                  value={newsBadge}
                  onChange={(e) => setNewsBadge(e.target.value)}
                  className="w-full bg-[#001233] border border-[#d4af37]/20 text-white rounded-sm text-xs p-2 focus:ring-1 focus:ring-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Newsletter Contents (Body text)</label>
              <textarea
                placeholder="Draft full message text. Outline hearings, legal handbooks, or compliance trainings..."
                rows={6}
                required
                value={newsBody}
                onChange={(e) => setNewsBody(e.target.value)}
                className="w-full bg-[#001233] border border-[#d4af37]/20 text-white placeholder-gray-500 rounded-sm text-xs p-2.5 focus:ring-1 focus:ring-[#d4af37] focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <p className="text-[11px] text-gray-400 font-sans italic">{newsStatus}</p>
              <button
                type="submit"
                disabled={isSendingNews}
                className="px-6 py-2 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Transmit Broadcast Distribution</span>
              </button>
            </div>
          </form>

          {/* Historical Newsletters */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Transmitted Broadcast Archives ({newsletters.length})</h5>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {newsletters.map((news) => (
                <div key={news.id} className="p-4 bg-[#001233] border border-[#d4af37]/15 hover:border-[#d4af37]/35 rounded-sm space-y-2 transition-all">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <span className="px-2 py-0.5 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] font-sans font-bold text-[9px] uppercase rounded-sm mr-2">{news.badge}</span>
                      <span className="font-bold text-white text-xs sm:text-sm font-serif leading-snug">{news.subject}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#d4af37] font-bold">
                      Recipients: {news.recipientCount}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300 whitespace-pre-wrap font-sans font-light leading-relaxed">{news.body}</p>
                  <div className="text-right text-[8px] font-mono text-gray-400">
                    Transmission complete: {news.sentAt}
                  </div>
                </div>
              ))}
              {newsletters.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400 italic">No broadcast logs in archive history.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7.5 Supporter Emails management */}
      {activeTab === 'subs' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none mb-1">
              <Users className="w-4 h-4" /> Supporter Registry Database
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              Manage the directory of community members who have registered their email addresses. You can manually register new supporters or revoke old ones instantly.
            </p>
          </div>

          {/* Add Supporter Form */}
          <form onSubmit={handleManualAddSubscriber} className="bg-[#001a4d] border border-[#d4af37]/15 p-5 sm:p-6 rounded-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Add New Supporter Email</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="supporter-email@community.org"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="flex-grow bg-[#001233] border border-[#d4af37]/20 text-white rounded-sm text-xs p-2.5 focus:ring-1 focus:ring-[#d4af37] focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  disabled={isAddingSub}
                  className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#c39e2e] text-[#001a4d] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>{isAddingSub ? "Registering..." : "Add Supporter"}</span>
                </button>
              </div>
            </div>

            {subAddStatus && (
              <p className="text-[11px] text-[#d4af37] font-sans italic">{subAddStatus}</p>
            )}
          </form>

          {/* List existing subscribers */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Registered Supporters ({subscribers.length})</h5>
            <div className="divide-y divide-[#d4af37]/10 bg-[#001a4d] border border-[#d4af37]/15 rounded-sm max-h-[400px] overflow-y-auto">
              {subscribers.map((sub) => (
                <div key={sub.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white font-mono">{sub.email}</p>
                    <p className="text-[10px] text-gray-400 font-sans">Registered on {sub.subscribedAt || "Unknown date"}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${sub.email} from the supporters list?`)) {
                        onDeleteSubscriber(sub.id);
                      }
                    }}
                    className="p-1.5 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-500/15 rounded-sm transition-all cursor-pointer"
                    title="Remove supporter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {subscribers.length === 0 && (
                <p className="p-6 text-center text-xs text-gray-400 italic">No registered supporters inside the database.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Mail Alerts & Logs */}
      {activeTab === 'mails' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 leading-none">
                <Mail className="w-4 h-4" /> Live Question Notification Transmissions ({notificationLogs.length})
              </h4>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
                Whenever a user submits an anonymous question on the public chatbox, this mailbox logs the instant alert dispatches sent directly to <strong className="text-white">thecivicshield@gmail.com</strong>.
              </p>
            </div>
            
            <div className="text-[10px] font-mono text-[#d4af37] border border-[#d4af37]/20 px-2.5 py-1 bg-[#001233] uppercase">
              Target: thecivicshield@gmail.com
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Dispatched Mail Alerts Log ({notificationLogs.length})</h5>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {notificationLogs.map((log) => (
                <div key={log.id} className="p-4 bg-[#001233] border border-[#d4af37]/15 hover:border-[#d4af37]/35 rounded-sm space-y-3 transition-all">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-sm mr-2 font-bold ${
                        log.status === 'sent' 
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                          : log.status === 'failed' 
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                          : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      }`}>
                        {log.status === 'sent' ? 'SMTP DELIVERED' : log.status === 'failed' ? 'FAILED' : 'ETHEREAL SIMULATION'}
                      </span>
                      <span className="font-bold text-white text-xs sm:text-sm font-serif leading-snug">{log.subject}</span>
                    </div>
                    <div className="text-[9px] font-mono text-gray-400">
                      ID: {log.id} • {log.timestamp}
                    </div>
                  </div>

                  <div className="bg-[#001a4d] p-3 border border-[#d4af37]/10 rounded-sm">
                    <p className="text-[11px] text-gray-300 whitespace-pre-wrap font-sans font-light leading-relaxed">{log.body}</p>
                  </div>

                  {log.previewUrl && (
                    <div className="flex items-center gap-2 pt-1 border-t border-[#d4af37]/10">
                      <span className="text-[10px] font-mono text-gray-400">💡 Testing Sandbox:</span>
                      <a 
                        href={log.previewUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-[#d4af37] font-bold hover:underline hover:text-white transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Click here to open and read real sent email in Ethereal Sandbox Inbox!
                      </a>
                    </div>
                  )}

                  {!log.previewUrl && log.status === 'sent' && (
                    <div className="text-[10px] font-mono text-green-400 italic">
                      ✓ Delivered via custom SMTP configuration to candidate email server.
                    </div>
                  )}
                  
                  {log.status === 'failed' && (
                    <div className="text-[10px] font-mono text-red-400 italic">
                      ⚠ Delivery failed. Check server console or SMTP configuration credentials.
                    </div>
                  )}
                </div>
              ))}
              
              {notificationLogs.length === 0 && (
                <div className="text-center py-12 border border-[#d4af37]/10 bg-[#001233] p-6 rounded-sm space-y-2">
                  <p className="text-xs text-gray-400 italic">No mail alert notifications logged.</p>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Submit an anonymous question in the Chatbox below to instantly trigger a test notification email dispatch!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. Backup & Sync */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 leading-none font-sans">
              <Sparkles className="w-4 h-4 animate-pulse" /> 100% Automatic Background Sync Enabled
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans font-light">
              We have configured an <strong>invisible background synchronization engine</strong> for you! Whenever you unlock the manager panel and edit/update a blog post, change a metric, or add legal documents, your changes are cached automatically in your browser. <strong>If Render or your cloud container ever restarts and resets back to the checked-in default, our system will instantly detect the reset and push your latest changes back to the cloud database automatically in the background.</strong> You do not need to do anything—your work is safe!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Backup / Download */}
            <div className="bg-[#001233] p-5 border border-[#d4af37]/15 rounded-sm space-y-4 font-sans">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-[#d4af37] tracking-widest uppercase">OPTION 1</span>
                <h5 className="text-sm font-bold text-white uppercase font-serif">Export & Download Local Backup</h5>
                <p className="text-[11px] text-gray-400 font-sans font-light">
                  Download the current system configurations, layout blocks, blog posts, answered questions, and metrics as a single JSON file. You can commit this file as <code className="text-[#d4af37]">civic_data.json</code> in your GitHub repository root to make your changes permanent across future redeployments!
                </p>
              </div>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/campaign-data");
                    if (!res.ok) throw new Error("Failed to fetch current data.");
                    const data = await res.json();
                    
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                    const dlAnchor = document.createElement('a');
                    dlAnchor.setAttribute("href", dataStr);
                    dlAnchor.setAttribute("download", "civic_data.json");
                    document.body.appendChild(dlAnchor);
                    dlAnchor.click();
                    dlAnchor.remove();
                  } catch (e: any) {
                    alert("Export failed: " + e.message);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#d4af37] hover:bg-white text-[#001233] font-bold text-xs uppercase rounded-sm cursor-pointer transition-all duration-300 animate-in fade-in"
              >
                <Download className="w-4 h-4" /> Download backup file (civic_data.json)
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/campaign-data");
                    if (!res.ok) throw new Error("Failed to fetch current data.");
                    const dbCopy = await res.json();
                    await navigator.clipboard.writeText(JSON.stringify(dbCopy, null, 2));
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  } catch (e: any) {
                    alert("Copy failed: " + e.message);
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 font-bold text-xs uppercase rounded-sm cursor-pointer transition-all duration-300 border ${
                  copySuccess 
                    ? "bg-emerald-600 text-white border-emerald-500" 
                    : "bg-[#001a4d] text-[#d4af37] border-[#d4af37]/35 hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                }`}
              >
                <Copy className="w-3.5 h-3.5" /> 
                {copySuccess ? "✓ Copied to Clipboard!" : "Copy raw json to clipboard"}
              </button>

              <div className="p-3 bg-blue-950/20 border border-[#d4af37]/10 text-[10.5px] text-gray-300 leading-relaxed space-y-1.5 font-light">
                <span className="font-mono font-bold text-[#d4af37] block uppercase text-[8.5px]">💡 How to sync with GitHub permanently:</span>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the <code className="text-white">civic_data.json</code> backup above.</li>
                  <li>In your GitHub project, drag and replace the old file at the root.</li>
                  <li>Commit and push the changes to your <code className="text-white">main</code> folder branch.</li>
                  <li>Render will compile, deploy automatically, and remember every edit!</li>
                </ol>
              </div>
            </div>

            {/* Column 2: Restore / Upload */}
            <div className="bg-[#001233] p-5 border border-[#d4af37]/15 rounded-sm space-y-4 font-sans">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-[#d4af37] tracking-widest uppercase">OPTION 2</span>
                <h5 className="text-sm font-bold text-white uppercase font-serif">Upload / Restore Data Backup</h5>
                <p className="text-[11px] text-gray-400 font-sans font-light">
                  If the website redeployed and reset, you can instantly restore everything from a previously downloaded backup file without having to redo any of your manual edits.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Select Backup JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        try {
                          const parsed = JSON.parse(event.target?.result as string);
                          
                          // Basic check
                          if (!parsed.blocks || (!parsed.blogPosts && !parsed.evidence)) {
                            alert("Invalid backup file format. Double check it is a valid backup JSON.");
                            return;
                          }

                          if (confirm("Are you sure you want to restore the entire Campaign Database from this file? All current unsaved changes will be overridden.")) {
                            const response = await fetch("/api/import-campaign-data", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(parsed)
                            });
                            
                            const resJson = await response.json();
                            if (response.ok && resJson.success) {
                              alert("✓ Campaign database successfully restored! Reloading page to apply updates...");
                              window.location.reload();
                            } else {
                              alert("Failed to restore: " + (resJson.error || "Unknown error"));
                            }
                          }
                        } catch (err: any) {
                          alert("Error parsing backup JSON file: " + err.message);
                        }
                      };
                      reader.readAsText(file);
                    }}
                    className="w-full text-xs text-gray-300 font-mono file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[11px] file:font-bold file:uppercase file:bg-[#d4af37]/15 file:text-[#d4af37] hover:file:bg-[#d4af37]/25 file:cursor-pointer bg-[#001a4d] p-2 border border-[#d4af37]/15 rounded-sm"
                  />
                </label>

                <div className="pt-2">
                  <span className="text-[9.5px] font-mono uppercase text-[#d4af37] block mb-1">Or Paste Backup JSON Content</span>
                  <textarea
                    placeholder='Paste raw JSON content here {"blocks": [...], ...}'
                    id="raw_json_input"
                    rows={4}
                    className="w-full text-xs font-mono bg-[#001a4d] border border-[#d4af37]/15 p-2.5 rounded-sm text-gray-200 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    onClick={async () => {
                      const area = document.getElementById("raw_json_input") as HTMLTextAreaElement;
                      if (!area || !area.value.trim()) {
                        alert("Paste JSON contents before submitting.");
                        return;
                      }
                      try {
                        const parsed = JSON.parse(area.value);
                        if (!parsed.blocks) {
                          alert("Invalid JSON data. Layout blocks list ('blocks') missing.");
                          return;
                        }
                        if (confirm("Confirm restoral of copy-pasted configuration data?")) {
                          const response = await fetch("/api/import-campaign-data", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(parsed)
                          });
                          
                          const resJson = await response.json();
                          if (response.ok && resJson.success) {
                            alert("✓ Campaign database successfully restored! Reloading page...");
                            window.location.reload();
                          } else {
                            alert("Failed: " + (resJson.error || "Unknown error"));
                          }
                        }
                      } catch (err: any) {
                        alert("Syntax mismatch. Invalid JSON format: " + err.message);
                      }
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#001a4d] hover:bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs uppercase rounded-sm border border-[#d4af37]/25 cursor-pointer transition-all duration-300"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Restore pasted JSON data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Option 3: GitHub Direct Integration */}
          <div className="bg-[#001233] p-6 border border-[#d4af37]/20 rounded-sm space-y-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/15 pb-4">
              <div className="space-y-1 text-left">
                <span className="text-[8.5px] font-mono text-[#d4af37] tracking-widest uppercase">OPTION 3 (ADVANCED)</span>
                <h5 className="text-base font-bold text-white uppercase font-serif flex items-center gap-2">
                  <Github className="w-5 h-5 text-[#d4af37]" /> Direct GitHub Repository Sync
                </h5>
                <p className="text-[11px] text-gray-400 font-sans font-light">
                  Authenticate your GitHub account and instantly push your website changes (<code className="text-white">civic_data.json</code>) back to your GitHub repository in one click!
                </p>
              </div>
              {gitUser ? (
                <div className="flex items-center gap-3 bg-[#001a4d] p-2 border border-[#d4af37]/20 rounded-sm">
                  <img src={gitUser.avatarUrl} alt="GitHub avatar" className="w-8 h-8 rounded-full border border-[#d4af37]/30" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none">@{gitUser.username}</p>
                    <p className="text-[10px] text-emerald-400 font-light mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                    </p>
                  </div>
                  <button
                    onClick={handleDisconnectGit}
                    className="ml-2 p-1.5 hover:bg-red-950/40 text-gray-400 hover:text-red-400 rounded-sm transition-colors cursor-pointer"
                    title="Disconnect GitHub Account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConnectOAuth}
                    className="flex items-center gap-2 py-2 px-4 bg-white hover:bg-gray-100 text-[#001233] font-bold text-xs uppercase rounded-sm cursor-pointer transition-all duration-300"
                  >
                    <Github className="w-4 h-4" /> OAuth Connect
                  </button>
                </div>
              )}
            </div>

            {gitSyncStatus && (
              <div className={`p-3 text-xs text-left rounded-sm border ${
                gitSyncStatus.includes("✓") 
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
                  : gitSyncStatus.includes("Failed") || gitSyncStatus.includes("failed") || gitSyncStatus.includes("validation failed")
                    ? "bg-red-950/40 border-red-500/30 text-red-400"
                    : "bg-[#001a4d] border-[#d4af37]/30 text-gray-300"
              } flex items-start gap-2.5`}>
                {gitSyncStatus.includes("✓") ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : gitSyncStatus.includes("Failed") || gitSyncStatus.includes("failed") || gitSyncStatus.includes("validation failed") ? (
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <RefreshCw className="w-4 h-4 animate-spin mt-0.5 flex-shrink-0 text-[#d4af37]" />
                )}
                <div className="space-y-1">
                  <p className="leading-relaxed whitespace-pre-line">{gitSyncStatus}</p>
                  {gitSyncSuccessUrl && (
                    <a 
                      href={gitSyncSuccessUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-[#d4af37] hover:underline font-bold mt-1 text-[11px]"
                    >
                      View Commit on GitHub <Download className="w-3 h-3 rotate-180" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {!gitToken ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
                <div className="space-y-3 bg-[#001a4d]/50 p-4 border border-[#d4af37]/10 rounded-sm">
                  <h6 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Method A: Quick Connect
                  </h6>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                    Direct and fast. Click the button below to sign in with GitHub using the secure OAuth consent workflow.
                  </p>
                  <button
                    onClick={handleConnectOAuth}
                    className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-white text-[#001233] font-bold text-xs uppercase rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Github className="w-4 h-4" /> Connect GitHub Account
                  </button>
                </div>

                <div className="space-y-3 bg-[#001a4d]/50 p-4 border border-[#d4af37]/10 rounded-sm">
                  <h6 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#d4af37]" /> Method B: Personal Access Token (PAT)
                  </h6>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                    Generate a token in your <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] underline">GitHub Settings</a> with the <strong>'repo'</strong> scope checked, then paste it here:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      value={patInput}
                      onChange={(e) => setPatInput(e.target.value)}
                      className="flex-1 bg-[#001a4d] border border-[#d4af37]/20 p-2 text-xs font-mono rounded-sm text-gray-100 focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      onClick={handleConnectPAT}
                      className="py-2 px-3 bg-[#001a4d] hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] font-bold text-xs uppercase rounded-sm cursor-pointer transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-[#d4af37]/10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select Repo */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#d4af37] uppercase">1. Target Repository</label>
                    {isFetchingRepos ? (
                      <div className="w-full bg-[#001a4d] border border-[#d4af37]/20 p-2 text-xs rounded-sm text-gray-400 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" /> Loading repos...
                      </div>
                    ) : gitRepos.length > 0 ? (
                      <select
                        value={selectedRepo}
                        onChange={(e) => {
                          setSelectedRepo(e.target.value);
                          const chosen = gitRepos.find(r => r.fullName === e.target.value);
                          if (chosen) {
                            setGitBranch(chosen.defaultBranch || "main");
                          }
                        }}
                        className="w-full bg-[#001a4d] border border-[#d4af37]/25 p-2.5 text-xs rounded-sm text-gray-200 focus:outline-none focus:border-[#d4af37]"
                      >
                        {gitRepos.map(repo => (
                          <option key={repo.fullName} value={repo.fullName}>
                            {repo.fullName} {repo.private ? "🔒" : "🌐"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="owner/repository"
                          value={selectedRepo}
                          onChange={(e) => setSelectedRepo(e.target.value)}
                          className="w-full bg-[#001a4d] border border-[#d4af37]/25 p-2 text-xs rounded-sm text-gray-200 focus:outline-none"
                        />
                        <p className="text-[9px] text-gray-400">No repositories found automatically. Type owner/repo manually.</p>
                      </div>
                    )}
                  </div>

                  {/* Select Branch */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#d4af37] uppercase">2. Branch Name</label>
                    <input
                      type="text"
                      placeholder="main"
                      value={gitBranch}
                      onChange={(e) => setGitBranch(e.target.value)}
                      className="w-full bg-[#001a4d] border border-[#d4af37]/25 p-2.5 text-xs rounded-sm text-gray-200 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* File Target Path */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#d4af37] uppercase">3. Target File Name</label>
                    <input
                      type="text"
                      placeholder="civic_data.json"
                      value={gitPath}
                      onChange={(e) => setGitPath(e.target.value)}
                      className="w-full bg-[#001a4d] border border-[#d4af37]/25 p-2.5 text-xs rounded-sm text-gray-200 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSyncToGitHub}
                    disabled={isGitSyncing || !selectedRepo}
                    className={`w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors`}
                  >
                    {isGitSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Synchronizing & Committing...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" /> Push civic_data.json to GitHub Repository 🛡️
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
