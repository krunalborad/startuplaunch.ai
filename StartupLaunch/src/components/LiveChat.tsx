import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  message: string;
  created_at: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("live-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        display_name: profile?.display_name || user.email?.split("@")[0] || "Anonymous",
        avatar_url: profile?.avatar_url || null,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Community Chat
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 px-4" ref={scrollRef as any}>
          <div className="space-y-3 py-2">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.user_id === user?.id ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={msg.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">{msg.display_name[0]}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${msg.user_id === user?.id ? "text-right" : ""}`}>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">{msg.display_name}</p>
                  <div className={`text-sm rounded-lg px-3 py-1.5 ${msg.user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          {user ? (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="h-9 text-sm"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              />
              <Button size="sm" className="h-9 px-3" onClick={handleSend} disabled={sending || !newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              <button onClick={() => (window.location.href = "/auth")} className="text-primary hover:underline">
                Sign in
              </button>{" "}
              to join the chat
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}