import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

type Subscription = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

type Cart = Database['public']['Tables']['cart']['Row']
type CartInsert = Database['public']['Tables']['cart']['Insert']
type CartUpdate = Database['public']['Tables']['cart']['Update']

export class SupabaseService {
  // Authentication
  async signUp(email: string, password: string, userData: { name: string; phone?: string }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name: userData.name,
          phone: userData.phone,
        })

      if (profileError) throw profileError
    }

    return authData
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: UserUpdate) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Products
  async getProducts(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    sort?: string
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    // Apply filters
    if (params?.category) {
      query = query.eq('category', params.category)
    }

    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }

    if (params?.minPrice) {
      query = query.gte('price', params.minPrice)
    }

    if (params?.maxPrice) {
      query = query.lte('price', params.maxPrice)
    }

    // Apply sorting
    if (params?.sort) {
      switch (params.sort) {
        case 'price-low':
          query = query.order('price', { ascending: true })
          break
        case 'price-high':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'name':
        default:
          query = query.order('name', { ascending: true })
          break
      }
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit
      const to = from + params.limit - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      products: data || [],
      totalResults: count || 0,
      page: params?.page || 1,
      totalPages: params?.limit ? Math.ceil((count || 0) / params.limit) : 1,
    }
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  }

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(8)

    if (error) throw error
    return data || []
  }

  async getProductsByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Orders
  async createOrder(orderData: OrderInsert) {
    // Generate order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_number: orderNumber,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getOrder(id: string, userId?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('id', id)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.single()

    if (error) throw error
    return data
  }

  async updateOrder(id: string, updates: OrderUpdate) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Cart
  async getCart(userId?: string, sessionId?: string) {
    let query = supabase
      .from('cart')
      .select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    } else {
      throw new Error('Either userId or sessionId is required')
    }

    const { data, error } = await query.single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error
    }

    return data
  }

  async upsertCart(cartData: CartInsert | CartUpdate) {
    const { data, error } = await supabase
      .from('cart')
      .upsert(cartData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async clearCart(userId?: string, sessionId?: string) {
    let query = supabase.from('cart').delete()

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    } else {
      throw new Error('Either userId or sessionId is required')
    }

    const { error } = await query

    if (error) throw error
  }

  // Subscriptions
  async createSubscription(subscriptionData: SubscriptionInsert) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getSubscriptions(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateSubscription(id: string, updates: SubscriptionUpdate) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async cancelSubscription(id: string, reason?: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        end_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Contact/Support
  async sendContactMessage(messageData: {
    name: string
    email: string
    subject: string
    message: string
    category: string
  }) {
    // In a real implementation, you might want to store contact messages
    // or send them via email service. For now, we'll just log them.
    console.log('Contact message:', messageData)
    
    // You could also use Supabase Edge Functions to send emails
    // or integrate with a service like Resend, SendGrid, etc.
    
    return { success: true, message: 'Message sent successfully' }
  }

  // Real-time subscriptions
  subscribeToOrders(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  }

  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        callback
      )
      .subscribe()
  }
}

export const supabaseService = new SupabaseService()