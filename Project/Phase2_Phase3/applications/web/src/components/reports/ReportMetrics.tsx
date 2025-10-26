import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RiArrowUpLine, RiArrowDownLine, RiArrowRightLine, RiTrophyLine, RiUser3Line, RiMoneyDollarCircleLine, RiTimeLine } from "@remixicon/react";

export interface MetricItem {
  /** Metric title */
  title: string;
  /** Metric value */
  value: string | number;
  /** Optional subtitle/secondary value */
  subtitle?: string;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Metric trend: 'up', 'down', 'neutral' */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend percentage */
  trendPercentage?: number;
  /** Custom color for the metric */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Large number display (reduces font size for long numbers) */
  large?: boolean;
  /** Formatted value display */
  formatter?: (value: any) => string;
}

export interface ReportMetricsProps {
  /** Array of metrics to display */
  metrics: MetricItem[];
  /** Number of columns in the grid */
  columns?: 1 | 2 | 3 | 4 | 6;
  /** Whether metrics are loading */
  isLoading?: boolean;
  /** Whether to show skeleton loading */
  showSkeleton?: boolean;
  /** CSS class name */
  className?: string;
  /** Compact display variant */
  compact?: boolean;
}

/**
 * Key metrics display component for reports.
 * Shows summary statistics with icons, trends, and color coding
 * in a responsive grid layout.
 */
export function ReportMetrics({
  metrics,
  columns = 4,
  isLoading = false,
  showSkeleton = true,
  className,
  compact = false,
}: ReportMetricsProps) {
  // Grid columns mapping
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  // Color mappings
  const getColorClasses = (color?: MetricItem['color']) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400',
        };
      case 'primary':
      default:
        return {
          bg: 'bg-primary/10 dark:bg-primary/20',
          border: 'border-primary/20 dark:border-primary/30',
          text: 'text-primary dark:text-primary-foreground',
          icon: 'text-primary',
        };
    }
  };

  // Trend icon component
  const TrendIcon = ({ trend }: { trend?: 'up' | 'down' | 'neutral' }) => {
    switch (trend) {
      case 'up':
        return <RiArrowUpLine className="h-4 w-4 text-green-600" />;
      case 'down':
        return <RiArrowDownLine className="h-4 w-4 text-red-600" />;
      default:
        return <RiArrowRightLine className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Format metric value
  const formatValue = (metric: MetricItem) => {
    if (metric.formatter) {
      return metric.formatter(metric.value);
    }

    if (typeof metric.value === 'number') {
      // Format large numbers with commas
      return metric.value.toLocaleString();
    }

    return metric.value;
  };

  // Loading skeleton
  if (isLoading && showSkeleton) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
        {[...Array(columns)].map((_, index) => (
          <Card key={index}>
            <CardContent className={`p-6 ${compact ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        const Icon = metric.icon;

        return (
          <Card key={index} className={`${colors.border} border-2 ${colors.bg}`}>
            <CardContent className={`p-6 ${compact ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center justify-between mb-2">
                {Icon && (
                  <div className={`p-2 rounded-lg ${colors.bg} ${colors.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                {metric.trend && (
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={metric.trend} />
                    {metric.trendPercentage && (
                      <span className="text-xs text-muted-foreground">
                        {metric.trend.trend === 'up' ? '+' : ''}
                        {metric.trendPercentage}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={`${metric.large ? 'space-y-1' : 'space-y-2'}`}>
                <div className={`font-bold ${metric.large ? 'text-xl' : 'text-2xl'} ${colors.text}`}>
                  {formatValue(metric)}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </div>
                  {metric.subtitle && (
                    <div className="text-xs text-muted-foreground">
                      {metric.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Preset metric configurations for common gaming platform metrics
 */
export const CommonMetrics = {
  // Game Performance Metrics
  totalRevenue: (value: number): MetricItem => ({
    title: "Total Revenue",
    value: value,
    icon: RiMoneyDollarCircleLine,
    color: "success",
    formatter: (v) => `$${(v as number).toLocaleString()}`,
    large: true,
  }),

  totalPlayers: (value: number): MetricItem => ({
    title: "Total Players",
    value: value,
    icon: RiUser3Line,
    color: "primary",
    formatter: (v) => (v as number).toLocaleString(),
  }),

  totalPlaytime: (value: number): MetricItem => ({
    title: "Total Playtime",
    value: value,
    icon: RiTimeLine,
    color: "info",
    subtitle: "hours",
    formatter: (v) => `${Math.round(v as number).toLocaleString()}`,
  }),

  averageRating: (value: number): MetricItem => ({
    title: "Average Rating",
    value: value,
    icon: RiTrophyLine,
    color: "warning",
    subtitle: "/ 5.0",
    formatter: (v) => (v as number).toFixed(1),
  }),

  // Growth Metrics
  revenueGrowth: (percentage: number): MetricItem => ({
    title: "Revenue Growth",
    value: percentage,
    icon: RiArrowUpLine,
    color: percentage >= 0 ? "success" : "danger",
    trend: percentage >= 0 ? "up" : "down",
    trendPercentage: Math.abs(percentage),
    formatter: (v) => `${v >= 0 ? '+' : ''}${(v as number).toFixed(1)}%`,
  }),

  playerGrowth: (percentage: number): MetricItem => ({
    title: "Player Growth",
    value: percentage,
    icon: RiUser3Line,
    color: percentage >= 0 ? "success" : "danger",
    trend: percentage >= 0 ? "up" : "down",
    trendPercentage: Math.abs(percentage),
    formatter: (v) => `${v >= 0 ? '+' : ''}${(v as number).toFixed(1)}%`,
  }),
};