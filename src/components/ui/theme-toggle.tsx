import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full bg-accent p-1 transition-colors",
        isDark ? "bg-accent" : "bg-accent",
        className
      )}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track background with gradient */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{
          background: isDark 
            ? "linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(258 50% 20%) 100%)"
            : "linear-gradient(135deg, hsl(38 92% 80%) 0%, hsl(217 91% 85%) 100%)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Stars for dark mode */}
      <AnimatePresence>
        {isDark && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-1.5 left-2 w-1 h-1 rounded-full bg-white/70"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-3 left-4 w-0.5 h-0.5 rounded-full bg-white/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-2 left-3 w-0.5 h-0.5 rounded-full bg-white/60"
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Toggle knob */}
      <motion.div
        className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        animate={{
          x: isDark ? 22 : 0,
          background: isDark
            ? "linear-gradient(135deg, hsl(240 10% 20%) 0%, hsl(240 10% 30%) 100%)"
            : "linear-gradient(135deg, hsl(38 92% 60%) 0%, hsl(38 92% 50%) 100%)"
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-3.5 h-3.5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isDark
            ? "0 0 20px hsl(258 90% 66% / 0.3), inset 0 0 20px hsl(258 90% 66% / 0.1)"
            : "0 0 20px hsl(38 92% 50% / 0.3), inset 0 0 20px hsl(38 92% 50% / 0.1)"
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
