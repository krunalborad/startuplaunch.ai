import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  Target, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle,
  Circle,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Heart
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  action?: string;
}

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [generatedIdea, setGeneratedIdea] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Share Your Interest",
      description: "Tell us what you're passionate about",
      icon: Lightbulb,
      completed: false,
      action: "Enter your interest"
    },
    {
      id: 2,
      title: "AI Generates Ideas",
      description: "Our AI creates personalized startup concepts",
      icon: Sparkles,
      completed: false
    },
    {
      id: 3,
      title: "Validate Your Concept",
      description: "Test and refine your idea with market research",
      icon: Target,
      completed: false
    },
    {
      id: 4,
      title: "Find Your Team",
      description: "Connect with co-founders and team members",
      icon: Users,
      completed: false
    },
    {
      id: 5,
      title: "Launch & Grow",
      description: "Build your MVP and scale your startup",
      icon: Zap,
      completed: false
    }
  ]);

  const interests = [
    "Sustainability", "Education", "Healthcare", "FinTech", "Gaming", 
    "Social Media", "E-commerce", "AI/ML", "Fitness", "Travel"
  ];

  const sampleIdeas = {
    "sustainability": "EcoScore: A browser extension that rates websites based on their environmental impact and suggests greener alternatives.",
    "education": "StudySync: A collaborative platform where students can form virtual study groups and share resources in real-time.",
    "healthcare": "MindfulU: A mental health app specifically designed for college students with peer support and campus counselor integration.",
    "fintech": "SplitSmart: An AI-powered expense splitting app for roommates and friend groups with automatic bill categorization.",
    "gaming": "SkillQuest: A gamified learning platform that turns academic subjects into RPG-style adventures.",
    "default": "CampusConnect: A hyperlocal social platform connecting students for activities, study groups, and campus events."
  };

  const handleInterestSelect = (interest: string) => {
    setUserInput(interest);
    generateIdea(interest);
  };

  const generateIdea = (interest: string) => {
    const key = interest.toLowerCase();
    const idea = sampleIdeas[key as keyof typeof sampleIdeas] || sampleIdeas.default;
    
      setTimeout(() => {
      setGeneratedIdea(idea);
      completeStep(0);
      setCurrentStep(1);
      
      // Auto-complete next steps with delays
      setTimeout(() => completeStep(1), 1000);
      setTimeout(() => setCurrentStep(2), 1500);
      setTimeout(() => completeStep(2), 3000);
      setTimeout(() => setCurrentStep(3), 3500);
      setTimeout(() => completeStep(3), 5000);
      setTimeout(() => setCurrentStep(4), 5500);
      setTimeout(() => completeStep(4), 7000);
    }, 1500);
  };

  const completeStep = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setUserInput("");
    setGeneratedIdea("");
    setSteps(prev => prev.map(step => ({ ...step, completed: false })));
  };

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Interactive Demo</Badge>
          <h2 className="text-4xl font-bold mb-4">See How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our startup creation process in real-time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Steps Timeline */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card 
                  key={step.id}
                  className={`transition-all duration-300 ${
                    index === currentStep 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : step.completed 
                        ? 'bg-success/5 border-success/20' 
                        : 'opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-success text-white' 
                          : index === currentStep 
                            ? 'bg-primary text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {step.action && index === currentStep && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {step.action}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interactive Area */}
            <div className="space-y-6">
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      What interests you?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Type your interest or select below..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && userInput && generateIdea(userInput)}
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Button
                            key={interest}
                            variant="outline"
                            size="sm"
                            onClick={() => handleInterestSelect(interest)}
                            className="text-xs"
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>

                      {userInput && (
                        <Button 
                          onClick={() => generateIdea(userInput)}
                          className="w-full"
                        >
                          Generate Startup Ideas
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep >= 1 && generatedIdea && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Generated Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium mb-4">
                      {generatedIdea}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>47 likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span>12 comments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>High potential</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep >= 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Market Validation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Market Size Analysis</span>
                        <Badge variant="secondary">Large Market</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competition Level</span>
                        <Badge variant="outline">Moderate</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Technical Feasibility</span>
                        <Badge className="bg-success">High</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep >= 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Potential Team Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                       {["Alex (Frontend Dev)", "Sarah (Designer)", "Mike (Marketing)"].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{member}</span>
                          <Button size="sm" variant="outline" onClick={() => window.location.href = '/match'}>Connect</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {steps.every(step => step.completed) && (
                <Card className="border-success bg-success/5">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-muted-foreground mb-4">
                      You've completed the startup creation process. Ready to make it real?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={resetDemo} variant="outline">
                        Try Again
                      </Button>
                      <Button onClick={() => window.location.href = '/create'}>
                        Create Real Startup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}