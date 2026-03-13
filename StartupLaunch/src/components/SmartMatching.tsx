import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Brain, 
  Heart, 
  TrendingUp, 
  Target, 
  CheckCircle,
  MessageCircle,
  UserPlus,
  Zap
} from "lucide-react";

interface Match {
  id: string;
  type: 'startup' | 'person';
  name: string;
  title?: string;
  company?: string;
  avatar: string;
  matchScore: number;
  reasons: string[];
  skills: string[];
  interests: string[];
  location: string;
}

export default function SmartMatching() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const allInterests = [
    "AI & Machine Learning", "Sustainability", "FinTech", "HealthTech", 
    "EdTech", "E-commerce", "Blockchain", "IoT", "Robotics", "Cybersecurity",
    "AR/VR", "Social Impact", "Food Tech", "Travel Tech", "Gaming"
  ];

  const mockMatches: Match[] = [
    {
      id: "1",
      type: "person",
      name: "Alex Chen",
      title: "Full-Stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      matchScore: 92,
      reasons: ["Shared interest in AI & ML", "React expertise", "Looking for co-founder"],
      skills: ["React", "Python", "TensorFlow", "Node.js"],
      interests: ["AI & Machine Learning", "HealthTech"],
      location: "San Francisco, CA"
    },
    {
      id: "2",
      type: "startup",
      name: "GreenTech Solutions",
      company: "Carbon tracking platform",
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=center",
      matchScore: 88,
      reasons: ["Similar problem space", "Complementary technology", "Same target market"],
      skills: ["Environmental Science", "Data Analytics", "Mobile Development"],
      interests: ["Sustainability", "Climate Tech"],
      location: "Austin, TX"
    },
    {
      id: "3",
      type: "person",
      name: "Sarah Rodriguez",
      title: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=60&h=60&fit=crop&crop=face",
      matchScore: 85,
      reasons: ["Product design expertise", "Early-stage experience", "Portfolio alignment"],
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      interests: ["EdTech", "Social Impact"],
      location: "New York, NY"
    },
    {
      id: "4",
      type: "startup",
      name: "FinanceAI",
      company: "AI-powered financial advisor",
      avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=60&fit=crop&crop=center",
      matchScore: 82,
      reasons: ["AI technology synergy", "B2C focus", "Growth stage alignment"],
      skills: ["Machine Learning", "Financial Modeling", "API Development"],
      interests: ["FinTech", "AI & Machine Learning"],
      location: "London, UK"
    },
    {
      id: "5",
      type: "person",
      name: "David Kim",
      title: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      matchScore: 78,
      reasons: ["Growth marketing expertise", "B2C experience", "Sustainability passion"],
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      interests: ["Sustainability", "E-commerce"],
      location: "Los Angeles, CA"
    }
  ];

  const analyzeMatches = () => {
    setIsAnalyzing(true);
    setMatches([]);
    
    setTimeout(() => {
      const filteredMatches = selectedInterests.length > 0 
        ? mockMatches.filter(match => 
            match.interests.some(interest => selectedInterests.includes(interest))
          )
        : mockMatches;
      
      setMatches(filteredMatches);
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  useEffect(() => {
    if (selectedInterests.length > 0) {
      analyzeMatches();
    }
  }, [selectedInterests]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI-Powered Smart Matching
          </CardTitle>
          <p className="text-muted-foreground">
            Find the perfect co-founders, team members, and collaboration opportunities using AI analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Select Your Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={analyzeMatches} 
            disabled={selectedInterests.length === 0 || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing Matches...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Find Smart Matches
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-medium">AI is analyzing potential matches...</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ Analyzing skill compatibility</p>
                <p>✓ Matching interests and goals</p>
                <p>✓ Evaluating collaboration potential</p>
                <p className="text-primary">→ Ranking matches by compatibility score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Smart Matches ({matches.length})
          </h2>
          
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={match.avatar} />
                    <AvatarFallback>{match.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{match.name}</h3>
                        <p className="text-muted-foreground">
                          {match.type === 'person' ? match.title : match.company}
                        </p>
                        <p className="text-sm text-muted-foreground">{match.location}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getMatchColor(match.matchScore)}`}>
                          {match.matchScore}%
                        </div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Why this is a great match:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {match.reasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {match.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {match.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.skills.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" variant="default">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add to Network
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAnalyzing && matches.length === 0 && selectedInterests.length > 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              Try selecting different interests or check back later for new matches.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}