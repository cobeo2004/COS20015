/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CSV Export Service
 * Handles exporting data to CSV format using PapaParse
 */

import Papa from "papaparse";
import type { CSVExportOptions } from "../types/hybrid-data";

export class CSVExportService {
  /**
   * Export data to CSV file
   * @param data - Array of objects to export
   * @param options - Export configuration options
   */
  static export<T extends Record<string, any>>(
    data: T[],
    options: CSVExportOptions
  ): void {
    try {
      // Generate filename with timestamp if requested
      const filename = this.generateFilename(
        options.filename,
        options.includeTimestamp
      );

      // Prepare data for export
      const exportData = this.prepareData(data, options);

      // Convert to CSV using PapaParse
      const csv = Papa.unparse(exportData, {
        delimiter: options.delimiter || ",",
        header: true,
        skipEmptyLines: true,
      });

      // Trigger download
      this.downloadFile(csv, filename, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      throw new Error(`Failed to export CSV: ${error}`);
    }
  }

  /**
   * Prepare data for export
   * - Flatten nested objects
   * - Handle arrays by converting to comma-separated strings
   * - Remove null/undefined values
   */
  private static prepareData<T extends Record<string, any>>(
    data: T[],
    options: CSVExportOptions
  ): Record<string, any>[] {
    return data.map((item) => {
      const flattened: Record<string, any> = {};

      Object.entries(item).forEach(([key, value]) => {
        // Skip if custom headers are provided and this key is not included
        if (options.headers && !options.headers.includes(key)) {
          return;
        }

        // Handle different data types
        if (value === null || value === undefined) {
          flattened[key] = "";
        } else if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings
          flattened[key] = value.join(", ");
        } else if (typeof value === "object") {
          // Flatten nested objects
          flattened[key] = JSON.stringify(value);
        } else if (typeof value === "number") {
          // Format numbers to 2 decimal places if they're floats
          flattened[key] = Number.isInteger(value) ? value : value.toFixed(2);
        } else {
          flattened[key] = value;
        }
      });

      return flattened;
    });
  }

  /**
   * Generate filename with optional timestamp
   */
  private static generateFilename(
    baseFilename: string,
    includeTimestamp?: boolean
  ): string {
    // Remove .csv extension if provided
    const name = baseFilename.replace(/\.csv$/i, "");

    if (includeTimestamp) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      return `${name}_${timestamp}.csv`;
    }

    return `${name}.csv`;
  }

  /**
   * Trigger browser download of the CSV file
   */
  private static downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    // Create a Blob from the CSV content
    const blob = new Blob([content], { type: mimeType });

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  /**
   * Export with custom column mapping
   * Allows renaming columns in the CSV output
   */
  static exportWithMapping<T extends Record<string, any>>(
    data: T[],
    columnMapping: Record<string, string>, // { originalKey: 'Display Name' }
    filename: string,
    includeTimestamp?: boolean
  ): void {
    try {
      // Map the data to use display names
      const mappedData = data.map((item) => {
        const mapped: Record<string, any> = {};

        Object.entries(columnMapping).forEach(([key, displayName]) => {
          if (key in item) {
            let value = item[key];

            // Handle special data types
            if (Array.isArray(value)) {
              value = value.join(", ");
            } else if (typeof value === "object" && value !== null) {
              value = JSON.stringify(value);
            } else if (typeof value === "number" && !Number.isInteger(value)) {
              value = value.toFixed(2);
            } else if (value === null || value === undefined) {
              value = "";
            }

            mapped[displayName] = value;
          }
        });

        return mapped;
      });

      // Generate CSV
      const csv = Papa.unparse(mappedData, {
        header: true,
        skipEmptyLines: true,
      });

      // Download
      const finalFilename = this.generateFilename(filename, includeTimestamp);
      this.downloadFile(csv, finalFilename, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Error exporting CSV with mapping:", error);
      throw new Error(`Failed to export CSV: ${error}`);
    }
  }

  /**
   * Quick export with sensible defaults
   */
  static quickExport<T extends Record<string, any>>(
    data: T[],
    filename: string
  ): void {
    this.export(data, {
      filename,
      includeTimestamp: true,
    });
  }
}
