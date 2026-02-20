import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  Sparkles,
  AlertCircle,
  Download,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ExtractedSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
}

interface CareerRecommendation {
  role: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
}

interface ResumeAnalysis {
  skills: ExtractedSkill[];
  recommendations: CareerRecommendation[];
  summary: string;
  yearsOfExperience: number;
  topStrengths: string[];
}

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Content = await base64Promise;

      // Call edge function to analyze resume
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          fileContent: base64Content,
          fileName: file.name 
        },
      });

      if (fnError) throw fnError;

      setAnalysis(data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold">
              <GradientText>AI Resume Analysis</GradientText>
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload your resume for AI-powered skill extraction
            </p>
          </div>
        </div>

        {!file ? (
          <motion.div
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragging ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse (PDF only)
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!analysis && (
              <AnimatedButton
                variant="hero"
                className="w-full"
                onClick={analyzeResume}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </AnimatedButton>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-destructive/10 text-destructive"
          >
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </GlassCard>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary */}
            <GlassCard glow glowColor="purple">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Analysis Complete</h3>
              </div>
              <p className="text-muted-foreground mb-4">{analysis.summary}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {analysis.yearsOfExperience} years experience
                </span>
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground">
                  {analysis.skills.length} skills identified
                </span>
              </div>
            </GlassCard>

            {/* Top Strengths */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Top Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topStrengths.map((strength, index) => (
                  <motion.span
                    key={strength}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent-foreground/10 text-sm font-medium"
                  >
                    {strength}
                  </motion.span>
                ))}
              </div>
            </GlassCard>

            {/* Extracted Skills */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Extracted Skills</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-accent/30"
                  >
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        skill.level === "Expert" && "bg-purple-500/10 text-purple-500",
                        skill.level === "Advanced" && "bg-blue-500/10 text-blue-500",
                        skill.level === "Intermediate" && "bg-amber-500/10 text-amber-500",
                        skill.level === "Beginner" && "bg-green-500/10 text-green-500"
                      )}
                    >
                      {skill.level}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Career Recommendations */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Career Recommendations</h3>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-accent/30 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{rec.role}</h4>
                        <p className="text-sm text-primary">{rec.salaryRange}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {rec.matchScore}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-full bg-accent text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex gap-4">
              <AnimatedButton variant="hero" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </AnimatedButton>
              <AnimatedButton variant="outline" onClick={removeFile}>
                Analyze Another Resume
              </AnimatedButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
