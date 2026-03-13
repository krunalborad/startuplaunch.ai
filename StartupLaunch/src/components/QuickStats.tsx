import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Zap,
  ArrowUp,
  ArrowRight
} from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  change: number;
  icon: any;
  trend: 'up' | 'down' | 'neutral';
}

export default function QuickStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Active Users", value: 1247, change: 12, icon: Users, trend: 'up' },
    { label: "Ideas Today", value: 23, change: 5, icon: Lightbulb, trend: 'up' },
    { label: "Teams Formed", value: 156, change: 3, icon: TrendingUp, trend: 'up' },
    { label: "MVPs Launched", value: 52, change: 1, icon: Zap, trend: 'up' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.value + Math.floor(Math.random() * 3),
        change: Math.floor(Math.random() * 15) + 1,
        trend: 'up'
      })));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 border-b bg-background">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-success/40 text-success">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse mr-1.5" />
                Live
              </Badge>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">{stat.value.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center text-success text-xs">
                    <ArrowUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => window.location.href = '/dashboard'}
          >
            View Dashboard
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}