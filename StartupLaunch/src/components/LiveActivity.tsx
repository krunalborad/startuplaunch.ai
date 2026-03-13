import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import LiveChat from "@/components/LiveChat";
import { 
  Activity, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Lightbulb,
  Target,
  Zap,
  Eye,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'idea' | 'like' | 'comment' | 'team' | 'launch' | 'view';
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  metadata?: {
    ideaTitle?: string;
    teamSize?: number;
    views?: number;
  };
}

const generateActivity = (): ActivityItem => {
  const activities = [
    {
      type: 'idea' as const,
      users: [
        { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
        { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612bad5?w=100&h=100&fit=crop&crop=face" },
        { name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
      ],
      ideas: [
        "AI-powered study scheduler for college students",
        "Sustainable packaging marketplace for local businesses",
        "Virtual reality fitness classes for dorms",
        "Peer-to-peer textbook rental platform",
        "Campus event discovery and planning app"
      ]
    },
    {
      type: 'like' as const,
      users: [
        { name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
        { name: "David Park", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
        { name: "Lisa Zhang", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" }
      ],
      targets: ["EcoTrack", "StudyBuddy AI", "LocalEats", "CampusConnect", "GreenTech"]
    },
    {
      type: 'team' as const,
      users: [
        { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
        { name: "Taylor Brown", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612bad5?w=100&h=100&fit=crop&crop=face" }
      ],
      actions: [
        "joined the team for",
        "applied to join",
        "was invited to join"
      ]
    },
    {
      type: 'launch' as const,
      users: [
        { name: "Chris Wang", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
        { name: "Kelly Johnson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" }
      ],
      launches: [
        "launched their MVP for",
        "went live with",
        "soft-launched"
      ]
    },
    {
      type: 'view' as const,
      users: [
        { name: "Amy Foster", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
        { name: "Ryan Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" }
      ],
      viewActions: [
        "browsed startup profiles",
        "explored idea categories",
        "discovered new projects"
      ]
    }
  ];

  const activityType = activities[Math.floor(Math.random() * activities.length)];
  const user = activityType.users[Math.floor(Math.random() * activityType.users.length)];
  const now = new Date();
  const timestamp = new Date(now.getTime() - Math.random() * 3600000).toISOString(); // Random time within last hour

  let content = "";
  let metadata = {};

  switch (activityType.type) {
    case 'idea':
      const idea = (activityType as any).ideas[Math.floor(Math.random() * (activityType as any).ideas.length)];
      content = `shared a new startup idea: "${idea}"`;
      metadata = { ideaTitle: idea };
      break;
    case 'like':
      const target = (activityType as any).targets[Math.floor(Math.random() * (activityType as any).targets.length)];
      content = `liked ${target}`;
      break;
    case 'team':
      const action = (activityType as any).actions[Math.floor(Math.random() * (activityType as any).actions.length)];
      const project = ["EcoTrack", "StudyBuddy AI", "LocalEats"][Math.floor(Math.random() * 3)];
      content = `${action} ${project}`;
      metadata = { teamSize: Math.floor(Math.random() * 5) + 2 };
      break;
    case 'launch':
      const launchAction = (activityType as any).launches[Math.floor(Math.random() * (activityType as any).launches.length)];
      const launchProject = ["EcoTrack", "StudyBuddy AI", "LocalEats"][Math.floor(Math.random() * 3)];
      content = `${launchAction} ${launchProject}`;
      break;
    case 'view':
      const viewAction = (activityType as any).viewActions[Math.floor(Math.random() * (activityType as any).viewActions.length)];
      content = viewAction;
      metadata = { views: Math.floor(Math.random() * 50) + 10 };
      break;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: activityType.type,
    user,
    content,
    timestamp,
    metadata
  };
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'idea': return Lightbulb;
    case 'like': return Heart;
    case 'comment': return MessageCircle;
    case 'team': return UserPlus;
    case 'launch': return Zap;
    case 'view': return Eye;
    default: return Activity;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'idea': return 'text-yellow-500';
    case 'like': return 'text-red-500';
    case 'comment': return 'text-blue-500';
    case 'team': return 'text-green-500';
    case 'launch': return 'text-purple-500';
    case 'view': return 'text-gray-500';
    default: return 'text-primary';
  }
};

const formatTimestamp = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  const handleLike = useCallback((id: string, userName: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        toast({ title: "❤️ Liked!", description: `You liked ${userName}'s activity.` });
      }
      return next;
    });
  }, [toast]);

  const handleComment = useCallback((id: string) => {
    setCommentingId(prev => prev === id ? null : id);
    setCommentText("");
  }, []);

  const submitComment = useCallback((id: string) => {
    if (!commentText.trim()) return;
    setComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), commentText.trim()]
    }));
    setCommentText("");
    toast({ title: "💬 Comment added!" });
  }, [commentText, toast]);

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));

    // Add new activity every 3-8 seconds
    const interval = setInterval(() => {
      if (isLive) {
        const newActivity = generateActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only latest 20
      }
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const totalUsers = 2547;
  const activeNow = 127;
  const ideasToday = 23;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Live Activity</Badge>
          <h2 className="text-4xl font-bold mb-4">What's Happening Right Now</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See real-time activity from our community of student entrepreneurs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold text-green-500">{activeNow}</span>
                </div>
                <p className="text-sm text-muted-foreground">Active now</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-primary">{totalUsers}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total members</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">{ideasToday}</span>
                </div>
                <p className="text-sm text-muted-foreground">Ideas shared today</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Activity Feed
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isLive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsLive(!isLive)}
                  >
                    {isLive ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        Live
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Paused
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="p-4 space-y-4">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClass = getActivityColor(activity.type);
                    
                    return (
                      <div key={activity.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => toast({ title: `👤 ${activity.user.name}`, description: "Community member active in the startup ecosystem." })}>
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => toast({ title: `👤 ${activity.user.name}`, description: "Community member active in the startup ecosystem." })}>{activity.user.name}</span>
                              <Icon className={`w-4 h-4 ${colorClass}`} />
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {activity.content}
                            </p>
                            
                            {activity.metadata?.teamSize && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                Team size: {activity.metadata.teamSize}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-8 w-8 p-0 ${likedIds.has(activity.id) ? 'text-red-500' : ''}`}
                              onClick={() => handleLike(activity.id, activity.user.name)}
                            >
                              <Heart className={`w-3 h-3 ${likedIds.has(activity.id) ? 'fill-current' : ''}`} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-8 w-8 p-0 ${commentingId === activity.id ? 'text-primary' : ''}`}
                              onClick={() => handleComment(activity.id)}
                            >
                              <MessageCircle className={`w-3 h-3 ${(comments[activity.id]?.length) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>

                        {/* Comments section */}
                        {(comments[activity.id]?.length > 0 || commentingId === activity.id) && (
                          <div className="ml-11 mt-2 space-y-2">
                            {comments[activity.id]?.map((c, i) => (
                              <p key={i} className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-1.5">
                                {c}
                              </p>
                            ))}
                            {commentingId === activity.id && (
                              <div className="flex gap-2">
                                <Input
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Write a comment..."
                                  className="h-8 text-xs"
                                  onKeyDown={(e) => e.key === 'Enter' && submitComment(activity.id)}
                                />
                                <Button size="sm" className="h-8 text-xs px-3" onClick={() => submitComment(activity.id)}>
                                  Post
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <LiveChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

          {/* Quick Actions */}
          <div className="mt-8 text-center space-y-4">
            <h3 className="text-lg font-semibold">Join the Activity</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => setChatOpen(!chatOpen)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {chatOpen ? "Close Chat" : "Live Chat"}
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/create'}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Share Your Idea
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/discover'}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore Startups
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/match'}>
                <Users className="w-4 h-4 mr-2" />
                Find Team Members
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}