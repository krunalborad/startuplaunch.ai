import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, CheckCircle, ArrowLeft, Loader2, Rocket, Target, Lightbulb, Users, BarChart3 } from "lucide-react";

const STAGES = [
  { name: "Idea", icon: Lightbulb, description: "Define your problem and solution", color: "primary" },
  { name: "Validation", icon: Target, description: "Test your assumptions with real users", color: "accent" },
  { name: "Prototype", icon: Rocket, description: "Build a working prototype", color: "warning" },
  { name: "Beta", icon: Users, description: "Launch to beta users and iterate", color: "success" },
  { name: "Launch", icon: TrendingUp, description: "Go live and acquire users", color: "primary" },
  { name: "Scaling", icon: BarChart3, description: "Grow and optimize", color: "accent" },
];

const MILESTONES: Record<string, string[]> = {
  Idea: ["Problem statement defined", "Solution hypothesis created", "Target audience identified", "Competitor research done"],
  Validation: ["User interviews conducted (10+)", "Survey results analyzed", "Problem-solution fit confirmed", "Value proposition refined"],
  Prototype: ["Wireframes designed", "MVP features listed", "Tech stack chosen", "Working prototype built"],
  Beta: ["Beta users onboarded (50+)", "Feedback collected", "Critical bugs fixed", "Core metrics defined"],
  Launch: ["Marketing website live", "Launch campaign executed", "First paying customers", "Press/media coverage"],
  Scaling: ["Revenue growing MoM", "Team expanded", "Processes automated", "Series A preparation"],
};

export default function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myStartups, setMyStartups] = useState<any[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<string>("");
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState("Idea");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchStartups();
  }, [user]);

  useEffect(() => {
    if (selectedStartup) fetchProgress();
  }, [selectedStartup]);

  const fetchStartups = async () => {
    if (!user) return;
    const { data } = await supabase.from("startups").select("id, title, stage").eq("owner_id", user.id);
    setMyStartups(data || []);
    if (data && data.length > 0) setSelectedStartup(data[0].id);
    setLoading(false);
  };

  const fetchProgress = async () => {
    if (!selectedStartup || !user) return;
    const { data } = await supabase.from("startup_progress").select("*").eq("startup_id", selectedStartup).single();
    if (data) {
      setProgress(data);
      setCurrentStage((data as any).stage || "Idea");
      setCompletedMilestones(((data as any).milestones as string[]) || []);
    } else {
      setCurrentStage("Idea");
      setCompletedMilestones([]);
      setProgress(null);
    }
  };

  const toggleMilestone = (milestone: string) => {
    setCompletedMilestones(prev =>
      prev.includes(milestone) ? prev.filter(m => m !== milestone) : [...prev, milestone]
    );
  };

  const saveProgress = async () => {
    if (!user || !selectedStartup) return;
    setSaving(true);

    const payload = {
      startup_id: selectedStartup,
      user_id: user.id,
      stage: currentStage,
      milestones: completedMilestones,
    };

    let error;
    if (progress) {
      ({ error } = await supabase.from("startup_progress").update({ stage: currentStage, milestones: completedMilestones as any }).eq("id", progress.id));
    } else {
      ({ error } = await supabase.from("startup_progress").insert(payload as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Progress saved! 🎉" });
      // Also update the startup's stage
      await supabase.from("startups").update({ stage: currentStage }).eq("id", selectedStartup);
      fetchProgress();
    }
    setSaving(false);
  };

  const currentStageIndex = STAGES.findIndex(s => s.name === currentStage);
  const overallProgress = Math.round(((currentStageIndex + (completedMilestones.filter(m => MILESTONES[currentStage]?.includes(m)).length / (MILESTONES[currentStage]?.length || 1))) / STAGES.length) * 100);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />Progress Tracking
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Startup Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor milestones and move through stages from idea to scale
          </p>
        </div>

        {myStartups.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="font-semibold mb-2">No startups yet</h3>
              <p className="text-muted-foreground mb-4">Create a startup first to track progress</p>
              <Button variant="gradient" onClick={() => navigate("/create")}>Create Startup</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Startup Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium whitespace-nowrap">Select Startup:</label>
              <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{myStartups.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Overall Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Overall Progress</h3>
                  <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-6">
                  <div className="bg-gradient-primary h-3 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
                </div>

                {/* Stage Pipeline */}
                <div className="flex items-center justify-between gap-1">
                  {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const isCompleted = i < currentStageIndex;
                    const isCurrent = i === currentStageIndex;
                    return (
                      <button key={stage.name} onClick={() => setCurrentStage(stage.name)}
                        className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all text-center ${
                          isCurrent ? 'bg-primary/10 border-2 border-primary' : isCompleted ? 'bg-success/10' : 'bg-muted/30 opacity-60'
                        }`}>
                        <Icon className={`w-5 h-5 mb-1 ${isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-medium">{stage.name}</span>
                        {isCompleted && <CheckCircle className="w-3 h-3 text-success mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Current Stage Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  {currentStage} Stage Milestones
                </CardTitle>
                <p className="text-sm text-muted-foreground">{STAGES.find(s => s.name === currentStage)?.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {(MILESTONES[currentStage] || []).map((milestone) => {
                  const completed = completedMilestones.includes(milestone);
                  return (
                    <button key={milestone} onClick={() => toggleMilestone(milestone)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                        completed ? 'bg-success/5 border-success/30' : 'bg-card hover:bg-muted/50 border-border'
                      }`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        completed ? 'bg-success border-success' : 'border-muted-foreground'
                      }`}>
                        {completed && <CheckCircle className="w-4 h-4 text-success-foreground" />}
                      </div>
                      <span className={`text-sm ${completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>{milestone}</span>
                    </button>
                  );
                })}

                <div className="pt-4">
                  <Button variant="gradient" className="w-full" onClick={saveProgress} disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Progress"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}