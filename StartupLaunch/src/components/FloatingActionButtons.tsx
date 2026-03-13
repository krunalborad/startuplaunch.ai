import { useState, useCallback } from "react";
import LiveChat from "@/components/LiveChat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Users, 
  MessageCircle,
  Bell,
  BookOpen,
  Zap,
  Target,
  X,
  TrendingUp,
  HelpCircle,
  Share2
} from "lucide-react";

export default function FloatingActionButtons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications] = useState(3);
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  const quickActions = [
    {
      icon: Plus,
      label: "New Idea",
      color: "bg-green-500 hover:bg-green-600",
      action: () => window.location.href = '/create'
    },
    {
      icon: Search,
      label: "Discover",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => window.location.href = '/discover'
    },
    {
      icon: Users,
      label: "Find Team",
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => window.location.href = '/discover?tab=teams'
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => window.location.href = '/profile?tab=analytics'
    },
    {
      icon: BookOpen,
      label: "Resources",
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => window.open('https://docs.lovable.dev', '_blank')
    },
    {
      icon: HelpCircle,
      label: "Help",
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => toast({ title: "💡 Need help?", description: "Check our docs or reach out to support!" })
    }
  ];

  return (
    <>
      {/* Main FAB */}
      <div className="fixed bottom-20 right-6 z-40">
        <Button
          size="icon"
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-primary hover:shadow-xl'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Zap className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Quick Action Buttons */}
      {isExpanded && (
        <div className="fixed bottom-36 right-6 z-40 space-y-3">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="bg-background/90 backdrop-blur-sm border shadow-lg">
                <CardContent className="p-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
              
              <Button
                size="icon"
                className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${action.color}`}
                onClick={action.action}
              >
                <action.icon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Notifications */}
      <div className="fixed top-20 right-6 z-40">
        <Button
          variant="outline"
          size="icon"
          className="relative w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.location.href = '/profile?tab=notifications'}
        >
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-6 h-6 text-xs flex items-center justify-center p-0"
            >
              {notifications}
            </Badge>
          )}
        </Button>
      </div>

      {/* Quick Share Button */}
      <div className="fixed top-36 right-6 z-40">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'StartupLaunch',
                text: 'Turn your crazy idea into something real!',
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Live Chat Support */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96">
          <LiveChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </>
  );
}