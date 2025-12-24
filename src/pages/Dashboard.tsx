import { useEffect, useState } from 'react';
import { Video, FileText, Clock, Plus, Play, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onCreateVideo: () => void;
}

interface DashboardStats {
  totalVideos: number;
  totalDocs: number;
  totalDuration: number;
}

interface RecentVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  duration: number | null;
  status: string;
  created_at: string;
}

export default function Dashboard({ onNavigate, onCreateVideo }: DashboardProps) {
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalDocs: 0,
    totalDuration: 0,
  });
  const [recentVideos, setRecentVideos] = useState<RecentVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      fetchDashboardData();
    }
  }, [currentWorkspace]);

  const fetchDashboardData = async () => {
    if (!currentWorkspace) return;

    const { data: videos } = await supabase
      .from('videos')
      .select('*')
      .eq('workspace_id', currentWorkspace.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { count: docCount } = await supabase
      .from('documentation')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', currentWorkspace.id);

    const totalDuration = videos?.reduce((acc, video) => acc + (video.duration || 0), 0) || 0;

    setStats({
      totalVideos: videos?.length || 0,
      totalDocs: docCount || 0,
      totalDuration: totalDuration,
    });

    setRecentVideos(videos || []);
    setLoading(false);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back to {currentWorkspace?.name}
          </p>
        </div>
        <button
          onClick={onCreateVideo}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-5 h-5" />
          Create New Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalVideos}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Videos Created</h3>
          <p className="text-xs text-slate-500 mt-1">Total screen recordings processed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalDocs}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Docs Generated</h3>
          <p className="text-xs text-slate-500 mt-1">AI-powered documentation</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              {formatDuration(stats.totalDuration)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Time Saved</h3>
          <p className="text-xs text-slate-500 mt-1">Through AI automation</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Videos</h2>
          <button
            onClick={() => onNavigate('videos')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentVideos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No videos yet</h3>
            <p className="text-slate-600 mb-6">Create your first video to get started</p>
            <button
              onClick={onCreateVideo}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Video
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onNavigate(`video-${video.id}`)}
              >
                <div className="w-24 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">{video.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      video.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : video.status === 'processing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {video.status}
                    </span>
                    {video.duration && (
                      <span className="text-xs text-slate-500">{formatDuration(video.duration)}</span>
                    )}
                    <span className="text-xs text-slate-500">{formatDate(video.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
