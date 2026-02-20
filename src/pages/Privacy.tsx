import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Sparkles } from "lucide-react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-32 max-w-3xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-display font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account, update your profile, or use our AI features. This includes your name, email address, career information, and resumes you upload for analysis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use the information we collect to provide, improve, and personalize our services. Your resume and profile data is used solely to generate AI-powered career recommendations. We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Your data is stored securely using Google Firebase infrastructure with industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. AI Processing</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Our AI features are powered by Google's Gemini API. Resume content and chat messages sent to our AI mentor are processed by Google's API to generate responses. Please review Google's privacy policy for information on how they handle API data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You have the right to access, update, or delete your personal information at any time through your profile settings. You may also request a full export of your data by contacting us at privacy@ascendcareer.ai.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at{" "}
                                <a href="mailto:privacy@ascendcareer.ai" className="text-primary hover:underline">
                                    privacy@ascendcareer.ai
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
