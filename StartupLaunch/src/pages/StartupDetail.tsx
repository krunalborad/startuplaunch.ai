import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Share2, Users, Calendar, Globe, ArrowLeft, TrendingUp, Target, Lightbulb, Loader2 } from "lucide-react";

export default function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState<any>(null);
  const [ownerName, setOwnerName] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchStartup();
  }, [id, user]);

  const fetchStartup = async () => {
    setLoading(true);
    const { data } = await supabase.from("startups").select("*").eq("id", id).single();
    if (!data) { setLoading(false); return; }
    setStartup(data);

    const [profileRes, likesRes, userLikeRes, userFollowRes] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("user_id", data.owner_id).single(),
      supabase.from("startup_likes").select("id").eq("startup_id", id!),
      user ? supabase.from("startup_likes").select("id").eq("startup_id", id!).eq("user_id", user.id) : Promise.resolve({ data: [] }),
      user ? supabase.from("startup_follows").select("id").eq("startup_id", id!).eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);

    setOwnerName(profileRes.data?.display_name || "Unknown");
    setLikeCount(likesRes.data?.length || 0);
    setIsLiked((userLikeRes.data?.length || 0) > 0);
    setIsFollowing((userFollowRes.data?.length || 0) > 0);
    setLoading(false);
  };

  const handleLike = async () => {
    if (!user) { navigate("/auth"); return; }
    if (isLiked) {
      await supabase.from("startup_likes").delete().eq("user_id", user.id).eq("startup_id", id!);
      setIsLiked(false); setLikeCount(p => p - 1);
    } else {
      await supabase.from("startup_likes").insert({ user_id: user.id, startup_id: id! });
      setIsLiked(true); setLikeCount(p => p + 1);
    }
  };

  const handleFollow = async () => {
    if (!user) { navigate("/auth"); return; }
    if (isFollowing) {
      await supabase.from("startup_follows").delete().eq("user_id", user.id).eq("startup_id", id!);
      setIsFollowing(false);
      toast({ title: "Unfollowed" });
    } else {
      await supabase.from("startup_follows").insert({ user_id: user.id, startup_id: id! });
      setIsFollowing(true);
      toast({ title: "🚀 Following!" });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "🔗 Link Copied!" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!startup) return <div className="min-h-screen flex items-center justify-center"><p>Startup not found</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/discover")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Discover
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">{startup.title[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{startup.title}</h1>
                      <p className="text-muted-foreground">by {ownerName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{startup.stage}</Badge>
                        <Badge variant="outline">{startup.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="w-4 h-4" /></Button>
                    <Button variant={isFollowing ? "secondary" : "gradient"} onClick={handleFollow}>
                      <TrendingUp className="w-4 h-4 mr-2" />{isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
                <p className="text-lg mb-6">{startup.description}</p>
                <div className="flex items-center gap-6">
                  <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /><span>{likeCount}</span>
                  </button>
                  {startup.team_size && <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-5 h-5" /><span>{startup.team_size}</span></div>}
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-5 h-5" /><span>{new Date(startup.created_at).toLocaleDateString()}</span></div>
                  {startup.website && <a href={startup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe className="w-5 h-5" />Website</a>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {startup.looking_for?.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Looking For</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {startup.looking_for.map((role: string, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{role}</span>
                        <Button size="sm" variant="outline" onClick={() => { if (!user) navigate("/auth"); else toast({ title: "Application sent! 📨" }); }}>Apply</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {startup.skills?.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Skills Needed</CardTitle></CardHeader>
                <CardContent><div className="flex flex-wrap gap-2">{startup.skills.map((s: string, i: number) => <Badge key={i} variant="secondary">{s}</Badge>)}</div></CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Interested in Joining?</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect with the team</p>
                <Button variant="gradient" className="w-full" onClick={() => { if (!user) navigate("/auth"); else toast({ title: "Message sent! 💬" }); }}>
                  Contact Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}