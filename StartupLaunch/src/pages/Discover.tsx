import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StartupCard } from "@/components/StartupCard";
import { Search, Filter, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Startup {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  team_size: string | null;
  owner_id: string;
  created_at: string;
  looking_for: string[];
  skills: string[];
  website: string | null;
  owner_name?: string;
  like_count: number;
  is_liked: boolean;
}

const categories = ["All", "Technology", "Healthcare", "Finance", "Education", "Environmental", "E-commerce", "Social Impact", "Gaming", "Food & Beverage", "Travel", "Other"];
const stages = ["All", "Idea", "MVP", "Beta", "Launched", "Growing", "Scaling"];
const sortOptions = ["Newest", "Most Liked"];

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchStartups = async () => {
    setLoading(true);
    const { data: startupsData, error } = await supabase
      .from("startups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !startupsData) {
      setLoading(false);
      return;
    }

    // Get like counts
    const { data: likeCounts } = await supabase
      .from("startup_likes")
      .select("startup_id");

    // Get user's likes
    let userLikes: string[] = [];
    if (user) {
      const { data: ul } = await supabase
        .from("startup_likes")
        .select("startup_id")
        .eq("user_id", user.id);
      userLikes = (ul || []).map(l => l.startup_id);
    }

    // Get owner profiles
    const ownerIds = [...new Set(startupsData.map(s => s.owner_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", ownerIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p.display_name]));
    const likeCountMap = new Map<string, number>();
    (likeCounts || []).forEach(l => {
      likeCountMap.set(l.startup_id, (likeCountMap.get(l.startup_id) || 0) + 1);
    });

    setStartups(startupsData.map(s => ({
      ...s,
      looking_for: s.looking_for || [],
      skills: s.skills || [],
      owner_name: profileMap.get(s.owner_id) || "Unknown",
      like_count: likeCountMap.get(s.id) || 0,
      is_liked: userLikes.includes(s.id),
    })));
    setLoading(false);
  };

  useEffect(() => { fetchStartups(); }, [user]);

  const filtered = startups.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchStage = selectedStage === "All" || s.stage === selectedStage;
    return matchSearch && matchCat && matchStage;
  }).sort((a, b) => sortBy === "Most Liked" ? b.like_count - a.like_count : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Search className="w-4 h-4" />Discover Startups
          </div>
          <h1 className="text-4xl font-bold mb-4">Explore Ideas & Join Teams</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Find exciting startups to join, follow, or get inspired by</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search startups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stage</label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{sortOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{filtered.length} startups found</span>
            </div>
            <Button variant="gradient" size="sm" onClick={() => navigate(user ? "/create" : "/auth")}>
              <Plus className="w-4 h-4 mr-2" />Create Startup
            </Button>
          </div>
        </div>

        {(selectedCategory !== "All" || selectedStage !== "All" || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>Search: "{searchTerm}" ×</Badge>}
            {selectedCategory !== "All" && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("All")}>Category: {selectedCategory} ×</Badge>}
            {selectedStage !== "All" && <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedStage("All")}>Stage: {selectedStage} ×</Badge>}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((startup) => (
              <div key={startup.id} onClick={() => navigate(`/startup/${startup.id}`)} className="cursor-pointer transform transition-all hover:scale-105">
                <StartupCard
                  id={startup.id}
                  title={startup.title}
                  description={startup.description || ""}
                  founder={startup.owner_name || "Unknown"}
                  avatar=""
                  stage={startup.stage}
                  category={startup.category}
                  likes={startup.like_count}
                  comments={0}
                  teamSize={startup.team_size || "TBD"}
                  isLiked={startup.is_liked}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No startups found</h3>
            <p className="text-muted-foreground mb-6">Be the first to create one!</p>
            <Button variant="gradient" onClick={() => navigate(user ? "/create" : "/auth")}>
              <Plus className="w-4 h-4 mr-2" />Create the First One
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}