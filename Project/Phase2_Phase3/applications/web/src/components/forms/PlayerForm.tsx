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

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (playerData: Database["public"]["Tables"]["players"]["Insert"]) => void;
  initialData?: Database["public"]["Tables"]["players"]["Row"];
  isSubmitting?: boolean;
}

export function PlayerForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: PlayerFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    country: initialData?.country || undefined,
    level: initialData?.level?.toString() || "1",
    total_score: initialData?.total_score?.toString() || "0",
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        email: initialData.email || "",
        country: initialData.country || undefined,
        level: initialData.level?.toString() || "1",
        total_score: initialData.total_score?.toString() || "0",
      });
    } else {
      // Reset form for new player
      setFormData({
        username: "",
        email: "",
        country: undefined,
        level: "1",
        total_score: "0",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerData: Database["public"]["Tables"]["players"]["Insert"] = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      country: formData.country,
      level: parseInt(formData.level) || 1,
      total_score: parseInt(formData.total_score) || 0,
    };

    onSubmit(playerData);
  };

  const handleInputChange = (field: string, value: string) => {
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
            {initialData ? "Edit Player" : "Add New Player"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the player information below."
              : "Fill in the information to add a new player to the platform."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country || ""}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="VN">Vietnam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="100"
                value={formData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_score">Total Score</Label>
              <Input
                id="total_score"
                type="number"
                min="0"
                value={formData.total_score}
                onChange={(e) => handleInputChange("total_score", e.target.value)}
              />
            </div>
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
                isSubmitting ||
                !formData.username.trim() ||
                !formData.email.trim()
              }
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update Player"
                  : "Add Player"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}