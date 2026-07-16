export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string;
          admin_notes: string | null;
          business: string;
          contact: string;
          created_at: string;
          date: string;
          email: string;
          id: string;
          notes: string | null;
          phone: string;
          postcode: string;
          service: string;
          slot: string;
          status: Database["public"]["Enums"]["booking_status"];
          updated_at: string;
        };
        Insert: {
          address: string;
          admin_notes?: string | null;
          business: string;
          contact: string;
          created_at?: string;
          date: string;
          email: string;
          id?: string;
          notes?: string | null;
          phone: string;
          postcode: string;
          service: string;
          slot: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Update: {
          address?: string;
          admin_notes?: string | null;
          business?: string;
          contact?: string;
          created_at?: string;
          date?: string;
          email?: string;
          id?: string;
          notes?: string | null;
          phone?: string;
          postcode?: string;
          service?: string;
          slot?: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          status: Database["public"]["Enums"]["request_status"];
          subject: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          subject: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          subject?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          business: string;
          city: string;
          contact: string;
          created_at: string;
          details: string | null;
          email: string;
          frequency: string;
          id: string;
          industry: string;
          phone: string;
          role: string | null;
          rooms: string | null;
          status: Database["public"]["Enums"]["request_status"];
          updated_at: string;
          volume: string;
        };
        Insert: {
          business: string;
          city: string;
          contact: string;
          created_at?: string;
          details?: string | null;
          email: string;
          frequency: string;
          id?: string;
          industry: string;
          phone: string;
          role?: string | null;
          rooms?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
          volume: string;
        };
        Update: {
          business?: string;
          city?: string;
          contact?: string;
          created_at?: string;
          details?: string | null;
          email?: string;
          frequency?: string;
          id?: string;
          industry?: string;
          phone?: string;
          role?: string | null;
          rooms?: string | null;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
          volume?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      booking_status: "new" | "confirmed" | "completed" | "cancelled";
      request_status: "new" | "in_progress" | "resolved" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DatabaseWithoutInternals["public"]["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DatabaseWithoutInternals["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      booking_status: ["new", "confirmed", "completed", "cancelled"],
      request_status: ["new", "in_progress", "resolved", "archived"],
    },
  },
} as const;
