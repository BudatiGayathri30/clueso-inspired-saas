import { useEffect, useState } from 'react';
import { FileText, Download, Search, Plus, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface DocumentationProps {
  onDocumentSelect: (docId: string) => void;
}

interface Doc {
  id: string;
  title: string;
  content: any;
  format: string;
  created_at: string;
  video_id: string;
}

export default function Documentation({ onDocumentSelect }: DocumentationProps) {
  const { currentWorkspace } = useWorkspace();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentWorkspace) {
      fetchDocumentation();
    }
  }, [currentWorkspace]);

  const fetchDocumentation = async () => {
    if (!currentWorkspace) return;

    const { data, error } = await supabase
      .from('documentation')
      .select('*')
      .eq('workspace_id', currentWorkspace.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documentation:', error);
      return;
    }

    setDocs(data || []);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredDocs = docs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
          <p className="text-slate-600 mt-1">AI-generated step-by-step guides</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchQuery ? 'No documentation found' : 'No documentation yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Create a video to automatically generate documentation'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onDocumentSelect(doc.id)}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {Array.isArray(doc.content) ? doc.content.length : 0} steps
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(doc.created_at)}</span>
                        <span>•</span>
                        <span className="uppercase">{doc.format}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
