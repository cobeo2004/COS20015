import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  RiArrowLeftLine,
  RiTrophyLine,
  RiLockLine,
  RiCheckLine,
  RiSearchLine,
  RiFilter3Line,
  RiCloseLine,
  RiArrowUpLine,
  RiArrowDownLine
} from "@remixicon/react";
import { Check, Lock, Trophy } from "lucide-react";
import { usePlayerAchievements } from "@/hooks/usePlayerAchievements";
import type { AchievementFilters } from "@/lib/repositories/player-achievements-repo";

const RARITY_OPTIONS = [
  { value: "Legendary", label: "Legendary" },
  { value: "Epic", label: "Epic" },
  { value: "Rare", label: "Rare" },
  { value: "Common", label: "Common" }
];

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "points", label: "Points" },
  { value: "rarity", label: "Rarity" }
];

export default function AchievementsPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AchievementFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search implementation (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 300);

  // Debounced filters implementation
  const debouncedFilters = useMemo(() => {
    const newFilters = { ...filters };
    if (debouncedSearchTerm) {
      newFilters.searchTerm = debouncedSearchTerm;
    } else {
      delete newFilters.searchTerm;
    }
    return newFilters;
  }, [debouncedSearchTerm, filters]);

  const { data: achievementsData, isLoading } = usePlayerAchievements(
    playerId || "",
    debouncedFilters
  );

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim() !== "";

  const updateFilter = (key: keyof AchievementFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: keyof AchievementFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const achievements = {
    unlocked: achievementsData?.unlocked || [],
    locked: achievementsData?.locked || [],
  };

  const totalAchievements =
    achievements.unlocked.length + achievements.locked.length;
  const unlockedCount = achievements.unlocked.length;
  const completionPercentage = achievementsData?.completionPercentage || 0;
  const totalPoints = achievementsData?.totalPoints || 0;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Epic":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Rare":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link prefetch="intent" to={`/player/${playerId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock rewards
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements by name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <RiFilter3Line className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <RiCloseLine className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <RiCloseLine className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.rarity && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Rarity: {filters.rarity}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter("rarity")}
                >
                  <RiCloseLine className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.sortBy && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sort: {SORT_OPTIONS.find(s => s.value === filters.sortBy)?.label}
                {filters.sortOrder === "asc" ? (
                  <RiArrowUpLine className="h-3 w-3" />
                ) : (
                  <RiArrowDownLine className="h-3 w-3" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => {
                    removeFilter("sortBy");
                    removeFilter("sortOrder");
                  }}
                >
                  <RiCloseLine className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="rarity">Rarity</Label>
                  <Select
                    value={filters.rarity || undefined}
                    onValueChange={(value) => updateFilter("rarity", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All rarities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All rarities</SelectItem>
                      {RARITY_OPTIONS.map((rarity) => (
                        <SelectItem key={rarity.value} value={rarity.value}>
                          {rarity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sortBy">Sort By</Label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.sortBy || undefined}
                      onValueChange={(value) => updateFilter("sortBy", value || undefined)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                      disabled={!filters.sortBy}
                    >
                      {filters.sortOrder === "asc" ? (
                        <RiArrowUpLine className="h-4 w-4" />
                      ) : (
                        <RiArrowDownLine className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-9 w-20 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalPoints}</div>
                  <p className="text-sm text-muted-foreground">
                    Achievement points earned
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {unlockedCount}/{totalAchievements}
                  </div>
                  <Progress value={completionPercentage} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {completionPercentage.toFixed(0)}% complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Next Milestone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">25</div>
                  <p className="text-sm text-muted-foreground">
                    {Math.max(0, 25 - unlockedCount)} achievements to go
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Achievements List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({totalAchievements})</TabsTrigger>
            <TabsTrigger value="unlocked">
              Unlocked ({unlockedCount})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({totalAchievements - unlockedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-muted animate-pulse">
                          <div className="h-5 w-5" />
                        </div>
                        <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Unlocked Achievements */}
                {achievements.unlocked.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Unlocked</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {achievements.unlocked.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className="border-green-200 bg-green-50/50"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="p-2 rounded-lg bg-green-100">
                                <RiTrophyLine className="h-5 w-5 text-green-600" />
                              </div>
                              <RiCheckLine className="h-5 w-5 text-green-600" />
                            </div>
                            <CardTitle className="text-lg">
                              {achievement.name}
                            </CardTitle>
                            <CardDescription>
                              {achievement.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Badge
                                className={getRarityColor(achievement.rarity)}
                              >
                                {achievement.rarity}
                              </Badge>
                              <span className="text-sm font-semibold">
                                {achievement.points} pts
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Unlocked {achievement.unlockedAt}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locked Achievements */}
                {achievements.locked.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Locked</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {achievements.locked.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="p-2 rounded-lg bg-muted">
                                <RiLockLine className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                            <CardTitle className="text-lg">
                              {achievement.name}
                            </CardTitle>
                            <CardDescription>
                              {achievement.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Badge
                                className={getRarityColor(achievement.rarity)}
                              >
                                {achievement.rarity}
                              </Badge>
                              <span className="text-sm font-semibold">
                                {achievement.points} pts
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {achievements.unlocked.length === 0 &&
                  achievements.locked.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <RiTrophyLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No Achievements
                      </p>
                      <p className="text-sm">
                        Start playing games to unlock achievements
                      </p>
                    </div>
                  )}
              </>
            )}
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-muted animate-pulse">
                          <div className="h-5 w-5" />
                        </div>
                        <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : achievements.unlocked.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.unlocked.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className="border-green-200 bg-green-50/50"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">
                        {achievement.name}
                      </CardTitle>
                      <CardDescription>
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {achievement.points} pts
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Unlocked {achievement.unlockedAt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <RiTrophyLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No Unlocked Achievements
                </p>
                <p className="text-sm">
                  Start playing games to unlock achievements
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-muted animate-pulse">
                          <div className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : achievements.locked.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.locked.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-muted">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {achievement.name}
                      </CardTitle>
                      <CardDescription>
                        {achievement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {achievement.points} pts
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <RiLockLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  All Achievements Unlocked!
                </p>
                <p className="text-sm">
                  Great job! You've unlocked all available achievements
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
