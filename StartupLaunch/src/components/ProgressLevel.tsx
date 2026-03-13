import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lock } from "lucide-react";

interface Level {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

interface ProgressLevelProps {
  levels: Level[];
}

export const ProgressLevel = ({ levels }: ProgressLevelProps) => {
  return (
    <div className="space-y-4">
      {levels.map((level, index) => (
        <div key={level.id} className="flex items-center gap-4 group">
          <div className="flex-shrink-0">
            {level.isCompleted ? (
              <CheckCircle className="w-8 h-8 text-success fill-current" />
            ) : level.isCurrent ? (
              <Circle className="w-8 h-8 text-primary fill-current" />
            ) : level.isLocked ? (
              <Lock className="w-8 h-8 text-muted-foreground" />
            ) : (
              <Circle className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${
                level.isCurrent ? 'text-primary' : 
                level.isCompleted ? 'text-success' : 
                level.isLocked ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {level.name}
              </h3>
              
              {level.isCurrent && (
                <Badge className="bg-gradient-primary text-primary-foreground">
                  Current
                </Badge>
              )}
              
              {level.isCompleted && (
                <Badge className="bg-success text-success-foreground">
                  Complete
                </Badge>
              )}
            </div>
            
            <p className={`text-sm ${
              level.isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              {level.description}
            </p>
          </div>
          
          {index < levels.length - 1 && (
            <div className="absolute left-4 mt-12 w-0.5 h-8 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
};