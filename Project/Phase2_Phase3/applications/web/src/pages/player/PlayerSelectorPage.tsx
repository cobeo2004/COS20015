import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Star } from "lucide-react";

export default function PlayerSelectorPage() {
  // TODO: Replace with real data from database
  const players = [
    { id: 1, username: "GamerPro", level: 42, total_score: 15680, country: "US" },
    { id: 2, username: "ProGamer123", level: 58, total_score: 25680, country: "US" },
    { id: 3, username: "ElitePlayer", level: 55, total_score: 23450, country: "UK" },
    { id: 4, username: "ChampionX", level: 52, total_score: 21890, country: "JP" },
    { id: 5, username: "MasterGamer", level: 48, total_score: 19560, country: "AU" },
    { id: 6, username: "PlayerOne", level: 40, total_score: 14230, country: "VN" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
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
            <Badge variant="secondary">{players.length} Players</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Link key={player.id} to={`/player/${player.id}`}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
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
                        <Star className="h-3 w-3" />
                        Total Score
                      </span>
                      <span className="font-semibold">
                        {player.total_score.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Button className="w-full" variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About Player Profiles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Select any player to view their complete gaming profile, including:
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
