import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Download, Filter } from "lucide-react";

export default function Report2Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <Link to="/admin/reports">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">Player Engagement Analysis</h1>
                <Badge>Report #2</Badge>
              </div>
              <p className="text-muted-foreground">
                Detailed insights into player behavior, session duration, and achievement completion
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
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
              <Users className="h-5 w-5" />
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
                <Badge variant="outline">Players Table (Structured)</Badge>
                <Badge variant="outline">Sessions Table (Structured)</Badge>
                <Badge variant="outline">Achievements Table (Structured)</Badge>
                <Badge variant="outline">Player Achievements (Structured)</Badge>
                <Badge variant="outline">Player Profiles (Structured)</Badge>
                <Badge variant="outline">Player Settings (JSONB)</Badge>
                <Badge variant="outline">Avatar Images (URLs)</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Metrics</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Average session duration by player and country</li>
                <li>Achievement completion rates</li>
                <li>Player retention and engagement scores</li>
                <li>Total playtime and session counts</li>
                <li>Privacy settings and theme preferences from JSONB</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Planned Features</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Filter by country, level range, date range, privacy setting</li>
                <li>Sort by engagement score, achievements, sessions, playtime</li>
                <li>Group by theme preference or notification settings</li>
                <li>Interactive charts (session duration trends, achievement rates)</li>
                <li>Export to CSV and PDF formats</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for actual report content */}
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
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
