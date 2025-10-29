import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  RiArrowLeftLine,
  RiUserLine,
  RiStarFill,
  RiSearchLine,
  RiFilter3Line,
  RiCloseLine,
  RiArrowUpLine,
  RiArrowDownLine
} from "@remixicon/react";
import { usePlayers } from "@/hooks/usePlayers";
import type { PlayerFilters } from "@/lib/repositories/players";

const COUNTRIES = [
  { value: "AU", label: "Australia" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "JP", label: "Japan" },
  { value: "VN", label: "Vietnam" }
];

const SORT_OPTIONS = [
  { value: "total_score", label: "Total Score" },
  { value: "username", label: "Username" },
  { value: "level", label: "Level" },
  { value: "country", label: "Country" }
];

export default function PlayerSelectorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PlayerFilters>({});
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

  const { data: players, isLoading } = usePlayers(debouncedFilters);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim() !== "";

  const updateFilter = (key: keyof PlayerFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: keyof PlayerFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link prefetch="intent" to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Role Selection
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Select Player</h1>
              <p className="text-muted-foreground">
                Choose a player profile to view their dashboard and statistics
              </p>
            </div>
            {isLoading ? (
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <Badge variant="secondary">{players?.length || 0} Players</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players by username or email..."
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
            {filters.country && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Country: {COUNTRIES.find(c => c.value === filters.country)?.label || filters.country}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter("country")}
                >
                  <RiCloseLine className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.minLevel && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Level: {filters.minLevel}+
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter("minLevel")}
                >
                  <RiCloseLine className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.minScore && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Score: {filters.minScore.toLocaleString()}+
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter("minScore")}
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={filters.country || undefined}
                    onValueChange={(value) => updateFilter("country", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All countries</SelectItem>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minLevel">Min Level</Label>
                  <Input
                    id="minLevel"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="1"
                    value={filters.minLevel || ""}
                    onChange={(e) => updateFilter("minLevel", e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <Label htmlFor="minScore">Min Score</Label>
                  <Input
                    id="minScore"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={filters.minScore || ""}
                    onChange={(e) => updateFilter("minScore", e.target.value ? parseInt(e.target.value) : undefined)}
                  />
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-full bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : players && players.length > 0 ? (
            players.map((player) => (
              <Link
                prefetch="intent"
                key={player.id}
                to={`/player/${player.id}`}
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={player.player_profiles?.avatar_url || undefined}
                        />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {player.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {player.username}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Level {player.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {player.country}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <RiStarFill className="h-3 w-3" />
                          Total Score
                        </span>
                        <span className="font-semibold">
                          {player.total_score?.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full" variant="outline">
                          <RiUserLine className="h-4 w-4 mr-2" />
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <RiUserLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Players Found</p>
                    <p className="text-sm">
                      There are currently no player profiles available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About Player Profiles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Select any player to view their complete gaming profile,
              including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
              <li>Personal statistics and achievements</li>
              <li>Game library and recent activity</li>
              <li>Leaderboard rankings</li>
              <li>Achievement progress and milestones</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
