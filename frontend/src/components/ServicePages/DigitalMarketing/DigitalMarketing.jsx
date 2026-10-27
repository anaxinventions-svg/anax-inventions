import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Megaphone,
  TrendingUp,
  Target,
  BarChart3,
  Search,
  Share2,
  Mail,
  PenTool,
  Video,
  Globe,
  Zap,
  Users,
  Eye,
  MousePointerClick,
  Award,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Sparkles,
  Flame,
  Hash,
  MessageCircle,
  Smartphone,
  Monitor,
  ShoppingCart,
  FileText,
  Image,
  Link2,
  Cpu,
  Radar,
  Gauge,
  Lightbulb,
  Rocket,
  Send,
  ThumbsUp,
  Heart,
  Repeat,
  Bookmark,
  Clock,
  Calendar,
  BarChart,
  PieChart,
  Activity,
  Layers,
  Palette,
  Fingerprint
} from 'lucide-react';
import './DigitalMarketing.css';

const DigitalMarketing = ({ data }) => {
  const [activeService, setActiveService] = useState(0);
  const [activeCase, setActiveCase] = useState(0);
  const [hoveredStat, setHoveredStat] = useState(null);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  // Hero stats with animated counters
  const stats = [
    { number: 500, suffix: "+", label: "Campaigns Launched", icon: <Rocket size={22} />, color: "#F59E0B" },
    { number: 10, suffix: "M+", label: "Leads Generated", icon: <Target size={22} />, color: "#EC4899" },
    { number: 350, suffix: "%", label: "Avg ROI Increase", icon: <TrendingUp size={22} />, color: "#10B981" },
    { number: 50, suffix: "+", label: "Global Clients", icon: <Globe size={22} />, color: "#3B82F6" }
  ];

  // Services
  const services = [
    {
      icon: <Search size={28} />,
      title: "SEO Optimization",
      subtitle: "Rank Higher, Get Found",
      desc: "Data-driven SEO strategies that push your website to the top of Google. Technical audits, keyword research, on-page optimization, and white-hat link building that delivers lasting results.",
      features: ["Technical SEO Audit", "Keyword Research", "On-Page SEO", "Link Building", "Local SEO", "Content Strategy"],
      metrics: { label: "Organic Traffic", value: "+340%" },
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
    },
    {
      icon: <MousePointerClick size={28} />,
      title: "PPC Advertising",
      subtitle: "Pay-Per-Click Mastery",
      desc: "Google Ads, Meta Ads, LinkedIn Ads — managed by certified experts. We optimize every dollar for maximum conversions with A/B testing, remarketing, and smart bidding strategies.",
      features: ["Google Ads", "Meta/Facebook Ads", "LinkedIn Ads", "Remarketing", "A/B Testing", "Conversion Tracking"],
      metrics: { label: "Cost Per Lead", value: "-60%" },
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
    },
    {
      icon: <Share2 size={28} />,
      title: "Social Media Marketing",
      subtitle: "Build Your Brand Community",
      desc: "Strategic content creation, community management, and paid social campaigns across Instagram, TikTok, LinkedIn, Twitter/X, and more. We turn followers into loyal customers.",
      features: ["Content Creation", "Community Management", "Paid Social", "Influencer Outreach", "Analytics", "Crisis Management"],
      metrics: { label: "Engagement Rate", value: "+280%" },
      color: "#EC4899",
      bgGradient: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)"
    },
    {
      icon: <Mail size={28} />,
      title: "Email Marketing",
      subtitle: "Convert Inboxes to Revenue",
      desc: "High-converting email sequences, newsletters, and automation flows. From welcome series to abandoned cart recovery — every email is optimized for opens, clicks, and sales.",
      features: ["Email Automation", "Newsletter Design", "A/B Testing", "List Segmentation", "Drip Campaigns", "Analytics"],
      metrics: { label: "Open Rate", value: "45%" },
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)"
    },
    {
      icon: <PenTool size={28} />,
      title: "Content Marketing",
      subtitle: "Content That Converts",
      desc: "Blog posts, whitepapers, case studies, and video scripts that establish thought leadership and drive organic traffic. SEO-optimized content that ranks and resonates.",
      features: ["Blog Writing", "Video Scripts", "Case Studies", "Whitepapers", "SEO Content", "Content Calendar"],
      metrics: { label: "Content Reach", value: "2M+" },
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
    },
    {
      icon: <Video size={28} />,
      title: "Video Marketing",
      subtitle: "Stories That Sell",
      desc: "Short-form video content for Reels, TikTok, and YouTube. From scripting to editing to distribution — we create scroll-stopping videos that drive engagement and conversions.",
      features: ["Video Production", "YouTube SEO", "Reels/TikTok", "Video Ads", "Animation", "Live Streaming"],
      metrics: { label: "Video Views", value: "50M+" },
      color: "#EF4444",
      bgGradient: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)"
    }
  ];

  // Process
  const processSteps = [
    {
      step: "01",
      title: "Discovery & Audit",
      desc: "Deep analysis of your current digital presence, competitors, and market opportunities. We identify gaps and create a roadmap for growth.",
      icon: <Radar size={26} />,
      details: ["Competitor Analysis", "Digital Audit", "Audience Research", "KPI Definition"]
    },
    {
      step: "02",
      title: "Strategy Development",
      desc: "Custom marketing strategy aligned with your business goals. Channel selection, budget allocation, and campaign architecture designed for maximum impact.",
      icon: <Lightbulb size={26} />,
      details: ["Channel Strategy", "Budget Planning", "Content Calendar", "Campaign Architecture"]
    },
    {
      step: "03",
      title: "Creative Production",
      desc: "Eye-catching creatives, compelling copy, and conversion-optimized landing pages. Every asset is crafted to stop the scroll and drive action.",
      icon: <Palette size={26} />,
      details: ["Ad Creatives", "Copywriting", "Landing Pages", "Video Production"]
    },
    {
      step: "04",
      title: "Campaign Launch",
      desc: "Precision-targeted campaigns across chosen channels. We monitor performance in real-time and optimize for the best possible results from day one.",
      icon: <Rocket size={26} />,
      details: ["Campaign Setup", "Audience Targeting", "Bid Management", "Launch Monitoring"]
    },
    {
      step: "05",
      title: "Optimize & Scale",
      desc: "Continuous A/B testing, performance analysis, and budget reallocation. We double down on what works and cut what doesn't to maximize ROI.",
      icon: <Gauge size={26} />,
      details: ["A/B Testing", "Performance Analysis", "Budget Scaling", "ROI Optimization"]
    },
    {
      step: "06",
      title: "Report & Iterate",
      desc: "Transparent weekly and monthly reports with actionable insights. We iterate based on data to keep improving results month over month.",
      icon: <BarChart3 size={26} />,
      details: ["Weekly Reports", "Monthly Reviews", "Strategy Updates", "Growth Planning"]
    }
  ];

  // Case studies
  const caseStudies = [
    {
      client: "TechStart Inc.",
      industry: "SaaS",
      service: "SEO + Content",
      result: "Organic traffic grew 450% in 6 months",
      metric: "+450%",
      metricLabel: "Organic Traffic",
      color: "#3B82F6",
      icon: <TrendingUp size={24} />
    },
    {
      client: "FashionHub",
      industry: "E-Commerce",
      service: "Social Media + PPC",
      result: "ROAS improved from 2.5x to 8.5x",
      metric: "8.5x",
      metricLabel: "ROAS",
      color: "#EC4899",
      icon: <ShoppingCart size={24} />
    },
    {
      client: "HealthPlus",
      industry: "Healthcare",
      service: "Email + Landing Pages",
      result: "Lead cost reduced by 65%",
      metric: "-65%",
      metricLabel: "Cost Per Lead",
      color: "#10B981",
      icon: <Target size={24} />
    },
    {
      client: "EduLearn",
      industry: "EdTech",
      service: "Video + YouTube SEO",
      result: "1.2M views and 15K enrollments",
      metric: "1.2M",
      metricLabel: "Video Views",
      color: "#F59E0B",
      icon: <Video size={24} />
    }
  ];

  // Pricing
  const pricingPlans = [
    {
      name: "Starter",
      price: "$1,999",
      period: "month",
      description: "Perfect for small businesses starting their digital journey",
      features: [
        "2 marketing channels",
        "Basic SEO audit",
        "Social media management (2 platforms)",
        "Monthly content (4 posts)",
        "Email newsletter (1/month)",
        "Monthly performance report",
        "Dedicated account manager"
      ],
      popular: false,
      color: "#3B82F6"
    },
    {
      name: "Growth",
      price: "$4,999",
      period: "month",
      description: "Comprehensive marketing for businesses ready to scale",
      features: [
        "4 marketing channels",
        "Advanced SEO + content strategy",
        "Social media (4 platforms)",
        "Weekly content (16 posts)",
        "Email automation sequences",
        "PPC campaign management",
        "A/B testing & optimization",
        "Bi-weekly reports + strategy calls",
        "Dedicated growth team"
      ],
      popular: true,
      color: "#EC4899"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      description: "Full-scale digital marketing for large organizations",
      features: [
        "All marketing channels",
        "Custom strategy & execution",
        "Unlimited content creation",
        "Advanced analytics & BI",
        "Influencer marketing",
        "Video production team",
        "Crisis management",
        "24/7 monitoring",
        "Quarterly business reviews",
        "White-label reporting"
      ],
      popular: false,
      color: "#10B981"
    }
  ];

  // Tools we use
  const tools = [
    { name: "Google Analytics 4", category: "Analytics", icon: "📊" },
    { name: "SEMrush / Ahrefs", category: "SEO", icon: "🔍" },
    { name: "Meta Business Suite", category: "Social", icon: "📱" },
    { name: "HubSpot / Mailchimp", category: "Email", icon: "📧" },
    { name: "Google Ads", category: "PPC", icon: "🎯" },
    { name: "Canva / Figma", category: "Design", icon: "🎨" },
    { name: "Hootsuite / Buffer", category: "Social", icon: "📲" },
    { name: "Hotjar / Crazy Egg", category: "CRO", icon: "🔥" },
    { name: "Sprout Social", category: "Social", icon: "🌱" },
    { name: "Adobe Creative Suite", category: "Creative", icon: "✨" },
    { name: "WordPress / Webflow", category: "CMS", icon: "🌐" },
    { name: "Zapier / Make", category: "Automation", icon: "⚡" }
  ];

  // Animated counter component
  const AnimatedCounter = ({ target, suffix, isInView }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [isInView, target]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="dm-page">
      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-hero">
        <div className="dm-hero-bg">
          <div className="dm-particles">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="dm-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 6}s`,
                  opacity: 0.2 + Math.random() * 0.5
                }}
              />
            ))}
          </div>
          <div className="dm-glow dm-glow-1"></div>
          <div className="dm-glow dm-glow-2"></div>
          <div className="dm-glow dm-glow-3"></div>
        </div>

        <div className="dm-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="dm-hero-badge">
              <Sparkles size={16} />
              <span>Digital Marketing Agency</span>
            </div>

            <h1 className="dm-hero-title">
              Turn Clicks Into <span className="dm-gradient-text">Customers</span>
              <br />At Scale
            </h1>

            <p className="dm-hero-subtitle">
              {data?.description || "Data-driven digital marketing strategies that drive measurable growth. SEO, PPC, social media, and content marketing — all under one roof."}
            </p>

            <div className="dm-hero-buttons">
              <button className="dm-btn dm-btn-primary">
                <Flame size={18} />
                Get Free Audit
                <ArrowRight size={18} />
              </button>
              <button className="dm-btn dm-btn-secondary">
                <BarChart3 size={18} />
                View Case Studies
              </button>
            </div>
          </motion.div>

          {/* Animated Stats */}
          <div className="dm-hero-stats" ref={statsRef}>
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                className="dm-stat-card"
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                whileHover={{ scale: 1.05, y: -8 }}
              >
                <div 
                  className="dm-stat-glow"
                  style={{ 
                    opacity: hoveredStat === idx ? 0.3 : 0,
                    background: `radial-gradient(circle, ${stat.color}, transparent)`
                  }}
                />
                <div className="dm-stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="dm-stat-number" style={{ color: stat.color }}>
                  <AnimatedCounter 
                    target={stat.number} 
                    suffix={stat.suffix} 
                    isInView={isStatsInView} 
                  />
                </div>
                <div className="dm-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-services-section">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="dm-section-tag">
              <Target size={14} />
              Services
            </span>
            <h2 className="dm-section-title">
              Full-Funnel <span className="dm-gradient-text">Marketing</span> Solutions
            </h2>
            <p className="dm-section-desc">
              Every channel, every tactic — optimized for your business growth
            </p>
          </motion.div>

          <div className="dm-services-layout">
            {/* Service Selector */}
            <div className="dm-service-selector">
              {services.map((service, idx) => (
                <motion.button
                  key={idx}
                  className={`dm-service-btn ${activeService === idx ? 'dm-service-active' : ''}`}
                  onClick={() => setActiveService(idx)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ x: 6 }}
                >
                  <div className="dm-service-btn-icon" style={{ color: service.color }}>
                    {service.icon}
                  </div>
                  <div className="dm-service-btn-text">
                    <span className="dm-service-btn-title">{service.title}</span>
                    <span className="dm-service-btn-sub">{service.subtitle}</span>
                  </div>
                  <ChevronRight size={18} className="dm-service-btn-arrow" />
                </motion.button>
              ))}
            </div>

            {/* Service Detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                className="dm-service-detail"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  className="dm-detail-header"
                  style={{ background: services[activeService].bgGradient }}
                >
                  <div className="dm-detail-icon">
                    {services[activeService].icon}
                  </div>
                  <div className="dm-detail-title-group">
                    <h3>{services[activeService].title}</h3>
                    <span>{services[activeService].subtitle}</span>
                  </div>
                  <div className="dm-detail-metric">
                    <span className="dm-metric-value">{services[activeService].metrics.value}</span>
                    <span className="dm-metric-label">{services[activeService].metrics.label}</span>
                  </div>
                </div>

                <div className="dm-detail-body">
                  <p className="dm-detail-desc">{services[activeService].desc}</p>

                  <div className="dm-detail-features">
                    {services[activeService].features.map((feat, fidx) => (
                      <motion.div 
                        key={fidx}
                        className="dm-detail-feature"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: fidx * 0.06 }}
                      >
                        <CheckCircle2 size={18} style={{ color: services[activeService].color }} />
                        <span>{feat}</span>
                      </motion.div>
                    ))}
                  </div>

                  <button 
                    className="dm-detail-cta"
                    style={{ color: services[activeService].color, borderColor: services[activeService].color }}
                  >
                    Explore {services[activeService].title}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROCESS SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-process-section">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="dm-section-tag">
              <Layers size={14} />
              Our Process
            </span>
            <h2 className="dm-section-title">
              How We Drive <span className="dm-gradient-text">Results</span>
            </h2>
          </motion.div>

          <div className="dm-process-grid">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="dm-process-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <div className="dm-process-number">{step.step}</div>
                <div className="dm-process-icon">{step.icon}</div>
                <h3 className="dm-process-title">{step.title}</h3>
                <p className="dm-process-desc">{step.desc}</p>
                <div className="dm-process-tags">
                  {step.details.map((detail, didx) => (
                    <span key={didx} className="dm-process-tag">
                      <CheckCircle2 size={12} />
                      {detail}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CASE STUDIES SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-cases-section">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="dm-section-tag">
              <Award size={14} />
              Success Stories
            </span>
            <h2 className="dm-section-title">
              Results That <span className="dm-gradient-text">Speak</span>
            </h2>
          </motion.div>

          <div className="dm-cases-layout">
            {/* Case Selector */}
            <div className="dm-case-list">
              {caseStudies.map((study, idx) => (
                <motion.button
                  key={idx}
                  className={`dm-case-btn ${activeCase === idx ? 'dm-case-active' : ''}`}
                  onClick={() => setActiveCase(idx)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  <div className="dm-case-btn-icon" style={{ color: study.color }}>
                    {study.icon}
                  </div>
                  <div className="dm-case-btn-info">
                    <span className="dm-case-btn-client">{study.client}</span>
                    <span className="dm-case-btn-industry">{study.industry}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Case Detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase}
                className="dm-case-detail"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  className="dm-case-metric-big"
                  style={{ 
                    background: `linear-gradient(135deg, ${caseStudies[activeCase].color}20, transparent)`
                  }}
                >
                  <span style={{ color: caseStudies[activeCase].color }}>
                    {caseStudies[activeCase].metric}
                  </span>
                  <label>{caseStudies[activeCase].metricLabel}</label>
                </div>

                <div className="dm-case-info">
                  <h3>{caseStudies[activeCase].client}</h3>
                  <div className="dm-case-meta">
                    <span className="dm-case-industry">{caseStudies[activeCase].industry}</span>
                    <span className="dm-case-service">{caseStudies[activeCase].service}</span>
                  </div>
                  <p className="dm-case-result">{caseStudies[activeCase].result}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TOOLS SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-tools-section">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="dm-section-tag">
              <Cpu size={14} />
              Tech Stack
            </span>
            <h2 className="dm-section-title">
              Tools We <span className="dm-gradient-text">Master</span>
            </h2>
          </motion.div>

          <div className="dm-tools-grid">
            {tools.map((tool, idx) => (
              <motion.div
                key={idx}
                className="dm-tool-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <span className="dm-tool-icon">{tool.icon}</span>
                <span className="dm-tool-name">{tool.name}</span>
                <span className="dm-tool-cat">{tool.category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-pricing-section">
        <div className="dm-container">
          <motion.div 
            className="dm-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="dm-section-tag">
              <Hash size={14} />
              Pricing
            </span>
            <h2 className="dm-section-title">
              Investment <span className="dm-gradient-text">Plans</span>
            </h2>
            <p className="dm-section-desc">
              Transparent pricing with measurable ROI
            </p>
          </motion.div>

          <div className="dm-pricing-grid">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`dm-pricing-card ${plan.popular ? 'dm-pricing-popular' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={{ y: plan.popular ? -20 : -12 }}
              >
                {plan.popular && (
                  <div className="dm-popular-badge">
                    <Star size={14} fill="currentColor" />
                    Best Value
                  </div>
                )}

                <div className="dm-pricing-header" style={{ borderColor: plan.color }}>
                  <h3 style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="dm-pricing-amount">
                    <span className="dm-price">{plan.price}</span>
                    <span className="dm-period">/{plan.period}</span>
                  </div>
                  <p>{plan.description}</p>
                </div>

                <ul className="dm-pricing-features">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx}>
                      <CheckCircle2 size={18} style={{ color: plan.color }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className="dm-pricing-btn"
                  style={{
                    background: plan.popular ? plan.color : 'transparent',
                    color: plan.popular ? 'white' : plan.color,
                    border: `2px solid ${plan.color}`
                  }}
                >
                  {plan.period === 'quote' ? 'Contact Us' : 'Get Started'}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="dm-section dm-cta-section">
        <div className="dm-cta-bg">
          <div className="dm-cta-glow"></div>
          <div className="dm-cta-particles"></div>
        </div>

        <motion.div 
          className="dm-cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="dm-cta-icon">
            <Megaphone size={48} />
          </div>
          <h2 className="dm-cta-title">
            Ready to <span className="dm-gradient-text">Dominate</span> Digital?
          </h2>
          <p className="dm-cta-subtitle">
            Get a free marketing audit and discover untapped growth opportunities for your business.
          </p>

          <div className="dm-cta-buttons">
            <button className="dm-btn dm-btn-glow">
              <Send size={18} />
              Free Marketing Audit
              <ArrowRight size={18} />
            </button>
            <button className="dm-btn dm-btn-outline">
              <Calendar size={18} />
              Book Strategy Call
            </button>
          </div>

          <div className="dm-cta-trust">
            <div className="dm-trust-item">
              <CheckCircle2 size={18} />
              <span>No Credit Card Required</span>
            </div>
            <div className="dm-trust-item">
              <Clock size={18} />
              <span>24-Hour Turnaround</span>
            </div>
            <div className="dm-trust-item">
              <ThumbsUp size={18} />
              <span>100% Satisfaction</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default DigitalMarketing;