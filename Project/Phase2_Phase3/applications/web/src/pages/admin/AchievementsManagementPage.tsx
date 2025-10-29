import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AchievementsTable } from "@/components/tables/AchievementsTable";
import { AchievementForm } from "@/components/forms/AchievementForm";
import { useAchievements } from "@/hooks/useAchievements";
import {
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from "@/hooks/useAchievementsMutations";
import { useGames } from "@/hooks/useGames";
import { Plus, Search, Filter, Award, Star, Trophy } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";

export default function AchievementsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [minPoints, setMinPoints] = useState<string>("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<
    Database["public"]["Tables"]["achievements"]["Row"] | null
  >(null);
  const [achievementToDelete, setAchievementToDelete] = useState<
    Database["public"]["Tables"]["achievements"]["Row"] | null
  >(null);

  const { data: games = [] } = useGames();
  const { data: achievements = [] } = useAchievements();

  console.log(achievements);

  // Filter achievements based on criteria
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      !searchTerm ||
      achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (achievement.description &&
        achievement.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesGame =
      !selectedGame ||
      selectedGame === "all" ||
      achievement.game_id === selectedGame;

    const matchesMinPoints =
      !minPoints ||
      (achievement.points && achievement.points >= parseInt(minPoints));

    return matchesSearch && matchesGame && matchesMinPoints;
  });

  // Enrich achievements with game data
  const achievementsWithGames = filteredAchievements.map((achievement) => {
    const game = games.find((g) => g.id === achievement.game_id);
    return {
      ...achievement,
      games: game || null,
    };
  });

  const createAchievementMutation = useCreateAchievement();
  const updateAchievementMutation = useUpdateAchievement();
  const deleteAchievementMutation = useDeleteAchievement();

  const handleCreateAchievement = (
    achievementData: Database["public"]["Tables"]["achievements"]["Insert"]
  ) => {
    createAchievementMutation.mutate(achievementData, {
      onSuccess: () => {
        setIsCreateFormOpen(false);
      },
    });
  };

  const handleUpdateAchievement = (
    achievementData: Database["public"]["Tables"]["achievements"]["Update"]
  ) => {
    if (!editingAchievement) return;

    updateAchievementMutation.mutate(
      { id: editingAchievement.id, achievementData },
      {
        onSuccess: () => {
          setEditingAchievement(null);
        },
      }
    );
  };

  const handleDeleteAchievement = () => {
    if (!achievementToDelete) return;

    deleteAchievementMutation.mutate(achievementToDelete.id, {
      onSuccess: () => {
        setAchievementToDelete(null);
      },
    });
  };

  const handleEditAchievement = (
    achievement: Database["public"]["Tables"]["achievements"]["Row"]
  ) => {
    setEditingAchievement(achievement);
  };

  const handleDeleteClick = (
    achievement: Database["public"]["Tables"]["achievements"]["Row"]
  ) => {
    setAchievementToDelete(achievement);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGame("all");
    setMinPoints("");
  };

  const hasActiveFilters =
    searchTerm || (selectedGame && selectedGame !== "all") || minPoints;

  // Calculate statistics
  const totalAchievements = achievements.length;
  const highValueAchievements = achievements.filter(
    (a) => a.points && a.points >= 50
  ).length;
  const totalPoints = achievements.reduce((sum, a) => sum + (a.points || 0), 0);
  const gamesWithAchievements = new Set(achievements.map((a) => a.game_id))
    .size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Achievements Management
              </h1>
              <p className="text-muted-foreground">
                Manage achievements, unlock criteria, and reward systems for
                games.
              </p>
            </div>
            <Button onClick={() => setIsCreateFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Achievements
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalAchievements.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Value
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {highValueAchievements}
                </div>
                <p className="text-xs text-muted-foreground">50+ points</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Points
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalPoints.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Games with Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gamesWithAchievements}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end flex-wrap">
                <div className="min-w-64">
                  <label className="text-sm font-medium mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search achievements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="w-64">
                  <label className="text-sm font-medium mb-2 block">Game</label>
                  <Select value={selectedGame} onValueChange={setSelectedGame}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Games</SelectItem>
                      {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <label className="text-sm font-medium mb-2 block">
                    Min Points
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={minPoints}
                    onChange={(e) => setMinPoints(e.target.value)}
                  />
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                A list of all achievements across games with their details and
                actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementsTable
                achievements={achievementsWithGames}
                onEdit={handleEditAchievement}
                onDelete={handleDeleteClick}
              />
            </CardContent>
          </Card>

          {/* Create Achievement Form */}
          <AchievementForm
            open={isCreateFormOpen}
            onOpenChange={setIsCreateFormOpen}
            onSubmit={handleCreateAchievement}
            isSubmitting={createAchievementMutation.isPending}
          />

          {/* Edit Achievement Form */}
          <AchievementForm
            open={!!editingAchievement}
            onOpenChange={(open) => !open && setEditingAchievement(null)}
            onSubmit={handleUpdateAchievement}
            initialData={editingAchievement || undefined}
            isSubmitting={updateAchievementMutation.isPending}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!achievementToDelete}
            onOpenChange={() => setAchievementToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete the achievement "
                  {achievementToDelete?.name}" and all associated player unlock
                  data. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAchievementToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAchievement}
                  variant="destructive"
                  disabled={deleteAchievementMutation.isPending}
                >
                  {deleteAchievementMutation.isPending
                    ? "Deleting..."
                    : "Delete Achievement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
