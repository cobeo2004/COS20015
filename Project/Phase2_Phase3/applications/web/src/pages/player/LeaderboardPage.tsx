import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiArrowLeftLine, RiTrophyLine, RiMedalLine, RiVipCrownLine } from "@remixicon/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function LeaderboardPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: leaderboardData, isLoading } = useLeaderboard(playerId || "");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <RiVipCrownLine className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <RiMedalLine className="h-5 w-5 text-gray-400" />;
      case 3:
        return <RiMedalLine className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link to={`/player/${playerId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <RiTrophyLine className="h-10 w-10 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground">
                Top players ranked by total score
              </p>
            </div>
            <Badge variant="secondary">Global Rankings</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Top 3 Podium */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="text-center">
                  <div className="h-5 w-5 mx-auto mb-4 bg-muted rounded animate-pulse" />
                  <div className="h-20 w-20 rounded-full mx-auto mb-4 bg-muted animate-pulse" />
                  <div className="h-6 w-32 mx-auto bg-muted rounded animate-pulse mb-2" />
                  <div className="h-5 w-16 mx-auto bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="h-4 w-24 mx-auto bg-muted rounded animate-pulse" />
                  <div className="h-8 w-28 mx-auto bg-muted rounded animate-pulse" />
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : leaderboardData && leaderboardData.length > 0 ? (
            leaderboardData.slice(0, 3).map((player) => (
              <Card
                key={player.rank}
                className={player.rank === 1 ? "border-yellow-500 border-2" : ""}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(player.rank)}
                  </div>
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{player.username}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">#{player.rank}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="text-2xl font-bold">{player.totalScore.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Level</p>
                      <p className="font-semibold">{player.level}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Country</p>
                      <p className="font-semibold">{player.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : null}
        </div>

        {/* Full Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
            <CardDescription>Complete player leaderboard</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leaderboardData && leaderboardData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Level</TableHead>
                    <TableHead className="text-right">Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((player) => (
                    <TableRow
                      key={player.rank}
                      className={player.isCurrentUser ? "bg-primary/5 font-semibold" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRankIcon(player.rank)}
                          <span>#{player.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {player.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{player.username}</span>
                          {player.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {player.totalScore.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{player.level}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{player.country}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <RiTrophyLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Leaderboard Data</p>
                <p className="text-sm">
                  Leaderboard data is currently unavailable
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
