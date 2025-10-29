import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { GamesTable } from "@/components/tables/GamesTable";
import { GameForm } from "@/components/forms/GameForm";
import { useCreateGame, useUpdateGame, useDeleteGame } from "@/hooks/useGamesMutations";
import { useDevelopers } from "@/hooks/useDevelopers";
import { Plus, Search, Filter } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";
import { useQuery } from "@tanstack/react-query";
import { GamesRepository } from "@/lib/repositories";

export default function GamesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Database["public"]["Tables"]["games"]["Row"] | null>(null);
  const [gameToDelete, setGameToDelete] = useState<Database["public"]["Tables"]["games"]["Row"] | null>(null);

  const { data: developers = [] } = useDevelopers();

  // Get games with developers for the table
  const queryResult = useQuery({
    queryKey: ["games", "with-developers", searchTerm, selectedGenre, selectedDeveloper],
    queryFn: async () => {
      if (searchTerm || selectedGenre || selectedDeveloper) {
        const games = await GamesRepository.searchGames(searchTerm || "");
        // Further filter by genre and developer if needed
        let filteredGames = games;
        if (selectedGenre && selectedGenre !== "all") {
          filteredGames = filteredGames.filter(game => game.genre === selectedGenre);
        }
        if (selectedDeveloper && selectedDeveloper !== "all") {
          filteredGames = filteredGames.filter(game => game.developer_id === selectedDeveloper);
        }

        // Attach developer info
        return Promise.all(
          filteredGames.map(async (game) => {
            if (game.developer_id) {
              const developer = developers.find(d => d.id === game.developer_id);
              return {
                ...game,
                developers: developer || null
              };
            }
            return {
              ...game,
              developers: null
            };
          })
        );
      }
      return GamesRepository.getGamesWithDevelopers();
    },
    staleTime: 2 * 60 * 1000,
  });

  const gamesWithDevelopers = (queryResult.data || []) as Array<Database["public"]["Tables"]["games"]["Row"] & {
    developers: Database["public"]["Tables"]["developers"]["Row"] | null;
  }>;

  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();
  const deleteGameMutation = useDeleteGame();

  const handleCreateGame = (gameData: Database["public"]["Tables"]["games"]["Insert"]) => {
    createGameMutation.mutate(gameData, {
      onSuccess: () => {
        setIsCreateFormOpen(false);
      },
    });
  };

  const handleUpdateGame = (gameData: Database["public"]["Tables"]["games"]["Update"]) => {
    if (!editingGame) return;

    updateGameMutation.mutate(
      { id: editingGame.id, gameData },
      {
        onSuccess: () => {
          setEditingGame(null);
        },
      }
    );
  };

  const handleDeleteGame = () => {
    if (!gameToDelete) return;

    deleteGameMutation.mutate(gameToDelete.id, {
      onSuccess: () => {
        setGameToDelete(null);
      },
    });
  };

  const handleEditGame = (game: Database["public"]["Tables"]["games"]["Row"]) => {
    setEditingGame(game);
  };

  const handleDeleteClick = (game: Database["public"]["Tables"]["games"]["Row"]) => {
    setGameToDelete(game);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSelectedDeveloper("all");
  };

  const hasActiveFilters = searchTerm || (selectedGenre && selectedGenre !== "all") || (selectedDeveloper && selectedDeveloper !== "all");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Games Management</h1>
              <p className="text-muted-foreground">
                Manage games, developers, and pricing for your gaming platform.
              </p>
            </div>
            <Button onClick={() => setIsCreateFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Game
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
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamesWithDevelopers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamesWithDevelopers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasActiveFilters ? (
                <Badge variant="secondary">
                  {[searchTerm && "Search", selectedGenre && "Genre", selectedDeveloper && "Developer"]
                    .filter(Boolean)
                    .length}
                </Badge>
              ) : (
                "0"
              )}
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
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="RPG">RPG</SelectItem>
                  <SelectItem value="FPS">FPS</SelectItem>
                  <SelectItem value="Strategy">Strategy</SelectItem>
                  <SelectItem value="Puzzle">Puzzle</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">Developer</label>
              <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                <SelectTrigger>
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Developers</SelectItem>
                  {developers.map((developer) => (
                    <SelectItem key={developer.id} value={developer.id}>
                      {developer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>Games</CardTitle>
          <CardDescription>
            A list of all games on the platform with their details and actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GamesTable
            games={gamesWithDevelopers}
            onEdit={handleEditGame}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Create Game Form */}
      <GameForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        onSubmit={handleCreateGame}
        isSubmitting={createGameMutation.isPending}
      />

      {/* Edit Game Form */}
      <GameForm
        open={!!editingGame}
        onOpenChange={(open) => !open && setEditingGame(null)}
        onSubmit={handleUpdateGame}
        initialData={editingGame || undefined}
        isSubmitting={updateGameMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!gameToDelete} onOpenChange={() => setGameToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the game "{gameToDelete?.title}" and all associated data
              including achievements, sessions, and purchases. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGameToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGame}
              variant="destructive"
              disabled={deleteGameMutation.isPending}
            >
              {deleteGameMutation.isPending ? "Deleting..." : "Delete Game"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
}