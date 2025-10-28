/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export type ChartType = "line" | "bar" | "pie" | "area";

export interface ChartDataPoint {
  [key: string]: any;
}

export interface ChartSeries {
  /** Data key for the series */
  dataKey: string;
  /** Display name for the series */
  name: string;
  /** Color for the series */
  color?: string;
  /** Chart type for this series (for mixed charts) */
  type?: ChartType;
}

export interface ReportChartProps {
  /** Chart type */
  type: ChartType;
  /** Chart data */
  data: ChartDataPoint[];
  /** Chart series configuration */
  series: ChartSeries[];
  /** Chart title */
  title?: string;
  /** Chart height */
  height?: number;
  /** Chart aspect ratio */
  aspect?: number;
  /** Whether to show legend */
  showLegend?: boolean;
  /** Whether to show grid */
  showGrid?: boolean;
  /** Whether to show tooltip */
  showTooltip?: boolean;
  /** X-axis data key */
  xAxisDataKey?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Whether chart is loading */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: any, name: string, props: any) => React.ReactNode;
  /** Chart configuration for theming */
  chartConfig?: any;
  /** CSS class name */
  className?: string;
  /** Maximum number of data points to display */
  maxDataPoints?: number;
}

// Default colors for charts
const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#67b7dc",
  "#ff6b6b",
  "#4ecdc4",
];

/**
 * Chart wrapper component for reports using the shadcn/ui chart system.
 * Supports line, bar, pie, and area charts with responsive design,
 * consistent theming, and loading states.
 */
export function ReportChart({
  type,
  data,
  series,
  title,
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  xAxisDataKey,
  yAxisLabel,
  isLoading = false,
  error = null,
  emptyMessage = "No data available",
  tooltipFormatter,
  chartConfig,
  className,
  maxDataPoints,
}: ReportChartProps) {
  // Limit data points if specified
  const chartData = maxDataPoints ? data.slice(-maxDataPoints) : data;

  // Build chart config for theming
  const defaultChartConfig = React.useMemo(() => {
    const config: any = {};
    series.forEach((s, index) => {
      config[s.dataKey] = {
        label: s.name,
        color: s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      };
    });
    return config;
  }, [series]);

  const finalChartConfig = chartConfig || defaultChartConfig;

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge variant="destructive">Error</Badge>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!chartData || chartData.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            )}
            {xAxisDataKey && (
              <XAxis
                dataKey={xAxisDataKey}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
            )}
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={tooltipFormatter as any} />
                }
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((s, index) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={
                  s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={s.name}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            )}
            {xAxisDataKey && (
              <XAxis
                dataKey={xAxisDataKey}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
            )}
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={tooltipFormatter as any} />
                }
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((s, index) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                fill={s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                name={s.name}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={series[0]?.dataKey}
              nameKey={xAxisDataKey}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height, 400) / 2 - 20}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={tooltipFormatter as any} />
                }
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart data={chartData}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            )}
            {xAxisDataKey && (
              <XAxis
                dataKey={xAxisDataKey}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
            )}
            <YAxis
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                  : undefined
              }
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={tooltipFormatter as any} />
                }
              />
            )}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((s, index) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={
                  s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                fill={s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                fillOpacity={0.6}
                name={s.name}
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>
          <ChartContainer config={finalChartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() as React.ReactElement}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Simple chart wrapper for quick chart creation
 */
export function QuickChart({
  type,
  data,
  dataKey,
  name,
  title,
  ...props
}: Omit<ReportChartProps, "series"> & {
  dataKey: string;
  name: string;
}) {
  const series: ChartSeries[] = [{ dataKey, name }];

  return (
    <ReportChart
      type={type}
      data={data}
      series={series}
      title={title}
      {...props}
    />
  );
}
