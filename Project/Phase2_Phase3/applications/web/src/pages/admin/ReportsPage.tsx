import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RiArrowLeftLine,
  RiBarChartBoxLine,
  RiGroupLine,
  RiBuilding2Line,
} from "@remixicon/react";

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Game Performance Analytics",
      description:
        "Comprehensive analysis of game revenue, playtime, player engagement, and ratings across all titles",
      icon: RiBarChartBoxLine,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      metrics: [
        "Revenue Trends",
        "Active Players",
        "Average Rating",
        "Total Playtime",
      ],
      dataSource: "Games + Sessions + Purchases + Developers",
    },
    {
      id: 2,
      title: "Player Engagement Analysis",
      description:
        "Detailed insights into player behavior, session duration, achievement completion, and retention rates",
      icon: RiGroupLine,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      metrics: [
        "Session Duration",
        "Achievement Rate",
        "Retention",
        "Engagement Score",
      ],
      dataSource: "Players + Sessions + Achievements + Profiles",
    },
    {
      id: 3,
      title: "Developer Success Dashboard",
      description:
        "Studio performance metrics including total games, revenue, average ratings, and player base",
      icon: RiBuilding2Line,
      color: "text-green-600",
      bgColor: "bg-green-100",
      metrics: [
        "Total Games",
        "Total Revenue",
        "Avg Game Rating",
        "Active Users",
      ],
      dataSource: "Developers + Games + Purchases + Sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link prefetch="intent" to="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Advanced reports combining data from structured,
                semi-structured, and unstructured sources
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              3 Reports Available
            </Badge>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-1 max-w-5xl mx-auto">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        <Icon className={`h-6 w-6 ${report.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Key Metrics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.metrics.map((metric) => (
                          <Badge key={metric} variant="outline">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Data Sources */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Data Sources
                      </h4>
                      <Badge variant="secondary">{report.dataSource}</Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Link
                        prefetch="intent"
                        to={`/admin/reports/${report.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <RiBarChartBoxLine className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 max-w-5xl mx-auto bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About These Reports</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              All reports integrate data from multiple sources to provide
              comprehensive insights:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Structured data:</strong> PostgreSQL relational tables
                (players, games, sessions, etc.)
              </li>
              <li>
                <strong>Semi-structured data:</strong> JSONB columns for
                flexible metadata
              </li>
              <li>
                <strong>Unstructured data:</strong> Image URLs and text content
              </li>
            </ul>
            <p className="pt-2">
              Each report includes filtering, sorting, and export capabilities
              (CSV/PDF).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
