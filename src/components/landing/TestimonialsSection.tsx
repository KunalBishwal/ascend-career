import { motion } from "framer-motion";
import { Star, Sparkles, Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Software Engineer at Google",
        avatar: "PS",
        avatarColor: "from-pink-500 to-purple-600",
        stars: 5,
        text: "Ascend Career's AI mentor helped me navigate my transition from a mid-level to senior engineer role. The personalized roadmap was exactly what I needed. Landed my dream job at Google within 3 months!",
    },
    {
        name: "Marcus Johnson",
        role: "Product Manager at Meta",
        avatar: "MJ",
        avatarColor: "from-blue-500 to-cyan-500",
        stars: 5,
        text: "The resume analysis feature is incredible. It pointed out gaps I never noticed and suggested improvements that made my application stand out. The AI career advice was spot-on and very actionable.",
    },
    {
        name: "Aisha Patel",
        role: "Data Scientist at Amazon",
        avatar: "AP",
        avatarColor: "from-orange-500 to-red-500",
        stars: 5,
        text: "I was skeptical at first, but the career map feature gave me a clear 6-month plan to transition into data science. The skill gap analysis was incredibly accurate. Best career investment I've made.",
    },
    {
        name: "James Chen",
        role: "Frontend Developer at Netflix",
        avatar: "JC",
        avatarColor: "from-green-500 to-teal-500",
        stars: 5,
        text: "The job matching algorithm is smarter than anything else I've tried. It found roles that perfectly matched my skills and salary expectations. Got 3 offers within 6 weeks of using Ascend Career.",
    },
    {
        name: "Riya Kapoor",
        role: "UX Designer at Figma",
        avatar: "RK",
        avatarColor: "from-violet-500 to-purple-500",
        stars: 5,
        text: "As a designer making the jump to a product role, the AI mentorship was invaluable. It understood my unique situation and gave advice that generic career coaches couldn't. Highly recommended!",
    },
    {
        name: "David Park",
        role: "DevOps Engineer at Stripe",
        avatar: "DP",
        avatarColor: "from-yellow-500 to-orange-500",
        stars: 5,
        text: "The interview preparation module is incredible. I practiced with the AI and it gave me feedback that helped me crush every technical interview. Landed a 40% salary increase in my new role.",
    },
];

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Success Stories
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
                        Careers <GradientText>Transformed</GradientText>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of professionals who have accelerated their careers with Ascend Career.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {[
                        { value: "10,000+", label: "Users" },
                        { value: "4.9/5", label: "Average Rating" },
                        { value: "87%", label: "Got Promoted/Hired" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl font-display font-bold gradient-text-hero">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                        >
                            <GlassCard className="h-full flex flex-col relative">
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                                <StarRating count={t.stars} />
                                <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
                                    "{t.text}"
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
