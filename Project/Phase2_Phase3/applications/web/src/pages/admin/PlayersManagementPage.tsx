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
import { PlayersTable } from "@/components/tables/PlayersTable";
import { PlayerForm } from "@/components/forms/PlayerForm";
import {
  useCreatePlayer,
  useUpdatePlayer,
  useDeletePlayer,
} from "@/hooks/usePlayersMutations";
import { Plus, Search, Filter, Users, Trophy, Target } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";
import { usePlayers as usePlayersQuery } from "@/hooks/usePlayers";

export default function PlayersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [minLevel, setMinLevel] = useState<string>("");
  const [maxLevel, setMaxLevel] = useState<string>("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<
    Database["public"]["Tables"]["players"]["Row"] | null
  >(null);
  const [playerToDelete, setPlayerToDelete] = useState<
    Database["public"]["Tables"]["players"]["Row"] | null
  >(null);

  // Get filtered players
  const { data: players = [] } = usePlayersQuery({
    searchTerm,
    country:
      selectedCountry && selectedCountry !== "all"
        ? (selectedCountry as Database["public"]["Enums"]["countries"])
        : undefined,
    minLevel: minLevel ? parseInt(minLevel) : undefined,
    maxLevel: maxLevel ? parseInt(maxLevel) : undefined,
  });

  const createPlayerMutation = useCreatePlayer();
  const updatePlayerMutation = useUpdatePlayer();
  const deletePlayerMutation = useDeletePlayer();

  const handleCreatePlayer = (
    playerData: Database["public"]["Tables"]["players"]["Insert"]
  ) => {
    createPlayerMutation.mutate(playerData, {
      onSuccess: () => {
        setIsCreateFormOpen(false);
      },
    });
  };

  console.log(players);

  const handleUpdatePlayer = (
    playerData: Database["public"]["Tables"]["players"]["Update"]
  ) => {
    if (!editingPlayer) return;

    updatePlayerMutation.mutate(
      { id: editingPlayer.id, playerData },
      {
        onSuccess: () => {
          setEditingPlayer(null);
        },
      }
    );
  };

  const handleDeletePlayer = () => {
    if (!playerToDelete) return;

    deletePlayerMutation.mutate(playerToDelete.id, {
      onSuccess: () => {
        setPlayerToDelete(null);
      },
    });
  };

  const handleEditPlayer = (
    player: Database["public"]["Tables"]["players"]["Row"]
  ) => {
    setEditingPlayer(player);
  };

  const handleDeleteClick = (
    player: Database["public"]["Tables"]["players"]["Row"]
  ) => {
    setPlayerToDelete(player);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountry("all");
    setMinLevel("");
    setMaxLevel("");
  };

  const hasActiveFilters =
    searchTerm ||
    (selectedCountry && selectedCountry !== "all") ||
    minLevel ||
    maxLevel;

  // Calculate statistics
  const totalPlayers = players.length;
  const highLevelPlayers = players.filter(
    (p) => p.level && p.level >= 50
  ).length;
  const topScorers = players.filter(
    (p) => p.total_score && p.total_score >= 10000
  ).length;
  const activeCountries = new Set(players.map((p) => p.country).filter(Boolean))
    .size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Players Management</h1>
              <p className="text-muted-foreground">
                Manage player accounts, statistics, and user information.
              </p>
            </div>
            <Button onClick={() => setIsCreateFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Player
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
                  Total Players
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalPlayers.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Level Players
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highLevelPlayers}</div>
                <p className="text-xs text-muted-foreground">Level 50+</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Scorers
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topScorers}</div>
                <p className="text-xs text-muted-foreground">10k+ points</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCountries}</div>
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
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="w-40">
                  <label className="text-sm font-medium mb-2 block">
                    Country
                  </label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="VN">Vietnam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <label className="text-sm font-medium mb-2 block">
                    Min Level
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    min="1"
                    max="100"
                    value={minLevel}
                    onChange={(e) => setMinLevel(e.target.value)}
                  />
                </div>

                <div className="w-32">
                  <label className="text-sm font-medium mb-2 block">
                    Max Level
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    min="1"
                    max="100"
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(e.target.value)}
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

          {/* Players Table */}
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                A list of all players on the platform with their details and
                actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlayersTable
                players={players}
                onEdit={handleEditPlayer}
                onDelete={handleDeleteClick}
              />
            </CardContent>
          </Card>

          {/* Create Player Form */}
          <PlayerForm
            open={isCreateFormOpen}
            onOpenChange={setIsCreateFormOpen}
            onSubmit={handleCreatePlayer}
            isSubmitting={createPlayerMutation.isPending}
          />

          {/* Edit Player Form */}
          <PlayerForm
            open={!!editingPlayer}
            onOpenChange={(open) => !open && setEditingPlayer(null)}
            onSubmit={handleUpdatePlayer}
            initialData={editingPlayer || undefined}
            isSubmitting={updatePlayerMutation.isPending}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={!!playerToDelete}
            onOpenChange={() => setPlayerToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete the player "
                  {playerToDelete?.username}" and all associated data including
                  sessions, achievements, and purchases. This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setPlayerToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeletePlayer}
                  variant="destructive"
                  disabled={deletePlayerMutation.isPending}
                >
                  {deletePlayerMutation.isPending
                    ? "Deleting..."
                    : "Delete Player"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
