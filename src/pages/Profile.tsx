import { useState } from "react";
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
  Award,
  Star,
  TrendingUp,
  FileText,
  CheckCircle,
  Calendar,
  Building,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
}

interface Skill {
  name: string;
  level: number;
  endorsed: number;
}

const experiences: Experience[] = [
  {
    id: "1",
    role: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    period: "Jan 2022 - Present",
    current: true,
    description: "Leading frontend architecture and mentoring junior developers. Building scalable React applications with TypeScript.",
  },
  {
    id: "2",
    role: "Frontend Developer",
    company: "StartupX",
    location: "New York, NY",
    period: "Jun 2019 - Dec 2021",
    current: false,
    description: "Developed user-facing features and improved application performance by 40%.",
  },
  {
    id: "3",
    role: "Junior Developer",
    company: "WebAgency",
    location: "Boston, MA",
    period: "Aug 2017 - May 2019",
    current: false,
    description: "Built responsive websites and learned modern JavaScript frameworks.",
  },
];

const skills: Skill[] = [
  { name: "React", level: 95, endorsed: 42 },
  { name: "TypeScript", level: 90, endorsed: 38 },
  { name: "Node.js", level: 80, endorsed: 25 },
  { name: "System Design", level: 70, endorsed: 18 },
  { name: "GraphQL", level: 75, endorsed: 22 },
  { name: "AWS", level: 65, endorsed: 15 },
];

const achievements = [
  { icon: Award, label: "Top Contributor 2024", date: "Mar 2024" },
  { icon: Star, label: "React Certified Pro", date: "Jan 2024" },
  { icon: TrendingUp, label: "Fastest Growing Profile", date: "Dec 2023" },
  { icon: CheckCircle, label: "100 Applications Milestone", date: "Nov 2023" },
];

const profileStats = [
  { label: "Profile Views", value: 1247, change: "+23%" },
  { label: "Search Appearances", value: 89, change: "+15%" },
  { label: "Recruiter Contacts", value: 12, change: "+8%" },
  { label: "Skills Endorsed", value: 160, change: "+31%" },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "experience" | "skills">("overview");

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
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-foreground/20 flex items-center justify-center">
                        <User className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  </motion.div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <Camera className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
                    Alex Johnson
                  </h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    Senior Frontend Developer at TechCorp Inc.
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      alex@example.com
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined Mar 2023
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <AnimatedButton
                    variant={isEditing ? "hero" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-6">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: LinkIcon, href: "#", label: "Portfolio" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {profileStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center">
                <p className="text-2xl font-display font-bold mb-1">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <span className="text-xs text-green-500 font-medium">{stat.change}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "experience", label: "Experience" },
            { id: "skills", label: "Skills" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* About */}
                <GlassCard>
                  <h2 className="text-xl font-display font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Passionate frontend developer with 7+ years of experience building 
                    scalable web applications. Specialized in React, TypeScript, and modern 
                    JavaScript frameworks. Currently leading frontend architecture at TechCorp 
                    and mentoring junior developers. Looking for opportunities to transition 
                    into a Tech Lead role where I can combine my technical expertise with 
                    leadership skills.
                  </p>
                </GlassCard>

                {/* Recent Activity */}
                <GlassCard>
                  <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {[
                      { action: "Completed course", item: "Advanced TypeScript Patterns", time: "2 hours ago" },
                      { action: "Applied to", item: "Senior Developer at Google", time: "1 day ago" },
                      { action: "Updated skill", item: "System Design", time: "3 days ago" },
                      { action: "Earned badge", item: "React Pro Certification", time: "1 week ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                            <span className="font-medium">{activity.item}</span>
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === "experience" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {experiences.map((exp, index) => (
                  <GlassCard key={exp.id}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-foreground/20 flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{exp.role}</h3>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          {exp.current && (
                            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{exp.period}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GlassCard>
                  <h2 className="text-xl font-display font-semibold mb-6">Technical Skills</h2>
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {skill.endorsed} endorsements
                            </span>
                          </div>
                          <span className="text-sm font-medium text-primary">{skill.level}%</span>
                        </div>
                        <div className="h-3 bg-accent rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
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

            {/* Achievements */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-accent/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent-foreground/20 flex items-center justify-center">
                      <achievement.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{achievement.label}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Career Goals */}
            <GlassCard glow glowColor="purple">
              <h3 className="font-semibold mb-4">Career Goals</h3>
              <div className="space-y-3">
                {[
                  { goal: "Become Tech Lead", progress: 70 },
                  { goal: "Master System Design", progress: 45 },
                  { goal: "AWS Certification", progress: 30 },
                ].map((item) => (
                  <div key={item.goal}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.goal}</span>
                      <span className="text-primary">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
