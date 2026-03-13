import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, Image, Upload, Play, User, Clock, X, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Pitch {
  id: string;
  user_id: string;
  startup_name: string;
  founder_name: string;
  email: string;
  description: string | null;
  video_url: string | null;
  document_urls: string[] | null;
  image_urls: string[] | null;
  created_at: string;
}

const StartupTV = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    startup_name: "",
    founder_name: "",
    email: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    const { data } = await supabase
      .from("pitches")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPitches(data as Pitch[]);
      if (data.length > 0 && !selectedPitch) setSelectedPitch(data[0] as Pitch);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file);

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to upload a pitch." });
      return;
    }

    if (!form.startup_name || !form.founder_name || !form.email) {
      toast({ title: "Missing fields", description: "Please fill in all required fields." });
      return;
    }

    setLoading(true);

    try {
      let video_url = null;
      let document_urls: string[] = [];
      let image_urls: string[] = [];

      if (videoFile) video_url = await uploadFile(videoFile, "pitch-videos");

      for (const f of docFiles) {
        const url = await uploadFile(f, "pitch-documents");
        document_urls.push(url);
      }

      for (const f of imgFiles) {
        const url = await uploadFile(f, "pitch-images");
        image_urls.push(url);
      }

      const { error } = await supabase.from("pitches").insert({
        user_id: user.id,
        startup_name: form.startup_name,
        founder_name: form.founder_name,
        email: form.email,
        description: form.description,
        video_url,
        document_urls,
        image_urls,
      });

      if (error) throw error;

      toast({
        title: "🎬 Pitch uploaded!",
        description: "Your startup pitch is now live.",
      });

      setForm({
        startup_name: "",
        founder_name: "",
        email: "",
        description: "",
      });

      setVideoFile(null);
      setDocFiles([]);
      setImgFiles([]);

      fetchPitches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePitch = async (pitchId: string) => {
    try {
      const { error } = await supabase
        .from("pitches")
        .delete()
        .eq("id", pitchId);

      if (error) throw error;

      toast({
        title: "Pitch removed",
        description: "Your pitch has been deleted.",
      });

      if (selectedPitch?.id === pitchId) setSelectedPitch(null);

      fetchPitches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">StartupTV</h1>
        </div>

        <p className="text-muted-foreground mb-8">Upload Your Startup Pitch</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM (UNCHANGED) */}
          <div className="space-y-4">

            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Startup Name"
                value={form.startup_name}
                onChange={(e) => setForm({ ...form, startup_name: e.target.value })}
                className="pl-10 bg-primary/5 border-primary/20"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Founder Name"
                value={form.founder_name}
                onChange={(e) => setForm({ ...form, founder_name: e.target.value })}
                className="pl-10 bg-primary/5 border-primary/20"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground text-sm">✉</span>
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10 bg-primary/5 border-primary/20"
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="pl-10 bg-primary/5 border-primary/20 min-h-[80px]"
              />
            </div>

            {/* YOUR FILE UPLOAD UI (UNCHANGED) */}
            {/* Video */}
            <div className="flex items-center gap-2">
              <div
                onClick={() => videoInputRef.current?.click()}
                className="flex-1 flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20 cursor-pointer hover:bg-destructive/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium text-sm">Pitch Video</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {videoFile ? videoFile.name : "Click to upload"}
                    </p>
                  </div>
                </div>
                <Upload className="w-5 h-5 text-primary" />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
              </div>

              {videoFile && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setVideoFile(null);
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Documents */}
            <div
              onClick={() => docInputRef.current?.click()}
              className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Documents</p>
                  <p className="text-xs text-muted-foreground">
                    {docFiles.length > 0 ? `${docFiles.length} file(s)` : "Click to upload"}
                  </p>
                </div>
              </div>

              <Upload className="w-5 h-5 text-primary" />

              <input
                ref={docInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setDocFiles(Array.from(e.target.files || []))}
              />
            </div>

            {/* Images */}
            <div
              onClick={() => imgInputRef.current?.click()}
              className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20 cursor-pointer hover:bg-warning/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm">Images</p>
                  <p className="text-xs text-muted-foreground">
                    {imgFiles.length > 0 ? `${imgFiles.length} file(s)` : "Click to upload"}
                  </p>
                </div>
              </div>

              <Upload className="w-5 h-5 text-primary" />

              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setImgFiles(Array.from(e.target.files || []))}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-primary"
              size="lg"
            >
              {loading ? "Uploading..." : "Upload Pitch"}
            </Button>
          </div>

          {/* RIGHT SIDE PLAYER */}
          <div className="space-y-4">

            <div className="aspect-video bg-muted rounded-xl overflow-hidden flex items-center justify-center border">
              {selectedPitch?.video_url ? (
                <video src={selectedPitch.video_url} controls className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p>Select a pitch to watch</p>
                </div>
              )}
            </div>

            {selectedPitch && (
              <div>

                <h3 className="font-semibold text-lg">
                  {selectedPitch.startup_name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selectedPitch.founder_name}
                </p>

                {selectedPitch.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedPitch.description}
                  </p>
                )}

                {/* DOCUMENTS */}
                {selectedPitch.document_urls && selectedPitch.document_urls.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-1">Documents</p>
                    <div className="flex flex-col gap-1">
                      {selectedPitch.document_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          className="text-sm text-primary underline"
                        >
                          View Document {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* IMAGES */}
                {selectedPitch.image_urls && selectedPitch.image_urls.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-1">Images</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedPitch.image_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          className="rounded-md border object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* All Pitches */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">All Pitches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pitches.map((pitch) => (
              <Card
                key={pitch.id}
                className={`cursor-pointer hover:shadow-md transition-all relative group ${selectedPitch?.id === pitch.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedPitch(pitch)}
              >
                {user?.id === pitch.user_id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePitch(pitch.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
                <CardContent className="p-3">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2 relative overflow-hidden">
                    {pitch.video_url ? (
                      <>
                        <video src={pitch.video_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <Play className="w-6 h-6 text-muted-foreground" />
                    )}
                    {selectedPitch?.id === pitch.id && (
                      <Badge className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5">PLAYING</Badge>
                    )}
                  </div>
                  <p className="font-medium text-xs truncate">{pitch.startup_name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(pitch.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {pitches.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">No pitches yet. Be the first to upload!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupTV;