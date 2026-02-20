import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  FileText,
  Map,
  MessageSquare,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

const features = [
  {
    icon: FileText,
    title: "Resume Intelligence",
    description:
      "AI-powered resume analysis that extracts skills, experience, and potential career paths automatically.",
    color: "from-primary to-accent-foreground",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    description:
      "Personalized step-by-step career progression with role milestones, skills gaps, and growth timelines.",
    color: "from-accent-foreground to-primary",
  },
  {
    icon: MessageSquare,
    title: "AI Career Mentor",
    description:
      "24/7 conversational AI guidance for career decisions, interview prep, and professional development.",
    color: "from-primary via-accent-foreground to-primary",
  },
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "Intelligent job recommendations based on your skills, goals, and cultural fit preferences.",
    color: "from-accent-foreground to-primary",
  },
  {
    icon: GraduationCap,
    title: "Learning Paths",
    description:
      "Curated courses and certifications aligned with your career goals and skill gaps.",
    color: "from-primary to-accent-foreground",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description:
      "Real-time salary data, industry trends, and demand forecasts for informed decisions.",
    color: "from-accent-foreground via-primary to-accent-foreground",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/30 to-background pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            Everything You Need to{" "}
            <GradientText>Accelerate Your Career</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform provides comprehensive tools to help you navigate
            your professional journey with confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <GlassCard className="h-full">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}
                >
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-6 px-8 py-4 rounded-full glass">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">Join 50,000+ professionals</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground border-2 border-background"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
