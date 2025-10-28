import { useState } from "react";
import { ReportLayout } from "@/components/reports/ReportLayout";
import { ReportDataTable } from "@/components/reports/ReportDataTable";
import {
  ReportMetrics,
  CommonMetrics,
} from "@/components/reports/ReportMetrics";
import { useDeveloperSuccessReport } from "@/hooks/useDeveloperSuccessReport";
import { RiBuilding2Line, RiGamepadLine, RiStarLine } from "@remixicon/react";

export default function Report3Page() {
  const { data, isLoading } = useDeveloperSuccessReport();

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
        "Developer Name": String(item.developer_name || ""),
        "Email": String(item.email || ""),
        "Total Games": Number(item.total_games || 0).toString(),
        "Total Revenue": `$${Number(item.total_revenue || 0).toFixed(2)}`,
        "Revenue per Game": `$${Number(item.revenue_per_game || 0).toFixed(2)}`,
        "Total Players": Number(item.total_players || 0).toString(),
        "Avg Game Rating": item.avg_game_rating ? Number(item.avg_game_rating).toFixed(1) : "N/A",
        "Total Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(1),
        "Company Size": String(item.company_size || "N/A"),
        "Founded Year": item.founded_year ? Number(item.founded_year).toString() : "N/A",
        "Headquarters": String(item.headquarters || "N/A"),
        "Specialties": item.specialties ? item.specialties.join(", ") : "N/A",
        "Awards Count": item.awards_count ? Number(item.awards_count).toString() : "0",
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `developer-success-report-${date}.csv`;

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
      const exportData = data.map((item) => ({
        "Developer": String(item.developer_name || ""),
        "Games": Number(item.total_games || 0).toString(),
        "Revenue": `$${Number(item.total_revenue || 0).toLocaleString()}`,
        "Players": Number(item.total_players || 0).toLocaleString(),
        "Avg Rating": item.avg_game_rating ? Number(item.avg_game_rating).toFixed(1) : "N/A",
        "Company Size": String(item.company_size || "N/A"),
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `developer-success-report-${date}`;

      PDFExportService.quickExport(exportData, "Developer Success Dashboard", filename);
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
          totalDevelopers: data.length,
          totalGames: data.reduce((sum, item) => sum + item.total_games, 0),
          totalRevenue: data.reduce((sum, item) => sum + item.total_revenue, 0),
          totalPlayers: data.reduce((sum, item) => sum + item.total_players, 0),
          avgGameRating:
            data.reduce((sum, item) => sum + (item.avg_game_rating || 0), 0) /
            data.filter((d) => d.avg_game_rating).length,
          topDeveloper: data.reduce((top, current) =>
            current.total_revenue > top.total_revenue ? current : top
          ),
        }
      : null;

  // Summary metrics for display
  const displayMetrics = summaryMetrics
    ? [
        {
          title: "Total Developers",
          value: summaryMetrics.totalDevelopers,
          icon: RiBuilding2Line,
          color: "primary" as const,
        },
        {
          title: "Total Games",
          value: summaryMetrics.totalGames.toLocaleString(),
          icon: RiGamepadLine,
          color: "info" as const,
        },
        CommonMetrics.totalRevenue(summaryMetrics.totalRevenue),
        CommonMetrics.totalPlayers(summaryMetrics.totalPlayers),
        CommonMetrics.averageRating(summaryMetrics.avgGameRating),
        {
          title: "Top Developer",
          value: summaryMetrics.topDeveloper.developer_name,
          subtitle: `$${summaryMetrics.topDeveloper.total_revenue.toLocaleString()}`,
          icon: RiStarLine,
          color: "success" as const,
          formatter: (v: string) =>
            v.length > 20 ? v.substring(0, 20) + "..." : v,
        },
      ]
    : [];

  // Table columns
  const tableColumns = [
    {
      key: "developer_name",
      label: "Developer Name",
      sortable: true,
    },
    {
      key: "total_games",
      label: "Games",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "total_revenue",
      label: "Revenue",
      sortable: true,
      align: "right" as const,
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "revenue_per_game",
      label: "Revenue/Game",
      sortable: true,
      align: "right" as const,
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "total_players",
      label: "Players",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "avg_game_rating",
      label: "Avg Rating",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value?.toFixed(1) || "N/A",
    },
    {
      key: "company_size",
      label: "Company Size",
      sortable: true,
      format: (value: string) => value || "N/A",
    },
  ];

  return (
    <ReportLayout
      title="Developer Success Dashboard"
      description="Studio performance metrics including games count, revenue, and player engagement"
      reportNumber="#3"
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
        emptyMessage="No developers found in the dataset"
      />
    </ReportLayout>
  );
}
