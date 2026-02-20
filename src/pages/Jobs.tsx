import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Bookmark,
  Building2,
  Filter,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  match: number;
  posted: string;
  skills: string[];
  logo?: string;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$150k - $180k",
    type: "Full-time",
    match: 95,
    posted: "2 days ago",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupX",
    location: "Remote",
    salary: "$130k - $160k",
    type: "Full-time",
    match: 88,
    posted: "1 week ago",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
  },
  {
    id: "3",
    title: "React Lead Developer",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "$140k - $170k",
    type: "Full-time",
    match: 82,
    posted: "3 days ago",
    skills: ["React", "Redux", "GraphQL", "Team Leadership"],
  },
  {
    id: "4",
    title: "Frontend Architect",
    company: "DigitalFirst",
    location: "Austin, TX",
    salary: "$160k - $200k",
    type: "Full-time",
    match: 78,
    posted: "5 days ago",
    skills: ["System Design", "React", "Performance", "Mentoring"],
  },
  {
    id: "5",
    title: "Staff Software Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    salary: "$180k - $220k",
    type: "Full-time",
    match: 75,
    posted: "1 day ago",
    skills: ["Microservices", "Kubernetes", "React", "Go"],
  },
];

const filters = [
  { label: "Job Type", options: ["Full-time", "Part-time", "Contract", "Remote"] },
  { label: "Experience", options: ["Entry", "Mid-level", "Senior", "Lead"] },
  { label: "Salary", options: ["$50k+", "$100k+", "$150k+", "$200k+"] },
];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            <GradientText>AI-Matched</GradientText> Jobs
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities tailored to your skills and career goals.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.label}
                className="flex items-center gap-2 px-4 h-12 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <span className="text-sm">{filter.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Job Listings */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className={`cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? "ring-2 ring-primary border-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-foreground/20 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedJobs.includes(job.id) ? "fill-primary text-primary" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-md bg-accent text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 2 && (
                        <span className="px-2 py-1 rounded-md bg-accent text-xs">
                          +{job.skills.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {job.match}%
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Job Details */}
          <AnimatePresence mode="wait">
            {selectedJob && (
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-3"
              >
                <GlassCard className="sticky top-24">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold">{selectedJob.title}</h2>
                        <p className="text-muted-foreground">{selectedJob.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {selectedJob.match}% Match
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">Location</span>
                      </div>
                      <p className="font-medium text-sm">{selectedJob.location}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Salary</span>
                      </div>
                      <p className="font-medium text-sm">{selectedJob.salary}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Posted</span>
                      </div>
                      <p className="font-medium text-sm">{selectedJob.posted}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Job Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We are looking for a talented {selectedJob.title} to join our team at{" "}
                      {selectedJob.company}. You will be responsible for building and maintaining
                      high-quality applications while collaborating with cross-functional teams
                      to deliver exceptional user experiences.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <AnimatedButton variant="hero" className="flex-1">
                      Apply Now
                    </AnimatedButton>
                    <AnimatedButton
                      variant="glass"
                      onClick={() => toggleSaveJob(selectedJob.id)}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedJobs.includes(selectedJob.id) ? "fill-current" : ""
                        }`}
                      />
                      {savedJobs.includes(selectedJob.id) ? "Saved" : "Save"}
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
