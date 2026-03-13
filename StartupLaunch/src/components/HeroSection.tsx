import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Target, Users, Play, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleStartJourney = () => {
    window.location.href = '/create';
  };

  const handleExplore = () => {
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchDemo = () => {
    document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmailSignup = () => {
    if (email) {
      toast({
        title: "🎉 You're on the list!",
        description: "We'll send you startup tips and resources.",
      });
      setEmail("");
    } else {
      toast({
        title: "Enter your email",
        description: "Sign up for exclusive startup resources.",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-warning/20 rounded-full blur-xl animate-pulse delay-500" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <button 
            onClick={() => toast({ title: "✨ Early Access", description: "You're among the first to discover StartupLaunch!" })}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-primary/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            From College Idea to Real Startup
            <ChevronRight className="w-3 h-3" />
          </button>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight pb-2">
            Turn Your Crazy Idea Into Something Real
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The first platform that guides college students through the entire startup journey. 
            No experience? No problem. Even your "dumbest" idea deserves a shot.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={handleStartJourney}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/20 hover:bg-primary/5"
              onClick={handleExplore}
            >
              Explore Ideas
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/20 hover:bg-primary/5"
              onClick={handleWatchDemo}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Email Signup */}
          <div className="flex items-center gap-2 max-w-md mx-auto mb-12">
            <input
              type="email"
              placeholder="Enter your email for free resources..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailSignup()}
              className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button onClick={handleEmailSignup} size="sm" className="bg-gradient-primary">
              Get Started
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <button 
              onClick={() => window.location.href = '/discover'}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Ideas Launched</div>
            </button>
            
            <button 
              onClick={() => toast({ title: "🤝 Community", description: "2,000+ students from 200+ universities!" })}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">2K+</div>
              <div className="text-sm text-muted-foreground">Students Connected</div>
            </button>
            
            <button 
              onClick={() => document.getElementById('success-stories')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">50+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};