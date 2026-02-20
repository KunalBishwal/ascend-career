import { motion } from "framer-motion";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "API", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display font-bold text-xl">CareerPath</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              AI-powered career guidance that helps you navigate your professional
              journey with confidence.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent/80 transition-colors"
                  whileHover={{ y: -3 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerPath AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
