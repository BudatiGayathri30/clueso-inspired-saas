import { Sparkles, TrendingUp, Clock, Users, BarChart3, Zap } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';

export default function AIInsights() {
  const { currentWorkspace } = useWorkspace();

  const insights = [
    {
      title: 'Content Performance',
      value: '87%',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      description: 'Average engagement rate across all videos',
    },
    {
      title: 'Time Saved',
      value: '142 hrs',
      change: '+28%',
      trend: 'up',
      icon: Clock,
      color: 'blue',
      description: 'Total time saved through AI automation',
    },
    {
      title: 'AI Processing',
      value: '234',
      change: '+45',
      trend: 'up',
      icon: Zap,
      color: 'purple',
      description: 'Total videos processed this month',
    },
    {
      title: 'Team Productivity',
      value: '96%',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'cyan',
      description: 'Team adoption and usage rate',
    },
  ];

  const recommendations = [
    {
      title: 'Optimize Video Length',
      description: 'Videos between 3-5 minutes have 45% higher completion rates',
      impact: 'High',
      category: 'Content',
    },
    {
      title: 'Add More Highlights',
      description: 'Videos with 3+ zoom highlights get 2x more engagement',
      impact: 'Medium',
      category: 'Editing',
    },
    {
      title: 'Use Professional Voice',
      description: 'Professional voices improve viewer retention by 23%',
      impact: 'Medium',
      category: 'Voice',
    },
    {
      title: 'Weekly Documentation Review',
      description: 'Regular updates keep documentation accuracy above 95%',
      impact: 'Low',
      category: 'Documentation',
    },
  ];

  const topVideos = [
    { title: 'Getting Started Guide', views: 1234, engagement: 92 },
    { title: 'Advanced Features Tutorial', views: 987, engagement: 88 },
    { title: 'Quick Tips & Tricks', views: 856, engagement: 95 },
    { title: 'Product Overview', views: 743, engagement: 85 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Insights</h1>
          <p className="text-slate-600 mt-1">
            Powered insights for {currentWorkspace?.name}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">AI-Powered Analytics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const colorClasses = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            cyan: 'bg-cyan-100 text-cyan-600',
          }[insight.color];

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  {insight.change}
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900">{insight.value}</h3>
                <p className="text-sm font-medium text-slate-600">{insight.title}</p>
                <p className="text-xs text-slate-500">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Recommendations</h2>
              <p className="text-sm text-slate-600">Personalized suggestions to improve your content</p>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{rec.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.impact === 'High'
                        ? 'bg-red-100 text-red-700'
                        : rec.impact === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {rec.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                <span className="text-xs text-slate-500">{rec.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top Performing Videos</h2>
              <p className="text-sm text-slate-600">Based on views and engagement</p>
            </div>
          </div>

          <div className="space-y-4">
            {topVideos.map((video, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">{video.title}</h3>
                      <p className="text-xs text-slate-500">{video.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{video.engagement}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                    style={{ width: `${video.engagement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">AI is analyzing your content patterns</h2>
            <p className="text-blue-100 mb-6">
              Based on your video library, we've identified key trends and opportunities to enhance your
              content strategy. Insights are updated in real-time as you create more videos.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold mb-1">234</p>
                <p className="text-sm text-blue-100">Videos Analyzed</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">4.8k</p>
                <p className="text-sm text-blue-100">Data Points</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">12</p>
                <p className="text-sm text-blue-100">Patterns Found</p>
              </div>
            </div>
          </div>
          <Sparkles className="w-16 h-16 opacity-20" />
        </div>
      </div>
    </div>
  );
}
