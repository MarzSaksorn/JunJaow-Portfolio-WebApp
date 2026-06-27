export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accommodation_applications: {
        Row: {
          address: string | null
          admin_note: string | null
          amenities: string[] | null
          application_status: string | null
          booking_agoda_url: string | null
          booking_booking_url: string | null
          booking_direct_url: string | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          description: string | null
          id: string
          image_url: string | null
          latitude: number
          line_id: string | null
          longitude: number
          owner_name: string
          phone: string
          price_range: string | null
          property_name: string
          property_type: string
          room_summary: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          amenities?: string[] | null
          application_status?: string | null
          booking_agoda_url?: string | null
          booking_booking_url?: string | null
          booking_direct_url?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          line_id?: string | null
          longitude: number
          owner_name: string
          phone: string
          price_range?: string | null
          property_name: string
          property_type?: string
          room_summary?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          amenities?: string[] | null
          application_status?: string | null
          booking_agoda_url?: string | null
          booking_booking_url?: string | null
          booking_direct_url?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          line_id?: string | null
          longitude?: number
          owner_name?: string
          phone?: string
          price_range?: string | null
          property_name?: string
          property_type?: string
          room_summary?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      accommodations: {
        Row: {
          address: string | null
          amenities: string[] | null
          application_id: string | null
          booking_links: Json | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number
          line_id: string | null
          longitude: number
          marker_color: string | null
          marker_icon: string | null
          name: string
          owner_user_id: string | null
          phone: string | null
          price_range: string | null
          property_type: string
          rating: number | null
          room_types: Json | null
          sort_order: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          application_id?: string | null
          booking_links?: Json | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude: number
          line_id?: string | null
          longitude: number
          marker_color?: string | null
          marker_icon?: string | null
          name: string
          owner_user_id?: string | null
          phone?: string | null
          price_range?: string | null
          property_type?: string
          rating?: number | null
          room_types?: Json | null
          sort_order?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          application_id?: string | null
          booking_links?: Json | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number
          line_id?: string | null
          longitude?: number
          marker_color?: string | null
          marker_icon?: string | null
          name?: string
          owner_user_id?: string | null
          phone?: string | null
          price_range?: string | null
          property_type?: string
          rating?: number | null
          room_types?: Json | null
          sort_order?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "accommodation_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          academic_year: string | null
          category: string | null
          created_at: string | null
          description: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          issued_at: string | null
          issuer: string | null
          owner_id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          owner_id: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string | null
          owner_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      checkins: {
        Row: {
          checked_in_at: string | null
          checkin_method: string | null
          id: string
          latitude: number | null
          longitude: number | null
          place_id: string
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checkin_method?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id: string
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checkin_method?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      digital_passport_stamps: {
        Row: {
          collected_at: string | null
          id: string
          place_id: string
          stamp_code: string
          user_id: string | null
        }
        Insert: {
          collected_at?: string | null
          id?: string
          place_id: string
          stamp_code: string
          user_id?: string | null
        }
        Update: {
          collected_at?: string | null
          id?: string
          place_id?: string
          stamp_code?: string
          user_id?: string | null
        }
        Relationships: []
      }
      local_taxi_applications: {
        Row: {
          admin_note: string | null
          age: number | null
          application_status: string | null
          capacity: number | null
          first_name: string
          id: string
          last_name: string
          luggage_note: string | null
          nickname: string | null
          phone: string
          public_contact_address: string | null
          service_area: string | null
          stand_location: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          vehicle_color: string | null
          vehicle_description: string | null
          vehicle_plate: string
          vehicle_type: string
        }
        Insert: {
          admin_note?: string | null
          age?: number | null
          application_status?: string | null
          capacity?: number | null
          first_name: string
          id?: string
          last_name: string
          luggage_note?: string | null
          nickname?: string | null
          phone: string
          public_contact_address?: string | null
          service_area?: string | null
          stand_location?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_color?: string | null
          vehicle_description?: string | null
          vehicle_plate: string
          vehicle_type: string
        }
        Update: {
          admin_note?: string | null
          age?: number | null
          application_status?: string | null
          capacity?: number | null
          first_name?: string
          id?: string
          last_name?: string
          luggage_note?: string | null
          nickname?: string | null
          phone?: string
          public_contact_address?: string | null
          service_area?: string | null
          stand_location?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_color?: string | null
          vehicle_description?: string | null
          vehicle_plate?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      local_taxi_drivers: {
        Row: {
          age: number | null
          application_id: string | null
          available_now: boolean | null
          created_at: string | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          nickname: string | null
          phone: string
          profile_image: string | null
          public_contact_address: string | null
          rating: number | null
          service_area: string | null
          stand_location: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          application_id?: string | null
          available_now?: boolean | null
          created_at?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          nickname?: string | null
          phone: string
          profile_image?: string | null
          public_contact_address?: string | null
          rating?: number | null
          service_area?: string | null
          stand_location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          application_id?: string | null
          available_now?: boolean | null
          created_at?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          nickname?: string | null
          phone?: string
          profile_image?: string | null
          public_contact_address?: string | null
          rating?: number | null
          service_area?: string | null
          stand_location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_taxi_drivers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "local_taxi_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      local_taxi_vehicles: {
        Row: {
          capacity: number | null
          driver_id: string | null
          id: string
          luggage_note: string | null
          vehicle_color: string | null
          vehicle_description: string | null
          vehicle_plate: string
          vehicle_type: string
        }
        Insert: {
          capacity?: number | null
          driver_id?: string | null
          id?: string
          luggage_note?: string | null
          vehicle_color?: string | null
          vehicle_description?: string | null
          vehicle_plate: string
          vehicle_type: string
        }
        Update: {
          capacity?: number | null
          driver_id?: string | null
          id?: string
          luggage_note?: string | null
          vehicle_color?: string | null
          vehicle_description?: string | null
          vehicle_plate?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_taxi_vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "local_taxi_drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      local_taxi_verifications: {
        Row: {
          created_at: string | null
          driver_id: string | null
          expires_at: string | null
          government_record_checked: boolean | null
          id: string
          identity_checked: boolean | null
          phone_checked: boolean | null
          tourism_training_checked: boolean | null
          vehicle_plate_checked: boolean | null
          vehicle_type_checked: boolean | null
          verification_ref: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by_agency: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          expires_at?: string | null
          government_record_checked?: boolean | null
          id?: string
          identity_checked?: boolean | null
          phone_checked?: boolean | null
          tourism_training_checked?: boolean | null
          vehicle_plate_checked?: boolean | null
          vehicle_type_checked?: boolean | null
          verification_ref?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by_agency?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          expires_at?: string | null
          government_record_checked?: boolean | null
          id?: string
          identity_checked?: boolean | null
          phone_checked?: boolean | null
          tourism_training_checked?: boolean | null
          vehicle_plate_checked?: boolean | null
          vehicle_type_checked?: boolean | null
          verification_ref?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by_agency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_taxi_verifications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "local_taxi_drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          approval_status: string | null
          category: string | null
          created_at: string | null
          description: string | null
          gi_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_gi: boolean | null
          is_otop: boolean | null
          is_sme: boolean | null
          name: string
          price: number | null
          product_type: string | null
          seller_id: string | null
          stock_status: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          approval_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          gi_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_gi?: boolean | null
          is_otop?: boolean | null
          is_sme?: boolean | null
          name: string
          price?: number | null
          product_type?: string | null
          seller_id?: string | null
          stock_status?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          gi_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_gi?: boolean | null
          is_otop?: boolean | null
          is_sme?: boolean | null
          name?: string
          price?: number | null
          product_type?: string | null
          seller_id?: string | null
          stock_status?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_seller_applications: {
        Row: {
          admin_note: string | null
          application_status: string | null
          description: string | null
          id: string
          line_id: string | null
          owner_name: string
          phone: string
          public_contact_address: string | null
          seller_type: string | null
          service_area: string | null
          shop_location: string | null
          shop_name: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          application_status?: string | null
          description?: string | null
          id?: string
          line_id?: string | null
          owner_name: string
          phone: string
          public_contact_address?: string | null
          seller_type?: string | null
          service_area?: string | null
          shop_location?: string | null
          shop_name: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          application_status?: string | null
          description?: string | null
          id?: string
          line_id?: string | null
          owner_name?: string
          phone?: string
          public_contact_address?: string | null
          seller_type?: string | null
          service_area?: string | null
          shop_location?: string | null
          shop_name?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marketplace_sellers: {
        Row: {
          application_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          line_id: string | null
          owner_name: string | null
          phone: string | null
          public_contact_address: string | null
          seller_type: string | null
          service_area: string | null
          shop_location: string | null
          shop_name: string
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          line_id?: string | null
          owner_name?: string | null
          phone?: string | null
          public_contact_address?: string | null
          seller_type?: string | null
          service_area?: string | null
          shop_location?: string | null
          shop_name: string
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          line_id?: string | null
          owner_name?: string | null
          phone?: string | null
          public_contact_address?: string | null
          seller_type?: string | null
          service_area?: string | null
          shop_location?: string | null
          shop_name?: string
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_sellers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "marketplace_seller_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_pages: {
        Row: {
          content_snapshot: Json | null
          created_at: string | null
          id: string
          owner_id: string
          selected_certificate_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_snapshot?: Json | null
          created_at?: string | null
          id?: string
          owner_id: string
          selected_certificate_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_snapshot?: Json | null
          created_at?: string | null
          id?: string
          owner_id?: string
          selected_certificate_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activities: string[] | null
          bio: string | null
          contact: Json | null
          created_at: string | null
          full_name: string | null
          id: string
          nickname: string | null
          owner_id: string
          profile_image_path: string | null
          profile_image_url: string | null
          program: string | null
          school: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          activities?: string[] | null
          bio?: string | null
          contact?: Json | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          nickname?: string | null
          owner_id: string
          profile_image_path?: string | null
          profile_image_url?: string | null
          program?: string | null
          school?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          activities?: string[] | null
          bio?: string | null
          contact?: Json | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          nickname?: string | null
          owner_id?: string
          profile_image_path?: string | null
          profile_image_url?: string | null
          program?: string | null
          school?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_places: {
        Row: {
          id: string
          place_id: string
          saved_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          place_id: string
          saved_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          place_id?: string
          saved_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tourism_locations: {
        Row: {
          audio_story: string | null
          best_time: string | null
          created_at: string | null
          cultural_highlights: string | null
          description: string | null
          distance_label: string | null
          history_summary: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number
          location_category: string
          longitude: number
          marker_color: string | null
          marker_icon: string | null
          name: string
          need_to_know: string | null
          rating: number | null
          sort_order: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          audio_story?: string | null
          best_time?: string | null
          created_at?: string | null
          cultural_highlights?: string | null
          description?: string | null
          distance_label?: string | null
          history_summary?: string | null
          id: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude: number
          location_category?: string
          longitude: number
          marker_color?: string | null
          marker_icon?: string | null
          name: string
          need_to_know?: string | null
          rating?: number | null
          sort_order?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          audio_story?: string | null
          best_time?: string | null
          created_at?: string | null
          cultural_highlights?: string | null
          description?: string | null
          distance_label?: string | null
          history_summary?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number
          location_category?: string
          longitude?: number
          marker_color?: string | null
          marker_icon?: string | null
          name?: string
          need_to_know?: string | null
          rating?: number | null
          sort_order?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      trip_plan_items: {
        Row: {
          id: string
          note: string | null
          order_index: number
          place_id: string
          trip_plan_id: string | null
        }
        Insert: {
          id?: string
          note?: string | null
          order_index: number
          place_id: string
          trip_plan_id?: string | null
        }
        Update: {
          id?: string
          note?: string | null
          order_index?: number
          place_id?: string
          trip_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_plan_items_trip_plan_id_fkey"
            columns: ["trip_plan_id"]
            isOneToOne: false
            referencedRelation: "trip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_plans: {
        Row: {
          created_at: string | null
          id: string
          title: string
          trip_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          trip_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          trip_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_code: string
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_code: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_code?: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          compact_mode: boolean | null
          custom_primary_color: string | null
          language: string | null
          notification_enabled: boolean | null
          primary_accent: string
          safety_mode: boolean | null
          ui_scale: string
          updated_at: string | null
          use_custom_primary_color: boolean
          user_id: string
        }
        Insert: {
          compact_mode?: boolean | null
          custom_primary_color?: string | null
          language?: string | null
          notification_enabled?: boolean | null
          primary_accent?: string
          safety_mode?: boolean | null
          ui_scale?: string
          updated_at?: string | null
          use_custom_primary_color?: boolean
          user_id: string
        }
        Update: {
          compact_mode?: boolean | null
          custom_primary_color?: string | null
          language?: string | null
          notification_enabled?: boolean | null
          primary_accent?: string
          safety_mode?: boolean | null
          ui_scale?: string
          updated_at?: string | null
          use_custom_primary_color?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_accommodation_application: {
        Args: { p_application_id: string }
        Returns: string
      }
      approve_marketplace_product: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      approve_seller_application: {
        Args: { p_application_id: string }
        Returns: undefined
      }
      approve_taxi_application: {
        Args: { p_application_id: string; p_verified_by_agency?: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      reject_marketplace_product: {
        Args: { p_product_id: string }
        Returns: undefined
      }
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
