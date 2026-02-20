import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Loader2,
    Trash2,
    ChevronDown,
    ChevronUp,
    Clock,
    Award,
    Sparkles,
    AlertCircle,
    RefreshCw,
    Map,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAuth } from "@/contexts/AuthContext";
import { getResumeAnalyses } from "@/integrations/firebase/firestore";
import {
    doc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/config";
import { generateRoadmap, saveRoadmap } from "@/integrations/firebase/roadmap";
import { useNavigate } from "react-router-dom";

interface SavedAnalysis {
    id: string;
    fileName?: string;
    analyzedAt?: any;
    atsScore?: number;
    skills?: { name: string; level?: string }[];
    experienceLabel?: string;
    recommendations?: { role: string; matchScore: number }[];
    [key: string]: any;
}

function formatDate(ts: any): string {
    if (!ts) return "Unknown date";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function ATSBadge({ score }: { score?: number }) {
    if (score == null) return null;
    const color =
        score >= 75
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : score >= 50
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20";
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>
            ATS {score}%
        </span>
    );
}

export function ResumeHistory() {
    const { user } = useAuth();
    const uid = user?.uid ?? null;
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [generatingRoadmapId, setGeneratingRoadmapId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        if (!uid) { setLoading(false); return; }
        setLoading(true);
        try {
            const data = await getResumeAnalyses(uid) as SavedAnalysis[];
            // newest first
            setAnalyses(data.reverse());
        } catch (e) {
            setError("Failed to load resume history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [uid]);

    const handleDelete = async (id: string) => {
        if (!uid) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "users", uid, "resumeAnalyses", id));
            setAnalyses((prev) => prev.filter((a) => a.id !== id));
        } catch {
            setError("Failed to delete. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleGenerateRoadmap = async (analysis: SavedAnalysis) => {
        if (!uid) return;
        setGeneratingRoadmapId(analysis.id);
        try {
            const roadmap = await generateRoadmap({
                skills: analysis.skills,
                experienceLabel: analysis.experienceLabel,
                recommendations: analysis.recommendations,
                education: analysis.education,
                summary: analysis.summary,
            });
            await saveRoadmap(uid, roadmap);
            navigate("/career-map");
        } catch (e) {
            setError("Failed to generate roadmap from this analysis.");
        } finally {
            setGeneratingRoadmapId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
        );
    }

    if (analyses.length === 0) {
        return (
            <GlassCard className="text-center py-14">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No resume analyses yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                    Upload and analyze a resume — your history will appear here.
                </p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                    <button className="ml-auto text-xs underline" onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {analyses.length} resume{analyses.length !== 1 ? "s" : ""} saved
                </p>
                <button
                    onClick={load}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                </button>
            </div>

            <AnimatePresence>
                {analyses.map((analysis, i) => {
                    const isExpanded = expandedId === analysis.id;
                    const topSkills = (analysis.skills ?? []).slice(0, 5);

                    return (
                        <motion.div
                            key={analysis.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <GlassCard className="overflow-hidden">
                                {/* Header row */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <h3 className="font-semibold truncate">
                                                {analysis.fileName ?? "Resume Analysis"}
                                            </h3>
                                            <ATSBadge score={analysis.atsScore} />
                                            {i === 0 && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                                    Latest
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(analysis.createdAt ?? analysis.analyzedAt)}
                                            </span>
                                            {analysis.experienceLabel && (
                                                <span className="flex items-center gap-1">
                                                    <Award className="w-3 h-3" />
                                                    {analysis.experienceLabel}
                                                </span>
                                            )}
                                        </div>

                                        {/* Top skills preview */}
                                        {topSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {topSkills.map((s) => (
                                                    <span
                                                        key={s.name}
                                                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] border border-primary/20"
                                                    >
                                                        {s.name}
                                                    </span>
                                                ))}
                                                {(analysis.skills?.length ?? 0) > 5 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-accent text-muted-foreground text-[10px]">
                                                        +{analysis.skills!.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : analysis.id)}
                                            className="w-8 h-8 rounded-lg bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                                            title={isExpanded ? "Collapse" : "Expand"}
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(analysis.id)}
                                            disabled={deletingId === analysis.id}
                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                                            title="Delete"
                                        >
                                            {deletingId === analysis.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded detail */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                                                {/* All skills */}
                                                {(analysis.skills?.length ?? 0) > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">All Skills</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {analysis.skills!.map((s) => (
                                                                <span
                                                                    key={s.name}
                                                                    className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20"
                                                                >
                                                                    {s.name}
                                                                    {s.level && <span className="opacity-60 ml-1">· {s.level}</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Top recommendations */}
                                                {(analysis.recommendations?.length ?? 0) > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">Role Recommendations</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.recommendations!.slice(0, 4).map((r) => (
                                                                <span
                                                                    key={r.role}
                                                                    className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs border border-sky-500/20"
                                                                >
                                                                    {r.role} · {r.matchScore}%
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Generate Roadmap CTA */}
                                                <AnimatedButton
                                                    variant="hero"
                                                    className="w-full"
                                                    onClick={() => handleGenerateRoadmap(analysis)}
                                                    disabled={!!generatingRoadmapId}
                                                >
                                                    {generatingRoadmapId === analysis.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Generating Roadmap…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Map className="w-4 h-4" />
                                                            Generate Career Roadmap from This Resume
                                                        </>
                                                    )}
                                                </AnimatedButton>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
