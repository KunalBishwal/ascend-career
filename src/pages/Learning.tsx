import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  Star,
  ArrowRight,
  Filter,
  Search,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  duration: string;
  lessons: number;
  completedLessons: number;
  instructor: string;
  thumbnail: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  recommended: boolean;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Advanced TypeScript Patterns",
    category: "Programming",
    progress: 75,
    duration: "8h 30m",
    lessons: 24,
    completedLessons: 18,
    instructor: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
    difficulty: "Advanced",
    recommended: true,
  },
  {
    id: "2",
    title: "System Design Fundamentals",
    category: "Architecture",
    progress: 40,
    duration: "12h",
    lessons: 32,
    completedLessons: 13,
    instructor: "Michael Park",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    difficulty: "Intermediate",
    recommended: true,
  },
  {
    id: "3",
    title: "Leadership for Engineers",
    category: "Soft Skills",
    progress: 20,
    duration: "6h",
    lessons: 16,
    completedLessons: 3,
    instructor: "Emily Rodriguez",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
    difficulty: "Beginner",
    recommended: false,
  },
  {
    id: "4",
    title: "React Performance Optimization",
    category: "Programming",
    progress: 100,
    duration: "5h 45m",
    lessons: 18,
    completedLessons: 18,
    instructor: "James Wilson",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    difficulty: "Advanced",
    recommended: false,
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    category: "Cloud",
    progress: 0,
    duration: "15h",
    lessons: 40,
    completedLessons: 0,
    instructor: "David Kim",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    difficulty: "Intermediate",
    recommended: true,
  },
];

const skills = [
  { name: "React", level: 92, color: "from-cyan-500 to-blue-500" },
  { name: "TypeScript", level: 88, color: "from-blue-500 to-indigo-500" },
  { name: "Node.js", level: 75, color: "from-green-500 to-emerald-500" },
  { name: "System Design", level: 60, color: "from-purple-500 to-pink-500" },
  { name: "AWS", level: 45, color: "from-orange-500 to-amber-500" },
];

const achievements = [
  { icon: Trophy, label: "Courses Completed", value: 12 },
  { icon: Clock, label: "Hours Learned", value: 156 },
  { icon: Star, label: "Certificates", value: 8 },
  { icon: Zap, label: "Streak Days", value: 23 },
];

const categories = ["All", "Programming", "Architecture", "Soft Skills", "Cloud"];

export default function Learning() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
              <GradientText>Learning Hub</GradientText>
            </h1>
            <p className="text-muted-foreground">
              Build skills that accelerate your career growth
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-display font-bold">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Skills Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold">Skill Progress</h2>
              <AnimatedButton variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {skills.map((skill, index) => (
                <div key={skill.name} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
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
                        className={`stroke-current text-primary`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: skill.level / 100 }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{skill.level}%</span>
                    </div>
                  </div>
                  <p className="font-medium text-sm">{skill.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <GlassCard className="overflow-hidden group cursor-pointer" hover>
                <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  {course.recommended && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Recommended
                    </div>
                  )}
                  {course.progress === 100 && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-accent text-xs font-medium text-muted-foreground">
                      {course.category}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      course.difficulty === "Beginner" && "bg-green-500/10 text-green-500",
                      course.difficulty === "Intermediate" && "bg-amber-500/10 text-amber-500",
                      course.difficulty === "Advanced" && "bg-red-500/10 text-red-500"
                    )}>
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>

                  <p className="text-sm text-muted-foreground">by {course.instructor}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.completedLessons}/{course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>

                  {course.progress > 0 && course.progress < 100 && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-accent rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Recommended Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glow glowColor="purple">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl font-display font-semibold mb-2">
                  Personalized Learning Path
                </h3>
                <p className="text-muted-foreground">
                  Based on your career goals and current skills, we've curated a learning path to help you become a Tech Lead in 6 months.
                </p>
              </div>
              <AnimatedButton variant="hero" size="lg">
                View Path <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
