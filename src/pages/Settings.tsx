import { useState } from 'react';
import { User, Building2, Key, Users as UsersIcon, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

export default function Settings() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'api' | 'team'>('profile');
  const [copied, setCopied] = useState(false);

  const mockApiKey = 'clso_live_abc123def456ghi789jklmno';

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'workspace', name: 'Workspace', icon: Building2 },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'team', name: 'Team', icon: UsersIcon },
  ];

  const teamMembers = [
    { id: '1', email: user?.email || '', role: 'owner', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and workspace preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
                    <input
                      type="text"
                      value={user?.id || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Workspace Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={currentWorkspace?.name || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Workspace Slug
                    </label>
                    <input
                      type="text"
                      value={currentWorkspace?.slug || ''}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={currentWorkspace?.primary_color || '#3B82F6'}
                        className="w-20 h-12 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={currentWorkspace?.primary_color || '#3B82F6'}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">API Keys</h2>
                <p className="text-sm text-slate-600 mb-6">
                  Use these keys to integrate Clueso with your applications
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Production API Key</span>
                    <button
                      onClick={handleCopyApiKey}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block text-sm font-mono text-slate-900 break-all">
                    {mockApiKey}
                  </code>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">API Documentation</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Learn how to integrate Clueso's API into your workflow with our comprehensive documentation.
                </p>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  View API Docs →
                </a>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Team Members</h2>
                  <p className="text-sm text-slate-600">
                    Manage who has access to this workspace
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                  <UsersIcon className="w-5 h-5" />
                  Invite Member
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {member.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.email}</p>
                        <p className="text-sm text-slate-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
