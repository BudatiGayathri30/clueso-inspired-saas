import { useState, useRef } from 'react';
import { Upload, Loader2, Check, Sparkles, Mic, Type, Zap, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface CreateVideoProps {
  onClose: () => void;
  onComplete: (videoId: string) => void;
}

export default function CreateVideo({ onClose, onComplete }: CreateVideoProps) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiScript, setAiScript] = useState('');
  const [aiVoice, setAiVoice] = useState('professional-male');
  const [captions, setCaptions] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const simulateAIProcessing = async (videoId: string) => {
    const mockScript = `Welcome to this comprehensive tutorial! In this video, we'll walk through the key features of our platform.

First, we'll cover the dashboard where you can see all your metrics at a glance. The dashboard provides real-time analytics and insights.

Next, we'll explore the video creation tools. Our AI-powered editor automatically enhances your recordings, removes silence, and adds professional captions.

Finally, we'll demonstrate how to generate documentation from your videos. The system automatically extracts key steps and creates beautiful, shareable guides.

Let's get started!`;

    const mockCaptions = [
      { start: 0, end: 5, text: 'Welcome to this comprehensive tutorial!' },
      { start: 5, end: 10, text: "In this video, we'll walk through the key features of our platform." },
      { start: 10, end: 15, text: "First, we'll cover the dashboard where you can see all your metrics." },
    ];

    const mockHighlights = [
      { time: 12, type: 'zoom', description: 'Dashboard overview' },
      { time: 45, type: 'zoom', description: 'Video editor interface' },
      { time: 78, type: 'zoom', description: 'Documentation generator' },
    ];

    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    await supabase
      .from('videos')
      .update({
        status: 'completed',
        ai_script: mockScript,
        ai_voice: 'professional-male',
        captions: mockCaptions,
        highlights: mockHighlights,
        duration: 120,
      })
      .eq('id', videoId);

    setAiScript(mockScript);
    setCaptions(mockCaptions);
  };

  const handleUpload = async () => {
    if (!file || !currentWorkspace || !user) return;

    setStep('processing');

    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        workspace_id: currentWorkspace.id,
        user_id: user.id,
        title: title,
        status: 'processing',
        thumbnail_url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return;
    }

    setVideoId(video.id);
    await simulateAIProcessing(video.id);
    setStep('result');
  };

  const handleComplete = () => {
    onComplete(videoId);
  };

  if (step === 'upload') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Create New Video</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Video File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">MP4, MOV, AVI up to 500MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Processing</h3>
                  <p className="text-sm text-slate-700">
                    Our AI will automatically enhance your video with:
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Professional script rewriting
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Auto-generated captions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Smart zoom highlights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Step-by-step documentation
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || !title}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Start Processing
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Your Video</h2>
            <p className="text-slate-600">AI is analyzing and enhancing your content</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Progress</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress > 25 ? 'bg-green-500' : 'bg-slate-300'
                }`}>
                  {progress > 25 ? <Check className="w-5 h-5 text-white" /> : <Loader2 className="w-5 h-5 text-white animate-spin" />}
                </div>
                <span className="text-sm font-medium text-slate-700">Analyzing video content</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress > 50 ? 'bg-green-500' : progress > 25 ? 'bg-blue-500' : 'bg-slate-300'
                }`}>
                  {progress > 50 ? <Check className="w-5 h-5 text-white" /> : progress > 25 ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Type className="w-5 h-5 text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">Generating AI script</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress > 75 ? 'bg-green-500' : progress > 50 ? 'bg-blue-500' : 'bg-slate-300'
                }`}>
                  {progress > 75 ? <Check className="w-5 h-5 text-white" /> : progress > 50 ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Mic className="w-5 h-5 text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">Creating captions</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress === 100 ? 'bg-green-500' : progress > 75 ? 'bg-blue-500' : 'bg-slate-300'
                }`}>
                  {progress === 100 ? <Check className="w-5 h-5 text-white" /> : progress > 75 ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Zap className="w-5 h-5 text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">Adding smart highlights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Video Processed Successfully!</h2>
              <p className="text-sm text-slate-600">Review your AI-enhanced content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              AI-Generated Script
            </label>
            <textarea
              value={aiScript}
              onChange={(e) => setAiScript(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              AI Voice Selection
            </label>
            <select
              value={aiVoice}
              onChange={(e) => setAiVoice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional-male">Professional Male</option>
              <option value="professional-female">Professional Female</option>
              <option value="casual-male">Casual Male</option>
              <option value="casual-female">Casual Female</option>
              <option value="energetic">Energetic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Auto-Generated Captions
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {captions.map((caption, index) => (
                <div key={index} className="text-sm text-slate-700">
                  <span className="font-mono text-xs text-slate-500 mr-2">
                    {caption.start}s - {caption.end}s
                  </span>
                  {caption.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            View Video & Generate Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
