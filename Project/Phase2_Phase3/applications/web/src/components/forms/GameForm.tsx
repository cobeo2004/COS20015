import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/supabase/generated";
import { useDevelopers } from "@/hooks/useDevelopers";

interface GameFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (gameData: Database["public"]["Tables"]["games"]["Insert"]) => void;
  initialData?: Database["public"]["Tables"]["games"]["Row"];
  isSubmitting?: boolean;
}

export function GameForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: GameFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    genre: initialData?.genre || undefined,
    price: initialData?.price || undefined,
    release_date: initialData?.release_date
      ? new Date(initialData.release_date).toISOString().split('T')[0]
      : "",
    developer_id: initialData?.developer_id || "",
    cover_image_url: initialData?.cover_image_url || "",
  });

  const { data: developers = [] } = useDevelopers();

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        genre: initialData.genre || undefined,
        price: initialData.price || undefined,
        release_date: initialData.release_date
          ? new Date(initialData.release_date).toISOString().split('T')[0]
          : "",
        developer_id: initialData.developer_id || "",
        cover_image_url: initialData.cover_image_url || "",
      });
    } else {
      // Reset form for new game
      setFormData({
        title: "",
        genre: undefined,
        price: undefined,
        release_date: "",
        developer_id: "",
        cover_image_url: "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gameData: Database["public"]["Tables"]["games"]["Insert"] = {
      title: formData.title,
      genre: formData.genre,
      price: formData.price ? parseFloat(formData.price.toString()) : null,
      release_date: formData.release_date ? new Date(formData.release_date).toISOString() : null,
      developer_id: formData.developer_id || null,
      cover_image_url: formData.cover_image_url || null,
      metadata: null,
    };

    onSubmit(gameData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the game information below."
              : "Fill in the information to add a new game to the platform."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter game title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={formData.genre || ""}
              onValueChange={(value) => handleInputChange("genre", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RPG">RPG</SelectItem>
                <SelectItem value="FPS">FPS</SelectItem>
                <SelectItem value="Strategy">Strategy</SelectItem>
                <SelectItem value="Puzzle">Puzzle</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_date">Release Date</Label>
            <Input
              id="release_date"
              type="date"
              value={formData.release_date}
              onChange={(e) => handleInputChange("release_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developer_id">Developer</Label>
            <Select
              value={formData.developer_id || ""}
              onValueChange={(value) => handleInputChange("developer_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select developer" />
              </SelectTrigger>
              <SelectContent>
                {developers.map((developer) => (
                  <SelectItem key={developer.id} value={developer.id}>
                    {developer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input
              id="cover_image_url"
              type="url"
              value={formData.cover_image_url}
              onChange={(e) => handleInputChange("cover_image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update Game"
                  : "Add Game"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}