import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Star, Calendar, Clock, ArrowLeft, Loader2, BookOpen, Users } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  avatar_url: string | null;
  available_slots: { day: string; time: string }[];
  rating: number;
  sessions_completed: number;
}

export default function Mentors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [topic, setTopic] = useState("");
  const [booking, setBooking] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMentors();
    if (user) fetchMyBookings();
  }, [user]);

  const fetchMentors = async () => {
    const { data } = await supabase.from("mentors").select("*").order("rating", { ascending: false });
    setMentors((data as any[]) || []);
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    if (!user) return;
    const { data } = await supabase.from("bookings").select("*, mentors(name, title)").eq("user_id", user.id).order("scheduled_at", { ascending: true });
    setMyBookings((data as any[]) || []);
  };

  const handleBook = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!bookingMentor || !selectedSlot) return;
    setBooking(true);

    const slot = bookingMentor.available_slots[parseInt(selectedSlot)];
    const nextDate = getNextDayDate(slot.day, slot.time);

    const { error } = await supabase.from("bookings").insert({
      mentor_id: bookingMentor.id,
      user_id: user.id,
      scheduled_at: nextDate.toISOString(),
      topic: topic || null,
      status: "confirmed",
    });

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Session Booked! 🎉", description: `Your session with ${bookingMentor.name} is confirmed.` });
      setBookingMentor(null);
      setSelectedSlot("");
      setTopic("");
      fetchMyBookings();
    }
    setBooking(false);
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Cancel failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Session Cancelled",
      description: "Your mentor session has been cancelled.",
    });

    fetchMyBookings();
  };

  const getNextDayDate = (day: string, time: string) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const targetDay = days.indexOf(day);
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    const [hours, minutes] = time.split(":").map(Number);
    target.setHours(hours, minutes, 0, 0);
    return target;
  };

  const filtered = mentors.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />Expert Mentors
          </div>
          <h1 className="text-4xl font-bold mb-4">Book a Mentor Session</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized guidance from experienced entrepreneurs and industry experts
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {myBookings.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Your Upcoming Sessions
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {myBookings
                    .filter(b => new Date(b.scheduled_at) > new Date() && b.status !== "cancelled")
                    .map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{(b.mentors as any)?.name || "Mentor"}</p>
                          <p className="text-sm text-muted-foreground">{(b.mentors as any)?.title}</p>
                          {b.topic && <p className="text-xs text-muted-foreground mt-1">Topic: {b.topic}</p>}
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">{new Date(b.scheduled_at).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(b.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>

                          <Badge variant="secondary" className="mt-1">{b.status}</Badge>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => cancelBooking(b.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-6">
            <div className="relative max-w-md">
              <Input placeholder="Search by name or expertise..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {mentor.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.title}</p>

                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="flex items-center gap-1 text-warning">
                            <Star className="w-3 h-3 fill-current" />
                            {mentor.rating}
                          </span>

                          <span className="text-muted-foreground">
                            {mentor.sessions_completed} sessions
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3">{mentor.bio}</p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {mentor.expertise.map(e => (
                        <Badge key={e} variant="secondary" className="text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Available: {mentor.available_slots.map(s => `${s.day} ${s.time}`).join(", ")}
                    </div>

                    <Button
                      variant="gradient"
                      className="w-full mt-4"
                      onClick={() => {
                        if (!user) navigate("/auth");
                        else setBookingMentor(mentor);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!bookingMentor} onOpenChange={() => setBookingMentor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Session with {bookingMentor?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time Slot</label>

              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a slot" />
                </SelectTrigger>

                <SelectContent>
                  {bookingMentor?.available_slots.map((slot, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {slot.day} at {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic (Optional)</label>
              <Textarea
                placeholder="What would you like to discuss?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <Button
              variant="gradient"
              className="w-full"
              onClick={handleBook}
              disabled={booking || !selectedSlot}
            >
              {booking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}