import { useState } from "react";
import { ReportLayout } from "@/components/reports/ReportLayout";
import { ReportDataTable } from "@/components/reports/ReportDataTable";
import {
  ReportMetrics,
  CommonMetrics,
} from "@/components/reports/ReportMetrics";
import { useDeveloperSuccessReport } from "@/hooks/useDeveloperSuccessReport";
import { ReportImage } from "@/components/reports/ReportImage";
import { DeveloperSpecialties } from "@/components/reports/JSONBadge";
import {
  RiBuilding2Line,
  RiGamepadLine,
  RiStarLine,
  RiMapPinLine,
  RiCalendarLine,
  RiTrophyLine,
  RiTeamLine,
} from "@remixicon/react";
import type { DeveloperSuccessReport } from "@/lib/types/hybrid-data";

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
        Email: String(item.email || ""),
        "Total Games": Number(item.total_games || 0).toString(),
        "Total Revenue": `$${Number(item.total_revenue || 0).toFixed(2)}`,
        "Revenue per Game": `$${Number(item.revenue_per_game || 0).toFixed(2)}`,
        "Total Players": Number(item.total_players || 0).toString(),
        "Avg Game Rating": item.avg_game_rating
          ? Number(item.avg_game_rating).toFixed(1)
          : "N/A",
        "Total Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(
          1
        ),
        "Company Size": String(item.company_size || "N/A"),
        "Founded Year": item.founded_year
          ? Number(item.founded_year).toString()
          : "N/A",
        Headquarters: String(item.headquarters || "N/A"),
        Specialties: item.specialties ? item.specialties.join(", ") : "N/A",
        "Awards Count": item.awards_count
          ? Number(item.awards_count).toString()
          : "0",
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
        Developer: String(item.developer_name || ""),
        Games: Number(item.total_games || 0).toString(),
        Revenue: `$${Number(item.total_revenue || 0).toLocaleString()}`,
        Players: Number(item.total_players || 0).toLocaleString(),
        "Avg Rating": item.avg_game_rating
          ? Number(item.avg_game_rating).toFixed(1)
          : "N/A",
        "Company Size": String(item.company_size || "N/A"),
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `developer-success-report-${date}`;

      PDFExportService.quickExport(
        exportData,
        "Developer Success Dashboard",
        filename
      );
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

  // Helper functions for displaying company metadata
  const getSizeColor = (size?: string) => {
    if (!size) return "text-gray-500";
    if (size.includes("Indie")) return "text-green-600";
    if (size.includes("Small")) return "text-blue-600";
    if (size.includes("Medium")) return "text-purple-600";
    if (size.includes("Large")) return "text-orange-600";
    return "text-gray-600";
  };

  // Table columns
  const tableColumns = [
    {
      key: "developer_name",
      label: "Developer",
      sortable: true,
      render: (value: string, record: DeveloperSuccessReport) => (
        <div className="flex items-center gap-3">
          <ReportImage
            src={record.logo_url}
            alt={value}
            size="md"
            className="w-10 h-10"
            fallbackText={value
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{value}</span>
            {record.company_size && (
              <span
                className={`text-xs font-medium ${getSizeColor(
                  record.company_size
                )}`}
              >
                {record.company_size}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "specialties",
      label: "Specialties",
      sortable: false,
      render: (value: string[]) => (
        <DeveloperSpecialties items={value} maxVisible={3} />
      ),
    },
    {
      key: "headquarters",
      label: "Location",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <RiMapPinLine className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value || "Unknown"}</span>
        </div>
      ),
    },
    {
      key: "founded_year",
      label: "Founded",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <RiCalendarLine className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "total_games",
      label: "Games",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <RiGamepadLine className="w-4 h-4 text-blue-500" />
          <span>{value.toLocaleString()}</span>
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
      key: "total_players",
      label: "Players",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <RiTeamLine className="w-4 h-4 text-green-500" />
          <span>{value.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "avg_game_rating",
      label: "Avg Rating",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <RiStarLine className="w-4 h-4 text-yellow-500" />
          <span>{value?.toFixed(1) || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "awards_count",
      label: "Awards",
      sortable: true,
      align: "right" as const,
      render: (value: number) => (
        <div className="flex items-center justify-end gap-1">
          <RiTrophyLine className="w-4 h-4 text-yellow-600" />
          <span>{value?.toLocaleString() || "0"}</span>
        </div>
      ),
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
