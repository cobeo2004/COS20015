import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RiDownloadLine, RiFileTextLine, RiFilePdfLine, RiCheckLine, RiErrorWarningLine, RiLoaderLine } from "@remixicon/react";

export interface ExportData {
  /** Data to export */
  data: any[];
  /** Report title for filename */
  title: string;
  /** Report description for PDF */
  description?: string;
  /** Current filters for filename context */
  filters?: Record<string, any>;
  /** Current sort for filename context */
  sort?: { field: string; direction: 'asc' | 'desc' };
  /** Chart images for PDF export */
  chartImages?: { id: string; imageData: string; title: string }[];
}

export interface ExportButtonsProps {
  /** Export data and metadata */
  exportData: ExportData;
  /** Whether export is in progress */
  isExporting?: boolean;
  /** Export type in progress */
  exportingType?: 'csv' | 'pdf';
  /** Error message */
  error?: string | null;
  /** Success message */
  success?: string | null;
  /** Whether to show both buttons or dropdown */
  asDropdown?: boolean;
  /** Whether to disable export when no data */
  disableWhenEmpty?: boolean;
  /** Custom filename generator */
  generateFilename?: (type: 'csv' | 'pdf', data: ExportData) => string;
  /** CSS class name */
  className?: string;
  /** Size variant: 'sm', 'default', 'lg' */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Enhanced export buttons component for reports.
 * Supports CSV and PDF export with loading states, error handling,
  success notifications, and filename generation with context.
 */
export function ExportButtons({
  exportData,
  isExporting = false,
  exportingType,
  error = null,
  success = null,
  asDropdown = false,
  disableWhenEmpty = true,
  generateFilename,
  className,
  size = 'sm',
}: ExportButtonsProps) {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Generate filename if not provided
  const defaultFilenameGenerator = (type: 'csv' | 'pdf', data: ExportData): string => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const titleSlug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let filename = `${titleSlug}-${date}.${type}`;

    // Add sort context to filename
    if (data.sort) {
      const sortSlug = `sorted-${data.sort.field}-${data.sort.direction}`;
      filename = `${titleSlug}-${sortSlug}-${date}.${type}`;
    }

    return filename;
  };

  const getFilename = (type: 'csv' | 'pdf') => {
    return generateFilename ? generateFilename(type, exportData) : defaultFilenameGenerator(type, exportData);
  };

  // Export handlers
  const handleExportCSV = async () => {
    try {
      setExportSuccess(null);

      // Import CSVExportService dynamically to avoid SSR issues
      const { CSVExportService } = await import("../../lib/services/CSVExportService");

      const filename = getFilename('csv');
      await CSVExportService.exportToCSV(exportData.data, filename);

      setExportSuccess(`Successfully exported ${exportData.data.length} rows to CSV`);
    } catch (err) {
      console.error('CSV export failed:', err);
      throw err;
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportSuccess(null);

      // Import PDFExportService dynamically to avoid SSR issues
      const { PDFExportService } = await import("../../lib/services/PDFExportService");

      const filename = getFilename('pdf');
      await PDFExportService.exportToPDF(exportData, filename);

      setExportSuccess(`Successfully exported report to PDF`);
    } catch (err) {
      console.error('PDF export failed:', err);
      throw err;
    }
  };

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 px-3 text-xs';
      case 'lg': return 'h-12 px-6 text-base';
      default: return 'h-10 px-4 text-sm';
    }
  };

  const isLoadingCSV = isExporting && exportingType === 'csv';
  const isLoadingPDF = isExporting && exportingType === 'pdf';
  const hasData = exportData.data && exportData.data.length > 0;
  const isDisabled = disableWhenEmpty && !hasData;

  // Individual export button
  const ExportButton = ({
    type,
    label,
    icon: Icon
  }: {
    type: 'csv' | 'pdf';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const isLoading = type === 'csv' ? isLoadingCSV : isLoadingPDF;

    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => type === 'csv' ? handleExportCSV() : handleExportPDF()}
        disabled={isDisabled || isLoading}
        className={`${getButtonSizeClasses()}`}
      >
        {isLoading ? (
          <RiLoaderLine className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Icon className="h-4 w-4 mr-2" />
        )}
        {isLoading ? `Exporting...` : label}
      </Button>
    );
  };

  // Dropdown menu variant
  if (asDropdown) {
    return (
      <div className={`space-y-3 ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={size}
              disabled={isDisabled || isExporting}
              className={getButtonSizeClasses()}
            >
              <RiDownloadLine className="h-4 w-4 mr-2" />
              Export
              {hasData && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {exportData.data.length}
                </Badge>
              )}
              {isExporting && <RiLoaderLine className="h-4 w-4 ml-2 animate-spin" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV} disabled={isLoadingCSV}>
              <RiFileTextLine className="h-4 w-4 mr-2" />
              Export as CSV
              {hasData && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {exportData.data.length} rows
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportPDF} disabled={isLoadingPDF}>
              <RiFilePdfLine className="h-4 w-4 mr-2" />
              Export as PDF
              {exportData.chartImages && exportData.chartImages.length > 0 && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {exportData.chartImages.length} charts
                </Badge>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status messages */}
        {error && (
          <Alert variant="destructive" className="text-sm">
            <RiErrorWarningLine className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(success || exportSuccess) && (
          <Alert className="text-sm border-green-200 bg-green-50 dark:bg-green-950">
            <RiCheckLine className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success || exportSuccess}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Separate buttons variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <ExportButton type="csv" label="Export CSV" icon={RiFileTextLine} />
        <ExportButton type="pdf" label="Export PDF" icon={RiFilePdfLine} />
      </div>

      {/* Status messages */}
      {error && (
        <Alert variant="destructive" className="text-sm">
          <RiErrorWarningLine className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(success || exportSuccess) && (
        <Alert className="text-sm border-green-200 bg-green-50 dark:bg-green-950">
          <RiCheckLine className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {success || exportSuccess}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Quick export button for single format
 */
export function QuickExportButton({
  type,
  exportData,
  isLoading = false,
  onExport,
  className,
  size = 'sm'
}: {
  type: 'csv' | 'pdf';
  exportData: ExportData;
  isLoading?: boolean;
  onExport: () => Promise<void>;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const isCSV = type === 'csv';
  const Icon = isCSV ? RiFileTextLine : RiFilePdfLine;
  const label = `Export ${type.toUpperCase()}`;

  const hasData = exportData.data && exportData.data.length > 0;
  const isDisabled = !hasData;

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 px-3 text-xs';
      case 'lg': return 'h-12 px-6 text-base';
      default: return 'h-10 px-4 text-sm';
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={onExport}
      disabled={isDisabled || isLoading}
      className={`${getButtonSizeClasses()} ${className}`}
    >
      {isLoading ? (
        <RiLoaderLine className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Icon className="h-4 w-4 mr-2" />
      )}
      {isLoading ? `Exporting...` : label}
    </Button>
  );
}