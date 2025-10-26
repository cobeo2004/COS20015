/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PDF Export Service
 * Handles exporting data to PDF format using jsPDF and jspdf-autotable
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFExportOptions } from "../types/hybrid-data";

export class PDFExportService {
  /**
   * Export data to PDF file with table
   * @param data - Array of objects to export
   * @param options - Export configuration options
   */
  static export<T extends Record<string, any>>(
    data: T[],
    options: PDFExportOptions
  ): void {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: options.orientation || "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add title if provided
      if (options.title) {
        this.addTitle(doc, options.title);
      }

      // Add metadata
      this.addMetadata(doc, options);

      // Prepare data for table
      const tableData = this.prepareTableData(data);

      // Add table using autoTable
      autoTable(doc, {
        head: [tableData.headers],
        body: tableData.rows,
        startY: options.title ? 25 : 15,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 10, bottom: 10 },
      });

      // Generate filename
      const filename = this.generateFilename(
        options.filename,
        options.includeTimestamp
      );

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw new Error(`Failed to export PDF: ${error}`);
    }
  }

  /**
   * Add title to the PDF
   */
  private static addTitle(doc: jsPDF, title: string): void {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 15);
  }

  /**
   * Add metadata (generation date, etc.)
   */
  private static addMetadata(doc: jsPDF, options: PDFExportOptions): void {
    const yPosition = options.title ? 20 : 10;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128, 128, 128);

    const date = new Date().toLocaleString();
    doc.text(`Generated: ${date}`, 14, yPosition);
  }

  /**
   * Prepare data for table format
   */
  private static prepareTableData<T extends Record<string, any>>(
    data: T[]
  ): { headers: string[]; rows: any[][] } {
    if (data.length === 0) {
      return { headers: [], rows: [] };
    }

    // Extract headers from first object
    const headers = Object.keys(data[0]).map((key) =>
      this.formatHeaderName(key)
    );

    // Extract rows
    const rows = data.map((item) =>
      Object.values(item).map((value) => this.formatCellValue(value))
    );

    return { headers, rows };
  }

  /**
   * Format header name (convert camelCase to Title Case)
   */
  private static formatHeaderName(key: string): string {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Format cell value for display
   */
  private static formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    if (typeof value === "number") {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  }

  /**
   * Generate filename with optional timestamp
   */
  private static generateFilename(
    baseFilename: string,
    includeTimestamp?: boolean
  ): string {
    // Remove .pdf extension if provided
    const name = baseFilename.replace(/\.pdf$/i, "");

    if (includeTimestamp) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      return `${name}_${timestamp}.pdf`;
    }

    return `${name}.pdf`;
  }

  /**
   * Export with custom column mapping
   * Allows renaming columns in the PDF output
   */
  static exportWithMapping<T extends Record<string, any>>(
    data: T[],
    columnMapping: Record<string, string>, // { originalKey: 'Display Name' }
    title: string,
    filename: string,
    orientation: "portrait" | "landscape" = "landscape"
  ): void {
    try {
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4",
      });

      // Add title
      this.addTitle(doc, title);

      // Add metadata
      this.addMetadata(doc, { filename, title });

      // Prepare headers and rows
      const headers = Object.values(columnMapping);
      const rows = data.map((item) =>
        Object.keys(columnMapping).map((key) => this.formatCellValue(item[key]))
      );

      // Add table
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 10, bottom: 10 },
      });

      // Save
      const finalFilename = this.generateFilename(filename, true);
      doc.save(finalFilename);
    } catch (error) {
      console.error("Error exporting PDF with mapping:", error);
      throw new Error(`Failed to export PDF: ${error}`);
    }
  }

  /**
   * Export with summary statistics
   * Adds a summary section before the data table
   */
  static exportWithSummary<T extends Record<string, any>>(
    data: T[],
    summary: Record<string, string | number>,
    title: string,
    filename: string,
    orientation: "portrait" | "landscape" = "landscape"
  ): void {
    try {
      const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4",
      });

      // Add title
      this.addTitle(doc, title);

      // Add metadata
      let yPosition = 20;
      this.addMetadata(doc, { filename, title });

      // Add summary section
      yPosition = 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Summary Statistics", 14, yPosition);

      yPosition += 7;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      Object.entries(summary).forEach(([key, value]) => {
        const label = this.formatHeaderName(key);
        doc.text(`${label}: ${value}`, 14, yPosition);
        yPosition += 5;
      });

      // Prepare table data
      const tableData = this.prepareTableData(data);

      // Add table
      autoTable(doc, {
        head: [tableData.headers],
        body: tableData.rows,
        startY: yPosition + 5,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 10, bottom: 10 },
      });

      // Save
      const finalFilename = this.generateFilename(filename, true);
      doc.save(finalFilename);
    } catch (error) {
      console.error("Error exporting PDF with summary:", error);
      throw new Error(`Failed to export PDF: ${error}`);
    }
  }

  /**
   * Quick export with sensible defaults
   */
  static quickExport<T extends Record<string, any>>(
    data: T[],
    title: string,
    filename: string
  ): void {
    this.export(data, {
      filename,
      title,
      orientation: "landscape",
      includeTimestamp: true,
    });
  }
}
