import { useState, useCallback, useEffect } from "react";
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
  GraduationCap,
  FolderKanban,
  Award,
  Briefcase,
  User,
  TrendingUp,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";
import { analyzeResume as geminiAnalyzeResume } from "@/integrations/firebase/gemini";
import { saveResumeAnalysis } from "@/integrations/firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces matching the new Gemini response schema
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

interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationDate: string;
  gpa: string | null;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string | null;
}

interface ATSBreakdown {
  formatting: number;
  keywords: number;
  actionVerbs: number;
  quantification: number;
}

interface ResumeAnalysis {
  atsScore: number;
  atsBreakdown: ATSBreakdown;
  atsSuggestions: string[];
  about: string;
  experienceMonths: number;
  experienceLabel: string;
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  skills: ExtractedSkill[];
  topStrengths: string[];
  recommendations: CareerRecommendation[];
  summary: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  organization: string;
  location: string;
  salary: string;
  url: string;
  type: string;
  source: string;
}

// ATS Score circular gauge component
function ATSGauge({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/20"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-display font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
}

// Fetch recommended jobs from Active Jobs DB API
async function fetchRecommendedJobs(
  skills: string[],
  title?: string
): Promise<RecommendedJob[]> {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey) return [];

  const query = title || skills.slice(0, 3).join(" ");

  try {
    const response = await fetch(
      `https://active-jobs-db.p.rapidapi.com/active-ats-7d?title=${encodeURIComponent(query)}&limit=6`,
      {
        headers: {
          "x-rapidapi-host": "active-jobs-db.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );

    if (!response.ok) {
      console.warn("Active Jobs DB error:", response.status);
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((job: any) => ({
      id: job.id || Math.random().toString(),
      title: job.title || "Untitled",
      organization: job.organization || "Unknown Company",
      location:
        job.locations_derived?.[0] ||
        job.locations_raw?.[0]?.address?.addressLocality ||
        "Not specified",
      salary: job.salary_raw?.value
        ? `${job.salary_raw.currency || "USD"} ${job.salary_raw.value.minValue || ""}${job.salary_raw.value.maxValue ? `–${job.salary_raw.value.maxValue}` : ""} / ${job.salary_raw.value.unitText?.toLowerCase() || "year"}`
        : "Not disclosed",
      url: job.url || "#",
      type: Array.isArray(job.employment_type)
        ? job.employment_type[0]
        : job.employment_type || "Full-time",
      source: job.source || "ATS",
    }));
  } catch (err) {
    console.error("Failed to fetch recommended jobs:", err);
    return [];
  }
}

export function ResumeUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Fetch jobs when analysis is complete
  useEffect(() => {
    if (analysis && analysis.skills.length > 0) {
      setLoadingJobs(true);
      const topSkills = analysis.skills.slice(0, 5).map((s) => s.name);
      const topRole = analysis.recommendations?.[0]?.role;
      fetchRecommendedJobs(topSkills, topRole)
        .then(setRecommendedJobs)
        .finally(() => setLoadingJobs(false));
    }
  }, [analysis]);

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
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Content = await base64Promise;

      const data = await geminiAnalyzeResume(base64Content, file.name);
      setAnalysis(data);

      // Persist to Firestore so Career Roadmap & History can use it
      if (user?.uid) {
        try {
          await saveResumeAnalysis(user.uid, {
            ...data,
            fileName: file.name,
            analyzedAt: new Date().toISOString(),
          });
          console.log("Resume analysis saved to Firestore");
        } catch (saveErr) {
          console.error("Failed to save analysis to Firestore:", saveErr);
          // Non-fatal — user still sees the analysis
        }
      }
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    setRecommendedJobs([]);
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
              Upload your resume for ATS scoring, skill extraction & job recommendations
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
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
            {/* ATS Score + Summary Row */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* ATS Score */}
              <GlassCard glow glowColor="purple" className="md:col-span-1">
                <h3 className="font-semibold text-center mb-4 flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  ATS Score
                </h3>
                <ATSGauge score={analysis.atsScore} />
                <div className="mt-4 space-y-2">
                  {analysis.atsBreakdown && (
                    <>
                      {[
                        { label: "Formatting", value: analysis.atsBreakdown.formatting, max: 25 },
                        { label: "Keywords", value: analysis.atsBreakdown.keywords, max: 25 },
                        { label: "Action Verbs", value: analysis.atsBreakdown.actionVerbs, max: 25 },
                        { label: "Quantification", value: analysis.atsBreakdown.quantification, max: 25 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{item.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-accent/50 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent-foreground"
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / item.max) * 100}%` }}
                              transition={{ delay: 0.5, duration: 1 }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{item.value}/{item.max}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </GlassCard>

              {/* Summary & Quick Stats */}
              <GlassCard className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Analysis Complete</h3>
                </div>

                {/* About / Summary */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {analysis.about || analysis.summary}
                </p>

                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                    📊 {analysis.experienceLabel || `${analysis.experienceMonths} months`}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium">
                    🛠 {analysis.skills?.length || 0} skills
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-medium">
                    🎓 {analysis.education?.length || 0} education
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                    📁 {analysis.projects?.length || 0} projects
                  </span>
                  {(analysis.certifications?.length || 0) > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                      🏅 {analysis.certifications.length} certifications
                    </span>
                  )}
                </div>

                {/* ATS Suggestions */}
                {analysis.atsSuggestions && analysis.atsSuggestions.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-400 mb-2">💡 Improvement Suggestions</p>
                    <ul className="space-y-1">
                      {analysis.atsSuggestions.slice(0, 4).map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Education */}
            {analysis.education && analysis.education.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {analysis.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-accent/30 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-primary">{edu.graduationDate}</p>
                          {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Projects */}
            {analysis.projects && analysis.projects.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  Projects
                </h3>
                <div className="space-y-4">
                  {analysis.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-accent/30 border border-border"
                    >
                      <h4 className="font-medium mb-1">{project.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {project.highlights.map((h, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <span className="text-primary">•</span> {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Certifications */}
            {analysis.certifications && analysis.certifications.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Certifications
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {analysis.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-xl bg-accent/30 border border-border flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Top Strengths */}
            {analysis.topStrengths && analysis.topStrengths.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Top Strengths
                </h3>
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
            )}

            {/* Extracted Skills */}
            {analysis.skills && analysis.skills.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Extracted Skills ({analysis.skills.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {analysis.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-accent/30"
                    >
                      <div>
                        <p className="font-medium text-sm">{skill.name}</p>
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
            )}

            {/* Career Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <GlassCard>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Career Recommendations
                </h3>
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
            )}

            {/* Real Job Recommendations from API */}
            <GlassCard>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Recommended Jobs for You
              </h3>
              {loadingJobs ? (
                <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finding matching jobs...
                </div>
              ) : recommendedJobs.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {recommendedJobs.map((job, index) => (
                    <motion.a
                      key={job.id}
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="block p-4 rounded-xl bg-accent/30 border border-border hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {job.title}
                        </h4>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 ml-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{job.organization}</p>
                      <p className="text-xs text-muted-foreground mb-2">📍 {job.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-medium">{job.salary}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                          {job.type}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No matching jobs found. Try refining your resume or check the Jobs page for more listings.
                </p>
              )}
            </GlassCard>

            {/* Actions */}
            <div className="flex gap-4">
              <AnimatedButton
                variant="hero"
                className="flex-1"
                onClick={() => {
                  if (!analysis) return;
                  const lines: string[] = [];
                  lines.push("═══════════════════════════════════════");
                  lines.push("       RESUME ANALYSIS REPORT");
                  lines.push("       Generated by Ascend Career");
                  lines.push("═══════════════════════════════════════");
                  lines.push("");
                  lines.push(`ATS SCORE: ${analysis.atsScore}/100`);
                  if (analysis.atsBreakdown) {
                    lines.push(`  Formatting:     ${analysis.atsBreakdown.formatting}/25`);
                    lines.push(`  Keywords:       ${analysis.atsBreakdown.keywords}/25`);
                    lines.push(`  Action Verbs:   ${analysis.atsBreakdown.actionVerbs}/25`);
                    lines.push(`  Quantification: ${analysis.atsBreakdown.quantification}/25`);
                  }
                  lines.push("");
                  lines.push("── ABOUT ──");
                  lines.push(analysis.about || analysis.summary || "N/A");
                  lines.push("");
                  lines.push(`Experience: ${analysis.experienceLabel || `${analysis.experienceMonths} months`}`);
                  lines.push("");
                  if (analysis.education?.length) {
                    lines.push("── EDUCATION ──");
                    analysis.education.forEach((e) => {
                      lines.push(`• ${e.degree}${e.field ? ` in ${e.field}` : ""} — ${e.institution} (${e.graduationDate})${e.gpa ? ` | GPA: ${e.gpa}` : ""}`);
                    });
                    lines.push("");
                  }
                  if (analysis.projects?.length) {
                    lines.push("── PROJECTS ──");
                    analysis.projects.forEach((p) => {
                      lines.push(`• ${p.name}`);
                      lines.push(`  ${p.description}`);
                      lines.push(`  Tech: ${p.technologies.join(", ")}`);
                      if (p.highlights?.length) p.highlights.forEach((h) => lines.push(`  - ${h}`));
                    });
                    lines.push("");
                  }
                  if (analysis.certifications?.length) {
                    lines.push("── CERTIFICATIONS ──");
                    analysis.certifications.forEach((c) => {
                      lines.push(`• ${c.name} — ${c.issuer}${c.date ? ` (${c.date})` : ""}`);
                    });
                    lines.push("");
                  }
                  if (analysis.skills?.length) {
                    lines.push("── SKILLS ──");
                    analysis.skills.forEach((s) => {
                      lines.push(`• ${s.name} [${s.level}] — ${s.category}`);
                    });
                    lines.push("");
                  }
                  if (analysis.topStrengths?.length) {
                    lines.push("── TOP STRENGTHS ──");
                    analysis.topStrengths.forEach((s) => lines.push(`• ${s}`));
                    lines.push("");
                  }
                  if (analysis.atsSuggestions?.length) {
                    lines.push("── IMPROVEMENT SUGGESTIONS ──");
                    analysis.atsSuggestions.forEach((s) => lines.push(`→ ${s}`));
                    lines.push("");
                  }
                  if (analysis.recommendations?.length) {
                    lines.push("── CAREER RECOMMENDATIONS ──");
                    analysis.recommendations.forEach((r) => {
                      lines.push(`• ${r.role} (${r.matchScore}% match)`);
                      lines.push(`  ${r.description}`);
                      lines.push(`  Salary: ${r.salaryRange}`);
                      lines.push(`  Skills needed: ${r.requiredSkills.join(", ")}`);
                    });
                  }
                  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "resume-analysis-report.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
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
