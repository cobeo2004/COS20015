import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminHeader } from "@/components/AdminHeader";
import {
  RiBarChartBoxLine,
  RiGroupLine,
  RiGamepadLine,
  RiLineChartLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiSettings3Line,
  RiTrophyLine,
} from "@remixicon/react";
import {
  useAdminDashboardMetrics,
  useRecentActivity,
} from "@/hooks/useAdminDashboardMetrics";

export default function AdminDashboard() {
  const { data: metricsData, isLoading: metricsLoading } =
    useAdminDashboardMetrics();
  const { data: activityData, isLoading: activityLoading } =
    useRecentActivity();

  const metrics = metricsData
    ? [
        {
          title: "Total Players",
          value: metricsData.totalPlayers.toLocaleString(),
          change: "+12%",
          trend: "up",
          icon: RiGroupLine,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Active Games",
          value: metricsData.activeGames.toString(),
          change: "+3",
          trend: "up",
          icon: RiGamepadLine,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          title: "Total Revenue",
          value: `$${metricsData.totalRevenue.toLocaleString()}`,
          change: "+23%",
          trend: "up",
          icon: RiMoneyDollarCircleLine,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Engagement Rate",
          value: `${metricsData.engagementRate.toFixed(1)}%`,
          change: "+5.2%",
          trend: "up",
          icon: RiLineChartLine,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        },
      ]
    : [];

  const recentActivity = activityData || [];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Welcome back! Here's what's happening with your platform."
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {metricsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="p-2 rounded-lg bg-muted">
                    <div className="h-4 w-4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : metrics.length > 0 ? (
            metrics.map((metric) => {
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
            })
          ) : (
            <div className="col-span-4 text-center py-8 text-muted-foreground">
              No metrics available
            </div>
          )}
        </div>

        {/* CRUD Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiSettings3Line className="h-5 w-5" />
              Platform Management
            </CardTitle>
            <CardDescription>
              Manage games, players, and achievements on your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                prefetch="intent"
                to="/admin/games"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <RiGamepadLine className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Games Management</h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage games, pricing, and developer information
                </p>
              </Link>

              <Link
                prefetch="intent"
                to="/admin/players"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <RiGroupLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Players Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage player accounts, statistics, and user information
                </p>
              </Link>

              <Link
                prefetch="intent"
                to="/admin/achievements"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                    <RiTrophyLine className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Achievements Management</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage achievements, unlock criteria, and rewards
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Reports and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Reports Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiBarChartBoxLine className="h-5 w-5" />
                Quick Reports
              </CardTitle>
              <CardDescription>
                Access comprehensive analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                prefetch="intent"
                to="/admin/reports/1"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Game Performance Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Revenue, playtime, and player engagement
                    </p>
                  </div>
                  <RiFileTextLine className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                prefetch="intent"
                to="/admin/reports/2"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Player Engagement Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Session duration, retention, and activity
                    </p>
                  </div>
                  <RiFileTextLine className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                prefetch="intent"
                to="/admin/reports/3"
                className="block p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Developer Success Dashboard
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Studio performance and game statistics
                    </p>
                  </div>
                  <RiFileTextLine className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>

              <Link
                prefetch="intent"
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
              <CardDescription>
                Latest platform events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading recent activity...
                  </div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.details}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
