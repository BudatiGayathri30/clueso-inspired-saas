import { useState, FormEvent } from 'react';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WorkspaceSetupProps {
  onComplete: () => void;
}

export default function WorkspaceSetup({ onComplete }: WorkspaceSetupProps) {
  const { user } = useAuth();
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    const slug = generateSlug(workspaceName);

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name: workspaceName,
        slug: slug,
        primary_color: '#3B82F6',
      })
      .select()
      .single();

    if (workspaceError) {
      setError(workspaceError.message);
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from('workspace_members').insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    });

    if (memberError) {
      setError(memberError.message);
      setLoading(false);
      return;
    }

    localStorage.setItem('currentWorkspaceId', workspace.id);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-lg relative">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your workspace</h1>
            <p className="text-slate-600">
              Set up your workspace to start creating videos and documentation
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="workspaceName" className="block text-sm font-medium text-slate-700 mb-2">
                Workspace name
              </label>
              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                placeholder="e.g., Acme Inc, My Team, Personal"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">
                This will be your workspace's display name
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !workspaceName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating workspace...
                </>
              ) : (
                <>
                  Create workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900">∞</p>
                <p className="text-xs text-slate-600 mt-1">Videos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">∞</p>
                <p className="text-xs text-slate-600 mt-1">Team members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">∞</p>
                <p className="text-xs text-slate-600 mt-1">Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
