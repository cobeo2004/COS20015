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
import { MoreHorizontal, Edit, Trash2, Eye, Trophy } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

interface PlayersTableProps {
  players: Array<
    Database["public"]["Tables"]["players"]["Row"] & {
      player_profiles?:
        | Database["public"]["Tables"]["player_profiles"]["Row"]
        | null;
    }
  >;
  onEdit: (player: Database["public"]["Tables"]["players"]["Row"]) => void;
  onDelete: (player: Database["public"]["Tables"]["players"]["Row"]) => void;
  onView?: (player: Database["public"]["Tables"]["players"]["Row"]) => void;
}

export function PlayersTable({
  players,
  onEdit,
  onDelete,
  onView,
}: PlayersTableProps) {
  const getCountryColor = (country: string | null) => {
    const colors: Record<string, string> = {
      AU: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      US: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      UK: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      JP: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      VN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return (
      colors[country || ""] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const getCountryName = (country: string | null) => {
    const names: Record<string, string> = {
      AU: "Australia",
      US: "United States",
      UK: "United Kingdom",
      JP: "Japan",
      VN: "Vietnam",
    };
    return names[country || ""] || "Unknown";
  };

  const getLevelColor = (level: number | null) => {
    if (!level)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    if (level >= 80)
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (level >= 60)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (level >= 40)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (level >= 20)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Total Score</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No players found
              </TableCell>
            </TableRow>
          ) : (
            players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-medium">
                        {/* {player.username.charAt(0).toUpperCase()} */}
                        <Avatar>
                          <AvatarImage
                            src={
                              player.player_profiles?.avatar_url || undefined
                            }
                            alt={player.username}
                          />
                          <AvatarFallback>
                            {player.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{player.username}</div>
                      {player.player_profiles?.bio && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {player.player_profiles.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{player.email}</div>
                </TableCell>
                <TableCell>
                  {player.country && (
                    <Badge className={getCountryColor(player.country)}>
                      {getCountryName(player.country)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor(player.level)}>
                      Lv. {player.level || 1}
                    </Badge>
                    {player.level && player.level >= 50 && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {player.total_score?.toLocaleString() || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(player.created_at)}
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
                        <DropdownMenuItem onClick={() => onView(player)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(player)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(player)}
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
