import { useParams, useNavigate } from "react-router-dom";
import { successStories } from "@/data/successStories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, DollarSign, TrendingUp, Calendar, Quote, ArrowRight, Code } from "lucide-react";

const SuccessStoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // FIX: ensure id is converted safely
  const story = successStories.find((s: any) => s.id === Number(id));

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const metrics = [
    { icon: Users, label: "Active Users", value: story.metrics.users, color: "text-primary", bg: "bg-primary/10" },
    { icon: DollarSign, label: "Monthly Revenue", value: story.metrics.revenue, color: "text-success", bg: "bg-success/10" },
    { icon: TrendingUp, label: "Funding Raised", value: story.metrics.funding, color: "text-accent", bg: "bg-accent/10" },
    { icon: Calendar, label: "Team Size", value: story.metrics.team, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-16 h-16">
            <AvatarImage src={story.avatar} />
            <AvatarFallback>{story.founder[0]}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{story.companyName}</h1>
            <p className="text-muted-foreground">
              Founded by {story.founder} · {story.founded}
            </p>

            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{story.category}</Badge>
              {story.featured && (
                <Badge className="bg-primary/10 text-primary">Featured</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 ${m.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>

                <p className={`text-xl font-bold ${m.color}`}>
                  {m.value}
                </p>

                <p className="text-xs text-muted-foreground">
                  {m.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote */}
        <Card className="mb-10">
          <CardContent className="p-6 relative">
            <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />

            <p className="text-lg leading-relaxed pl-8 italic text-muted-foreground">
              "{story.quote}"
            </p>

            <p className="text-sm font-medium mt-3 pl-8">
              — {story.founder}
            </p>
          </CardContent>
        </Card>

        {/* Story */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The Story</h2>

          <p className="text-muted-foreground leading-relaxed">
            {story.longDescription}
          </p>
        </div>

        {/* Challenges */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Challenges & Lessons
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            {story.challenges}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" /> Tech Stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {story.techStack.map((tech: string) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Journey Timeline
          </h2>

          <div className="space-y-4">
            {story.milestones.map((m: any, i: number) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-24 flex-shrink-0 text-sm font-medium text-primary">
                  {m.date}
                </div>

                <div className="w-3 h-3 rounded-full bg-primary mt-1 flex-shrink-0" />

                <p className="text-muted-foreground">
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
          <CardContent className="p-8 text-center">

            <h3 className="text-2xl font-bold mb-2">
              Inspired by {story.companyName}?
            </h3>

            <p className="text-muted-foreground mb-6">
              Start building your own success story today.
            </p>

            <Button
              size="lg"
              className="bg-gradient-primary"
              onClick={() => navigate("/create")}
            >
              Start Your Startup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SuccessStoryDetail;