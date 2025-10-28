import React from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiUserLine,
  RiGameLine,
  RiTeamLine,
} from "@remixicon/react";

export interface ReportCardProps {
  /** Report title */
  title: string;
  /** Report description */
  description: string;
  /** Report type identifier */
  type: string;
  /** Number to display on the badge */
  reportNumber?: string;
  /** Key metrics to display */
  metrics?: {
    label: string;
    value: string | number;
  }[];
  /** Click handler for the card */
  onClick?: () => void;
  /** Navigation link if card should be a link */
  to?: string;
  /** Whether to show loading skeleton */
  isLoading?: boolean;
  /** Card variant: 'default', 'featured' */
  variant?: "default" | "featured";
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** CSS class name */
  className?: string;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Optional status badge */
  status?: "draft" | "ready" | "error";
}

/**
 * Summary card component for reports overview.
 * Displays key metrics, status, and navigation to full report.
 * Used on the main reports page to show available reports.
 */
export function ReportCard({
  title,
  description,
  type,
  reportNumber,
  metrics = [],
  onClick,
  to,
  isLoading = false,
  variant = "default",
  icon,
  className,
  disabled = false,
  status,
}: ReportCardProps) {
  // Default icons based on report type
  const getDefaultIcon = () => {
    switch (type.toLowerCase()) {
      case "game":
      case "performance":
        return RiGameLine;
      case "player":
      case "engagement":
        return RiUserLine;
      case "developer":
      case "success":
        return RiTeamLine;
      default:
        return RiBarChartBoxLine;
    }
  };

  const Icon = icon || getDefaultIcon();

  // Status badge colors
  const getStatusBadge = () => {
    if (!status) return null;

    const statusConfig = {
      draft: { label: "Draft", variant: "secondary" as const },
      ready: { label: "Ready", variant: "default" as const },
      error: { label: "Error", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    );
  };

  // Card content
  const cardContent = (
    <Card
      className={`
      relative overflow-hidden transition-all duration-200
      ${
        variant === "featured"
          ? "border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 hover:shadow-lg hover:scale-[1.02]"
          : "hover:shadow-md hover:border-primary/50"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${className}
    `}
    >
      {/* Gradient overlay for featured cards */}
      {variant === "featured" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 pointer-events-none" />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle
                className={`${
                  variant === "featured" ? "text-xl" : "text-lg"
                } leading-tight`}
              >
                {title}
              </CardTitle>
              {reportNumber && (
                <Badge variant="outline" className="text-xs">
                  #{reportNumber}
                </Badge>
              )}
              {getStatusBadge()}
            </div>
          </div>
          {!disabled && (
            <RiArrowRightLine className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Key metrics preview */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {metrics.slice(0, 4).map((metric, index) => (
                <div
                  key={index}
                  className="text-center p-2 bg-muted/50 rounded-lg"
                >
                  <div className="text-lg font-semibold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action button for non-link cards */}
          {!to && !disabled && (
            <Button
              variant={variant === "featured" ? "default" : "outline"}
              className="w-full"
              onClick={onClick}
            >
              View Report
              <RiArrowRightLine className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-2">
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Wrap in Link if 'to' prop is provided
  if (to && !disabled) {
    return (
      <Link prefetch="intent" to={to} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

/**
 * Grid container for report cards with responsive layout
 */
export function ReportCardGrid({
  children,
  columns = 3,
  className,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
}
