import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  CheckCircle, 
  Circle,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Lightbulb
} from "lucide-react";

interface SlideData {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  required: boolean;
}

export default function PitchDeckBuilder() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([
    {
      id: "problem",
      title: "Problem Statement",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "solution",
      title: "Solution",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "market",
      title: "Market Opportunity",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "product",
      title: "Product Demo",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "business",
      title: "Business Model",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "competition",
      title: "Competition",
      content: "",
      completed: false,
      required: false
    },
    {
      id: "traction",
      title: "Traction",
      content: "",
      completed: false,
      required: false
    },
    {
      id: "team",
      title: "Team",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "financials",
      title: "Financial Projections",
      content: "",
      completed: false,
      required: true
    },
    {
      id: "funding",
      title: "Funding Ask",
      content: "",
      completed: false,
      required: true
    }
  ]);

  const updateSlide = (content: string) => {
    setSlides(prev => prev.map((slide, index) => 
      index === currentSlide 
        ? { ...slide, content, completed: content.length > 50 }
        : slide
    ));
  };

  const completedSlides = slides.filter(slide => slide.completed).length;
  const progress = (completedSlides / slides.length) * 100;

  const slidePrompts = {
    problem: "Describe the key problem your startup solves. What pain point are you addressing? Who experiences this problem and how significant is it?",
    solution: "Explain your solution clearly. How does it solve the problem? What makes it unique or better than existing alternatives?",
    market: "Define your target market size and opportunity. Use TAM, SAM, and SOM if possible. Show market growth trends.",
    product: "Showcase your product features and benefits. Include screenshots, demos, or prototypes if available.",
    business: "Explain how you make money. What's your revenue model? Pricing strategy? Unit economics?",
    competition: "Identify your main competitors and show your competitive advantages. How do you differentiate?",
    traction: "Share your progress metrics, user growth, revenue, partnerships, or other validation points.",
    team: "Introduce your founding team and key advisors. Highlight relevant experience and expertise.",
    financials: "Present your financial projections for the next 3-5 years. Include revenue, expenses, and key metrics.",
    funding: "Specify how much funding you need and how you'll use it. Break down the use of funds."
  };

  const getSlideIcon = (slideId: string) => {
    const iconMap = {
      problem: Target,
      solution: Lightbulb,
      market: TrendingUp,
      product: FileText,
      business: DollarSign,
      competition: Users,
      traction: TrendingUp,
      team: Users,
      financials: DollarSign,
      funding: DollarSign
    };
    const Icon = iconMap[slideId as keyof typeof iconMap] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Pitch Deck Builder
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress: {completedSlides}/{slides.length} slides completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Slide Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Slides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {slides.map((slide, index) => (
              <Button
                key={slide.id}
                variant={currentSlide === index ? "default" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setCurrentSlide(index)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    {slide.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    {getSlideIcon(slide.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {slide.title}
                    </div>
                    {slide.required && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Slide Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSlideIcon(slides[currentSlide].id)}
              {slides[currentSlide].title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {slidePrompts[slides[currentSlide].id as keyof typeof slidePrompts]}
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Slide Title
                    </label>
                    <Input 
                      placeholder="Enter slide title..."
                      defaultValue={slides[currentSlide].title}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Content
                    </label>
                    <Textarea
                      placeholder="Write your slide content here..."
                      value={slides[currentSlide].content}
                      onChange={(e) => updateSlide(e.target.value)}
                      className="min-h-[300px]"
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      {slides[currentSlide].content.length} characters
                      {slides[currentSlide].content.length < 50 && " (add at least 50 characters to mark as complete)"}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                      disabled={currentSlide === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                      disabled={currentSlide === slides.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Design customization coming soon!</p>
                  <p className="text-sm">Templates, themes, and layout options</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}