import { useState } from "react";
import { ReportLayout } from "@/components/reports/ReportLayout";
import { ReportDataTable } from "@/components/reports/ReportDataTable";
import {
  ReportMetrics,
  CommonMetrics,
} from "@/components/reports/ReportMetrics";
import { useGamePerformanceReport } from "@/hooks/useGamePerformanceReport";
import { ReportImage } from "@/components/reports/ReportImage";
import { GameTags } from "@/components/reports/JSONBadge";
import { RiGamepadLine, RiTrophyLine, RiStarLine } from "@remixicon/react";
import type { GamePerformanceReport } from "@/lib/types/hybrid-data";

export default function Report1Page() {
  const { data, isLoading } = useGamePerformanceReport();

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportingType, setExportingType] = useState<"csv" | "pdf" | null>(
    null
  );
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Export handlers
  const handleExportCSV = async () => {
    if (!data) return;

    setIsExporting(true);
    setExportingType("csv");
    setExportError(null);
    setExportSuccess(null);

    try {
      const { CSVExportService } = await import(
        "@/lib/services/CSVExportService"
      );

      // Prepare export data
      const exportData = data.map((item) => ({
        "Game Title": String(item.game_title || ""),
        Genre: String(item.genre || ""),
        Developer: String(item.developer_name || ""),
        Revenue: `$${Number(item.total_revenue || 0).toFixed(2)}`,
        Players: Number(item.unique_players || 0).toString(),
        "Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(1),
        Rating: item.average_rating ? Number(item.average_rating).toFixed(1) : "N/A",
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `game-performance-report-${date}.csv`;

      CSVExportService.quickExport(exportData, filename);
      setExportSuccess(
        `Successfully exported ${exportData.length} rows to CSV`
      );
    } catch (error) {
      setExportError(
        `CSV export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsExporting(false);
      setExportingType(null);
    }
  };

  const handleExportPDF = async () => {
    if (!data) return;

    setIsExporting(true);
    setExportingType("pdf");
    setExportError(null);
    setExportSuccess(null);

    try {
      const { PDFExportService } = await import(
        "@/lib/services/PDFExportService"
      );

      // Prepare export data - only include simple fields for PDF
      const exportData = {
        data: data.map((item) => {
          // Debug log to see what we're working with
          console.log('Exporting item:', item);

          return {
            "Game Title": String(item.game_title || ""),
            "Genre": String(item.genre || ""),
            "Developer": String(item.developer_name || ""),
            "Revenue": `$${Number(item.total_revenue || 0).toFixed(2)}`,
            "Players": Number(item.unique_players || 0).toString(),
            "Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(1),
            "Rating": item.average_rating ? Number(item.average_rating).toFixed(1) : "N/A",
          };
        }),
        title: "Game Performance Report",
        description:
          "Comprehensive analysis of game revenue, playtime, player engagement, and ratings",
      };

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `game-performance-report-${date}.pdf`;

      PDFExportService.quickExport(exportData.data, exportData.title, filename.replace('.pdf', ''));
      setExportSuccess(`Successfully exported report to PDF`);
    } catch (error) {
      setExportError(
        `PDF export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsExporting(false);
      setExportingType(null);
    }
  };

  // Calculate summary metrics
  const summaryMetrics =
    data && data.length > 0
      ? {
          totalRevenue: data.reduce((sum, item) => sum + item.total_revenue, 0),
          totalPlayers: data.reduce(
            (sum, item) => sum + item.unique_players,
            0
          ),
          totalPlaytime: data.reduce(
            (sum, item) => sum + item.total_playtime_hours,
            0
          ),
          avgRating:
            data.reduce((sum, item) => sum + (item.average_rating || 0), 0) /
            data.filter((g) => g.average_rating).length,
          totalGames: data.length,
          topPerformingGame: data.reduce((top, current) =>
            current.total_revenue > top.total_revenue ? current : top
          ),
        }
      : null;

  // Summary metrics for display
  const displayMetrics = summaryMetrics
    ? [
        CommonMetrics.totalRevenue(summaryMetrics.totalRevenue),
        CommonMetrics.totalPlayers(summaryMetrics.totalPlayers),
        CommonMetrics.totalPlaytime(summaryMetrics.totalPlaytime),
        CommonMetrics.averageRating(summaryMetrics.avgRating),
        {
          title: "Total Games",
          value: summaryMetrics.totalGames,
          icon: RiGamepadLine,
          color: "info" as const,
        },
        {
          title: "Top Game",
          value: summaryMetrics.topPerformingGame.game_title,
          subtitle: `$${summaryMetrics.topPerformingGame.total_revenue.toLocaleString()}`,
          icon: RiTrophyLine,
          color: "success" as const,
          formatter: (v: string) =>
            v.length > 20 ? v.substring(0, 20) + "..." : v,
        },
      ]
    : [];

  // Table columns
  const tableColumns = [
    {
      key: "cover_image_url",
      label: "Cover",
      sortable: false,
      render: (value: string, record: GamePerformanceReport) => (
        <ReportImage
          src={value}
          alt={record.game_title}
          size="md"
          className="w-12 h-12"
        />
      ),
    },
    {
      key: "game_title",
      label: "Game Title",
      sortable: true,
      render: (value: string, record: GamePerformanceReport) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          {record.total_reviews && (
            <span className="text-xs text-gray-500">
              {record.total_reviews.toLocaleString()} reviews
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tags",
      label: "Tags",
      sortable: false,
      render: (value: string[]) => (
        <GameTags items={value} maxVisible={3} />
      ),
    },
    {
      key: "genre",
      label: "Genre",
      sortable: true,
    },
    {
      key: "developer_name",
      label: "Developer",
      sortable: true,
      render: (value: string, record: GamePerformanceReport) => (
        <div className="flex items-center gap-2">
          {record.logo_url && (
            <ReportImage
              src={record.logo_url}
              alt={value}
              size="sm"
              className="w-6 h-6"
            />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "total_revenue",
      label: "Revenue",
      sortable: true,
      align: "right" as const,
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "unique_players",
      label: "Players",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "total_playtime_hours",
      label: "Playtime (hrs)",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toFixed(1),
    },
    {
      key: "average_rating",
      label: "Rating",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <RiStarLine className="w-4 h-4 text-yellow-500" />
          <span>{value?.toFixed(1) || "N/A"}</span>
        </div>
      ),
    },
  ];

  return (
    <ReportLayout
      title="Game Performance Analytics"
      description="Comprehensive analysis of game revenue, playtime, player engagement, and ratings"
      reportNumber="#1"
      onExportCSV={handleExportCSV}
      onExportPDF={handleExportPDF}
      isExportingCSV={isExporting && exportingType === "csv"}
      isExportingPDF={isExporting && exportingType === "pdf"}
      isLoading={isLoading}
    >
      {/* Export Status Messages */}
      {exportError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {exportError}
        </div>
      )}
      {exportSuccess && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
          {exportSuccess}
        </div>
      )}

      {/* Summary Metrics */}
      <div className="mb-8">
        <ReportMetrics
          metrics={displayMetrics}
          columns={3}
          isLoading={isLoading}
        />
      </div>

      {/* Data Table */}
      <ReportDataTable
        data={data || []}
        columns={tableColumns}
        showSearch={true}
        showPagination={true}
        emptyMessage="No games found in the dataset"
      />
    </ReportLayout>
  );
}
