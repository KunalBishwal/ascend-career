import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { ResumeHistory } from "@/components/resume/ResumeHistory";
import { GradientText } from "@/components/ui/gradient-text";
import { motion } from "framer-motion";
import { Upload, History } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "analyze" | "history";

export default function ResumeAnalysis() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");

  const tabs: { id: Tab; label: string; icon: typeof Upload }[] = [
    { id: "analyze", label: "Analyze New", icon: Upload },
    { id: "history", label: "Resume History", icon: History },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">
            <GradientText>Resume Center</GradientText>
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload, analyze, and manage your resumes
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 p-1 bg-accent/40 rounded-xl w-fit border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="resume-tab-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "analyze" ? (
          <ResumeUpload />
        ) : (
          <ResumeHistory />
        )}
      </div>
    </DashboardLayout>
  );
}
