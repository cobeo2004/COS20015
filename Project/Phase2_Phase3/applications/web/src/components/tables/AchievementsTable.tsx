import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Award, Star } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";
import { format } from "date-fns";

interface AchievementsTableProps {
  achievements: Array<
    Database["public"]["Tables"]["achievements"]["Row"] & {
      games?:
        | (Database["public"]["Tables"]["games"]["Row"] & {
            developers?:
              | Database["public"]["Tables"]["developers"]["Row"]
              | null;
          })
        | null;
    }
  >;
  onEdit: (
    achievement: Database["public"]["Tables"]["achievements"]["Row"]
  ) => void;
  onDelete: (
    achievement: Database["public"]["Tables"]["achievements"]["Row"]
  ) => void;
  onView?: (
    achievement: Database["public"]["Tables"]["achievements"]["Row"]
  ) => void;
}

export function AchievementsTable({
  achievements,
  onEdit,
  onDelete,
  onView,
}: AchievementsTableProps) {
  const getPointsColor = (points: number | null) => {
    if (!points)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    if (points >= 100)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (points >= 50)
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (points >= 25)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  };

  const getGameGenreColor = (genre: string | null) => {
    const colors: Record<string, string> = {
      RPG: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      FPS: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Strategy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Puzzle:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Sports:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return (
      colors[genre || ""] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  const getUnlockCriteriaSummary = (criteria: {
    type: string;
    target: string;
    difficulty: string;
  }) => {
    if (!criteria || typeof criteria !== "object") return "N/A";

    if (criteria.type === "score") {
      return `Score: ${criteria.target}`;
    }
    if (criteria.type === "level") {
      return `Level: ${criteria.target}`;
    }
    if (criteria.type === "time") {
      return `Time: ${criteria.target}`;
    }
    if (criteria.type === "completion") {
      return `Completion: ${criteria.target}%`;
    }

    return JSON.stringify(criteria).substring(0, 30) + "...";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Achievement</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Unlock Criteria</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No achievements found
              </TableCell>
            </TableRow>
          ) : (
            achievements.map((achievement) => (
              <TableRow key={achievement.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="max-w-[200px]">
                      <div className="font-medium">{achievement.name}</div>
                      {achievement.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {achievement.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {achievement.games && (
                    <div>
                      <div className="font-medium">
                        {achievement.games.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {achievement.games.genre && (
                          <Badge
                            variant="outline"
                            className={getGameGenreColor(
                              achievement.games.genre
                            )}
                          >
                            {achievement.games.genre}
                          </Badge>
                        )}
                        {achievement.games.developers && (
                          <span className="text-xs text-muted-foreground">
                            {achievement.games.developers.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getPointsColor(achievement.points)}>
                      {achievement.points || 0} pts
                    </Badge>
                    {achievement.points && achievement.points >= 50 && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {getUnlockCriteriaSummary(
                      achievement.unlock_criteria as {
                        type: string;
                        target: string;
                        difficulty: string;
                      }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(achievement.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(achievement)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(achievement)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(achievement)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
