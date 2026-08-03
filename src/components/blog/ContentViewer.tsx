import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Terminal, X, CalendarDays } from 'lucide-react';

interface ContentViewerProps {
  activeFile: string;
  content: string;
  date?: string;
  onClose: () => void;
}

export default function ContentViewer({ activeFile, content, date, onClose }: ContentViewerProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="w-full md:w-2/3 relative border border-white/20 rounded-xl bg-gray-900 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full h-10 bg-gray-800 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-300">
            cat content/{activeFile}.md
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          title="Terminali Kapat"
        >
          <X className="size-5" />
        </button>
      </div>

      {formattedDate && (
        <div className="w-full px-4 md:px-8 pt-4 flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
          <CalendarDays className="size-3.5" />
          <span>Eklenme tarihi: {formattedDate}</span>
        </div>
      )}

      <div className="p-4 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
        <div className="prose prose-invert prose-blue max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
