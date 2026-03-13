import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap,
  Crown,
  Medal,
  Award,
  CheckCircle,
  Lock,
  Flame,
  TrendingUp,
  Users,
  Lightbulb
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: any;
}

const levels: Level[] = [
  { level: 1, title: "Dreamer", minXP: 0, maxXP: 100, color: "text-gray-500", icon: Lightbulb },
  { level: 2, title: "Ideator", minXP: 100, maxXP: 300, color: "text-blue-500", icon: Star },
  { level: 3, title: "Builder", minXP: 300, maxXP: 600, color: "text-green-500", icon: Target },
  { level: 4, title: "Entrepreneur", minXP: 600, maxXP: 1000, color: "text-purple-500", icon: Zap },
  { level: 5, title: "Founder", minXP: 1000, maxXP: 1500, color: "text-orange-500", icon: Trophy },
  { level: 6, title: "CEO", minXP: 1500, maxXP: 2500, color: "text-red-500", icon: Crown },
];

const achievements: Achievement[] = [
  {
    id: 'first-idea',
    title: 'First Spark',
    description: 'Share your first startup idea',
    icon: Lightbulb,
    unlocked: true,
    rarity: 'common',
    xp: 50
  },
  {
    id: 'team-builder',
    title: 'Team Builder',
    description: 'Form your first team',
    icon: Users,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: 'common',
    xp: 75
  },
  {
    id: 'popular-idea',
    title: 'Crowd Pleaser',
    description: 'Get 50 likes on an idea',
    icon: Star,
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    rarity: 'rare',
    xp: 100
  },
  {
    id: 'mvp-creator',
    title: 'MVP Master',
    description: 'Launch your first MVP',
    icon: Target,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'epic',
    xp: 200
  },
  {
    id: 'investor-ready',
    title: 'Investor Ready',
    description: 'Complete a pitch deck',
    icon: Award,
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    rarity: 'rare',
    xp: 150
  },
  {
    id: 'unicorn',
    title: 'Unicorn Founder',
    description: 'Reach $1B valuation',
    icon: Crown,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'legendary',
    xp: 1000
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'border-gray-400 bg-gray-50';
    case 'rare': return 'border-blue-400 bg-blue-50';
    case 'epic': return 'border-purple-400 bg-purple-50';
    case 'legendary': return 'border-yellow-400 bg-yellow-50';
    default: return 'border-gray-400 bg-gray-50';
  }
};

const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-600';
    case 'rare': return 'text-blue-600';
    case 'epic': return 'text-purple-600';
    case 'legendary': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

export default function GameifiedProgress() {
  const [currentXP] = useState(425);
  const [streak] = useState(7);
  
  const currentLevel = levels.find(level => 
    currentXP >= level.minXP && currentXP < level.maxXP
  ) || levels[0];
  
  const nextLevel = levels.find(level => level.level === currentLevel.level + 1);
  
  const levelProgress = nextLevel 
    ? ((currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalXP = unlockedAchievements.reduce((sum, achievement) => sum + achievement.xp, 0);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Gamified Journey</Badge>
          <h2 className="text-4xl font-bold mb-4">Level Up Your Startup Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn XP, unlock achievements, and track your entrepreneurial progress
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Level & Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Level */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full ${currentLevel.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                      <currentLevel.icon className={`w-8 h-8 ${currentLevel.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Level {currentLevel.level}</h3>
                      <p className={`text-lg font-medium ${currentLevel.color}`}>{currentLevel.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{currentXP} XP</span>
                        {nextLevel && <span>• {nextLevel.minXP - currentXP} XP to next level</span>}
                        <Flame className="w-4 h-4 text-orange-500 ml-2" />
                        <span>{streak} day streak</span>
                      </div>
                    </div>
                  </div>

                  {nextLevel && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Level {nextLevel.level}</span>
                        <span>{Math.round(levelProgress)}%</span>
                      </div>
                      <Progress value={levelProgress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentLevel.title}</span>
                        <span>{nextLevel.title}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements
                    <Badge variant="secondary">{unlockedAchievements.length}/{achievements.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          achievement.unlocked 
                            ? getRarityColor(achievement.rarity) 
                            : 'border-gray-200 bg-gray-50/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.unlocked 
                              ? getRarityColor(achievement.rarity)
                              : 'bg-gray-200'
                          }`}>
                            {achievement.unlocked ? (
                              <achievement.icon className={`w-5 h-5 ${getRarityTextColor(achievement.rarity)}`} />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{achievement.title}</h4>
                              <Badge variant="outline" className={`text-xs ${getRarityTextColor(achievement.rarity)}`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            
                            {achievement.progress !== undefined && achievement.maxProgress && (
                              <div className="space-y-1">
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
                                  className="h-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                                  <span>+{achievement.xp} XP</span>
                                </div>
                              </div>
                            )}
                            
                            {achievement.unlocked && (
                              <div className="flex items-center gap-1 text-xs text-success">
                                <CheckCircle className="w-3 h-3" />
                                <span>+{achievement.xp} XP</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Leaderboard & Quick Actions */}
            <div className="space-y-6">
              {/* Level Path */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Path
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {levels.map((level) => (
                    <div 
                      key={level.level}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        level.level === currentLevel.level 
                          ? 'bg-primary/10 border border-primary/20' 
                          : level.level < currentLevel.level 
                            ? 'opacity-60' 
                            : 'opacity-40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        level.level <= currentLevel.level 
                          ? level.color.replace('text-', 'bg-') + '/10' 
                          : 'bg-gray-100'
                      }`}>
                        {level.level <= currentLevel.level ? (
                          <level.icon className={`w-4 h-4 ${level.color}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{level.title}</span>
                          {level.level === currentLevel.level && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Level {level.level} • {level.minXP} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="w-5 h-5" />
                    Weekly Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Sarah Chen", xp: 850, level: 4, position: 1 },
                    { name: "Alex Rivera", xp: 720, level: 3, position: 2 },
                    { name: "You", xp: currentXP, level: currentLevel.level, position: 3 },
                    { name: "Mike Johnson", xp: 380, level: 3, position: 4 },
                    { name: "Emma Davis", xp: 290, level: 2, position: 5 }
                  ].map((user) => (
                    <div 
                      key={user.position}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        user.name === "You" ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.position === 1 ? 'bg-yellow-100 text-yellow-700' :
                        user.position === 2 ? 'bg-gray-100 text-gray-700' :
                        user.position === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {user.position}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Level {user.level} • {user.xp} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Earn More XP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/create'}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Share New Idea (+50 XP)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/discover'}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Like 5 Ideas (+25 XP)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join a Team (+75 XP)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}