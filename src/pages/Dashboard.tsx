import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Briefcase, Target, Zap, ArrowUpRight, Sparkles, BookOpen, Clock, User, FileText, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/integrations/firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfileData).catch(() => { });
    }
  }, [user]);

  // Calculate dynamic stats from profile
  const skillCount = profileData?.skills?.length || 0;
  const hasTitle = !!profileData?.title;
  const hasBio = !!profileData?.bio;
  const hasLocation = !!profileData?.location;
  const hasSocials = !!(profileData?.github || profileData?.linkedin || profileData?.twitter || profileData?.portfolio);
  const profileCompletion = Math.min(100, [
    !!user?.displayName,
    !!user?.email,
    hasTitle,
    hasBio,
    hasLocation,
    hasSocials,
    skillCount > 0,
    skillCount >= 3,
  ].filter(Boolean).length * 12.5);

  const daysActive = user?.metadata?.creationTime
    ? Math.max(1, Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / 86400000))
    : 1;

  const quickStats = [
    { icon: Target, label: "Profile Completion", value: Math.round(profileCompletion), suffix: "%", color: "from-primary to-accent-foreground" },
    { icon: Briefcase, label: "Skills Added", value: skillCount, suffix: "", color: "from-accent-foreground to-primary" },
    { icon: BookOpen, label: "Days Active", value: daysActive, suffix: "", color: "from-primary via-accent-foreground to-primary" },
    { icon: Clock, label: "Resume Analyses", value: 0, suffix: "", color: "from-accent-foreground to-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Welcome back, <GradientText>{firstName}</GradientText>! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your career journey today.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-display font-bold">
                    {stat.value}{stat.suffix}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Completeness */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Profile Readiness</h2>
                <Link to="/dashboard/profile">
                  <AnimatedButton variant="ghost" size="sm">
                    Edit Profile <ArrowUpRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Radial Progress */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: profileCompletion / 100 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent-foreground))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold gradient-text-hero">{Math.round(profileCompletion)}</span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="flex-1 space-y-3">
                  {[
                    { label: "Display name set", done: !!user?.displayName },
                    { label: "Job title added", done: hasTitle },
                    { label: "Bio written", done: hasBio },
                    { label: "Location added", done: hasLocation },
                    { label: "Social links added", done: hasSocials },
                    { label: "3+ skills added", done: skillCount >= 3 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? "border-green-500 bg-green-500/20" : "border-muted-foreground/30"}`}>
                        {item.done && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="h-full" glow glowColor="purple">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-display font-semibold">AI Insights</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-sm leading-relaxed">
                    Complete your profile to get{" "}
                    <span className="font-semibold text-primary">personalized career recommendations</span> from our AI mentor.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-sm leading-relaxed">
                    Upload your resume for{" "}
                    <span className="font-semibold text-primary">AI-powered skill analysis</span> and
                    job matching.
                  </p>
                </div>
              </div>

              <Link to="/dashboard/mentor" className="block mt-6">
                <AnimatedButton variant="hero" className="w-full">
                  Chat with AI Mentor
                </AnimatedButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom Grid — Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Link to="/dashboard/resume">
              <GlassCard className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Resume Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">Upload your resume for AI-powered skill extraction and career recommendations.</p>
              </GlassCard>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Link to="/dashboard/jobs">
              <GlassCard className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-foreground to-primary flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Search Jobs</h3>
                </div>
                <p className="text-sm text-muted-foreground">Browse real job listings from top companies across the world.</p>
              </GlassCard>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Link to="/dashboard/mentor">
              <GlassCard className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-accent-foreground to-primary flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">AI Career Mentor</h3>
                </div>
                <p className="text-sm text-muted-foreground">Get personalized career advice, interview prep, and learning guidance.</p>
              </GlassCard>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
