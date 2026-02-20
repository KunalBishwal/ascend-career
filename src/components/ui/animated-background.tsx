import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "default" | "hero" | "subtle";
}

export function AnimatedBackground({ className, variant = "default" }: AnimatedBackgroundProps) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.4) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(258 90% 66% / 0.4) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(180 82% 45% / 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(330 81% 60% / 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional blue gradient orbs for enhanced effect */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-56 h-56 rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 55% / 0.5) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-20 left-1/3 w-48 h-48 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(200 90% 50% / 0.4) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 35, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient mesh overlay */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(217 91% 60% / 0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
