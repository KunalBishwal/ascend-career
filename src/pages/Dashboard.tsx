import { motion } from "framer-motion";
import { TrendingUp, Briefcase, Target, Zap, ArrowUpRight, Sparkles, BookOpen, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";

const quickStats = [
  { icon: Target, label: "Career Score", value: 85, suffix: "/100", color: "from-primary to-accent-foreground" },
  { icon: Briefcase, label: "Job Matches", value: 24, suffix: "", color: "from-accent-foreground to-primary" },
  { icon: BookOpen, label: "Skills to Learn", value: 6, suffix: "", color: "from-primary via-accent-foreground to-primary" },
  { icon: Clock, label: "Days Active", value: 127, suffix: "", color: "from-accent-foreground to-primary" },
];

const recentJobs = [
  { title: "Senior Frontend Developer", company: "TechCorp", match: 95, salary: "$150k - $180k" },
  { title: "Full Stack Engineer", company: "StartupX", match: 88, salary: "$130k - $160k" },
  { title: "React Lead Developer", company: "InnovateTech", match: 82, salary: "$140k - $170k" },
];

const upcomingTasks = [
  { title: "Complete TypeScript certification", dueIn: "3 days", progress: 75 },
  { title: "Update portfolio with new projects", dueIn: "1 week", progress: 40 },
  { title: "Practice system design interview", dueIn: "5 days", progress: 20 },
];

export default function Dashboard() {
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
            Welcome back, <GradientText>Alex</GradientText>! 👋
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
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Readiness Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Career Readiness</h2>
                <Link to="/dashboard/career-map">
                  <AnimatedButton variant="ghost" size="sm">
                    View Full Map <ArrowUpRight className="w-4 h-4" />
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
                      animate={{ pathLength: 0.85 }}
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
                    <span className="text-4xl font-display font-bold gradient-text-hero">85</span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="flex-1 space-y-4">
                  {[
                    { skill: "Technical Skills", value: 90 },
                    { skill: "Leadership", value: 75 },
                    { skill: "Communication", value: 85 },
                    { skill: "Problem Solving", value: 88 },
                  ].map((item) => (
                    <div key={item.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.skill}</span>
                        <span className="text-muted-foreground">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
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
                    Based on your skills and recent activity, consider focusing on{" "}
                    <span className="font-semibold text-primary">System Design</span> to unlock
                    senior-level opportunities.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-sm leading-relaxed">
                    Your profile matches well with{" "}
                    <span className="font-semibold text-primary">3 new positions</span> at top
                    tech companies posted today.
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

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Job Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Top Job Matches</h2>
                <Link to="/dashboard/jobs">
                  <AnimatedButton variant="ghost" size="sm">
                    View All <ArrowUpRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>
              </div>

              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job.title}
                    className="p-4 rounded-xl bg-accent/30 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <p className="text-sm text-primary mt-1">{job.salary}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {job.match}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Learning Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Learning Progress</h2>
                <Link to="/dashboard/learning">
                  <AnimatedButton variant="ghost" size="sm">
                    View All <ArrowUpRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={task.title} className="p-4 rounded-xl bg-accent/30 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Due in {task.dueIn}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
