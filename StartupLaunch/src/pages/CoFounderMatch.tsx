import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Sparkles, X, Plus, Loader2, ArrowLeft, UserPlus, Star } from "lucide-react";

export default function CoFounderMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [myInterests, setMyInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [domain, setDomain] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("skills, interests, startup_domain").eq("user_id", user.id).single();
    if (data) {
      setMySkills((data as any).skills || []);
      setMyInterests((data as any).interests || []);
      setDomain((data as any).startup_domain || "");
      if (((data as any).skills || []).length > 0 || ((data as any).interests || []).length > 0) {
        setProfileSaved(true);
      }
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      skills: mySkills,
      interests: myInterests,
      startup_domain: domain || null,
    } as any).eq("user_id", user.id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated! ✨" });
      setProfileSaved(true);
    }
    setSaving(false);
  };

  const findMatches = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const resp = await supabase.functions.invoke("match-cofounders");
      if (resp.error) throw resp.error;
      setMatches(resp.data?.matches || []);
      if ((resp.data?.matches || []).length === 0) {
        toast({ title: "No matches yet", description: "As more users join and add skills, matches will appear!" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to find matches", variant: "destructive" });
    }
    setLoading(false);
  };

  const addItem = (type: "skill" | "interest") => {
    if (type === "skill" && skillInput.trim()) {
      if (!mySkills.includes(skillInput.trim())) setMySkills(p => [...p, skillInput.trim()]);
      setSkillInput("");
    } else if (type === "interest" && interestInput.trim()) {
      if (!myInterests.includes(interestInput.trim())) setMyInterests(p => [...p, interestInput.trim()]);
      setInterestInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />Co-Founder Matching
          </div>
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Co-Founder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add your skills and interests to get matched with complementary founders
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Setup */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-primary" />Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Skills</label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., React, Python..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("skill"))} />
                  <Button size="icon" variant="outline" onClick={() => addItem("skill")}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {mySkills.map(s => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}<X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setMySkills(p => p.filter(x => x !== s))} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., AI, EdTech..." value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("interest"))} />
                  <Button size="icon" variant="outline" onClick={() => addItem("interest")}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {myInterests.map(s => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}<X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setMyInterests(p => p.filter(x => x !== s))} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Startup Domain</label>
                <Input placeholder="e.g., FinTech, HealthTech" value={domain} onChange={(e) => setDomain(e.target.value)} />
              </div>

              <Button variant="outline" className="w-full" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              <Button variant="gradient" className="w-full" onClick={findMatches} disabled={loading || !profileSaved}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Finding...</> : <><Sparkles className="w-4 h-4 mr-2" />Find Matches</>}
              </Button>
            </CardContent>
          </Card>

          {/* Matches */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Search className="w-5 h-5" />Recommended Co-Founders
            </h2>
            {matches.length > 0 ? (
              matches.map((match: any) => (
                <Card key={match.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {(match.display_name || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-lg">{match.display_name || "Anonymous"}</h3>
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" />{Math.min(match.match_score * 10, 99)}% Match
                          </Badge>
                        </div>
                        {match.bio && <p className="text-sm text-muted-foreground mb-3">{match.bio}</p>}
                        {match.startup_domain && <p className="text-xs text-muted-foreground mb-2">Domain: {match.startup_domain}</p>}
                        <div className="space-y-2">
                          {(match.skills || []).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground mr-1">Skills:</span>
                              {match.skills.map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                            </div>
                          )}
                          {(match.interests || []).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground mr-1">Interests:</span>
                              {match.interests.map((s: string) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="gradient" onClick={() => toast({ title: "📨 Connection request sent!", description: `Sent to ${match.display_name}` })}>
                            <UserPlus className="w-3 h-3 mr-1" />Connect
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toast({ title: "💬 Message sent!", description: `Conversation started with ${match.display_name}` })}>
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground text-sm">
                    {profileSaved ? 'Click "Find Matches" to discover co-founders' : "Add your skills and interests first, then save your profile"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}