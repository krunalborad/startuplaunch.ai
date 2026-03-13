import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lightbulb, Users, Target, Rocket, X } from "lucide-react";

const categories = [
  "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
  "Social Impact", "Gaming", "Food & Beverage", "Travel", "Environmental", "Other"
];

const stages = ["Idea", "MVP", "Beta", "Launched", "Growing", "Scaling"];

export default function CreateStartup() {
  const [formData, setFormData] = useState({
    title: "", description: "", category: "", stage: "",
    lookingFor: [] as string[], skills: [] as string[],
    website: "", teamSize: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [lookingForInput, setLookingForInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/auth"); return; }
    setLoading(true);
    
    const { error } = await supabase.from("startups").insert({
      owner_id: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category || "Other",
      stage: formData.stage || "Idea",
      looking_for: formData.lookingFor,
      skills: formData.skills,
      website: formData.website || null,
      team_size: formData.teamSize || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Startup Created! 🚀", description: "Your startup has been posted to the community." });
      navigate("/discover");
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const addLookingFor = () => {
    if (lookingForInput.trim() && !formData.lookingFor.includes(lookingForInput.trim())) {
      setFormData(prev => ({ ...prev, lookingFor: [...prev.lookingFor, lookingForInput.trim()] }));
      setLookingForInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              Launch Your Idea
            </div>
            <h1 className="text-4xl font-bold mb-4">Create Your Startup</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your idea with the community and start building your team
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Startup Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Startup Name *</label>
                    <Input placeholder="Enter your startup name" value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea placeholder="Describe your startup idea..." value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="min-h-[120px]" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Stage *</label>
                    <Select value={formData.stage} onValueChange={(v) => setFormData(prev => ({ ...prev, stage: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Size</label>
                    <Input placeholder="e.g., 2-3 people" value={formData.teamSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Website/Demo (Optional)</label>
                  <Input placeholder="https://yourwebsite.com" value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Target className="w-4 h-4" />Looking For</label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g., Co-founder, Developer..." value={lookingForInput}
                        onChange={(e) => setLookingForInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLookingFor())} />
                      <Button type="button" onClick={addLookingFor} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.lookingFor.map(item => (
                        <Badge key={item} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, lookingFor: prev.lookingFor.filter(l => l !== item) }))} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4" />Required Skills</label>
                    <div className="flex gap-2">
                      <Input placeholder="e.g., React, Design..." value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                      <Button type="button" onClick={addSkill} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">Cancel</Button>
                  <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
                    <Rocket className="w-4 h-4 mr-2" />
                    {loading ? "Creating..." : "Launch Startup"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}