import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Cpu, Route, Rocket } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Simply upload your resume or LinkedIn profile. Our AI extracts your skills, experience, and career trajectory.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes your profile against millions of career paths to identify optimal opportunities.",
  },
  {
    number: "03",
    icon: Route,
    title: "Get Your Roadmap",
    description:
      "Receive a personalized career roadmap with step-by-step guidance, skill recommendations, and timelines.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Achieve Your Goals",
    description:
      "Follow your roadmap, track progress, and leverage AI-matched jobs to accelerate your career growth.",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            How <GradientText>CareerPath</GradientText> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes with our streamlined AI-powered process.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <GlassCard className="text-center relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent-foreground">
                    <span className="text-sm font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 mx-auto mt-4 rounded-2xl bg-accent flex items-center justify-center mb-5"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className="w-8 h-8 text-primary" />
                  </motion.div>

                  <h3 className="text-xl font-display font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>

                {/* Arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
