import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be generated from your schema)
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price?: number
          category: 'concentrate' | 'tube' | 'flavored' | 'tea'
          images: string[]
          main_image: string
          ingredients: string[]
          nutrition: {
            calories: number
            caffeine: number
            sugar: number
            protein?: number
            carbs?: number
            fat?: number
          }
          instructions: string[]
          badges: string[]
          rating: number
          review_count: number
          stock: number
          sku: string
          is_active: boolean
          is_featured: boolean
          weight?: number
          dimensions?: {
            length: number
            width: number
            height: number
          }
          tags: string[]
          seo_title?: string
          seo_description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price?: number
          category: 'concentrate' | 'tube' | 'flavored' | 'tea'
          images: string[]
          main_image: string
          ingredients: string[]
          nutrition: {
            calories: number
            caffeine: number
            sugar: number
            protein?: number
            carbs?: number
            fat?: number
          }
          instructions: string[]
          badges?: string[]
          rating?: number
          review_count?: number
          stock: number
          sku: string
          is_active?: boolean
          is_featured?: boolean
          weight?: number
          dimensions?: {
            length: number
            width: number
            height: number
          }
          tags?: string[]
          seo_title?: string
          seo_description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          category?: 'concentrate' | 'tube' | 'flavored' | 'tea'
          images?: string[]
          main_image?: string
          ingredients?: string[]
          nutrition?: {
            calories: number
            caffeine: number
            sugar: number
            protein?: number
            carbs?: number
            fat?: number
          }
          instructions?: string[]
          badges?: string[]
          rating?: number
          review_count?: number
          stock?: number
          sku?: string
          is_active?: boolean
          is_featured?: boolean
          weight?: number
          dimensions?: {
            length: number
            width: number
            height: number
          }
          tags?: string[]
          seo_title?: string
          seo_description?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone?: string
          role: 'customer' | 'admin'
          is_email_verified: boolean
          addresses: Array<{
            type: 'home' | 'work' | 'other'
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            is_default: boolean
          }>
          preferences: {
            newsletter: boolean
            sms_notifications: boolean
            email_notifications: boolean
          }
          last_login?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string
          role?: 'customer' | 'admin'
          is_email_verified?: boolean
          addresses?: Array<{
            type: 'home' | 'work' | 'other'
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            is_default: boolean
          }>
          preferences?: {
            newsletter: boolean
            sms_notifications: boolean
            email_notifications: boolean
          }
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          role?: 'customer' | 'admin'
          is_email_verified?: boolean
          addresses?: Array<{
            type: 'home' | 'work' | 'other'
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            is_default: boolean
          }>
          preferences?: {
            newsletter: boolean
            sms_notifications: boolean
            email_notifications: boolean
          }
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id?: string
          customer_info: {
            name: string
            email: string
            phone?: string
          }
          items: Array<{
            product_id: string
            name: string
            price: number
            quantity: number
            image: string
            sku: string
          }>
          subtotal: number
          tax: number
          shipping: number
          discount: number
          total: number
          payment_method: 'online' | 'cod'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_details?: {
            razorpay_order_id?: string
            razorpay_payment_id?: string
            razorpay_signature?: string
            transaction_id?: string
          }
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            phone?: string
          }
          tracking_number?: string
          estimated_delivery?: string
          actual_delivery?: string
          notes?: string
          cancellation_reason?: string
          refund_amount?: number
          refund_status?: 'none' | 'requested' | 'processing' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string
          customer_info: {
            name: string
            email: string
            phone?: string
          }
          items: Array<{
            product_id: string
            name: string
            price: number
            quantity: number
            image: string
            sku: string
          }>
          subtotal: number
          tax: number
          shipping: number
          discount?: number
          total: number
          payment_method: 'online' | 'cod'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_details?: {
            razorpay_order_id?: string
            razorpay_payment_id?: string
            razorpay_signature?: string
            transaction_id?: string
          }
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            phone?: string
          }
          tracking_number?: string
          estimated_delivery?: string
          actual_delivery?: string
          notes?: string
          cancellation_reason?: string
          refund_amount?: number
          refund_status?: 'none' | 'requested' | 'processing' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          customer_info?: {
            name: string
            email: string
            phone?: string
          }
          items?: Array<{
            product_id: string
            name: string
            price: number
            quantity: number
            image: string
            sku: string
          }>
          subtotal?: number
          tax?: number
          shipping?: number
          discount?: number
          total?: number
          payment_method?: 'online' | 'cod'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_details?: {
            razorpay_order_id?: string
            razorpay_payment_id?: string
            razorpay_signature?: string
            transaction_id?: string
          }
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
            phone?: string
          }
          tracking_number?: string
          estimated_delivery?: string
          actual_delivery?: string
          notes?: string
          cancellation_reason?: string
          refund_amount?: number
          refund_status?: 'none' | 'requested' | 'processing' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          products: Array<{
            product_id: string
            quantity: number
          }>
          frequency: 'weekly' | 'biweekly' | 'monthly'
          status: 'active' | 'paused' | 'cancelled'
          next_delivery: string
          last_delivery?: string
          total_amount: number
          discount: number
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_method: string
          start_date: string
          end_date?: string
          paused_until?: string
          cancellation_reason?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          products: Array<{
            product_id: string
            quantity: number
          }>
          frequency: 'weekly' | 'biweekly' | 'monthly'
          status?: 'active' | 'paused' | 'cancelled'
          next_delivery: string
          last_delivery?: string
          total_amount: number
          discount?: number
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_method: string
          start_date?: string
          end_date?: string
          paused_until?: string
          cancellation_reason?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          products?: Array<{
            product_id: string
            quantity: number
          }>
          frequency?: 'weekly' | 'biweekly' | 'monthly'
          status?: 'active' | 'paused' | 'cancelled'
          next_delivery?: string
          last_delivery?: string
          total_amount?: number
          discount?: number
          shipping_address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_method?: string
          start_date?: string
          end_date?: string
          paused_until?: string
          cancellation_reason?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id?: string
          session_id?: string
          items: Array<{
            product_id: string
            quantity: number
            type: 'single' | 'subscription'
          }>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          session_id?: string
          items: Array<{
            product_id: string
            quantity: number
            type: 'single' | 'subscription'
          }>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          items?: Array<{
            product_id: string
            quantity: number
            type: 'single' | 'subscription'
          }>
          created_at?: string
          updated_at?: string
        }
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
  }
}