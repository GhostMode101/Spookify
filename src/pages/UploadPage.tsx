import { useState, useRef } from "react";
import { Upload, Music, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !file) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }
    setUploading(true);
    // In a real app, this would call api.uploadSong
    await new Promise(r => setTimeout(r, 1500));
    toast.success(`"${title}" uploaded successfully!`);
    setTitle("");
    setArtist("");
    setGenre("");
    setFile(null);
    setUploading(false);
  };

  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Upload Music</h1>
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
        {/* Drop zone */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 bg-surface p-10 transition-colors hover:border-primary/50 hover:bg-surface-hover"
        >
          {file ? (
            <>
              <FileAudio className="h-10 w-10 text-primary" />
              <span className="text-sm text-foreground font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to select an audio file</span>
              <span className="text-xs text-muted-foreground">MP3, WAV, FLAC up to 50MB</span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Song title" className="bg-surface border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artist">Artist *</Label>
          <Input id="artist" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist name" className="bg-surface border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" value={genre} onChange={e => setGenre(e.target.value)} placeholder="e.g. Electronic, Rock, Jazz" className="bg-surface border-border/50" />
        </div>

        <Button type="submit" disabled={uploading} className="w-full gap-2">
          <Music className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Song"}
        </Button>
      </form>
    </div>
  );
};

export default UploadPage;
