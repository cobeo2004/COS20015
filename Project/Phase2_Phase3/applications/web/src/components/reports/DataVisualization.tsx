import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportChart, type ChartType, type ChartSeries } from "./ReportChart";
import { RiFullscreenLine, RiFullscreenExitLine, RiDownloadLine, RiSettings3Line } from "@remixicon/react";

export interface VisualizationConfig {
  id: string;
  title: string;
  type: ChartType;
  dataKey: string;
  name: string;
  color?: string;
  height?: number;
  aspect?: number;
}

export interface DataVisualizationProps {
  /** Visualization configurations */
  visualizations: VisualizationConfig[];
  /** Data for all visualizations */
  data: any[];
  /** Default active tab */
  defaultTab?: string;
  /** Whether to allow fullscreen mode */
  allowFullscreen?: boolean;
  /** Whether to show export options */
  showExport?: boolean;
  /** Whether to show settings */
  showSettings?: boolean;
  /** Layout: 'tabs', 'grid', or 'stacked' */
  layout?: 'tabs' | 'grid' | 'stacked';
  /** Grid columns for grid layout */
  gridColumns?: 1 | 2 | 3 | 4;
  /** Chart click handler */
  onChartClick?: (chartId: string, dataPoint: any) => void;
  /** Export handler */
  onExport?: (chartId: string, format: 'png' | 'svg') => void;
  /** CSS class name */
  className?: string;
}

/**
 * Advanced visualization suite for reports.
 * Supports multiple chart types in tabs, grid, or stacked layouts
 * with fullscreen mode, export options, and interactive features.
 */
export function DataVisualization({
  visualizations,
  data,
  defaultTab,
  allowFullscreen = true,
  showExport = true,
  showSettings = false,
  layout = 'tabs',
  gridColumns = 2,
  onChartClick,
  onExport,
  className,
}: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || visualizations[0]?.id);
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);

  // Handle chart fullscreen toggle
  const toggleFullscreen = (chartId: string) => {
    if (fullscreenChart === chartId) {
      setFullscreenChart(null);
    } else {
      setFullscreenChart(chartId);
    }
  };

  // Render individual visualization
  const renderVisualization = (config: VisualizationConfig, isFullscreen = false) => {
    const chartData = data.map(item => ({
      ...item,
      [config.dataKey]: item[config.dataKey] || 0,
    }));

    const series: ChartSeries[] = [{
      dataKey: config.dataKey,
      name: config.name,
      color: config.color,
    }];

    const isLoading = !data || data.length === 0;
    const error = null;

    return (
      <ReportChart
        key={config.id}
        type={config.type}
        data={chartData}
        series={series}
        title={isFullscreen ? config.title : undefined}
        height={isFullscreen ? window.innerHeight * 0.7 : config.height}
        aspect={config.aspect}
        isLoading={isLoading}
        error={error}
        chartConfig={{
          [config.dataKey]: {
            label: config.name,
            color: config.color,
          },
        }}
        className={isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}
      />
    );
  };

  // Fullscreen overlay
  const FullscreenOverlay = () => {
    if (!fullscreenChart) return null;

    const config = visualizations.find(v => v.id === fullscreenChart);
    if (!config) return null;

    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{config.title}</h2>
          <div className="flex items-center gap-2">
            {showExport && onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(config.id, 'png')}
              >
                <RiDownloadLine className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFullscreen(config.id)}
            >
              <RiFullscreenExitLine className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </div>

        {/* Chart content */}
        <div className="flex-1 p-4 overflow-auto">
          {renderVisualization(config, true)}
        </div>
      </div>
    );
  };

  // Grid layout
  if (layout === 'grid') {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    return (
      <div className={`space-y-6 ${className}`}>
        <div className={`grid ${gridCols[gridColumns]} gap-6`}>
          {visualizations.map((config) => (
            <div key={config.id} className="relative">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{config.title}</CardTitle>
                    {allowFullscreen && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFullscreen(config.id)}
                        className="h-8 w-8 p-0"
                      >
                        <RiFullscreenLine className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {renderVisualization(config)}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <FullscreenOverlay />
      </div>
    );
  }

  // Stacked layout
  if (layout === 'stacked') {
    return (
      <div className={`space-y-6 ${className}`}>
        {visualizations.map((config) => (
          <div key={config.id} className="relative">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{config.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {showExport && onExport && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onExport(config.id, 'png')}
                      >
                        <RiDownloadLine className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    )}
                    {allowFullscreen && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFullscreen(config.id)}
                      >
                        <RiFullscreenLine className="h-4 w-4 mr-1" />
                        Fullscreen
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderVisualization(config)}
              </CardContent>
            </Card>
          </div>
        ))}
        <FullscreenOverlay />
      </div>
    );
  }

  // Default tabs layout
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visualizations.map((config) => (
            <TabsTrigger key={config.id} value={config.id} className="text-sm">
              {config.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {visualizations.map((config) => (
          <TabsContent key={config.id} value={config.id} className="space-y-4 mt-6">
            <div className="relative">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{config.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {showSettings && (
                        <Button variant="outline" size="sm">
                          <RiSettings3Line className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      )}
                      {showExport && onExport && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onExport(config.id, 'png')}
                        >
                          <RiDownloadLine className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      )}
                      {allowFullscreen && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFullscreen(config.id)}
                        >
                          <RiFullscreenLine className="h-4 w-4 mr-2" />
                          Fullscreen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderVisualization(config)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <FullscreenOverlay />
    </div>
  );
}

/**
 * Quick visualization presets for common report scenarios
 */
export const VisualizationPresets = {
  // Game Performance Presets
  revenueByGame: () => ({
    id: 'revenue-by-game',
    title: 'Revenue by Game',
    type: 'bar' as ChartType,
    dataKey: 'total_revenue',
    name: 'Revenue',
    color: '#10b981',
    height: 300,
  }),

  playerEngagement: () => ({
    id: 'player-engagement',
    title: 'Player Engagement Over Time',
    type: 'line' as ChartType,
    dataKey: 'active_players',
    name: 'Active Players',
    color: '#3b82f6',
    height: 300,
  }),

  gameRatings: () => ({
    id: 'game-ratings',
    title: 'Game Rating Distribution',
    type: 'pie' as ChartType,
    dataKey: 'average_rating',
    name: 'Rating',
    color: '#f59e0b',
    height: 300,
  }),

  // Developer Success Presets
  developerRevenue: () => ({
    id: 'developer-revenue',
    title: 'Revenue by Developer',
    type: 'bar' as ChartType,
    dataKey: 'total_revenue',
    name: 'Revenue',
    color: '#8b5cf6',
    height: 300,
  }),

  gamePerformance: () => ({
    id: 'game-performance',
    title: 'Game Performance Metrics',
    type: 'area' as ChartType,
    dataKey: 'total_playtime_hours',
    name: 'Playtime (hours)',
    color: '#06b6d4',
    height: 300,
  }),
};