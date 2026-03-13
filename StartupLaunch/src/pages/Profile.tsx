import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StartupCard } from "@/components/StartupCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Mail, Settings, Plus, TrendingUp, Heart, Loader2, LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Profile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myStartups, setMyStartups] = useState<any[]>([]);
  const [likedStartups, setLikedStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ display_name: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, startupsRes, likesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("startups").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("startup_likes").select("startup_id").eq("user_id", user.id),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setEditForm({ display_name: profileRes.data.display_name || "", bio: profileRes.data.bio || "" });
    }
    setMyStartups(startupsRes.data || []);

    if (likesRes.data && likesRes.data.length > 0) {
      const ids = likesRes.data.map(l => l.startup_id);
      const { data: liked } = await supabase.from("startups").select("*").in("id", ids);
      setLikedStartups(liked || []);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: editForm.display_name,
      bio: editForm.bio,
    }).eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated! ✨" });
      setEditOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({ title: "Signed out", description: "See you next time!" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {(profile?.display_name || user?.email || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mb-2">{profile?.display_name || "User"}</h1>
                <p className="text-muted-foreground mb-4">{profile?.bio || "No bio yet"}</p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center justify-center gap-2"><Mail className="w-4 h-4" /><span>{user?.email}</span></div>
                  <div className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" /><span>Joined {new Date(profile?.created_at || "").toLocaleDateString()}</span></div>
                </div>
                <Button variant="outline" className="w-full mb-2" onClick={() => setEditOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" />Edit Profile
                </Button>
                <Button variant="gradient" className="w-full mb-2" onClick={() => navigate("/create")}>
                  <Plus className="w-4 h-4 mr-2" />Create Startup
                </Button>
                <Button variant="ghost" className="w-full text-destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />Sign Out
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center"><div className="text-2xl font-bold text-primary">{myStartups.length}</div><div className="text-sm text-muted-foreground">Created</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-primary">{likedStartups.length}</div><div className="text-sm text-muted-foreground">Liked</div></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="created" className="space-y-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="created">My Startups ({myStartups.length})</TabsTrigger>
                <TabsTrigger value="liked">Liked ({likedStartups.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="created">
                {myStartups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myStartups.map(s => (
                      <div key={s.id} onClick={() => navigate(`/startup/${s.id}`)} className="cursor-pointer hover:scale-105 transition-transform">
                        <StartupCard id={s.id} title={s.title} description={s.description || ""} founder={profile?.display_name || ""} avatar="" stage={s.stage} category={s.category} likes={0} comments={0} teamSize={s.team_size || "TBD"} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No startups yet</h3>
                    <Button variant="gradient" onClick={() => navigate("/create")}><Plus className="w-4 h-4 mr-2" />Create Your First</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="liked">
                {likedStartups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likedStartups.map(s => (
                      <div key={s.id} onClick={() => navigate(`/startup/${s.id}`)} className="cursor-pointer hover:scale-105 transition-transform">
                        <StartupCard id={s.id} title={s.title} description={s.description || ""} founder="" avatar="" stage={s.stage} category={s.category} likes={0} comments={0} teamSize={s.team_size || "TBD"} isLiked />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No liked startups</h3>
                    <Button variant="gradient" onClick={() => navigate("/discover")}><Plus className="w-4 h-4 mr-2" />Discover Startups</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input value={editForm.display_name} onChange={(e) => setEditForm(p => ({ ...p, display_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea value={editForm.bio} onChange={(e) => setEditForm(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <Button variant="gradient" className="w-full" onClick={handleSaveProfile} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}