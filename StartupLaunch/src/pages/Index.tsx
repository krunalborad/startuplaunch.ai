import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { StartupCard } from "@/components/StartupCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "@/components/AIAssistant";
import StartupIdeaGenerator from "@/components/StartupIdeaGenerator";
import PitchDeckBuilder from "@/components/PitchDeckBuilder";
import SmartMatching from "@/components/SmartMatching";
import SuccessStories from "@/components/SuccessStories";
import InteractiveDemo from "@/components/InteractiveDemo";
import LiveActivity from "@/components/LiveActivity";
import GameifiedProgress from "@/components/GameifiedProgress";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import QuickStats from "@/components/QuickStats";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  Users, 
  Target, 
  Zap, 
  ArrowRight,
  Star,
  TrendingUp,
  Sparkles,
  Bot
} from "lucide-react";

const mockStartups = [
  {
    id: "1",
    title: "EcoTrack",
    description: "Help college students track and reduce their carbon footprint through gamified daily challenges and community competitions.",
    founder: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612bad5?w=100&h=100&fit=crop&crop=face",
    stage: "MVP",
    category: "Sustainability",
    likes: 47,
    comments: 12,
    teamSize: "3 people"
  },
  {
    id: "2", 
    title: "StudyBuddy AI",
    description: "AI-powered study companion that creates personalized learning paths and connects students for collaborative study sessions.",
    founder: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    stage: "Idea",
    category: "EdTech",
    likes: 32,
    comments: 8,
    teamSize: "2 people"
  },
  {
    id: "3",
    title: "LocalEats",
    description: "Connect college students with local restaurants offering student discounts and healthy meal options.",
    founder: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    stage: "Validation",
    category: "Food & Dining",
    likes: 28,
    comments: 15,
    teamSize: "4 people"
  }
];

