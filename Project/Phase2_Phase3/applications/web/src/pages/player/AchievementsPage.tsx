import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, Lock, Check } from "lucide-react";

export default function AchievementsPage() {
  const { playerId } = useParams<{ playerId: string }>();

  // TODO: Replace with real data from database
  const achievements = {
    unlocked: [
      {
        id: 1,
        name: "Speed Runner",
        description: "Complete a game in under 1 hour",
        points: 100,
        unlockedAt: "2 days ago",
        rarity: "Rare",
      },
      {
        id: 2,
        name: "Collector",
        description: "Collect all items in a game",
        points: 150,
        unlockedAt: "5 days ago",
        rarity: "Epic",
      },
      {
        id: 3,
        name: "Master",
        description: "Reach level 40",
        points: 200,
        unlockedAt: "1 week ago",
        rarity: "Legendary",
      },
    ],
    locked: [
      {
        id: 4,
        name: "Perfectionist",
        description: "Complete all achievements in one game",
        points: 500,
        progress: 65,
        rarity: "Legendary",
      },
      {
        id: 5,
        name: "Marathon",
        description: "Play for 10 consecutive hours",
        points: 250,
        progress: 40,
        rarity: "Epic",
      },
      {
        id: 6,
        name: "Social Butterfly",
        description: "Add 50 friends",
        points: 100,
        progress: 20,
        rarity: "Rare",
      },
    ],
  };

  const totalAchievements = achievements.unlocked.length + achievements.locked.length;
  const unlockedCount = achievements.unlocked.length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  const totalPoints = achievements.unlocked.reduce((sum, a) => sum + a.points, 0);

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
          <Link to={`/player/${playerId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock rewards
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPoints}</div>
              <p className="text-sm text-muted-foreground">Achievement points earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Unlocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {unlockedCount}/{totalAchievements}
              </div>
              <Progress value={completionPercentage} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {completionPercentage}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">25</div>
              <p className="text-sm text-muted-foreground">
                {25 - unlockedCount} achievements to go
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({totalAchievements})
            </TabsTrigger>
            <TabsTrigger value="unlocked">
              Unlocked ({unlockedCount})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({totalAchievements - unlockedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Unlocked Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Unlocked</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.unlocked.map((achievement) => (
                  <Card key={achievement.id} className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
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
            </div>

            {/* Locked Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4">In Progress</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.locked.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-muted">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <span className="text-sm font-semibold">
                            {achievement.points} pts
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.unlocked.map((achievement) => (
                <Card key={achievement.id} className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Trophy className="h-5 w-5 text-green-600" />
                      </div>
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
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
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.locked.map((achievement) => (
                <Card key={achievement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-muted">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <span className="text-sm font-semibold">
                          {achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
