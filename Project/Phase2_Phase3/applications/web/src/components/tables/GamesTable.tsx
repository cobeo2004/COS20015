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
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import type { Database } from "@/lib/supabase/generated";
import { format } from "date-fns";

interface GamesTableProps {
  games: Array<Database["public"]["Tables"]["games"]["Row"] & {
    developers?: Database["public"]["Tables"]["developers"]["Row"] | null;
  }>;
  onEdit: (game: Database["public"]["Tables"]["games"]["Row"]) => void;
  onDelete: (game: Database["public"]["Tables"]["games"]["Row"]) => void;
  onView?: (game: Database["public"]["Tables"]["games"]["Row"]) => void;
}

export function GamesTable({ games, onEdit, onDelete, onView }: GamesTableProps) {
  const formatPrice = (price: number | null) => {
    if (price === null) return "Free";
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  const getGenreColor = (genre: string | null) => {
    const colors: Record<string, string> = {
      RPG: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      FPS: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Strategy: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Puzzle: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Sports: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[genre || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Developer</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No games found
              </TableCell>
            </TableRow>
          ) : (
            games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {game.cover_image_url && (
                      <img
                        src={game.cover_image_url}
                        alt={game.title}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{game.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {game.genre && (
                    <Badge className={getGenreColor(game.genre)}>
                      {game.genre}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {game.developers ? game.developers.name : "No Developer"}
                </TableCell>
                <TableCell>{formatPrice(game.price)}</TableCell>
                <TableCell>{formatDate(game.release_date)}</TableCell>
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
                        <DropdownMenuItem onClick={() => onView(game)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(game)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(game)}
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