const Index = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { toast } = useToast();

  const renderSection = () => {
    switch (activeSection) {
      case "idea-generator":
        return (
          <div className="pt-32 pb-20 min-h-screen bg-background">
            <StartupIdeaGenerator />
          </div>
        );
      case "pitch-builder":
        return (
          <div className="pt-32 pb-20 min-h-screen bg-background">
            <PitchDeckBuilder />
          </div>
        );
      case "smart-matching":
        return (
          <div className="pt-32 pb-20 min-h-screen bg-background">
            <SmartMatching />
          </div>
        );
      default:
        return (
          <>
            {/* Quick Stats Bar */}
            <QuickStats />

            {/* Hero Section */}
            <HeroSection />

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-muted/30">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                  <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Follow our proven path from idea to launch, with AI guidance and community support every step of the way.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Lightbulb,
                      title: "Share Your Idea",
                      description: "No matter how crazy or simple, start with what you have",
                      color: "text-warning"
                    },
                    {
                      icon: Target,
                      title: "Get Guided",
                      description: "AI helps you plan, prioritize, and refine your concept",
                      color: "text-primary"
                    },
                    {
                      icon: Users,
                      title: "Find Your Team",
                      description: "Connect with co-founders, developers, and supporters",
                      color: "text-accent"
                    },
                    {
                      icon: Zap,
                      title: "Launch Together",
                      description: "Build, validate, and grow with community backing",
                      color: "text-success"
                    }
                  ].map((step, index) => (
                    <Card key={index} className="text-center hover:shadow-medium transition-all duration-300 animate-scale-in cursor-pointer group" onClick={() => {
                      const actions = ['/create', '/dashboard', '/discover', '/create'];
                      window.location.href = actions[index];
                    }}>
                      <CardContent className="p-6">
                        <div className={`w-16 h-16 ${step.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          <step.icon className={`w-8 h-8 ${step.color}`} />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{step.description}</p>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Learn More <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* AI Tools Section */}
            <section className="py-20 px-6">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Bot className="w-8 h-8 text-primary" />
                    AI-Powered Tools
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Leverage artificial intelligence to accelerate your startup journey
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveSection("idea-generator")}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-4">
                        <Lightbulb className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle>AI Idea Generator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Generate innovative startup ideas based on market trends and your interests
                      </p>
                      <Button variant="outline" className="w-full">
                        Generate Ideas
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveSection("pitch-builder")}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle>Pitch Deck Builder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Create professional pitch decks with AI-guided templates and content suggestions
                      </p>
                      <Button variant="outline" className="w-full">
                        Build Pitch Deck
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveSection("smart-matching")}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <CardTitle>Smart Matching</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        AI-powered matching to find co-founders, team members, and collaborators
                      </p>
                      <Button variant="outline" className="w-full">
                        Find Matches
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Featured Startups */}
            <section id="discover" className="py-20">
              <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-12">
                  <div>
                    <h2 className="text-4xl font-bold mb-4">Trending Ideas</h2>
                    <p className="text-xl text-muted-foreground">
                      See what other students are building and get inspired
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="hidden md:flex mt-4"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockStartups.map((startup) => (
                    <StartupCard key={startup.id} {...startup} />
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Demo */}
            <div id="interactive-demo">
              <InteractiveDemo />
            </div>

            {/* Success Stories */}
            <div id="success-stories">
              <SuccessStories />
            </div>

            {/* Live Activity */}
            <LiveActivity />

            {/* Gamified Progress */}
            <GameifiedProgress />

            {/* Community Stats */}
            <section id="community" className="py-20 bg-muted/30">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Thousands of students are already turning their ideas into reality
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  {[
                    { number: "2.5K+", label: "Active Students", icon: Users, action: () => toast({ title: "👥 Active Community", description: "2,500+ students from 200+ universities worldwide!" }) },
                    { number: "500+", label: "Ideas Shared", icon: Lightbulb, action: () => window.location.href = '/discover' },
                    { number: "150+", label: "Teams Formed", icon: Target, action: () => toast({ title: "🤝 Teams", description: "150+ teams formed through our Smart Matching!" }) },
                    { number: "50+", label: "MVPs Built", icon: Zap, action: () => document.getElementById('success-stories')?.scrollIntoView({ behavior: 'smooth' }) }
                  ].map((stat, index) => (
                    <button key={index} className="animate-scale-in hover:scale-105 transition-transform" onClick={stat.action}>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </button>
                  ))}
                </div>
                
                <Button 
                  size="lg" 
                  variant="gradient" 
                  className="animate-fade-in"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Start Your Journey Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                StartupLaunch
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => activeSection === "home" ? document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' }) : setActiveSection("home")}
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                {activeSection === "home" ? "Discover" : "Home"}
              </button>
              <button 
                onClick={() => setActiveSection("idea-generator")}
                className={`transition-colors font-medium ${activeSection === "idea-generator" ? "text-primary" : "text-foreground hover:text-primary"}`}
              >
                AI Tools
              </button>
              <button 
                onClick={() => window.location.href = '/startup-tv'}
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                StartupTV
              </button>
              <button 
                onClick={() => window.location.href = '/create'}
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                Create Startup
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setShowAIAssistant(true)}>
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="gradient" onClick={() => window.location.href = '/dashboard'}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation for AI Tools */}
      {activeSection !== "home" && (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setActiveSection("home")}>
                ← Back to Home
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant={activeSection === "idea-generator" ? "default" : "ghost"}
                  onClick={() => setActiveSection("idea-generator")}
                >
                  Idea Generator
                </Button>
                <Button 
                  variant={activeSection === "pitch-builder" ? "default" : "ghost"}
                  onClick={() => setActiveSection("pitch-builder")}
                >
                  Pitch Builder
                </Button>
                <Button 
                  variant={activeSection === "smart-matching" ? "default" : "ghost"}
                  onClick={() => setActiveSection("smart-matching")}
                >
                  Smart Matching
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderSection()}

      {/* Footer - Only show on home */}
      {activeSection === "home" && (
        <footer className="py-12 border-t">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  StartupLaunch
                </span>
              </div>
              
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <button onClick={() => toast({ title: "🔒 Privacy Policy", description: "Your data is secure. We never share your information with third parties." })} className="hover:text-foreground transition-colors">Privacy</button>
                <button onClick={() => toast({ title: "📜 Terms of Service", description: "By using StartupLaunch, you agree to our community guidelines." })} className="hover:text-foreground transition-colors">Terms</button>
                <button onClick={() => toast({ title: "💬 Support", description: "Need help? Email us at support@startuplaunch.com or use the AI Assistant!" })} className="hover:text-foreground transition-colors">Support</button>
                <button onClick={() => window.location.href = '/discover'} className="hover:text-foreground transition-colors">Discover</button>
                <button onClick={() => window.location.href = '/dashboard'} className="hover:text-foreground transition-colors">Dashboard</button>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2024 StartupLaunch. Empowering the next generation of entrepreneurs.
            </div>
          </div>
        </footer>
      )}

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onToggle={() => setShowAIAssistant(!showAIAssistant)} 
      />

      {/* Floating Action Buttons */}
      <FloatingActionButtons />
    </div>
  );
};

export default Index;