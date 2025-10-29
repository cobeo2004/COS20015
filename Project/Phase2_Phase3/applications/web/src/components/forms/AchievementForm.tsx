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
import { useGames } from "@/hooks/useGames";

interface AchievementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    achievementData: Database["public"]["Tables"]["achievements"]["Insert"]
  ) => void;
  initialData?: Database["public"]["Tables"]["achievements"]["Row"];
  isSubmitting?: boolean;
}

export function AchievementForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AchievementFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    points: initialData?.points?.toString() || "10",
    game_id: initialData?.game_id || "",
    unlock_criteria: initialData?.unlock_criteria
      ? JSON.stringify(initialData.unlock_criteria, null, 2)
      : '{\n  "type": "score",\n  "target": 1000,\n  "difficulty": "easy"\n}',
  });

  const { data: games = [] } = useGames();

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        points: initialData.points?.toString() || "10",
        game_id: initialData.game_id || "",
        unlock_criteria: initialData.unlock_criteria
          ? JSON.stringify(initialData.unlock_criteria, null, 2)
          : '{\n  "type": "score",\n  "target": 1000,\n  "difficulty": "easy"\n}',
      });
    } else {
      // Reset form for new achievement
      setFormData({
        name: "",
        description: "",
        points: "10",
        game_id: "",
        unlock_criteria:
          '{\n  "type": "score",\n  "target": 1000,\n  "difficulty": "easy"\n}',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let unlockCriteria = null;
    if (formData.unlock_criteria.trim()) {
      try {
        unlockCriteria = JSON.parse(formData.unlock_criteria);
      } catch {
        alert(
          "Invalid JSON format for unlock criteria. Please check your input."
        );
        return;
      }
    }

    const achievementData: Database["public"]["Tables"]["achievements"]["Insert"] =
      {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        points: parseInt(formData.points) || 0,
        game_id: formData.game_id,
        unlock_criteria: unlockCriteria,
      };

    onSubmit(achievementData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Achievement" : "Add New Achievement"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the achievement information below."
              : "Fill in the information to add a new achievement to a game."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Achievement Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter achievement name"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter achievement description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => handleInputChange("points", e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="game_id">Game *</Label>
              <Select
                value={formData.game_id || ""}
                onValueChange={(value) => handleInputChange("game_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlock_criteria">Unlock Criteria (JSON)</Label>
            <textarea
              id="unlock_criteria"
              value={formData.unlock_criteria}
              onChange={(e) =>
                handleInputChange("unlock_criteria", e.target.value)
              }
              placeholder='{"type": "score" | "time" | "completion" , "target": number, "difficulty": "easy" | "medium" | "hard"}'
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground">
              Enter unlock criteria in JSON format. Example:{" "}
              {`{"type": "score", "target": 1000, "difficulty": "easy"}`}
            </p>
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
              disabled={
                isSubmitting || !formData.name.trim() || !formData.game_id
              }
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Achievement"
                : "Add Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
