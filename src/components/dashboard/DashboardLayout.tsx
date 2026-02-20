import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Briefcase,
  MessageSquare,
  GraduationCap,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  Search,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { FileText } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Map", href: "/dashboard/career-map" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: MessageSquare, label: "AI Mentor", href: "/dashboard/mentor" },
  { icon: GraduationCap, label: "Learning", href: "/dashboard/learning" },
  { icon: FileText, label: "Resume AI", href: "/dashboard/resume" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">CareerPath</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display font-bold text-xl">CareerPath</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Alex Johnson</p>
                <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs, skills, resources..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="relative w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground" />
              <span className="font-medium">Alex</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
