import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiArrowLeftLine, RiLineChartLine, RiTimeLine, RiTargetLine } from "@remixicon/react";
import { usePlayerStats } from "@/hooks/usePlayerStats";

export default function MyStatsPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: statsData, isLoading } = usePlayerStats(playerId || "");

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
          <h1 className="text-4xl font-bold mb-2">My Statistics</h1>
          <p className="text-muted-foreground">
            Detailed breakdown of your gaming performance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Session History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex justify-between items-center">
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : statsData ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RiLineChartLine className="h-5 w-5" />
                      Performance Overview
                    </CardTitle>
                    <CardDescription>Your gaming statistics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Score</span>
                      <span className="font-bold text-lg">{statsData.performance.totalScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Games Played</span>
                      <span className="font-bold text-lg">{statsData.performance.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Achievement Progress</span>
                      <span className="font-bold text-lg">{statsData.performance.achievementCompletionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Achievements</span>
                      <span className="font-bold text-lg">{statsData.performance.achievementsUnlocked}/{statsData.performance.achievementsTotal}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RiTimeLine className="h-5 w-5" />
                      Time Statistics
                    </CardTitle>
                    <CardDescription>Your playtime breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Playtime</span>
                      <span className="font-bold text-lg">{Math.floor(statsData.time.totalPlaytimeHours)}h {Math.round((statsData.time.totalPlaytimeHours % 1) * 60)}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Session</span>
                      <span className="font-bold text-lg">{Math.floor(statsData.time.avgSessionDuration)}h {Math.round((statsData.time.avgSessionDuration % 1) * 60)}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-bold text-lg">{Math.floor(statsData.time.thisWeekHours)}h {Math.round((statsData.time.thisWeekHours % 1) * 60)}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-bold text-lg">{Math.floor(statsData.time.thisMonthHours)}h {Math.round((statsData.time.thisMonthHours % 1) * 60)}m</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Your recent gaming sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center pb-4 border-b">
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : statsData && statsData.sessions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statsData.sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.gameTitle}</TableCell>
                          <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
                          <TableCell>{session.endTime ? new Date(session.endTime).toLocaleString() : "In Progress"}</TableCell>
                          <TableCell className="text-right">
                            {Math.floor(session.durationHours)}h {Math.round((session.durationHours % 1) * 60)}m
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <RiTimeLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Sessions Yet</p>
                    <p className="text-sm">
                      Start playing games to see your session history
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : statsData ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overall Performance</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Score</p>
                          <p className="text-2xl font-bold">{statsData.performance.totalScore.toLocaleString()}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Games Played</p>
                          <p className="text-2xl font-bold">{statsData.performance.gamesPlayed}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                          <p className="text-2xl font-bold">{statsData.performance.achievementsUnlocked}/{statsData.performance.achievementsTotal}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Completion Rate</p>
                          <p className="text-2xl font-bold">{statsData.performance.achievementCompletionRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Playtime Analysis</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Playtime</p>
                          <p className="text-2xl font-bold">{Math.floor(statsData.time.totalPlaytimeHours)}h {Math.round((statsData.time.totalPlaytimeHours % 1) * 60)}m</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Average Session</p>
                          <p className="text-2xl font-bold">{Math.floor(statsData.time.avgSessionDuration)}h {Math.round((statsData.time.avgSessionDuration % 1) * 60)}m</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <RiTargetLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Performance Data</p>
                    <p className="text-sm">
                      Start playing games to see your performance metrics
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
