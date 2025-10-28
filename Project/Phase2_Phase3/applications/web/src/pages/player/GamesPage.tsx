import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  RiArrowLeftLine,
  RiSearchLine,
  RiFilter3Line,
  RiGamepadLine,
  RiStarFill,
} from "@remixicon/react";
import { useGames } from "@/hooks/useGames";

export default function GamesPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: games, isLoading } = useGames();

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
          <h1 className="text-4xl font-bold mb-2">Game Library</h1>
          <p className="text-muted-foreground">
            Browse and discover games from our catalog
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search games..." className="pl-10" />
          </div>
          <Button variant="outline">
            <RiFilter3Line className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <Card
                key={game.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <img
                    src={game.cover_image_url || undefined}
                    className="w-full h-full"
                    alt={game.title}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <Badge variant="secondary">{game.genre}</Badge>
                    <div className="flex items-center gap-1">
                      <RiStarFill className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${game.price?.toFixed(2)}
                    </span>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <RiGamepadLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No games found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
