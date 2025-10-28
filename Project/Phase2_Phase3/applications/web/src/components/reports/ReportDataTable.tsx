/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiSearchLine,
} from "@remixicon/react";

export interface TableColumn {
  /** Column key (should match data object property) */
  key: string;
  /** Column header label */
  label: string;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: string;
  /** Cell alignment */
  align?: "left" | "center" | "right";
  /** Custom cell renderer */
  render?: (value: any, row: any, index: number) => React.ReactNode;
  /** Format function for cell value */
  format?: (value: any) => string;
  /** Whether to hide column on mobile */
  hideOnMobile?: boolean;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
}

export interface ReportDataTableProps<T = any> {
  /** Table data array */
  data: T[];
  /** Column definitions */
  columns: TableColumn[];
  /** Current sort configuration */
  sort?: SortConfig;
  /** Sort change handler */
  onSortChange?: (sort: SortConfig) => void;
  /** Current pagination configuration */
  pagination?: PaginationConfig;
  /** Pagination change handler */
  onPaginationChange?: (pagination: PaginationConfig) => void;
  /** Whether table is loading */
  isLoading?: boolean;
  /** Search term */
  search?: string;
  /** Search change handler */
  onSearchChange?: (search: string) => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Whether to show search input */
  showSearch?: boolean;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** CSS class name */
  className?: string;
  /** Max table height */
  maxHeight?: string;
}

/**
 * Advanced data table component with sorting, pagination, search,
 * and responsive design for reports.
 */
export function ReportDataTable<T = any>({
  data,
  columns,
  sort,
  onSortChange,
  pagination,
  onPaginationChange,
  isLoading = false,
  search = "",
  onSearchChange,
  emptyMessage = "No data available",
  showSearch = true,
  showPagination = true,
  className,
  maxHeight,
}: ReportDataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState(search);
  const [localSort, setLocalSort] = useState<SortConfig | undefined>(sort);

  // Handle column sort
  const handleSort = (field: string) => {
    if (!onSortChange) return;

    let newDirection: "asc" | "desc" = "asc";
    if (localSort?.field === field && localSort.direction === "asc") {
      newDirection = "desc";
    }

    const newSort = { field, direction: newDirection };
    setLocalSort(newSort);
    onSortChange(newSort);
  };

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setLocalSearch(value);
    if (onSearchChange) {
      // Debounce search
      const timer = setTimeout(() => {
        onSearchChange(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    if (!onPaginationChange || !pagination) return;
    onPaginationChange({ ...pagination, page });
  };

  const handleLimitChange = (limit: string) => {
    if (!onPaginationChange || !pagination) return;
    onPaginationChange({ ...pagination, limit: Number(limit), page: 1 });
  };

  // Sort data locally if needed
  const sortedData = useMemo(() => {
    if (!localSort?.field) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[localSort.field];
      const bValue = (b as any)[localSort.field];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return localSort.direction === "asc" ? comparison : -comparison;
    });
  }, [data, localSort]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // Render cell value
  const renderCellValue = (column: TableColumn, row: any, index: number) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, index);
    }

    if (column.format) {
      return column.format(value);
    }

    return value;
  };

  // Get cell alignment class
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          {showSearch && <Skeleton className="h-10 w-64" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header row */}
            <div className="flex gap-4 p-4 border-b">
              {columns.map((column) => (
                <Skeleton key={column.key} className="h-6 flex-1" />
              ))}
            </div>
            {/* Data rows */}
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4 p-4">
                {columns.map((column) => (
                  <Skeleton key={column.key} className="h-8 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg">Results</CardTitle>
          <div className="flex items-center gap-2">
            {showSearch && onSearchChange && (
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={localSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}
            {pagination && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paginatedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div
            className={`overflow-auto ${
              maxHeight ? `max-h-[${maxHeight}]` : ""
            }`}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`${getAlignClass(column.align)} ${
                        column.hideOnMobile ? "hidden md:table-cell" : ""
                      }`}
                      style={{ width: column.width }}
                    >
                      {column.sortable && onSortChange ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort(column.key)}
                        >
                          {column.label}
                          {localSort?.field === column.key && (
                            <Badge variant="secondary" className="ml-1">
                              {localSort.direction === "asc" ? "↑" : "↓"}
                            </Badge>
                          )}
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`${getAlignClass(column.align)} ${
                          column.hideOnMobile ? "hidden md:table-cell" : ""
                        }`}
                      >
                        {renderCellValue(column, row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {showPagination && pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
              >
                <RiArrowLeftLine className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <RiArrowLeftLine className="h-4 w-4" />
              </Button>
              <span className="text-sm px-3">
                Page {pagination.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
              >
                <RiArrowRightLine className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={pagination.page === totalPages}
              >
                <RiArrowRightLine className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
