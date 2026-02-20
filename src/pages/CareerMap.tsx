import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";

interface CareerNode {
  id: string;
  title: string;
  level: string;
  salary: string;
  skills: string[];
  duration: string;
  status: "completed" | "current" | "upcoming" | "locked";
  x: number;
  y: number;
}

const careerPath: CareerNode[] = [
  {
    id: "1",
    title: "Junior Developer",
    level: "Entry Level",
    salary: "$60k - $80k",
    skills: ["JavaScript", "HTML/CSS", "Git"],
    duration: "1-2 years",
    status: "completed",
    x: 10,
    y: 80,
  },
  {
    id: "2",
    title: "Mid-Level Developer",
    level: "Intermediate",
    salary: "$80k - $110k",
    skills: ["React", "Node.js", "TypeScript"],
    duration: "2-3 years",
    status: "completed",
    x: 30,
    y: 60,
  },
  {
    id: "3",
    title: "Senior Developer",
    level: "Senior",
    salary: "$120k - $150k",
    skills: ["System Design", "Leadership", "Mentoring"],
    duration: "3-5 years",
    status: "current",
    x: 50,
    y: 40,
  },
  {
    id: "4",
    title: "Tech Lead",
    level: "Lead",
    salary: "$150k - $180k",
    skills: ["Architecture", "Team Management", "Strategy"],
    duration: "2-4 years",
    status: "upcoming",
    x: 70,
    y: 30,
  },
  {
    id: "5",
    title: "Engineering Manager",
    level: "Management",
    salary: "$180k - $220k",
    skills: ["People Management", "Budgeting", "Hiring"],
    duration: "3-5 years",
    status: "locked",
    x: 90,
    y: 20,
  },
];

export default function CareerMap() {
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.fromTo(
        pathRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 2, ease: "power2.out" }
      );
    }
  }, []);

  const getNodeColor = (status: CareerNode["status"]) => {
    switch (status) {
      case "completed":
        return "from-green-500 to-emerald-600";
      case "current":
        return "from-primary to-accent-foreground";
      case "upcoming":
        return "from-secondary to-muted";
      case "locked":
        return "from-muted to-muted";
    }
  };

  const getNodeIcon = (status: CareerNode["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "current":
        return <Star className="w-5 h-5" />;
      case "upcoming":
        return <ChevronRight className="w-5 h-5" />;
      case "locked":
        return <Lock className="w-5 h-5" />;
    }
  };

  // Generate SVG path
  const pathD = careerPath
    .map((node, i) => {
      const x = (node.x / 100) * 100;
      const y = (node.y / 100) * 100;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Your <GradientText>Career Roadmap</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Interactive visualization of your personalized career progression path.
          </p>
        </motion.div>

        {/* Career Map Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="relative overflow-hidden min-h-[500px]">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Path Line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent-foreground))" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="0.5"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / 0.5))" }}
              />
            </svg>

            {/* Nodes */}
            <div className="relative h-[500px]">
              {careerPath.map((node, index) => (
                <motion.div
                  key={node.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getNodeColor(
                      node.status
                    )} flex items-center justify-center text-primary-foreground shadow-lg ${
                      node.status === "current" ? "pulse-glow" : ""
                    }`}
                  >
                    {getNodeIcon(node.status)}
                  </div>
                  <p className="text-xs font-medium text-center mt-2 max-w-[100px]">
                    {node.title}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
              {[
                { status: "Completed", color: "bg-green-500" },
                { status: "Current", color: "bg-primary" },
                { status: "Upcoming", color: "bg-secondary" },
                { status: "Locked", color: "bg-muted" },
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Node Details Modal */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedNode(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <GlassCard glow>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2 bg-gradient-to-r ${getNodeColor(
                          selectedNode.status
                        )} text-primary-foreground`}
                      >
                        {getNodeIcon(selectedNode.status)}
                        {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                      </div>
                      <h2 className="text-2xl font-display font-bold">{selectedNode.title}</h2>
                      <p className="text-muted-foreground">{selectedNode.level}</p>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Salary Range</span>
                      </div>
                      <p className="font-semibold">{selectedNode.salary}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Duration</span>
                      </div>
                      <p className="font-semibold">{selectedNode.duration}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium">Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <AnimatedButton variant="hero" className="w-full">
                    <Sparkles className="w-4 h-4" />
                    Get AI Guidance for This Role
                  </AnimatedButton>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careerPath.slice(2, 5).map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <GlassCard
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getNodeColor(
                      node.status
                    )} flex items-center justify-center text-primary-foreground`}
                  >
                    {getNodeIcon(node.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{node.title}</h3>
                    <p className="text-sm text-muted-foreground">{node.salary}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
