import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiUserLine, RiStarFill } from "@remixicon/react";
import { usePlayers } from "@/hooks/usePlayers";

export default function PlayerSelectorPage() {
  const { data: players, isLoading } = usePlayers();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link to="/">
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
              <Link key={player.id} to={`/player/${player.id}`}>
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
