import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Unlock, Settings, Plus, Edit, Trash2, Save, 
  LogOut, X, Globe, Github, PlusCircle, Check, Loader2, 
  Database, AlertTriangle, Eye, ShieldAlert, Mail, UserPlus
} from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { setDoc, doc, collection, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Project, Profile, Experience } from "../types";
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_EXPERIENCES } from "../data";

interface CMSPanelProps {
  onClose: () => void;
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  onRefreshData: () => Promise<void>;
  onSeedDatabase: () => Promise<void>;
}

export default function CMSPanel({
  onClose,
  profile,
  projects,
  experiences,
  onRefreshData,
  onSeedDatabase,
}: CMSPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Tabs within CMS
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "seeder">("profile");

  // Form states - Profile
  const [profName, setProfName] = useState(profile.name);
  const [profTitle, setProfTitle] = useState(profile.title);
  const [profAbout, setProfAbout] = useState(profile.aboutMe);
  const [profAvatar, setProfAvatar] = useState(profile.avatarUrl);
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profGithub, setProfGithub] = useState(profile.github || "");
  const [profLinkedin, setProfLinkedin] = useState(profile.linkedin || "");
  const [profTwitter, setProfTwitter] = useState(profile.twitter || "");
  const [newSkill, setNewSkill] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>(profile.skills);

  // Form states - Projects Add/Edit Form
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCategory, setProjCategory] = useState("Web App");
  const [projImg, setProjImg] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projGit, setProjGit] = useState("");
  const [newProjTag, setNewProjTag] = useState("");
  const [projTagsList, setProjTagsList] = useState<string[]>([]);

  // Monitor Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Update form values when profile prop updates
  useEffect(() => {
    if (profile) {
      setProfName(profile.name);
      setProfTitle(profile.title);
      setProfAbout(profile.aboutMe);
      setProfAvatar(profile.avatarUrl);
      setProfEmail(profile.email);
      setProfGithub(profile.github || "");
      setProfLinkedin(profile.linkedin || "");
      setProfTwitter(profile.twitter || "");
      setSkillsList(profile.skills);
    }
  }, [profile]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setActionLoading(true);

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Logged in successfully!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Admin registered and logged in successfully!");
      }
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setActionLoading(true);
    setSuccessMsg("");

    try {
      const updatedProfile: Profile = {
        name: profName,
        title: profTitle,
        aboutMe: profAbout,
        avatarUrl: profAvatar,
        skills: skillsList,
        email: profEmail,
        github: profGithub || undefined,
        linkedin: profLinkedin || undefined,
        twitter: profTwitter || undefined,
      };

      // Write direct to profile/settings singleton
      await setDoc(doc(db, "profile", "settings"), updatedProfile);
      setSuccessMsg("Profile synced to cloud successfully.");
      await onRefreshData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to update profile. Ensure you are authorized.");
    } finally {
      setActionLoading(false);
    }
  };

  // Add Project Submit
  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc || !projCategory) {
      setAuthError("Please fill in all mandatory fields.");
      return;
    }

    setAuthError("");
    setActionLoading(true);

    try {
      const pid = editingProject?.id || projTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      const newProject: Project = {
        id: pid,
        title: projTitle,
        description: projDesc,
        category: projCategory,
        imageUrl: projImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
        demoUrl: projDemo || undefined,
        githubUrl: projGit || undefined,
        tags: projTagsList,
        createdAt: editingProject?.createdAt || Math.floor(Date.now() / 1000),
      };

      await setDoc(doc(db, "projects", pid), newProject);
      setSuccessMsg(editingProject ? "Project updated successfully!" : "Project created successfully!");
      setIsProjectFormOpen(false);
      resetProjectForm();
      await onRefreshData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Write failed. Ensure you are signed in as jowosantae@gmail.com.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Project Action Trigger
  const handleEditProjectClick = (proj: Project) => {
    setEditingProject(proj);
    setProjTitle(proj.title);
    setProjDesc(proj.description);
    setProjCategory(proj.category);
    setProjImg(proj.imageUrl);
    setProjDemo(proj.demoUrl || "");
    setProjGit(proj.githubUrl || "");
    setProjTagsList(proj.tags);
    setIsProjectFormOpen(true);
  };

  // Delete Project Action
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to remove this project? This is irreversible.")) return;

    setAuthError("");
    setActionLoading(true);

    try {
      await deleteDoc(doc(db, "projects", id));
      setSuccessMsg("Project removed from cloud.");
      await onRefreshData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Deletion failed. Ensure authorized credentials.");
    } finally {
      setActionLoading(false);
    }
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjTitle("");
    setProjDesc("");
    setProjCategory("Web App");
    setProjImg("");
    setProjDemo("");
    setProjGit("");
    setProjTagsList([]);
  };

  // Skill Managers
  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  // Project Tag Managers
  const handleAddProjectTag = () => {
    if (newProjTag.trim() && !projTagsList.includes(newProjTag.trim())) {
      setProjTagsList([...projTagsList, newProjTag.trim()]);
      setNewProjTag("");
    }
  };

  const handleRemoveProjectTag = (tag: string) => {
    setProjTagsList(projTagsList.filter((t) => t !== tag));
  };

  // Direct Seeding Trigger
  const handleSeedAction = async () => {
    setActionLoading(true);
    setAuthError("");
    setSuccessMsg("");
    try {
      await onSeedDatabase();
      setSuccessMsg("Database successfully populated with high-fidelity records!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: any) {
      setAuthError(err.message || "Seeding failed. Ensure signed in as jowosantae@gmail.com.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      id="cms-portal-modal"
      className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        id="cms-panel-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header Block */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Settings size={20} className="animate-spin duration-10000" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">
                Control Center CMS
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Real-Time Portfolio Sync
              </p>
            </div>
          </div>

          <button
            id="btn-close-cms"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Alerts Banner */}
        {authError && (
          <div className="px-6 py-3 bg-red-500/10 border-b border-red-500/20 text-red-500 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle size={14} className="shrink-0 animate-pulse" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2 font-mono">
            <Check size={14} className="shrink-0 animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
              Authorizing link...
            </span>
          </div>
        ) : !user ? (
          /* AUTHENTICATION PORTAL (NOT LOGGED IN) */
          <div className="flex-grow overflow-y-auto px-6 py-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Lock Badge */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 shadow-glow-cyan mb-4">
                  <Lock size={28} className="animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100 mb-2">
                  Portal Encrypted
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                  Sign in below to authenticate. To modify data, please use the owner email{" "}
                  <span className="font-mono text-cyan-500 dark:text-cyan-400 font-semibold">
                    jowosantae@gmail.com
                  </span>.
                </p>
              </div>

              {/* Form panel */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                    Credentials Email
                  </label>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., jowosantae@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                    Access Passcode / Password
                  </label>
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  id="btn-auth-submit"
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-display font-bold text-sm shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : authMode === "login" ? (
                    <>
                      <Unlock size={16} />
                      Unlock Console
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Register Admin Account
                    </>
                  )}
                </button>
              </form>

              {/* Toggle signup/signin link */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                  className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  {authMode === "login"
                    ? "Need a new admin credentials block? Register here"
                    : "Already registered? Go back to login screen"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CMS CONSOLE (LOGGED IN) */
          <>
            {/* Dashboard Subheader Navigation Tabs */}
            <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/30 dark:bg-slate-900/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "projects"
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Manage Projects ({projects.length})
                </button>

                <button
                  onClick={() => setActiveTab("seeder")}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "seeder"
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-cyan-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Database Setup / Seed
                </button>
              </div>

              {/* Signed user info footer */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                  Terminal: {user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/15 text-xs font-mono font-semibold transition-all cursor-pointer"
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Dashboard Content Panel */}
            <div className="flex-grow overflow-y-auto p-6">
              {/* TAB 1: EDIT PROFILE BIO & SOCIALS */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Notice banner for wrong user */}
                  {user.email !== "jowosantae@gmail.com" && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2 font-mono">
                      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>Security Warning:</strong> Your current signed-in session email ({user.email}) does not match the hardcoded security rules email (jowosantae@gmail.com). Changes might be blocked by Firestore Rules on submission.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        required
                        value={profTitle}
                        onChange={(e) => setProfTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        Biography / About Me
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={profAbout}
                        onChange={(e) => setProfAbout(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        Holographic Photo URL
                      </label>
                      <input
                        type="text"
                        required
                        value={profAvatar}
                        onChange={(e) => setProfAvatar(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        Public Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        value={profEmail}
                        onChange={(e) => setProfEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        GitHub Profile Link
                      </label>
                      <input
                        type="text"
                        value={profGithub}
                        onChange={(e) => setProfGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-1.5">
                        LinkedIn Profile Link
                      </label>
                      <input
                        type="text"
                        value={profLinkedin}
                        onChange={(e) => setProfLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Skills tags sub-section */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-400 uppercase mb-2">
                      Interactive Skills Matrix ({skillsList.length})
                    </label>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="Add capability..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        className="flex-grow px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500/20 cursor-pointer"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:scale-[1.01] text-white font-display font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={16} />
                          Sync Profile Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PROJECTS MANAGER */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  {/* Form toggle row */}
                  {!isProjectFormOpen ? (
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-4">
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                        Archived Portfolio Elements
                      </p>
                      <button
                        onClick={() => {
                          resetProjectForm();
                          setIsProjectFormOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20 font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        Add New Installation
                      </button>
                    </div>
                  ) : (
                    /* Project creation/editing form */
                    <form onSubmit={handleSaveProjectSubmit} className="p-5 border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                          {editingProject ? `Edit: ${editingProject.title}` : "New Project Installation"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProjectFormOpen(false);
                            resetProjectForm();
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={projTitle}
                            onChange={(e) => setProjTitle(e.target.value)}
                            placeholder="e.g. Plasma Synth"
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Category / Domain *
                          </label>
                          <select
                            value={projCategory}
                            onChange={(e) => setProjCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Web App">Web App</option>
                            <option value="Creative Dev">Creative Dev</option>
                            <option value="AI & ML">AI & ML</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Project Description *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={projDesc}
                            onChange={(e) => setProjDesc(e.target.value)}
                            placeholder="Describe what the system does..."
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Hero Image URL (Unsplash or similar)
                          </label>
                          <input
                            type="text"
                            value={projImg}
                            onChange={(e) => setProjImg(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Live Application Link
                          </label>
                          <input
                            type="text"
                            value={projDemo}
                            onChange={(e) => setProjDemo(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Source Code Link (GitHub)
                          </label>
                          <input
                            type="text"
                            value={projGit}
                            onChange={(e) => setProjGit(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {/* Project Tags */}
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
                            Technologies & Stack ({projTagsList.length})
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {projTagsList.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-[10px] font-mono text-slate-600 dark:text-slate-400"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectTag(tag)}
                                  className="hover:text-red-500 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 max-w-xs">
                            <input
                              type="text"
                              placeholder="e.g. React"
                              value={newProjTag}
                              onChange={(e) => setNewProjTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddProjectTag();
                                }
                              }}
                              className="flex-grow px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleAddProjectTag}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProjectFormOpen(false);
                            resetProjectForm();
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-5 py-2 rounded-lg bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                          Save Module
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of projects to edit/delete */}
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                          />
                          <div>
                            <h5 className="font-display font-semibold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                              {project.title}
                            </h5>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProjectClick(project)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SEEDER UTILITY */}
              {activeTab === "seeder" && (
                <div className="space-y-6 max-w-xl mx-auto py-6">
                  <div className="p-6 rounded-2xl border border-dashed border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-500/5 text-center space-y-4">
                    <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-500 shadow-glow-cyan mb-2">
                      <Database size={24} className="animate-bounce" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                      Cloud Sync & DB Initialization
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
                      Click the button below to populate your Firestore database collections with the default portfolio records. This will initialize the profileSettings and add high-fidelity mock installations for instant layout preview.
                    </p>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleSeedAction}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:scale-[1.01] text-white font-display font-semibold text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Database size={14} />
                          Seed Default Data to Cloud
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
