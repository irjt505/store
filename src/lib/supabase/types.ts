export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "owner" | "admin" | "staff" | "manager";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "staff" | "manager";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "owner" | "admin" | "staff" | "manager";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          key: string;
          value: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: "physical" | "digital" | "service" | "subscription" | "bundle" | "codes" | "food" | "booking";
          description: string | null;
          short_description: string | null;
          price: number;
          sale_price: number | null;
          cost_price: number | null;
          currency: string;
          sku: string | null;
          mpn: string | null;
          gtin: string | null;
          stock: number;
          low_stock_threshold: number;
          track_stock: boolean;
          weight: number | null;
          length: number | null;
          width: number | null;
          height: number | null;
          requires_shipping: boolean;
          is_digital: boolean;
          digital_files: Json;
          download_limit: number | null;
          download_expiry: string | null;
          subscription_period: string | null;
          auto_renew: boolean;
          booking_duration: number | null;
          status: "published" | "draft" | "archived";
          category_id: string | null;
          brand_id: string | null;
          featured_image: string | null;
          images: Json;
          sales_count: number;
          rating: number;
          review_count: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type: "physical" | "digital" | "service" | "subscription" | "bundle" | "codes" | "food" | "booking";
          description?: string | null;
          short_description?: string | null;
          price?: number;
          sale_price?: number | null;
          cost_price?: number | null;
          currency?: string;
          sku?: string | null;
          mpn?: string | null;
          gtin?: string | null;
          stock?: number;
          low_stock_threshold?: number;
          track_stock?: boolean;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          requires_shipping?: boolean;
          is_digital?: boolean;
          digital_files?: Json;
          download_limit?: number | null;
          download_expiry?: string | null;
          subscription_period?: string | null;
          auto_renew?: boolean;
          booking_duration?: number | null;
          status?: "published" | "draft" | "archived";
          category_id?: string | null;
          brand_id?: string | null;
          featured_image?: string | null;
          images?: Json;
          sales_count?: number;
          rating?: number;
          review_count?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          type?: "physical" | "digital" | "service" | "subscription" | "bundle" | "codes" | "food" | "booking";
          description?: string | null;
          short_description?: string | null;
          price?: number;
          sale_price?: number | null;
          cost_price?: number | null;
          currency?: string;
          sku?: string | null;
          mpn?: string | null;
          gtin?: string | null;
          stock?: number;
          low_stock_threshold?: number;
          track_stock?: boolean;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          requires_shipping?: boolean;
          is_digital?: boolean;
          digital_files?: Json;
          download_limit?: number | null;
          download_expiry?: string | null;
          subscription_period?: string | null;
          auto_renew?: boolean;
          booking_duration?: number | null;
          status?: "published" | "draft" | "archived";
          category_id?: string | null;
          brand_id?: string | null;
          featured_image?: string | null;
          images?: Json;
          sales_count?: number;
          rating?: number;
          review_count?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          options: Json;
          sku: string | null;
          price: number | null;
          stock: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          options?: Json;
          sku?: string | null;
          price?: number | null;
          stock?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          options?: Json;
          sku?: string | null;
          price?: number | null;
          stock?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      product_tags: {
        Row: {
          product_id: string;
          tag_id: string;
        };
        Insert: {
          product_id: string;
          tag_id: string;
        };
        Update: {
          product_id?: string;
          tag_id?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      collection_products: {
        Row: {
          collection_id: string;
          product_id: string;
          sort_order: number;
        };
        Insert: {
          collection_id: string;
          product_id: string;
          sort_order?: number;
        };
        Update: {
          collection_id?: string;
          product_id?: string;
          sort_order?: number;
        };
      };
      customers: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          status: "active" | "blocked";
          city: string | null;
          country: string;
          total_orders: number;
          total_spent: number;
          last_order_at: string | null;
          tags: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          status?: "active" | "blocked";
          city?: string | null;
          country?: string;
          total_orders?: number;
          total_spent?: number;
          last_order_at?: string | null;
          tags?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          status?: "active" | "blocked";
          city?: string | null;
          country?: string;
          total_orders?: number;
          total_spent?: number;
          last_order_at?: string | null;
          tags?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          created_at?: string;
        };
      };
      customer_group_members: {
        Row: {
          customer_id: string;
          group_id: string;
        };
        Insert: {
          customer_id: string;
          group_id: string;
        };
        Update: {
          customer_id?: string;
          group_id?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          status: "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "completed" | "cancelled" | "returned";
          payment_status: "paid" | "pending" | "failed" | "refunded";
          payment_method: string | null;
          payment_reference: string | null;
          source: "online" | "phone" | "walk-in";
          subtotal: number;
          discount_amount: number;
          shipping_amount: number;
          tax_amount: number;
          total: number;
          currency: string;
          coupon_code: string | null;
          shipping_name: string | null;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_country: string;
          shipping_postal_code: string | null;
          shipping_phone: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          notes: string | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "completed" | "cancelled" | "returned";
          payment_status?: "paid" | "pending" | "failed" | "refunded";
          payment_method?: string | null;
          payment_reference?: string | null;
          source?: "online" | "phone" | "walk-in";
          subtotal?: number;
          discount_amount?: number;
          shipping_amount?: number;
          tax_amount?: number;
          total?: number;
          currency?: string;
          coupon_code?: string | null;
          shipping_name?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_country?: string;
          shipping_postal_code?: string | null;
          shipping_phone?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "completed" | "cancelled" | "returned";
          payment_status?: "paid" | "pending" | "failed" | "refunded";
          payment_method?: string | null;
          payment_reference?: string | null;
          source?: "online" | "phone" | "walk-in";
          subtotal?: number;
          discount_amount?: number;
          shipping_amount?: number;
          tax_amount?: number;
          total?: number;
          currency?: string;
          coupon_code?: string | null;
          shipping_name?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_country?: string;
          shipping_postal_code?: string | null;
          shipping_phone?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          variant_id: string | null;
          variant_name: string | null;
          quantity: number;
          price: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image?: string | null;
          variant_id?: string | null;
          variant_name?: string | null;
          quantity?: number;
          price: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_image?: string | null;
          variant_id?: string | null;
          variant_name?: string | null;
          quantity?: number;
          price?: number;
          total?: number;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
          value: number;
          minimum_order: number;
          maximum_discount: number | null;
          usage_limit: number | null;
          usage_count: number;
          per_customer_limit: number;
          is_active: boolean;
          starts_at: string | null;
          expires_at: string | null;
          applicable_products: Json;
          applicable_categories: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
          value: number;
          minimum_order?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          usage_count?: number;
          per_customer_limit?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          applicable_products?: Json;
          applicable_categories?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
          value?: number;
          minimum_order?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          usage_count?: number;
          per_customer_limit?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          applicable_products?: Json;
          applicable_categories?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      abandoned_carts: {
        Row: {
          id: string;
          customer_email: string | null;
          customer_name: string | null;
          items: Json;
          cart_value: number;
          items_count: number;
          recovered: boolean;
          recovery_email_sent: boolean;
          recovery_email_sent_at: string | null;
          abandoned_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          items?: Json;
          cart_value?: number;
          items_count?: number;
          recovered?: boolean;
          recovery_email_sent?: boolean;
          recovery_email_sent_at?: string | null;
          abandoned_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          items?: Json;
          cart_value?: number;
          items_count?: number;
          recovered?: boolean;
          recovery_email_sent?: boolean;
          recovery_email_sent_at?: string | null;
          abandoned_at?: string;
          created_at?: string;
        };
      };
      coupon_usage: {
        Row: {
          id: string;
          coupon_id: string;
          order_id: string | null;
          customer_id: string | null;
          used_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          order_id?: string | null;
          customer_id?: string | null;
          used_at?: string;
        };
        Update: {
          id?: string;
          coupon_id?: string;
          order_id?: string | null;
          customer_id?: string | null;
          used_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string | null;
          type: "info" | "success" | "warning" | "error";
          is_read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message?: string | null;
          type?: "info" | "success" | "warning" | "error";
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string | null;
          type?: "info" | "success" | "warning" | "error";
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          role: string;
          status: "active" | "inactive" | "pending";
          permissions: Json;
          last_active: string | null;
          invited_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          role?: string;
          status?: "active" | "inactive" | "pending";
          permissions?: Json;
          last_active?: string | null;
          invited_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
          status?: "active" | "inactive" | "pending";
          permissions?: Json;
          last_active?: string | null;
          invited_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
