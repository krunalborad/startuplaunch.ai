import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { 
  Bot, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users,
  Sparkles,
  MessageCircle,
  X
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your AI startup assistant. I can help you with:\n\n• Generate startup ideas\n• Analyze your business concept\n• Suggest team roles\n• Create marketing strategies\n• Find potential collaborators\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      suggestions: ["Generate startup ideas", "Analyze my concept", "Find team members", "Marketing advice"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiResponses = {
    "generate startup ideas": [
      "🚀 **EcoTrack AI**: Carbon footprint tracker with personalized reduction plans",
      "💡 **SkillSwap Platform**: Peer-to-peer professional skill exchange network", 
      "🏠 **HomeBot**: AI-powered home automation for energy efficiency",
      "📱 **MindfulTech**: Digital wellness app that promotes healthy tech habits",
      "🎯 **LocalConnect**: Hyperlocal community marketplace for services"
    ],
    "analyze": [
      "📊 **Market Analysis**: Your concept shows strong potential in the growing sustainability market",
      "🎯 **Target Audience**: Consider focusing on eco-conscious millennials and Gen Z",
      "💰 **Revenue Streams**: Freemium model with premium analytics could work well",
      "🔍 **Competitors**: Research apps like Carbon Tracker and MyClimate for positioning",
      "📈 **Growth Strategy**: Partner with environmental organizations for credibility"
    ],
    "team": [
      "👨‍💻 **Full-Stack Developer**: React/Node.js experience, $80-120k equity + salary",
      "🎨 **UI/UX Designer**: Product design portfolio, early-stage startup experience",
      "📊 **Data Scientist**: ML/AI background for analytics and recommendations",
      "📱 **Marketing Lead**: Growth hacking experience, B2C app marketing",
      "🌱 **Environmental Expert**: Sustainability credentials, advisory role"
    ],
    "marketing": [
      "📱 **Social Media**: Focus on Instagram/TikTok with sustainability content",
      "🤝 **Partnerships**: Collaborate with eco-influencers and green brands",
      "🎯 **Content Strategy**: Share daily eco-tips and impact tracking",
      "📧 **Email Marketing**: Weekly sustainability challenges and tips",
      "🌟 **Community Building**: Create user-generated content campaigns"
    ]
  };

  const getAIResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    let response = "I understand you're interested in that topic. Let me help you explore it further!";
    let suggestions: string[] = [];

    if (message.includes("idea") || message.includes("generate")) {
      response = "🚀 Here are some innovative startup ideas trending now:\n\n" + 
        aiResponses["generate startup ideas"].join("\n\n");
      suggestions = ["Tell me more about EcoTrack", "Analyze market potential", "Find co-founders"];
    } else if (message.includes("analyz") || message.includes("concept") || message.includes("business")) {
      response = "📊 Let me analyze your startup concept:\n\n" + 
        aiResponses["analyze"].join("\n\n");
      suggestions = ["Refine target audience", "Explore revenue models", "Competitor research"];
    } else if (message.includes("team") || message.includes("hire") || message.includes("member")) {
      response = "👥 Here are key team roles for your startup:\n\n" + 
        aiResponses["team"].join("\n\n");
      suggestions = ["Create job posts", "Equity structure", "Remote vs local"];
    } else if (message.includes("market") || message.includes("promote") || message.includes("growth")) {
      response = "📈 Marketing strategy recommendations:\n\n" + 
        aiResponses["marketing"].join("\n\n");
      suggestions = ["Content calendar", "Influencer outreach", "Paid advertising"];
    } else if (message.includes("fund") || message.includes("investment")) {
      response = "💰 **Funding Options for Your Startup:**\n\n• **Bootstrapping**: Self-fund initial development\n• **Angel Investors**: $25k-$100k for 5-15% equity\n• **Seed VCs**: $500k-$2M for 15-25% equity\n• **Crowdfunding**: Kickstarter/Indiegogo for product validation\n• **Grants**: Government and environmental grants available";
      suggestions = ["Prepare pitch deck", "Financial projections", "Investor targeting"];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 z-50"
        size="icon"
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl border-2 border-primary/20 z-50 flex flex-col overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            AI Startup Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'ai' && <Bot className="w-4 h-4 mt-1 text-primary flex-shrink-0" />}
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-white transition-colors mr-1 mb-1"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about startup ideas, team building, marketing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="min-h-[40px] max-h-[80px] resize-none"
            />
            <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}