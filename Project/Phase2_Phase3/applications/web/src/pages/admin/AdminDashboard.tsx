import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Gamepad2, TrendingUp, FileText, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  // TODO: Replace with real data from database in Phase 4
  const metrics = [
    {
      title: "Total Players",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Games",
      value: "48",
      change: "+3",
      trend: "up",
      icon: Gamepad2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+23%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Engagement Rate",
      value: "78.5%",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentActivity = [
    { id: 1, action: "New game published", game: "Cyber Quest 2077", time: "2 hours ago" },
    { id: 2, action: "Achievement unlocked", player: "PlayerOne", time: "5 hours ago" },
    { id: 3, action: "Purchase completed", amount: "$29.99", time: "1 day ago" },
    { id: 4, action: "New player joined", player: "GamerPro", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your platform.
              </p>
            </div>
            <Link to="/">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Switch Role
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">
                      {metric.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reports and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Reports Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Reports
              </CardTitle>
              <CardDescription>
                Access comprehensive analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                to="/admin/reports/1"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Game Performance Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Revenue, playtime, and player engagement
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                to="/admin/reports/2"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Player Engagement Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Session duration, retention, and activity
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                to="/admin/reports/3"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Developer Success Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Studio performance and game statistics
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                to="/admin/reports"
                className="block text-center p-2 text-sm text-primary hover:underline"
              >
                View all reports →
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.game || activity.player || activity.amount}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
