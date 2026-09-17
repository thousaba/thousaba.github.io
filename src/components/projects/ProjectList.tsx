import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { Project } from './types';

interface ProjectListProps {
  projects: Project[];
  selectedId: number;
  onSelect: (project: Project) => void;
}

export default function ProjectList({ projects, selectedId, onSelect }: ProjectListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDown: false, startY: 0, startScrollTop: 0, moved: false });

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || e.button !== 0) return;
    // Clicks landing in (or near) the native scrollbar track/thumb are outside
    // clientWidth (which excludes the scrollbar) — let the browser handle those
    // natively. The scrollbar is thin, so add a small buffer for near-misses;
    // our drag-to-scroll uses an inverted "grab" direction that fights the
    // scrollbar's direct direction if it accidentally takes over here.
    const SCROLLBAR_EDGE_BUFFER = 12;
    const rect = el.getBoundingClientRect();
    if (e.clientX - rect.left > el.clientWidth - SCROLLBAR_EDGE_BUFFER) return;

    dragRef.current.isDown = true;
    dragRef.current.moved = false;
    dragRef.current.startY = e.clientY;
    dragRef.current.startScrollTop = el.scrollTop;

    // Track the drag on the window instead of using setPointerCapture — capturing
    // the pointer on this element re-targets the resulting "click" event to it,
    // which stops the project buttons' onClick from ever firing.
    const handleMove = (ev: PointerEvent) => {
      if (!dragRef.current.isDown) return;
      const delta = ev.clientY - dragRef.current.startY;
      if (Math.abs(delta) > 5) dragRef.current.moved = true;
      el.scrollTop = dragRef.current.startScrollTop - delta;
    };
    const handleUp = () => {
      dragRef.current.isDown = false;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 px-2 border-l-4 border-emerald-500">
        Projects
      </h2>

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        className="flex flex-col gap-3 overflow-y-auto pr-1 md:max-h-200 md:cursor-grab md:active:cursor-grabbing select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelect(project)}
            className={`cursor-pointer text-left p-3 md:p-5 rounded-xl border transition-all duration-300 group
              ${
                selectedId === project.id
                  ? "bg-gray-800 border-emerald-500/50 text-white shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/50"
                  : "bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:border-gray-700"
              }
            `}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-lg tracking-tight">{project.title}</span>
              {selectedId === project.id && (
                <span className="text-emerald-400 animate-pulse">●</span>
              )}
            </div>
            <p className={`text-sm font-medium transition-colors ${selectedId === project.id ? 'text-emerald-400/80' : 'text-gray-600 group-hover:text-gray-500'}`}>
              {project.category}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
