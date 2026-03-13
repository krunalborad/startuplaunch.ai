import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Sparkles, TrendingUp, Target, Zap, RefreshCw } from "lucide-react";

interface StartupIdea {
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marketSize: string;
  technologies: string[];
  timeToMarket: string;
}

export default function StartupIdeaGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIdea, setCurrentIdea] = useState<StartupIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    "all", "AI & ML", "Sustainability", "HealthTech", "FinTech", 
    "EdTech", "Social Impact", "E-commerce", "Productivity"
  ];

  const startupIdeas: StartupIdea[] = [
    {
      title: "EcoTrack Pro",
      description: "AI-powered carbon footprint tracker that provides real-time environmental impact analysis and personalized sustainability recommendations for individuals and businesses.",
      category: "Sustainability",
      difficulty: "Medium",
      marketSize: "$2.5B by 2028",
      technologies: ["React", "Python", "TensorFlow", "IoT Sensors"],
      timeToMarket: "8-12 months"
    },
    {
      title: "SkillSwap Network",
      description: "Peer-to-peer professional skill exchange platform where users trade expertise instead of money, building a collaborative learning economy.",
      category: "EdTech",
      difficulty: "Easy",
      marketSize: "$1.2B by 2026",
      technologies: ["React", "Node.js", "Socket.io", "Blockchain"],
      timeToMarket: "4-6 months"
    },
    {
      title: "MindfulAI Therapy",
      description: "AI-powered mental health companion that provides personalized therapy sessions, mood tracking, and crisis intervention capabilities.",
      category: "HealthTech",
      difficulty: "Hard",
      marketSize: "$4.8B by 2027",
      technologies: ["React Native", "Python", "NLP", "Voice AI"],
      timeToMarket: "12-18 months"
    },
    {
      title: "LocalLink Commerce",
      description: "Hyperlocal marketplace connecting neighborhood businesses with residents for same-day delivery and community building.",
      category: "E-commerce",
      difficulty: "Medium",
      marketSize: "$890M by 2025",
      technologies: ["React", "Node.js", "Maps API", "Payment APIs"],
      timeToMarket: "6-9 months"
    },
    {
      title: "VoiceFlow Studio",
      description: "No-code platform for creating voice applications and podcasts with AI-powered editing, transcription, and distribution tools.",
      category: "Productivity",
      difficulty: "Hard",
      marketSize: "$3.1B by 2029",
      technologies: ["React", "WebRTC", "Speech APIs", "Cloud Storage"],
      timeToMarket: "10-15 months"
    },
    {
      title: "CryptoLearn Academy",
      description: "Gamified cryptocurrency and blockchain education platform with virtual trading simulations and NFT certification rewards.",
      category: "FinTech",
      difficulty: "Medium",
      marketSize: "$1.7B by 2026",
      technologies: ["React", "Web3", "Solidity", "Game Engine"],
      timeToMarket: "7-10 months"
    },
    {
      title: "SocialGood Tracker",
      description: "Platform that connects volunteers with local nonprofits and tracks social impact through blockchain-verified contributions.",
      category: "Social Impact",
      difficulty: "Medium",
      marketSize: "$650M by 2027",
      technologies: ["React", "Blockchain", "Smart Contracts", "Maps"],
      timeToMarket: "8-12 months"
    },
    {
      title: "NeuroFocus Assistant",
      description: "AI-powered productivity tool that uses brainwave monitoring to optimize focus sessions and prevent mental fatigue.",
      category: "AI & ML",
      difficulty: "Hard",
      marketSize: "$2.9B by 2028",
      technologies: ["React", "Python", "EEG APIs", "Machine Learning"],
      timeToMarket: "15-20 months"
    }
  ];

  const generateIdea = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const filteredIdeas = selectedCategory === "all" 
        ? startupIdeas 
        : startupIdeas.filter(idea => idea.category === selectedCategory);
      
      const randomIdea = filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
      setCurrentIdea(randomIdea);
      setIsGenerating(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <Lightbulb className="w-7 h-7 text-primary" />
          AI Startup Idea Generator
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </CardTitle>
        <p className="text-muted-foreground">
          Generate innovative startup ideas tailored to trending markets and technologies
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateIdea} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Idea"}
          </Button>
        </div>

        {currentIdea && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="text-xl font-bold mb-2">{currentIdea.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {currentIdea.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">Category:</span>
                  <Badge variant="secondary">{currentIdea.category}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Market Size:</span>
                  <span className="text-green-600 font-semibold">{currentIdea.marketSize}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Difficulty:</span>
                  <Badge className={getDifficultyColor(currentIdea.difficulty)}>
                    {currentIdea.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-medium mb-2 block">Technologies:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentIdea.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Time to Market:</span>
                  <span className="text-primary font-semibold">{currentIdea.timeToMarket}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                Save Idea
              </Button>
              <Button variant="default" className="flex-1">
                Start Building
              </Button>
            </div>
          </div>
        )}

        {!currentIdea && (
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Idea" to discover your next startup opportunity!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}