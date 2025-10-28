/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  RiFilter3Line,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "@remixicon/react";

// Filter types
export interface DateRangeFilter {
  from: string;
  to: string;
}

export interface SelectFilter {
  value: string;
  label: string;
}

export interface MultiSelectFilter {
  values: string[];
  options: SelectFilter[];
}

export interface NumberRangeFilter {
  min: number;
  max: number;
}

export interface TextFilter {
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type:
    | "dateRange"
    | "select"
    | "multiSelect"
    | "numberRange"
    | "text"
    | "search";
  options?: SelectFilter[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface ReportFiltersProps {
  /** Configuration for available filters */
  filterConfigs: FilterConfig[];
  /** Current filter values */
  filters: Record<string, any>;
  /** Callback when filters change */
  onFiltersChange: (filters: Record<string, any>) => void;
  /** Whether to show the filters panel (default: true) */
  visible?: boolean;
  /** Callback to toggle visibility */
  onToggleVisibility?: () => void;
  /** CSS class name */
  className?: string;
}

/**
 * Dynamic filtering component that supports multiple filter types.
 * Provides date ranges, dropdowns, multi-select, number ranges, and text search.
 * Automatically debounces input changes and provides clear/reset functionality.
 */
export function ReportFilters({
  filterConfigs,
  filters,
  onFiltersChange,
  visible = true,
  onToggleVisibility,
  className,
}: ReportFiltersProps) {
  const [debounceTimers, setDebounceTimers] = useState<
    Record<string, NodeJS.Timeout>
  >({});

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    (key: string, value: any, debounceMs: number = 300) => {
      // Clear existing timer for this key
      if (debounceTimers[key]) {
        clearTimeout(debounceTimers[key]);
      }

      // Set new timer
      const timer = setTimeout(() => {
        onFiltersChange({
          ...filters,
          [key]: value,
        });
      }, debounceMs);

      setDebounceTimers((prev) => ({
        ...prev,
        [key]: timer,
      }));
    },
    [filters, onFiltersChange, debounceTimers]
  );

  // Immediate filter change (for non-text inputs)
  const immediateFilterChange = useCallback(
    (key: string, value: any) => {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    },
    [filters, onFiltersChange]
  );

  // Clear specific filter
  const clearFilter = useCallback(
    (key: string) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  // Get active filters count
  const activeFiltersCount = Object.keys(filters).length;

  // Render filter input based on type
  const renderFilterInput = (config: FilterConfig) => {
    const value = filters[config.key];

    switch (config.type) {
      case "dateRange": {
        const dateRange = (value as DateRangeFilter) || { from: "", to: "" };
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor={`${config.key}-from`}
                className="text-xs text-muted-foreground"
              >
                From
              </Label>
              <Input
                id={`${config.key}-from`}
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  immediateFilterChange(config.key, {
                    ...dateRange,
                    from: e.target.value,
                  })
                }
                className="h-8"
              />
            </div>
            <div>
              <Label
                htmlFor={`${config.key}-to`}
                className="text-xs text-muted-foreground"
              >
                To
              </Label>
              <Input
                id={`${config.key}-to`}
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  immediateFilterChange(config.key, {
                    ...dateRange,
                    to: e.target.value,
                  })
                }
                className="h-8"
              />
            </div>
          </div>
        );
      }

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              immediateFilterChange(config.key, e.target.value || undefined)
            }
            className="w-full h-8 px-3 py-1 text-sm border border-input bg-background rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All {config.label}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiSelect": {
        const multiSelect = (value as MultiSelectFilter) || {
          values: [],
          options: config.options || [],
        };
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 min-h-6">
              {multiSelect.values.map((selectedValue) => {
                const option = config.options?.find(
                  (opt) => opt.value === selectedValue
                );
                return (
                  <Badge
                    key={selectedValue}
                    variant="secondary"
                    className="text-xs pr-1"
                  >
                    {option?.label || selectedValue}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const newValues = multiSelect.values.filter(
                          (v) => v !== selectedValue
                        );
                        immediateFilterChange(config.key, {
                          ...multiSelect,
                          values: newValues,
                        });
                      }}
                    >
                      <RiCloseLine className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            <select
              onChange={(e) => {
                if (
                  e.target.value &&
                  !multiSelect.values.includes(e.target.value)
                ) {
                  immediateFilterChange(config.key, {
                    ...multiSelect,
                    values: [...multiSelect.values, e.target.value],
                  });
                }
              }}
              value=""
              className="w-full h-8 px-3 py-1 text-sm border border-input bg-background rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Add {config.label}...</option>
              {config.options
                ?.filter((option) => !multiSelect.values.includes(option.value))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        );
      }

      case "numberRange": {
        const numberRange = (value as NumberRangeFilter) || {
          min: config.min || 0,
          max: config.max || 100,
        };
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor={`${config.key}-min`}
                className="text-xs text-muted-foreground"
              >
                Min
              </Label>
              <Input
                id={`${config.key}-min`}
                type="number"
                min={config.min}
                max={config.max}
                value={numberRange.min}
                onChange={(e) =>
                  immediateFilterChange(config.key, {
                    ...numberRange,
                    min: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
            <div>
              <Label
                htmlFor={`${config.key}-max`}
                className="text-xs text-muted-foreground"
              >
                Max
              </Label>
              <Input
                id={`${config.key}-max`}
                type="number"
                min={config.min}
                max={config.max}
                value={numberRange.max}
                onChange={(e) =>
                  immediateFilterChange(config.key, {
                    ...numberRange,
                    max: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
          </div>
        );
      }

      case "text":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) =>
              debouncedFilterChange(config.key, e.target.value || undefined)
            }
            placeholder={
              config.placeholder || `Search ${config.label.toLowerCase()}...`
            }
            className="h-8"
          />
        );

      case "search":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) =>
              debouncedFilterChange(config.key, e.target.value || undefined)
            }
            placeholder={
              config.placeholder || `Search ${config.label.toLowerCase()}...`
            }
            className="h-8"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <Collapsible open={visible} onOpenChange={onToggleVisibility}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-4 flex items-center gap-2"
          >
            <RiFilter3Line className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
            {visible ? (
              <RiArrowUpSLine className="h-4 w-4" />
            ) : (
              <RiArrowDownSLine className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Report Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterConfigs.map((config) => (
                  <div key={config.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {config.label}
                      </Label>
                      {filters[config.key] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearFilter(config.key)}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        >
                          <RiCloseLine className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {renderFilterInput(config)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
