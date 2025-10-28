import React from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReportLayoutProps {
  /** Report title displayed in the header */
  title: string;
  /** Report description shown below the title */
  description: string;
  /** Report number/identifier for the badge */
  reportNumber?: string;
  /** Back navigation link destination */
  backTo?: string;
  /** Back button text */
  backText?: string;
  /** Whether to show export buttons */
  showExport?: boolean;
  /** Export button handlers */
  onExportCSV?: () => Promise<void>;
  onExportPDF?: () => Promise<void>;
  /** Loading states for export buttons */
  isExportingCSV?: boolean;
  isExportingPDF?: boolean;
  /** Whether the entire report is loading */
  isLoading?: boolean;
  /** Error state for the entire report */
  error?: string | null;
  /** Children content to render in the main area */
  children: React.ReactNode;
  /** Additional header actions */
  headerActions?: React.ReactNode;
  /** CSS class name */
  className?: string;
}

/**
 * Standardized layout component for all admin reports.
 * Provides consistent header, navigation, export functionality,
 * loading states, and error handling across all report pages.
 */
export function ReportLayout({
  title,
  description,
  reportNumber,
  backTo = "/admin/reports",
  backText = "Back to Reports",
  showExport = true,
  onExportCSV,
  onExportPDF,
  isExportingCSV = false,
  isExportingPDF = false,
  isLoading = false,
  error = null,
  children,
  headerActions,
  className,
}: ReportLayoutProps) {
  const handleExportCSV = async () => {
    try {
      await onExportCSV?.();
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  const handleExportPDF = async () => {
    try {
      await onExportPDF?.();
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  // Loading skeleton for header
  const HeaderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <>
              <Link to={backTo}>
                <Button variant="ghost" size="sm" className="mb-4">
                  <RiArrowLeftLine className="h-4 w-4 mr-2" />
                  {backText}
                </Button>
              </Link>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <RiErrorWarningLine className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    {reportNumber && <Badge>{reportNumber}</Badge>}
                  </div>
                  <p className="text-muted-foreground text-lg">{description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {headerActions}
                  {showExport && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleExportCSV}
                        disabled={!onExportCSV || isExportingCSV}
                      >
                        <RiDownloadLine className="h-4 w-4 mr-2" />
                        {isExportingCSV ? "Exporting..." : "Export CSV"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        disabled={!onExportPDF || isExportingPDF}
                      >
                        <RiDownloadLine className="h-4 w-4 mr-2" />
                        {isExportingPDF ? "Exporting..." : "Export PDF"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-12 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
