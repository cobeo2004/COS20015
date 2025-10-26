import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { RiTrophyLine, RiGamepadLine, RiTimeLine, RiLineChartLine, RiStarFill } from "@remixicon/react";

export default function PlayerDashboard() {
  const { playerId } = useParams<{ playerId: string }>();

  // TODO: Replace with real data from database using playerId
  const playerData = {
    id: playerId || "1",
    username: "GamerPro",
    email: "gamer@example.com",
    country: "US",
    level: 42,
    total_score: 15680,
    avatar_url: null,
  };

  const stats = [
    {
      title: "Total Score",
      value: playerData.total_score.toLocaleString(),
      icon: RiStarFill,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Current Level",
      value: playerData.level,
      icon: RiLineChartLine,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Games Played",
      value: "12",
      icon: RiGamepadLine,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Playtime",
      value: "48h",
      icon: RiTimeLine,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const recentAchievements = [
    { id: 1, name: "Speed Runner", description: "Complete a game in under 1 hour", unlocked: "2 days ago" },
    { id: 2, name: "Collector", description: "Collect all items in a game", unlocked: "5 days ago" },
    { id: 3, name: "Master", description: "Reach level 40", unlocked: "1 week ago" },
  ];

  const recentGames = [
    { id: 1, title: "Cyber Quest 2077", lastPlayed: "Today", playtime: "3h 45m" },
    { id: 2, title: "Fantasy Warriors", lastPlayed: "Yesterday", playtime: "2h 15m" },
    { id: 3, title: "Space Explorer", lastPlayed: "3 days ago", playtime: "5h 30m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage src={playerData.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-purple-800">
                  {playerData.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2">{playerData.username}</h1>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Level {playerData.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {playerData.country}
                  </Badge>
                </div>
              </div>
            </div>
            <Link to="/">
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10 border-white/30 text-white">
                Switch Role
              </Badge>
            </Link>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {playerData.level} Progress</span>
              <span className="text-sm">65% to next level</span>
            </div>
            <Progress value={65} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
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
          })}
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
              <CardDescription>Your latest unlocked achievements</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <p className="text-sm font-medium">{game.playtime}</p>
                      <p className="text-xs text-muted-foreground">playtime</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
