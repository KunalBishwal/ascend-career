import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />

      {/* Animated Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        style={{ left: "10%", top: "50%", transform: "translateY(-50%)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-accent-foreground/10 blur-3xl"
        style={{ right: "10%", top: "50%", transform: "translateY(-50%)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Start Free Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Ready to <GradientText>Transform</GradientText>
            <br />
            Your Career?
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of professionals who have accelerated their careers with
            AI-powered guidance. Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <AnimatedButton variant="hero" size="xl">
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </AnimatedButton>
            </Link>
            <AnimatedButton variant="glass" size="xl">
              Schedule a Demo
            </AnimatedButton>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
