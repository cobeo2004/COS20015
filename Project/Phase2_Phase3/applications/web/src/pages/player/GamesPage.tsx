import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiArrowLeftLine, RiSearchLine, RiFilter3Line, RiGamepadLine, RiStarFill } from "@remixicon/react";

export default function GamesPage() {
  const { playerId } = useParams<{ playerId: string }>();

  // TODO: Replace with real data from database
  const games = [
    {
      id: 1,
      title: "Cyber Quest 2077",
      genre: "RPG",
      price: 59.99,
      rating: 4.5,
      coverImage: null,
    },
    {
      id: 2,
      title: "Fantasy Warriors",
      genre: "Strategy",
      price: 39.99,
      rating: 4.8,
      coverImage: null,
    },
    {
      id: 3,
      title: "Space Explorer",
      genre: "FPS",
      price: 49.99,
      rating: 4.2,
      coverImage: null,
    },
    {
      id: 4,
      title: "Puzzle Master",
      genre: "Puzzle",
      price: 19.99,
      rating: 4.6,
      coverImage: null,
    },
  ];

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
            <Input
              placeholder="Search games..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <RiFilter3Line className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <RiGamepadLine className="h-16 w-16 text-white/50" />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <Badge variant="secondary">{game.genre}</Badge>
                  <div className="flex items-center gap-1">
                    <RiStarFill className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${game.price}</span>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (when no games found) */}
        {games.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <RiGamepadLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No games found</p>
                <p className="text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
