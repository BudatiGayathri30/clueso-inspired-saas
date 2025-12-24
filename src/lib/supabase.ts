import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          primary_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          primary_color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          primary_color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          original_video_url: string | null;
          processed_video_url: string | null;
          duration: number | null;
          status: 'uploading' | 'processing' | 'completed' | 'failed';
          ai_script: string | null;
          ai_voice: string | null;
          captions: any;
          highlights: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          original_video_url?: string | null;
          processed_video_url?: string | null;
          duration?: number | null;
          status?: 'uploading' | 'processing' | 'completed' | 'failed';
          ai_script?: string | null;
          ai_voice?: string | null;
          captions?: any;
          highlights?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          original_video_url?: string | null;
          processed_video_url?: string | null;
          duration?: number | null;
          status?: 'uploading' | 'processing' | 'completed' | 'failed';
          ai_script?: string | null;
          ai_voice?: string | null;
          captions?: any;
          highlights?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      documentation: {
        Row: {
          id: string;
          video_id: string;
          workspace_id: string;
          user_id: string;
          title: string;
          content: any;
          format: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          workspace_id: string;
          user_id: string;
          title: string;
          content?: any;
          format?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          video_id?: string;
          workspace_id?: string;
          user_id?: string;
          title?: string;
          content?: any;
          format?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
