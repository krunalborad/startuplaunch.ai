import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Quote, 
  ExternalLink, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { successStories } from "@/data/successStories";

export default function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredStories = filter === "all" 
    ? successStories 
    : successStories.filter(story => story.category.toLowerCase() === filter);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % filteredStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const featuredStory = filteredStories[currentStory];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Success Stories</Badge>
          <h2 className="text-4xl font-bold mb-4">From Dorm Room to Boardroom</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real students who turned their crazy ideas into thriving businesses
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-12">
          {["all", "cleantech", "edtech", "foodtech"].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {category === "all" ? "All Stories" : category}
            </Button>
          ))}
        </div>

        {/* Featured Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Story Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={featuredStory.avatar} />
                      <AvatarFallback>{featuredStory.founder[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{featuredStory.founder}</h3>
                      <p className="text-sm text-muted-foreground">Founder of {featuredStory.companyName}</p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                    <p className="text-lg leading-relaxed pl-6">
                      {featuredStory.quote}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{featuredStory.category}</Badge>
                    <Badge variant="secondary">Founded {featuredStory.founded}</Badge>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {featuredStory.description}
                  </p>

                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/success-story/${featuredStory.id}`)}
                    >
                      View Story
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={prevStory}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={nextStory}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 flex flex-col justify-center">
                  <h4 className="font-semibold mb-6 text-center">Company Metrics</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">{featuredStory.metrics.users}</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="w-6 h-6 text-success" />
                      </div>
                      <div className="text-2xl font-bold text-success">{featuredStory.metrics.revenue}</div>
                      <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <div className="text-2xl font-bold text-accent">{featuredStory.metrics.funding}</div>
                      <div className="text-xs text-muted-foreground">Funding Raised</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-warning" />
                      </div>
                      <div className="text-2xl font-bold text-warning">{featuredStory.metrics.team}</div>
                      <div className="text-xs text-muted-foreground">Team Size</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <Card 
              key={story.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                index === currentStory ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentStory(index)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.founder[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{story.companyName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{story.founder}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {story.metrics.users} users
                  </Badge>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of students who've already started their entrepreneurial journey
          </p>
          <Button size="lg" className="bg-gradient-primary" onClick={() => window.location.href = '/create'}>
            Start Your Startup Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}