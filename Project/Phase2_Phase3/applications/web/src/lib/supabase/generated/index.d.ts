export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null;
          description: string | null;
          game_id: string;
          id: string;
          name: string;
          points: number | null;
          unlock_criteria: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          game_id: string;
          id?: string;
          name: string;
          points?: number | null;
          unlock_criteria?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          game_id?: string;
          id?: string;
          name?: string;
          points?: number | null;
          unlock_criteria?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          }
        ];
      };
      developers: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          logo_url: string | null;
          metadata: Json | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          metadata?: Json | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          metadata?: Json | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      games: {
        Row: {
          cover_image_url: string | null;
          created_at: string | null;
          developer_id: string | null;
          genre: Database["public"]["Enums"]["game_genres"] | null;
          id: string;
          metadata: Json | null;
          price: number | null;
          release_date: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string | null;
          developer_id?: string | null;
          genre?: Database["public"]["Enums"]["game_genres"] | null;
          id?: string;
          metadata?: Json | null;
          price?: number | null;
          release_date?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string | null;
          developer_id?: string | null;
          genre?: Database["public"]["Enums"]["game_genres"] | null;
          id?: string;
          metadata?: Json | null;
          price?: number | null;
          release_date?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "games_developer_id_fkey";
            columns: ["developer_id"];
            isOneToOne: false;
            referencedRelation: "developers";
            referencedColumns: ["id"];
          }
        ];
      };
      leaderboard_entities: {
        Row: {
          achieved_at: string | null;
          created_at: string | null;
          id: string;
          leaderboard_id: string;
          player_id: string;
          rank: number | null;
          score: number | null;
          updated_at: string | null;
        };
        Insert: {
          achieved_at?: string | null;
          created_at?: string | null;
          id?: string;
          leaderboard_id: string;
          player_id: string;
          rank?: number | null;
          score?: number | null;
          updated_at?: string | null;
        };
        Update: {
          achieved_at?: string | null;
          created_at?: string | null;
          id?: string;
          leaderboard_id?: string;
          player_id?: string;
          rank?: number | null;
          score?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leaderboard_entities_leaderboard_id_fkey";
            columns: ["leaderboard_id"];
            isOneToOne: false;
            referencedRelation: "leaderboards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leaderboard_entities_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      leaderboards: {
        Row: {
          created_at: string | null;
          game_id: string;
          id: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          game_id: string;
          id?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          game_id?: string;
          id?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leaderboards_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          }
        ];
      };
      player_achievements: {
        Row: {
          achievement_id: string;
          created_at: string | null;
          id: string;
          player_id: string;
          unlocked_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          achievement_id: string;
          created_at?: string | null;
          id?: string;
          player_id: string;
          unlocked_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          achievement_id?: string;
          created_at?: string | null;
          id?: string;
          player_id?: string;
          unlocked_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "player_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_achievements_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      player_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          id: string;
          player_id: string;
          settings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id?: string;
          player_id: string;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id?: string;
          player_id?: string;
          settings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "player_profiles_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: true;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      players: {
        Row: {
          country: Database["public"]["Enums"]["countries"] | null;
          created_at: string | null;
          email: string;
          id: string;
          level: number | null;
          total_score: number | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          country?: Database["public"]["Enums"]["countries"] | null;
          created_at?: string | null;
          email: string;
          id?: string;
          level?: number | null;
          total_score?: number | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          country?: Database["public"]["Enums"]["countries"] | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          level?: number | null;
          total_score?: number | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          amount: number | null;
          created_at: string | null;
          game_id: string;
          id: string;
          payment_method: Database["public"]["Enums"]["payment_methods"] | null;
          player_id: string;
          purchase_date: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          game_id: string;
          id?: string;
          payment_method?:
            | Database["public"]["Enums"]["payment_methods"]
            | null;
          player_id: string;
          purchase_date?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          game_id?: string;
          id?: string;
          payment_method?:
            | Database["public"]["Enums"]["payment_methods"]
            | null;
          player_id?: string;
          purchase_date?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "purchases_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchases_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
      sessions: {
        Row: {
          created_at: string | null;
          end_time: string | null;
          game_id: string;
          id: string;
          player_id: string;
          score: number | null;
          start_time: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_time?: string | null;
          game_id: string;
          id?: string;
          player_id: string;
          score?: number | null;
          start_time?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_time?: string | null;
          game_id?: string;
          id?: string;
          player_id?: string;
          score?: number | null;
          start_time?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sessions_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      clear_database: { Args: never; Returns: undefined };
      get_developer_success_report: {
        Args: {
          p_company_size?: string;
          p_date_from?: string;
          p_date_to?: string;
          p_limit?: number;
          p_min_founded_year?: number;
          p_min_revenue?: number;
          p_offset?: number;
          p_sort_by?: string;
          p_sort_direction?: string;
          p_specialty?: string;
        };
        Returns: {
          active_players_last_30_days: number;
          avg_game_rating: number;
          awards_count: number;
          company_size: string;
          developer_id: string;
          developer_name: string;
          earliest_release_date: string;
          email: string;
          founded_year: number;
          headquarters: string;
          latest_release_date: string;
          logo_url: string;
          revenue_per_game: number;
          specialties: string[];
          total_games: number;
          total_players: number;
          total_playtime_hours: number;
          total_revenue: number;
        }[];
      };
      get_game_performance_report: {
        Args: {
          p_date_from?: string;
          p_date_to?: string;
          p_developer_id?: string;
          p_genre?: Database["public"]["Enums"]["game_genres"];
          p_limit?: number;
          p_min_rating?: number;
          p_min_revenue?: number;
          p_offset?: number;
          p_sort_direction?: string;
          p_tags?: string[];
        };
        Returns: {
          average_rating: number;
          avg_session_duration: number;
          company_size: string;
          cover_image_url: string;
          developer_name: string;
          game_id: string;
          game_title: string;
          genre: string;
          logo_url: string;
          price: number;
          release_date: string;
          revenue_per_player: number;
          specialties: string[];
          tags: string[];
          total_playtime_hours: number;
          total_revenue: number;
          total_reviews: number;
          total_sessions: number;
          unique_players: number;
        }[];
      };
      get_player_engagement_report: {
        Args: {
          p_country?: Database["public"]["Enums"]["countries"];
          p_date_from?: string;
          p_date_to?: string;
          p_limit?: number;
          p_max_level?: number;
          p_min_achievements?: number;
          p_min_level?: number;
          p_offset?: number;
          p_privacy_setting?: string;
          p_sort_by?: string;
          p_sort_direction?: string;
          p_theme?: string;
        };
        Returns: {
          account_created: string;
          achievement_completion_rate: number;
          achievements_unlocked: number;
          avatar_url: string;
          avg_session_duration: number;
          country: string;
          days_since_last_session: number;
          email: string;
          level: number;
          notifications_enabled: boolean;
          player_id: string;
          privacy: string;
          retention_score: number;
          theme: string;
          total_playtime_hours: number;
          total_score: number;
          total_sessions: number;
          username: string;
        }[];
      };
      populate_achievements: { Args: never; Returns: undefined };
      populate_database: { Args: never; Returns: undefined };
      populate_developers: { Args: never; Returns: undefined };
      populate_games: { Args: never; Returns: undefined };
      populate_leaderboard_entities: { Args: never; Returns: undefined };
      populate_leaderboards: { Args: never; Returns: undefined };
      populate_player_achievements: { Args: never; Returns: undefined };
      populate_player_profiles: { Args: never; Returns: undefined };
      populate_players: { Args: never; Returns: undefined };
      populate_purchases: { Args: never; Returns: undefined };
      populate_sessions: { Args: never; Returns: undefined };
      restart_database: { Args: never; Returns: undefined };
    };
    Enums: {
      countries: "AU" | "US" | "UK" | "JP" | "VN";
      game_genres: "RPG" | "FPS" | "Strategy" | "Puzzle" | "Sports";
      payment_methods: "CreditCard" | "PayPal" | "Crypto" | "BankTransfer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      countries: ["AU", "US", "UK", "JP", "VN"],
      game_genres: ["RPG", "FPS", "Strategy", "Puzzle", "Sports"],
      payment_methods: ["CreditCard", "PayPal", "Crypto", "BankTransfer"],
    },
  },
} as const;
