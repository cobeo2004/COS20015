import { useState } from "react";
import { ReportLayout } from "@/components/reports/ReportLayout";
import { ReportDataTable } from "@/components/reports/ReportDataTable";
import {
  ReportMetrics,
  CommonMetrics,
} from "@/components/reports/ReportMetrics";
import { usePlayerEngagementReport } from "@/hooks/usePlayerEngagementReport";
import { RiGroupLine, RiTrophyLine, RiTimeLine, RiStarLine } from "@remixicon/react";

export default function Report2Page() {
  const { data, isLoading } = usePlayerEngagementReport();

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
        "Username": String(item.username || ""),
        "Email": String(item.email || ""),
        "Country": String(item.country || ""),
        "Level": Number(item.level || 0).toString(),
        "Total Score": Number(item.total_score || 0).toString(),
        "Total Sessions": Number(item.total_sessions || 0).toString(),
        "Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(1),
        "Avg Session (hrs)": Number(item.avg_session_duration || 0).toFixed(2),
        "Achievements": Number(item.achievements_unlocked || 0).toString(),
        "Achievement Rate %": Number(item.achievement_completion_rate || 0).toFixed(1),
        "Retention Score": Number(item.retention_score || 0).toString(),
        "Days Since Last Session": Number(item.days_since_last_session || 0).toString(),
        "Privacy": String(item.privacy || "N/A"),
        "Theme": String(item.theme || "N/A"),
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `player-engagement-report-${date}.csv`;

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
        "Username": String(item.username || ""),
        "Country": String(item.country || ""),
        "Level": Number(item.level || 0).toString(),
        "Sessions": Number(item.total_sessions || 0).toString(),
        "Playtime (hrs)": Number(item.total_playtime_hours || 0).toFixed(1),
        "Achievements": Number(item.achievements_unlocked || 0).toString(),
        "Retention": Number(item.retention_score || 0).toString(),
      }));

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `player-engagement-report-${date}`;

      PDFExportService.quickExport(exportData, "Player Engagement Analysis", filename);
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
          totalPlayers: data.length,
          totalPlaytime: data.reduce(
            (sum, item) => sum + item.total_playtime_hours,
            0
          ),
          avgRetentionScore: data.reduce(
            (sum, item) => sum + item.retention_score,
            0
          ) / data.length,
          avgAchievementRate: data.reduce(
            (sum, item) => sum + item.achievement_completion_rate,
            0
          ) / data.length,
          totalSessions: data.reduce(
            (sum, item) => sum + item.total_sessions,
            0
          ),
          topPlayer: data.reduce((top, current) =>
            current.total_score > top.total_score ? current : top
          ),
        }
      : null;

  // Summary metrics for display
  const displayMetrics = summaryMetrics
    ? [
        {
          title: "Total Players",
          value: summaryMetrics.totalPlayers,
          icon: RiGroupLine,
          color: "primary" as const,
        },
        CommonMetrics.totalPlaytime(summaryMetrics.totalPlaytime),
        {
          title: "Avg Retention Score",
          value: summaryMetrics.avgRetentionScore.toFixed(0),
          subtitle: "Out of 100",
          icon: RiTimeLine,
          color: "success" as const,
        },
        {
          title: "Avg Achievement Rate",
          value: `${summaryMetrics.avgAchievementRate.toFixed(1)}%`,
          icon: RiTrophyLine,
          color: "warning" as const,
        },
        {
          title: "Total Sessions",
          value: summaryMetrics.totalSessions.toLocaleString(),
          icon: RiStarLine,
          color: "info" as const,
        },
        {
          title: "Top Player",
          value: summaryMetrics.topPlayer.username,
          subtitle: `Score: ${summaryMetrics.topPlayer.total_score.toLocaleString()}`,
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
      key: "username",
      label: "Username",
      sortable: true,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "level",
      label: "Level",
      sortable: true,
      align: "right" as const,
    },
    {
      key: "total_sessions",
      label: "Sessions",
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
      key: "achievements_unlocked",
      label: "Achievements",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "retention_score",
      label: "Retention",
      sortable: true,
      align: "right" as const,
      format: (value: number) => value.toFixed(0),
    },
  ];

  return (
    <ReportLayout
      title="Player Engagement Analysis"
      description="Detailed insights into player behavior, session duration, and achievement completion"
      reportNumber="#2"
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
        emptyMessage="No players found in the dataset"
      />
    </ReportLayout>
  );
}
