import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Edit3,
  Camera,
  Save,
  FileText,
  Calendar,
  ArrowRight,
  LogOut,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/integrations/firebase/auth";
import { getUserProfile, createUserProfile, updateUserProfile } from "@/integrations/firebase/firestore";

interface ProfileData {
  title: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  portfolio: string;
  skills: string[];
}

const defaultProfile: ProfileData = {
  title: "",
  bio: "",
  location: "",
  github: "",
  linkedin: "",
  twitter: "",
  portfolio: "",
  skills: [],
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editForm, setEditForm] = useState<ProfileData>(defaultProfile);
  const [newSkill, setNewSkill] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Load profile from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.uid);
        if (data) {
          const loaded: ProfileData = {
            title: data.title || "",
            bio: data.bio || "",
            location: data.location || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            portfolio: data.portfolio || "",
            skills: data.skills || [],
          };
          setProfile(loaded);
          setEditForm(loaded);
        } else {
          // Create initial profile
          const initial: ProfileData = {
            ...defaultProfile,
            title: "",
            bio: "",
          };
          await createUserProfile(user.uid, {
            ...initial,
            displayName: user.displayName || "",
            email: user.email || "",
          });
          setProfile(initial);
          setEditForm(initial);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Load avatar from localStorage
    const saved = localStorage.getItem(`avatar_${user.uid}`);
    if (saved) setAvatarPreview(saved);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, editForm);
      setProfile(editForm);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      localStorage.setItem(`avatar_${user.uid}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !editForm.skills.includes(trimmed)) {
      setEditForm({ ...editForm, skills: [...editForm.skills, trimmed] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skill) });
  };

  const avatarUrl = avatarPreview || user?.photoURL;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="relative overflow-hidden">
            {/* Cover Image */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary via-accent-foreground to-primary opacity-20" />

            <div className="relative pt-16 pb-4">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6">
                {/* Avatar */}
                <div className="relative -mt-20">
                  <motion.div
                    className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground p-1"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-foreground/20 flex items-center justify-center">
                          <User className="w-16 h-16 text-primary" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
                    {user?.displayName || "Your Name"}
                  </h1>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Your job title (e.g. Frontend Developer)"
                      className="w-full max-w-md px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm focus:border-primary outline-none mb-2"
                    />
                  ) : (
                    <p className="text-lg text-muted-foreground mb-2">
                      {profile.title || "Add your job title"}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </span>
                    {isEditing ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="Your location"
                          className="px-2 py-1 rounded bg-accent/50 border border-border text-sm focus:border-primary outline-none w-36"
                        />
                      </span>
                    ) : profile.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <AnimatedButton variant="hero" onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </AnimatedButton>
                      <AnimatedButton variant="ghost" onClick={() => { setEditForm(profile); setIsEditing(false); }}>
                        Cancel
                      </AnimatedButton>
                    </>
                  ) : (
                    <AnimatedButton variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </AnimatedButton>
                  )}
                  <AnimatedButton variant="ghost" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </div>

              {/* Social Links */}
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {[
                    { key: "github" as const, icon: Github, label: "GitHub URL", placeholder: "https://github.com/username" },
                    { key: "linkedin" as const, icon: Linkedin, label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
                    { key: "twitter" as const, icon: Twitter, label: "Twitter URL", placeholder: "https://twitter.com/username" },
                    { key: "portfolio" as const, icon: LinkIcon, label: "Portfolio URL", placeholder: "https://yoursite.com" },
                  ].map((social) => (
                    <div key={social.key} className="flex items-center gap-2">
                      <social.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <input
                        type="url"
                        value={editForm[social.key]}
                        onChange={(e) => setEditForm({ ...editForm, [social.key]: e.target.value })}
                        placeholder={social.placeholder}
                        className="flex-1 px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm focus:border-primary outline-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-6">
                  {[
                    { icon: Github, href: profile.github, label: "GitHub" },
                    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
                    { icon: Twitter, href: profile.twitter, label: "Twitter" },
                    { icon: LinkIcon, href: profile.portfolio, label: "Portfolio" },
                  ].filter(s => s.href).map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                  {!profile.github && !profile.linkedin && !profile.twitter && !profile.portfolio && (
                    <p className="text-sm text-muted-foreground">Click "Edit Profile" to add your social links</p>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <GlassCard>
              <h2 className="text-xl font-display font-semibold mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself, your experience, goals, and what you're looking for..."
                  className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-accent/50 border border-border text-sm focus:border-primary outline-none resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || "Click \"Edit Profile\" to add a bio about yourself."}
                </p>
              )}
            </GlassCard>

            {/* Skills */}
            <GlassCard>
              <h2 className="text-xl font-display font-semibold mb-4">Skills</h2>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      placeholder="Add a skill (e.g. React, Python, Project Management)"
                      className="flex-1 px-3 py-2 rounded-lg bg-accent/50 border border-border text-sm focus:border-primary outline-none"
                    />
                    <AnimatedButton variant="outline" size="sm" onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        layout
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet. Click "Edit Profile" to add your skills.</p>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Section */}
            <GlassCard glow glowColor="blue">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Resume Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered insights from your resume including skill extraction and career recommendations.
              </p>
              <Link to="/dashboard/resume">
                <AnimatedButton variant="hero" className="w-full">
                  Analyze Resume
                  <ArrowRight className="w-4 h-4" />
                </AnimatedButton>
              </Link>
            </GlassCard>

            {/* Quick Info */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.title || "No title set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.location || "No location set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user?.email || ""}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recently"}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
