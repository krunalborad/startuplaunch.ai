import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus, Search, User, Home, TrendingUp, LogIn, Brain, Users, GraduationCap, BarChart3, Video } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: TrendingUp },
    { label: "Discover", path: "/discover", icon: Search },
    { label: "Validate", path: "/validate", icon: Brain },
    { label: "Co-Founders", path: "/match", icon: Users },
    { label: "Mentors", path: "/mentors", icon: GraduationCap },
    { label: "Progress", path: "/progress", icon: BarChart3 },
    { label: "StartupTV", path: "/startup-tv", icon: Video },
    ...(user ? [{ label: "Profile", path: "/profile", icon: User }] : []),
  ];

  const handleNavigation = (path: string) => {
    if (!user && ["/dashboard", "/create", "/profile", "/validate", "/match", "/progress", "/startup-tv"].includes(path)) {
      navigate("/auth");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => handleNavigation("/home")} className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              StartupLaunch
            </button>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button key={item.path} onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                    <Icon className="w-4 h-4" />{item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Button variant="gradient" onClick={() => handleNavigation("/create")}>
                <Plus className="w-4 h-4 mr-2" />Create Startup
              </Button>
            ) : (
              <Button variant="gradient" onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4 mr-2" />Sign In
              </Button>
            )}
          </div>
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button key={item.path} onClick={() => handleNavigation(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`}>
                        <Icon className="w-5 h-5" />{item.label}
                      </button>
                    );
                  })}
                  {!user && (
                    <Button variant="gradient" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                      <LogIn className="w-4 h-4 mr-2" />Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};