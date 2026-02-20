import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          style={{ left: "20%", top: "20%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-accent-foreground/10 blur-3xl"
          style={{ right: "20%", bottom: "20%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-9xl font-display font-bold mb-6"
        >
          <GradientText>404</GradientText>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-4">
          Page Not Found
        </h1>

        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Oops! It seems like this career path doesn't exist yet. Let's get you
          back on track to your goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <AnimatedButton variant="hero" size="lg">
              <Home className="w-5 h-5" />
              Back to Home
            </AnimatedButton>
          </Link>
          <Link to="/dashboard">
            <AnimatedButton variant="glass" size="lg">
              <ArrowLeft className="w-5 h-5" />
              Go to Dashboard
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
