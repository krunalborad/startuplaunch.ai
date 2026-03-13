import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Users, TrendingUp, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface StartupCardProps {
  id: string;
  title: string;
  description: string;
  founder: string;
  avatar: string;
  stage: string;
  category: string;
  likes: number;
  comments: number;
  teamSize: string;
  isLiked?: boolean;
}

export const StartupCard = ({ 
  id, title, description, founder, avatar, stage, category, 
  likes: initialLikes, comments, teamSize, isLiked: initialIsLiked = false 
}: StartupCardProps) => {
  const [liked, setLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [following, setFollowing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'idea': return 'bg-primary/10 text-primary';
      case 'mvp': return 'bg-accent/10 text-accent';
      case 'beta': return 'bg-warning/10 text-warning';
      case 'launched': case 'growing': case 'scaling': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    
    if (liked) {
      await supabase.from("startup_likes").delete().eq("user_id", user.id).eq("startup_id", id);
      setLiked(false);
      setLikeCount(prev => prev - 1);
      toast({ title: "Removed like" });
    } else {
      await supabase.from("startup_likes").insert({ user_id: user.id, startup_id: id });
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast({ title: "❤️ Liked!" });
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    
    if (following) {
      await supabase.from("startup_follows").delete().eq("user_id", user.id).eq("startup_id", id);
      setFollowing(false);
      toast({ title: "Unfollowed" });
    } else {
      await supabase.from("startup_follows").insert({ user_id: user.id, startup_id: id });
      setFollowing(true);
      toast({ title: "🚀 Following!" });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/startup/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "🔗 Link copied!" });
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {title[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground">by {founder || "Unknown"}</p>
            </div>
          </div>
          <Badge className={getStageColor(stage)}>{stage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-xs">{category}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /><span>{teamSize}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-1 text-sm transition-all ${liked ? 'text-destructive scale-110' : 'text-muted-foreground hover:text-destructive'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /><span>{likeCount}</span>
            </button>
            <button onClick={handleShare} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={following ? "default" : "outline"} size="sm" className="text-xs" onClick={handleFollow}>
              <TrendingUp className="w-3 h-3 mr-1" />{following ? "Following" : "Follow"}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); navigate(`/startup/${id}`); }}>
              <Eye className="w-3 h-3 mr-1" />View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};