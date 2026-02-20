import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GradientTextProps extends HTMLMotionProps<"span"> {
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  animate?: boolean;
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, as: Component = "span", animate = false, children, ...props }, ref) => {
    const MotionComponent = motion[Component] as any;

    return (
      <MotionComponent
        ref={ref}
        className={cn(
          "gradient-text-hero",
          animate && "bg-[length:200%_auto] animate-gradient-shift",
          className
        )}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);
GradientText.displayName = "GradientText";

export { GradientText };
