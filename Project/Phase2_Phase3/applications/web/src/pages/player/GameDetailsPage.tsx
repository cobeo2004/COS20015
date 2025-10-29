import { useParams, Link } from "react-router";
import { useState } from "react";
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
import {
  RiArrowLeftLine,
  RiTrophyLine,
  RiStarFill,
  RiGamepadLine,
  RiCheckLine,
  RiLockLine,
  RiMedalLine,
  RiUserLine,
  RiThumbUpLine,
  RiThumbDownLine,
  RiFlashlightLine,
  RiGiftLine,
} from "@remixicon/react";
import { useGameDetails } from "@/hooks/useGameDetails";
import {
  useGameAchievements,
  useGameAchievementStats,
} from "@/hooks/useGameAchievements";
import { useGameLeaderboard } from "@/hooks/useGameLeaderboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GameMetadata } from "@/lib/types/hybrid-data";
import type {
  AchievementWithStatus,
  LeaderboardEntityWithPlayer,
} from "@/lib/types/game-details";

export default function GameDetailsPage() {
  const { playerId, gameId } = useParams<{
    playerId: string;
    gameId: string;
  }>();
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);

  const { data: game, isLoading: gameLoading } = useGameDetails(gameId || "");
  const { data: achievements, isLoading: achievementsLoading } =
    useGameAchievements(gameId || "", playerId);
  const { data: achievementStats, isLoading: statsLoading } =
    useGameAchievementStats(gameId || "", playerId || "");
  const { data: leaderboard, isLoading: leaderboardLoading } =
    useGameLeaderboard(gameId || "");

  console.log("Game Metadata:", game?.metadata);
  console.log("Game Achievements:", achievements);
  console.log("Game Achievement Stats:", achievementStats);
  console.log("Game Leaderboard:", leaderboard);

  // Parse game metadata with proper typing
  const metadata = (game?.metadata || {}) as GameMetadata;
  const averageRating = metadata.average_rating || 0;
  const totalReviews = metadata.total_reviews || 0;
  const tags = metadata.tags || [];
  const languages = metadata.languages || [];
  const contentRating = metadata.content_rating || "E";
  const screenshots = metadata.screenshots || [];
  const reviewsSummary = metadata.reviews_summary;
  const systemReqs = metadata.system_requirements;
  const earlyAccess = metadata.early_access || false;
  const dlcAvailable = metadata.dlc_available || false;
  const peakPlayers = metadata.peak_concurrent_players;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link prefetch="intent" to={`/player/${playerId}/games`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      {gameLoading ? (
        <div className="border-b">
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 aspect-video bg-muted animate-pulse rounded-lg" />
              <div className="flex-1">
                <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-4" />
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-4" />
                <div className="h-20 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : game ? (
        <div className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Game Cover */}
              <div className="w-full md:w-1/3">
                <div className="aspect-video rounded-lg overflow-hidden shadow-xl border">
                  {game.cover_image_url ? (
                    <img
                      src={game.cover_image_url}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <RiGamepadLine className="h-24 w-24 text-white/50" />
                    </div>
                  )}
                </div>
              </div>

              {/* Game Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-4xl font-bold">{game.title}</h1>
                      {earlyAccess && (
                        <Badge variant="default" className="bg-blue-500">
                          <RiFlashlightLine className="h-3 w-3 mr-1" />
                          Early Access
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="secondary" className="text-sm">
                        {game.genre}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {contentRating}
                      </Badge>
                      {dlcAvailable && (
                        <Badge variant="outline" className="text-sm">
                          <RiGiftLine className="h-3 w-3 mr-1" />
                          DLC Available
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <RiStarFill className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({totalReviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${game.price?.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Reviews Summary */}
                {reviewsSummary && (
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Player Reviews</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <RiThumbUpLine className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Positive</span>
                            <span className="text-sm font-semibold">
                              {reviewsSummary.positive_percentage}%
                            </span>
                          </div>
                          <Progress
                            value={reviewsSummary.positive_percentage}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiThumbDownLine className="h-4 w-4 text-red-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Negative</span>
                            <span className="text-sm font-semibold">
                              {reviewsSummary.negative_percentage}%
                            </span>
                          </div>
                          <Progress
                            value={reviewsSummary.negative_percentage}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Developer Info */}
                {game.developers && (
                  <Link
                    prefetch="intent"
                    to={`/player/${playerId}/developers/${game.developers.id}`}
                    className="block mb-4"
                  >
                    <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
                      <p className="text-sm text-muted-foreground mb-1">
                        Developer
                      </p>
                      <div className="flex items-center gap-3">
                        {game.developers.logo_url && (
                          <img
                            src={game.developers.logo_url}
                            alt={game.developers.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">
                            {game.developers.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {game.developers.email}
                          </p>
                        </div>
                        <RiArrowLeftLine className="h-5 w-5 rotate-180 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                )}

                {/* Release Date */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium">
                    {formatDate(game.release_date ?? "")}
                  </p>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-9 w-20 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {achievementStats?.percentage || 0}%
                  </div>
                  <Progress
                    value={achievementStats?.percentage || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {achievementStats?.unlocked || 0}/
                    {achievementStats?.total || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <RiStarFill className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                    <div className="text-3xl font-bold">
                      {averageRating.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {totalReviews.toLocaleString()} reviews
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {peakPlayers ? "Peak Players" : "On Leaderboard"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {peakPlayers?.toLocaleString() ||
                      leaderboard?.leaderboard_entities?.length ||
                      0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {peakPlayers ? "concurrent" : "players"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {screenshots.length > 0 && (
              <TabsTrigger value="screenshots">
                Screenshots ({screenshots.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="achievements">
              Achievements ({achievements?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Game</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Genre</p>
                    <p className="font-medium">{game?.genre}</p>
                  </div>

                  {contentRating && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Content Rating
                      </p>
                      <p className="font-medium">{contentRating}</p>
                    </div>
                  )}
                </div>

                {languages.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Supported Languages
                    </p>
                    <p className="font-medium">{languages.join(", ")}</p>
                  </div>
                )}

                {systemReqs && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      System Requirements
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      {systemReqs.min_ram_gb && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Minimum RAM:
                          </span>
                          <span className="text-sm">
                            {systemReqs.min_ram_gb} GB
                          </span>
                        </div>
                      )}
                      {systemReqs.min_storage_gb && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Minimum Storage:
                          </span>
                          <span className="text-sm">
                            {systemReqs.min_storage_gb} GB
                          </span>
                        </div>
                      )}
                      {systemReqs.recommended_gpu && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Recommended GPU:
                          </span>
                          <span className="text-sm">
                            {systemReqs.recommended_gpu}
                          </span>
                        </div>
                      )}
                      {systemReqs.platforms &&
                        systemReqs.platforms.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Platforms:
                            </p>
                            <div className="flex gap-2">
                              {systemReqs.platforms.map((platform) => (
                                <Badge
                                  key={platform}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {peakPlayers && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Peak Concurrent Players
                      </p>
                      <p className="font-medium text-2xl">
                        {peakPlayers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screenshots Tab */}
          {screenshots.length > 0 && (
            <TabsContent value="screenshots" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game Screenshots</CardTitle>
                  <CardDescription>
                    Browse through {screenshots.length} in-game screenshots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Main Screenshot Display */}
                  <div className="mb-4 aspect-video rounded-lg overflow-hidden border shadow-lg">
                    <img
                      src={screenshots[selectedScreenshot]}
                      alt={`Screenshot ${selectedScreenshot + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Screenshot Thumbnails */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedScreenshot(index)}
                        className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          selectedScreenshot === index
                            ? "border-primary scale-105"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={screenshot}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            {achievementsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : achievements && achievements.length > 0 ? (
              <>
                {/* Unlocked Achievements */}
                {achievements.filter((a: AchievementWithStatus) => a.isUnlocked).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Unlocked</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {achievements
                        .filter((a: AchievementWithStatus) => a.isUnlocked)
                        .map((achievement: AchievementWithStatus) => (
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
                                <span className="text-sm font-semibold">
                                  {achievement.points} pts
                                </span>
                              </div>
                              {achievement.unlocked_at && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Unlocked {formatDate(achievement.unlocked_at)}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* Locked Achievements */}
                {achievements.filter((a: AchievementWithStatus) => !a.isUnlocked).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Locked</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {achievements
                        .filter((a: AchievementWithStatus) => !a.isUnlocked)
                        .map((achievement: AchievementWithStatus) => (
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
                              <span className="text-sm font-semibold">
                                {achievement.points} pts
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <RiTrophyLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No Achievements Available
                    </p>
                    <p className="text-sm">
                      This game doesn't have achievements yet
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            {leaderboardLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg animate-pulse"
                      >
                        <div className="h-10 w-10 bg-muted rounded-full" />
                        <div className="flex-1">
                          <div className="h-5 w-32 bg-muted rounded mb-2" />
                          <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                        <div className="h-6 w-20 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : leaderboard &&
              leaderboard.leaderboard_entities &&
              leaderboard.leaderboard_entities.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Top Players</CardTitle>
                  <CardDescription>
                    {leaderboard.type} Leaderboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.leaderboard_entities.map((entry: LeaderboardEntityWithPlayer) => (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          entry.players?.id === playerId
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted/50"
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex items-center justify-center w-10 h-10">
                          {entry.rank !== null && entry.rank <= 3 ? (
                            <RiMedalLine
                              className={`h-8 w-8 ${
                                entry.rank === 1
                                  ? "text-yellow-500"
                                  : entry.rank === 2
                                  ? "text-gray-400"
                                  : "text-orange-600"
                              }`}
                            />
                          ) : (
                            <span className="text-xl font-bold text-muted-foreground">
                              {entry.rank ?? "-"}
                            </span>
                          )}
                        </div>

                        {/* Player Info */}
                        <Avatar>
                          <AvatarFallback>
                            <RiUserLine className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">
                            {entry.players?.username || "Unknown Player"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Level {entry.players?.level || 1}</span>
                            {entry.players?.country && (
                              <>
                                <span>•</span>
                                <span>{entry.players.country}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {entry.score !== null ? entry.score.toLocaleString() : "0"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            points
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <RiMedalLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No Leaderboard Available
                    </p>
                    <p className="text-sm">
                      This game doesn't have a leaderboard yet
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
