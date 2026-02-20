import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "react-router-dom";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Get started with essential career tools",
        icon: Sparkles,
        color: "from-muted to-muted-foreground",
        features: [
            "AI Career Mentor (10 messages/day)",
            "1 Resume Analysis per month",
            "Basic job search",
            "Profile page",
            "Career roadmap view",
        ],
        cta: "Get Started Free",
        href: "/login",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "per month",
        description: "Everything you need to accelerate your career",
        icon: Zap,
        color: "from-primary to-accent-foreground",
        features: [
            "Unlimited AI Career Mentor",
            "Unlimited Resume Analysis",
            "Advanced job matching",
            "Skills gap analysis",
            "Interview preparation",
            "Salary insights",
            "Priority support",
        ],
        cta: "Start Pro Trial",
        href: "/login",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        name: "Teams",
        price: "$49",
        period: "per month",
        description: "For teams and organizations investing in talent",
        icon: Crown,
        color: "from-accent-foreground to-primary",
        features: [
            "Everything in Pro",
            "Up to 10 team members",
            "Team analytics dashboard",
            "Bulk resume reviews",
            "Custom career paths",
            "Dedicated account manager",
            "API access",
        ],
        cta: "Contact Sales",
        href: "/login",
        highlighted: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 relative">
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
                        Simple Pricing
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
                        Invest in Your{" "}
                        <GradientText>Career Growth</GradientText>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your journey. Start free, upgrade when you're ready.
                    </p>
                </motion.div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="relative"
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground text-xs font-bold shadow-lg">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}
                            <GlassCard
                                className={`h-full flex flex-col ${plan.highlighted ? "ring-2 ring-primary border-primary" : ""}`}
                                glow={plan.highlighted}
                                glowColor="purple"
                            >
                                {/* Plan Header */}
                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                                        <plan.icon className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold mb-1">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-display font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground text-sm">/{plan.period}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 flex-1 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm">
                                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                <Check className="w-3 h-3 text-primary-foreground" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link to={plan.href}>
                                    <AnimatedButton
                                        variant={plan.highlighted ? "hero" : "glass"}
                                        className="w-full"
                                    >
                                        {plan.cta}
                                    </AnimatedButton>
                                </Link>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Money back note */}
                <motion.p
                    className="text-center text-sm text-muted-foreground mt-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    🔒 14-day money-back guarantee · No credit card required for Free plan · Cancel anytime
                </motion.p>
            </div>
        </section>
    );
}
