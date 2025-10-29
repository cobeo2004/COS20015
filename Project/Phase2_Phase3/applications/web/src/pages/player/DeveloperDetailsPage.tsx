import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RiArrowLeftLine,
  RiTrophyLine,
  RiStarFill,
  RiGamepadLine,
  RiMapPinLine,
  RiTeamLine,
  RiCalendarLine,
  RiGlobalLine,
  RiTwitterLine,
} from "@remixicon/react";
import { useDeveloperDetails, useDeveloperGames } from "@/hooks/useDeveloperDetails";
import type { DeveloperMetadata, GameMetadata } from "@/lib/types/hybrid-data";

export default function DeveloperDetailsPage() {
  const { playerId, developerId } = useParams<{ playerId: string; developerId: string }>();

  const { data: developer, isLoading: developerLoading } = useDeveloperDetails(developerId || "");
  const { data: games, isLoading: gamesLoading } = useDeveloperGames(developerId || "");

  // Parse developer metadata with proper typing
  const metadata = (developer?.metadata || {}) as DeveloperMetadata;
  const companySize = metadata.company_size;
  const foundedYear = metadata.founded_year;
  const headquarters = metadata.headquarters;
  const specialties = metadata.specialties || [];
  const awards = metadata.awards || [];
  const socialLinks = metadata.social_links;

  // Calculate statistics
  const totalGames = games?.length || 0;
  const averageRating = (games?.reduce((sum, game) => {
    const gameMetadata = game.metadata as GameMetadata;
    return sum + (gameMetadata?.average_rating || 0);
  }, 0) || 0) / (totalGames || 1);

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
      {developerLoading ? (
        <div className="border-b">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-muted animate-pulse rounded-full" />
              <div className="flex-1">
                <div className="h-10 w-1/2 bg-muted rounded animate-pulse mb-4" />
                <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ) : developer ? (
        <div className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6 py-12">
            <div className="flex items-start gap-6">
              {/* Developer Logo */}
              {developer.logo_url && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-xl">
                  <img
                    src={developer.logo_url}
                    alt={developer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Developer Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{developer.name}</h1>
                <div className="flex items-center gap-4 flex-wrap mb-4">
                  {companySize && (
                    <Badge variant="secondary" className="text-sm">
                      <RiTeamLine className="h-3 w-3 mr-1" />
                      {companySize}
                    </Badge>
                  )}
                  {foundedYear && (
                    <Badge variant="outline" className="text-sm">
                      <RiCalendarLine className="h-3 w-3 mr-1" />
                      Founded {foundedYear}
                    </Badge>
                  )}
                  {headquarters && (
                    <Badge variant="outline" className="text-sm">
                      <RiMapPinLine className="h-3 w-3 mr-1" />
                      {headquarters}
                    </Badge>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{developer.email}</span>
                  {socialLinks?.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <RiGlobalLine className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <RiTwitterLine className="h-4 w-4" />
                      {socialLinks.twitter}
                    </a>
                  )}
                </div>

                {/* Specialties */}
                {specialties.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
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
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGames}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <RiStarFill className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              </div>
              <p className="text-sm text-muted-foreground">Across all games</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{awards.length}</div>
              <p className="text-sm text-muted-foreground">Total awards</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList>
            <TabsTrigger value="games">Games ({totalGames})</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {awards.length > 0 && (
              <TabsTrigger value="awards">Awards ({awards.length})</TabsTrigger>
            )}
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-4">
            {gamesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="aspect-video bg-muted animate-pulse" />
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : games && games.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => {
                  const gameMetadata = game.metadata as GameMetadata;
                  return (
                    <Link
                      key={game.id}
                      prefetch="intent"
                      to={`/player/${playerId}/games/${game.id}`}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          {game.cover_image_url ? (
                            <img
                              src={game.cover_image_url}
                              className="w-full h-full object-cover"
                              alt={game.title}
                            />
                          ) : (
                            <RiGamepadLine className="h-16 w-16 text-white/50" />
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                          <CardDescription className="flex items-center justify-between">
                            <Badge variant="secondary">{game.genre}</Badge>
                            <div className="flex items-center gap-1">
                              <RiStarFill className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-medium">
                                {gameMetadata?.average_rating?.toFixed(1) || "N/A"}
                              </span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">
                              ${game.price?.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {game.release_date ? new Date(game.release_date).getFullYear() : "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <RiGamepadLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Games Published</p>
                    <p className="text-sm">This developer hasn't published any games yet</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {companySize && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company Size</p>
                      <p className="font-medium">{companySize}</p>
                    </div>
                  )}

                  {foundedYear && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Founded</p>
                      <p className="font-medium">{foundedYear}</p>
                    </div>
                  )}

                  {headquarters && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Headquarters</p>
                      <p className="font-medium">{headquarters}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contact</p>
                    <p className="font-medium">{developer?.email}</p>
                  </div>
                </div>

                {specialties.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {socialLinks && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Social Links</p>
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.website && (
                        <a
                          href={socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <RiGlobalLine className="h-4 w-4" />
                          Website
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a
                          href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <RiTwitterLine className="h-4 w-4" />
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awards Tab */}
          {awards.length > 0 && (
            <TabsContent value="awards" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Awards & Recognition</CardTitle>
                  <CardDescription>
                    {developer?.name} has received {awards.length} award{awards.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {awards.map((award, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="p-2 rounded-lg bg-yellow-100">
                          <RiTrophyLine className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{award}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
