import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  RiTrophyLine,
  RiGamepadLine,
  RiTimeLine,
  RiLineChartLine,
  RiStarFill,
} from "@remixicon/react";
import { usePlayerDashboard } from "@/hooks/usePlayerDashboard";

export default function PlayerDashboard() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: dashboardData, isLoading } = usePlayerDashboard(playerId || "");

  const playerData = dashboardData?.player;
  const statsData = dashboardData?.stats;

  const stats = statsData
    ? [
        {
          title: "Total Score",
          value: playerData?.total_score?.toLocaleString() || "0",
          icon: RiStarFill,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          title: "Current Level",
          value: playerData?.level || 0,
          icon: RiLineChartLine,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Games Played",
          value: statsData.gamesPlayed.toString(),
          icon: RiGamepadLine,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Total Playtime",
          value: `${Math.floor(statsData.totalPlaytimeHours)}h`,
          icon: RiTimeLine,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ]
    : [];

  const recentAchievements = dashboardData?.recentAchievements || [];
  const recentGames = dashboardData?.recentGames || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {isLoading ? (
                <>
                  <div className="h-24 w-24 rounded-full bg-white/20 animate-pulse" />
                  <div>
                    <div className="h-10 w-48 bg-white/20 rounded animate-pulse mb-2" />
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-20 bg-white/20 rounded animate-pulse" />
                      <div className="h-6 w-16 bg-white/20 rounded animate-pulse" />
                    </div>
                  </div>
                </>
              ) : playerData ? (
                <>
                  <Avatar className="h-24 w-24 border-4 border-white/20">
                    <AvatarImage src={playerData.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-purple-800">
                      {playerData.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      {playerData.username}
                    </h1>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        Level {playerData.level}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        {playerData.country}
                      </Badge>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <Link to="/">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-white/10 border-white/30 text-white"
              >
                Switch Role
              </Badge>
            </Link>
          </div>

          {/* Level Progress */}
          {!isLoading && playerData && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Level {playerData.level} Progress
                </span>
                <span className="text-sm">65% to next level</span>
              </div>
              <Progress value={65} className="h-2 bg-white/20" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            : stats.length > 0
            ? stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                );
              })
            : null}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiTrophyLine className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                Your latest unlocked achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 pb-4 border-b"
                    >
                      <div className="p-2 rounded-lg bg-muted animate-pulse">
                        <div className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentAchievements.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="p-2 rounded-lg bg-yellow-100">
                          <RiTrophyLine className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked {achievement.unlocked}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/player/${playerId}/achievements`}
                    className="block text-center mt-4 text-sm text-primary hover:underline"
                  >
                    View all achievements →
                  </Link>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <RiTrophyLine className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No achievements unlocked yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Played Games */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiGamepadLine className="h-5 w-5" />
                Recently Played
              </CardTitle>
              <CardDescription>Your gaming activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-4 border-b"
                    >
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentGames.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentGames.map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{game.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Last played: {game.lastPlayed}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {game.playtimeHours}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            playtime
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/player/${playerId}/games`}
                    className="block text-center mt-4 text-sm text-primary hover:underline"
                  >
                    Browse all games →
                  </Link>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <RiGamepadLine className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No games played yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
