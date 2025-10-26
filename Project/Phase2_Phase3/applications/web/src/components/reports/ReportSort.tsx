import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiSortDesc, RiSortAsc, RiArrowUpDownLine } from "@remixicon/react";

export interface SortOption {
  /** Sort field identifier */
  field: string;
  /** Display label for the sort option */
  label: string;
  /** Whether this field supports numeric sorting */
  numeric?: boolean;
}

export interface SortConfig {
  /** Current sort field */
  field: string;
  /** Sort direction: 'asc' for ascending, 'desc' for descending */
  direction: 'asc' | 'desc';
}

export interface ReportSortProps {
  /** Available sort options */
  sortOptions: SortOption[];
  /** Current sort configuration */
  currentSort?: SortConfig;
  /** Callback when sort changes */
  onSortChange: (sort: SortConfig) => void;
  /** Whether to show the sort as a dropdown (default: true) */
  asDropdown?: boolean;
  /** CSS class name */
  className?: string;
  /** Size variant: 'sm', 'default', 'lg' */
  size?: 'sm' | 'default' | 'lg';
  /** Variant: 'default', 'outline', 'ghost' */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Sorting controls component for reports.
 * Provides dropdown selection for sort field and toggle for direction.
 * Shows current sort state with visual indicators and allows quick sort changes.
 */
export function ReportSort({
  sortOptions,
  currentSort,
  onSortChange,
  asDropdown = true,
  className,
  size = 'sm' as const,
  variant = 'outline',
}: ReportSortProps) {
  // Handle sort field change
  const handleFieldChange = (field: string) => {
    const direction = field === currentSort?.field
      ? currentSort.direction === 'asc' ? 'desc' : 'asc'
      : 'asc';

    onSortChange({ field, direction });
  };

  // Handle direction toggle
  const handleDirectionToggle = () => {
    if (!currentSort?.field) return;

    onSortChange({
      ...currentSort,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  
  // Get sort icon
  const getSortIcon = (field?: string, direction?: 'asc' | 'desc') => {
    if (!field || !direction) {
      return <RiArrowUpDownLine className="h-4 w-4" />;
    }
    return direction === 'asc'
      ? <RiSortAsc className="h-4 w-4" />
      : <RiSortDesc className="h-4 w-4" />;
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  // If dropdown mode
  if (asDropdown) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <select
          value={currentSort?.field || ''}
          onChange={(e) => handleFieldChange(e.target.value)}
          className={`${sizeClasses[size]} border border-input bg-background rounded-md ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
        >
          <option value="">Sort by</option>
          {sortOptions.map((option) => (
            <option key={option.field} value={option.field}>
              {option.label}
            </option>
          ))}
        </select>

        {currentSort?.field && (
          <Button
            variant={variant}
            size={size}
            onClick={handleDirectionToggle}
            className="flex items-center gap-2"
          >
            {getSortIcon(currentSort.field, currentSort.direction)}
            <span className="sr-only">
              {currentSort.direction === 'asc' ? 'Ascending' : 'Descending'}
            </span>
          </Button>
        )}
      </div>
    );
  }

  // Button mode - render quick sort buttons
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">Sort:</span>
      {sortOptions.map((option) => {
        const isActive = currentSort?.field === option.field;
        const showDirection = isActive;

        return (
          <Button
            key={option.field}
            variant={isActive ? 'default' : variant}
            size={size}
            onClick={() => handleFieldChange(option.field)}
            className="flex items-center gap-2"
          >
            {showDirection && getSortIcon(option.field, currentSort?.direction)}
            {option.label}
            {isActive && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {currentSort?.direction === 'asc' ? 'A-Z' : 'Z-A'}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Quick sort component that renders just the current sort status
 * and allows toggling direction. Useful for compact display.
 */
export function QuickSort({
  currentSort,
  sortOptions,
  onSortChange,
  className
}: {
  currentSort?: SortConfig;
  sortOptions: SortOption[];
  onSortChange: (sort: SortConfig) => void;
  className?: string;
}) {
  if (!currentSort?.field) return null;

  const currentOption = sortOptions.find(opt => opt.field === currentSort.field);
  const handleDirectionToggle = () => {
    onSortChange({
      ...currentSort,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Sorted by:</span>
      <Badge variant="outline" className="flex items-center gap-1">
        {currentSort.direction === 'asc'
          ? <RiSortAsc className="h-3 w-3" />
          : <RiSortDesc className="h-3 w-3" />
        }
        {currentOption?.label || currentSort.field}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDirectionToggle}
        className="h-6 px-2 text-xs"
      >
        {currentSort.direction === 'asc' ? 'Desc' : 'Asc'}
      </Button>
    </div>
  );
}