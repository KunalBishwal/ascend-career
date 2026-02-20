import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: boolean;
  glowColor?: "purple" | "blue" | "pink";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, glow = false, glowColor = "purple", children, ...props }, ref) => {
    const glowClasses = {
      purple: "glow-purple",
      blue: "glow-blue",
      pink: "glow-pink",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass rounded-2xl p-6",
          hover && "transition-all duration-300 hover:shadow-xl hover:border-primary/30",
          glow && glowClasses[glowColor],
          className
        )}
        whileHover={hover ? { y: -5 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
