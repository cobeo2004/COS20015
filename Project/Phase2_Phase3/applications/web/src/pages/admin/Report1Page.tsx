import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiArrowLeftLine, RiBarChartBoxLine, RiDownloadLine, RiFilter3Line } from "@remixicon/react";

export default function Report1Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link to="/admin/reports">
            <Button variant="ghost" size="sm" className="mb-4">
              <RiArrowLeftLine className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">Game Performance Analytics</h1>
                <Badge>Report #1</Badge>
              </div>
              <p className="text-muted-foreground">
                Comprehensive analysis of game revenue, playtime, player engagement, and ratings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RiFilter3Line className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" disabled>
                <RiDownloadLine className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" disabled>
                <RiDownloadLine className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiBarChartBoxLine className="h-5 w-5" />
              Report Details
            </CardTitle>
            <CardDescription>
              This report will be implemented in Phase 4 with full data integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Games Table (Structured)</Badge>
                <Badge variant="outline">Sessions Table (Structured)</Badge>
                <Badge variant="outline">Purchases Table (Structured)</Badge>
                <Badge variant="outline">Developers Table (Structured)</Badge>
                <Badge variant="outline">Game Metadata (JSONB)</Badge>
                <Badge variant="outline">Developer Metadata (JSONB)</Badge>
                <Badge variant="outline">Cover Images (URLs)</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Metrics</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Total revenue by game and genre</li>
                <li>Total playtime and active players</li>
                <li>Average rating from JSONB metadata</li>
                <li>Review counts and tag analysis</li>
                <li>Developer performance by company size</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Planned Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Filter by date range, genre, developer, minimum rating</li>
                <li>Sort by revenue, playtime, player count, rating</li>
                <li>Search by game title or tags</li>
                <li>Interactive charts (revenue trends, rating distribution)</li>
                <li>Export to CSV and PDF formats</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for actual report content */}
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <RiBarChartBoxLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Report Implementation Pending</p>
              <p className="text-sm">
                This report will be fully implemented in Phase 4 with real-time data,
                <br />
                filtering, sorting, and export capabilities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
