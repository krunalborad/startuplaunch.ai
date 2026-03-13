import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressLevel } from "@/components/ProgressLevel";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Lightbulb, 
  Rocket, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Target,
  Plus,
  Settings,
  MessageCircle,
  Share2,
  Bell,
  Calendar,
  FileText,
  BarChart3
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const mockLevels = [
  {
    id: "1",
    name: "🧠 Define Your Idea",
    description: "Transform your vague concept into a clear problem statement",
    isCompleted: true,
    isCurrent: false,
    isLocked: false
  },
  {
    id: "2", 
    name: "🚀 Build MVP",
    description: "Create a minimum viable product to test your hypothesis",
    isCompleted: false,
    isCurrent: true,
    isLocked: false
  },
  {
    id: "3",
    name: "✅ Validate Concept", 
    description: "Get feedback from real users and iterate",
    isCompleted: false,
    isCurrent: false,
    isLocked: false
  },
  {
    id: "4",
    name: "👥 Find Early Users",
    description: "Build your first user base and community",
    isCompleted: false,
    isCurrent: false,
    isLocked: true
  },
  {
    id: "5",
    name: "📈 Scale & Grow",
    description: "Optimize for growth and expansion",
    isCompleted: false,
    isCurrent: false,
    isLocked: true
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string, taskName: string) => {
    setTaskStates(prev => {
      const newState = { ...prev, [taskId]: !prev[taskId] };
      toast({
        title: newState[taskId] ? "✅ Task Completed!" : "Task reopened",
        description: newState[taskId] ? `Great job completing: ${taskName}` : `${taskName} marked as incomplete`,
      });
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h2>
              <p className="text-muted-foreground mb-6">
                You're currently building your MVP. Keep up the momentum!
              </p>
              
              <Card className="bg-gradient-hero/5 border-primary/20 cursor-pointer hover:shadow-medium transition-all" onClick={() => navigate("/startup/1")}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">EcoTrack - Carbon Footprint App</h3>
                      <p className="text-muted-foreground">Help students track and reduce their carbon footprint</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">MVP Stage</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate("/startup/1"); }}>
                      <FileText className="w-3 h-3 mr-1" /> View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { 
                      e.stopPropagation(); 
                      navigator.clipboard.writeText(window.location.origin + "/startup/1");
                      toast({ title: "🔗 Link copied!", description: "Share your startup with others" });
                    }}>
                      <Share2 className="w-3 h-3 mr-1" /> Share
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { 
                      e.stopPropagation(); 
                      toast({ title: "📊 Analytics", description: "47 views this week, 12 new followers!" });
                    }}>
                      <BarChart3 className="w-3 h-3 mr-1" /> Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Levels */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Startup Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressLevel levels={mockLevels} />
              </CardContent>
            </Card>

            {/* Current Tasks */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "wireframes", icon: Rocket, color: "accent", title: "Create MVP Wireframes", desc: "Design the core user interface for your app", action: () => navigate("/create") },
                  { id: "cofounder", icon: Users, color: "primary", title: "Find Co-founder", desc: "Connect with developers and designers", action: () => setTeamDialogOpen(true) },
                  { id: "research", icon: Lightbulb, color: "warning", title: "Market Research", desc: "Analyze competitors and target audience", action: () => toast({ title: "📊 Market Research", description: "Opening competitor analysis tools... Check EdTech market reports for Q1 2024." }) },
                ].map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-center gap-3 p-3 bg-${task.color}/5 rounded-lg border-l-4 border-${task.color} cursor-pointer hover:bg-${task.color}/10 transition-colors group`}
                    onClick={task.action}
                  >
                    <button 
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${taskStates[task.id] ? 'bg-success border-success' : 'border-muted-foreground hover:border-primary'}`}
                      onClick={(e) => { e.stopPropagation(); toggleTask(task.id, task.title); }}
                    >
                      {taskStates[task.id] && <CheckCircle className="w-3 h-3 text-success-foreground" />}
                    </button>
                    <task.icon className={`w-5 h-5 text-${task.color}`} />
                    <div className="flex-1">
                      <h4 className={`font-medium ${taskStates[task.id] ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.desc}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Start →
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="gradient" onClick={() => setProgressDialogOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Update Progress
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setTeamDialogOpen(true)}>
                  <Users className="w-4 h-4" />
                  Find Team Members
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setFeedbackDialogOpen(true)}>
                  <TrendingUp className="w-4 h-4" />
                  Get Feedback
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/discover")}>
                  <Lightbulb className="w-4 h-4" />
                  Explore Startups
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/create")}>
                  <Rocket className="w-4 h-4" />
                  New Startup
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => {
                  toast({ title: "🔔 Notifications", description: "You have 3 new notifications: 2 likes, 1 team request" });
                }}>
                  <Bell className="w-4 h-4" />
                  Notifications
                  <Badge className="ml-auto bg-destructive text-destructive-foreground text-xs">3</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full w-2/5 transition-all duration-500"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button className="text-center hover:bg-muted/50 rounded-lg p-2 transition-colors" onClick={() => toast({ title: "🎉 Levels Complete", description: "You've completed: Define Your Idea & started Build MVP" })}>
                    <div className="text-2xl font-bold text-primary">2</div>
                    <div className="text-xs text-muted-foreground">Levels Complete</div>
                  </button>
                  <button className="text-center hover:bg-muted/50 rounded-lg p-2 transition-colors" onClick={() => toast({ title: "🗺️ Total Journey", description: "5 levels: Idea → MVP → Validate → Users → Scale" })}>
                    <div className="text-2xl font-bold text-accent">5</div>
                    <div className="text-xs text-muted-foreground">Total Levels</div>
                  </button>
                </div>

                <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/profile")}>
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Pitch Practice", time: "Tomorrow, 3 PM", type: "event" },
                  { title: "Mentor Call", time: "Wed, 10 AM", type: "meeting" },
                  { title: "Demo Day", time: "Next Friday", type: "milestone" },
                ].map((event, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors text-left"
                    onClick={() => toast({ title: `📅 ${event.title}`, description: `Scheduled: ${event.time}. Click to add to calendar.` })}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Update Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Progress</DialogTitle>
            <DialogDescription>Select what you've accomplished</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {["Completed wireframes", "Built landing page", "Conducted user interviews", "Wrote business plan", "Created prototype"].map((item) => (
              <Button 
                key={item} 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => { 
                  toast({ title: "🎉 Progress Updated!", description: `Marked as done: ${item}` }); 
                  setProgressDialogOpen(false); 
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> {item}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Find Team Dialog */}
      <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find Team Members</DialogTitle>
            <DialogDescription>Browse available collaborators</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { name: "Jordan Lee", role: "Full-Stack Developer", skills: "React, Node.js" },
              { name: "Priya Patel", role: "UI/UX Designer", skills: "Figma, Tailwind" },
              { name: "Sam Wilson", role: "Marketing Lead", skills: "Growth, SEO" },
            ].map((person) => (
              <div key={person.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.role} · {person.skills}</p>
                </div>
                <Button size="sm" onClick={() => {
                  toast({ title: "📨 Request Sent!", description: `Connection request sent to ${person.name}` });
                }}>
                  Connect
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setTeamDialogOpen(false); navigate("/discover"); }}>
              Browse All Members
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Get Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Feedback</DialogTitle>
            <DialogDescription>Choose how you'd like to get feedback</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              toast({ title: "📝 Survey Created!", description: "A feedback survey has been generated. Share it with your users!" });
              setFeedbackDialogOpen(false);
            }}>
              <FileText className="w-4 h-4 mr-2" /> Create Feedback Survey
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              toast({ title: "💬 Community Post", description: "Your startup has been posted for community feedback!" });
              setFeedbackDialogOpen(false);
            }}>
              <MessageCircle className="w-4 h-4 mr-2" /> Post to Community
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {
              toast({ title: "🎯 Mentor Match", description: "We're matching you with a mentor for personalized feedback!" });
              setFeedbackDialogOpen(false);
            }}>
              <Users className="w-4 h-4 mr-2" /> Request Mentor Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;