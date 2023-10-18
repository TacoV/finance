export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string | null
          account_no: string
          id: number
          owner_id: string
        }
        Insert: {
          account_name?: string | null
          account_no: string
          id?: number
          owner_id?: string
        }
        Update: {
          account_name?: string | null
          account_no?: string
          id?: number
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      tags: {
        Row: {
          category: string
          id: number
          name: string
          owner_id: string
        }
        Insert: {
          category: string
          id?: number
          name: string
          owner_id?: string
        }
        Update: {
          category?: string
          id?: number
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tags_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      transactions: {
        Row: {
          account_id: number
          amount: number
          book_code: string | null
          bookdate: string
          counter_account: string
          counter_name: string | null
          description: string | null
          description1: string | null
          description2: string | null
          description3: string | null
          eventual_name: string | null
          id: number
          initiating_name: string | null
          owner: string
          transaction_no: number
        }
        Insert: {
          account_id: number
          amount: number
          book_code?: string | null
          bookdate: string
          counter_account: string
          counter_name?: string | null
          description?: string | null
          description1?: string | null
          description2?: string | null
          description3?: string | null
          eventual_name?: string | null
          id?: number
          initiating_name?: string | null
          owner?: string
          transaction_no: number
        }
        Update: {
          account_id?: number
          amount?: number
          book_code?: string | null
          bookdate?: string
          counter_account?: string
          counter_name?: string | null
          description?: string | null
          description1?: string | null
          description2?: string | null
          description3?: string | null
          eventual_name?: string | null
          id?: number
          initiating_name?: string | null
          owner?: string
          transaction_no?: number
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_account_id_fkey'
            columns: ['account_id']
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_owner_fkey'
            columns: ['owner']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      transactions_tags: {
        Row: {
          account_id: number
          tag_id: number
          transaction_no: number
        }
        Insert: {
          account_id: number
          tag_id: number
          transaction_no: number
        }
        Update: {
          account_id?: number
          tag_id?: number
          transaction_no?: number
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_tags_tag_id_fkey'
            columns: ['tag_id']
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      transactions_overview: {
        Row: {
          account_id: number | null
          account_name: string | null
          amount: number | null
          book_code: string | null
          bookdate: string | null
          counter_account: string | null
          counter_name: string | null
          description: string | null
          description1: string | null
          description2: string | null
          description3: string | null
          eventual_name: string | null
          id: number | null
          initiating_name: string | null
          tag_category: string | null
          tag_name: string | null
          transaction_no: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_account_id_fkey'
            columns: ['account_id']
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          }
        ]
      }
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
