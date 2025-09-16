export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          position: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          title?: string
        }
        Relationships: []
      }
      applicants: {
        Row: {
          address: string
          created_at: string | null
          date_of_birth: string | null
          education_level: string | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string
          profile_image_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email: string
          experience_years?: number | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          phone: string
          profile_image_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string
          profile_image_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          created_at: string
          description: string
          email: string
          id: string
          is_approved: boolean
          logo: string | null
          name: string
          owner_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          email: string
          id?: string
          is_approved?: boolean
          logo?: string | null
          name: string
          owner_id: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          email?: string
          id?: string
          is_approved?: boolean
          logo?: string | null
          name?: string
          owner_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      employers: {
        Row: {
          address: string
          business_name: string
          business_type: string | null
          contact_person: string
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_verified: boolean | null
          logo_url: string | null
          phone: string
          tax_id: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address: string
          business_name: string
          business_type?: string | null
          contact_person: string
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          phone: string
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string
          business_name?: string
          business_type?: string | null
          contact_person?: string
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          phone?: string
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          address: string | null
          applicant_email: string
          applicant_id: string
          applicant_name: string
          company_name: string
          cover_letter: string
          created_at: string
          education_level: string | null
          experience_years: number | null
          id: string
          job_id: string
          job_title: string
          phone: string | null
          resume: string | null
          skills: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          applicant_email: string
          applicant_id: string
          applicant_name: string
          company_name: string
          cover_letter: string
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          id?: string
          job_id: string
          job_title: string
          phone?: string | null
          resume?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          applicant_email?: string
          applicant_id?: string
          applicant_name?: string
          company_name?: string
          cover_letter?: string
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          id?: string
          job_id?: string
          job_title?: string
          phone?: string | null
          resume?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          company_id: string
          company_name: string
          contact_person: string | null
          created_at: string
          current_applicants: number | null
          description: string
          district: string | null
          id: string
          image: string | null
          is_active: boolean
          is_approved: boolean
          location: string
          max_applicants: number | null
          organization_name: string | null
          project_details: string | null
          requirements: string
          salary: string
          salary_per_hour: number | null
          title: string
          updated_at: string
          work_duration: string | null
          working_hours: string
        }
        Insert: {
          application_deadline?: string | null
          company_id: string
          company_name: string
          contact_person?: string | null
          created_at?: string
          current_applicants?: number | null
          description: string
          district?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          is_approved?: boolean
          location: string
          max_applicants?: number | null
          organization_name?: string | null
          project_details?: string | null
          requirements: string
          salary: string
          salary_per_hour?: number | null
          title: string
          updated_at?: string
          work_duration?: string | null
          working_hours: string
        }
        Update: {
          application_deadline?: string | null
          company_id?: string
          company_name?: string
          contact_person?: string | null
          created_at?: string
          current_applicants?: number | null
          description?: string
          district?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          is_approved?: boolean
          location?: string
          max_applicants?: number | null
          organization_name?: string | null
          project_details?: string | null
          requirements?: string
          salary?: string
          salary_per_hour?: number | null
          title?: string
          updated_at?: string
          work_duration?: string | null
          working_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          profile_image: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          profile_image?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profile_image?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
