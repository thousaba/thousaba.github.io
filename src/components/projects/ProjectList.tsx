import type { Project } from './types';

interface ProjectListProps {
  projects: Project[];
  selectedId: number;
  onSelect: (project: Project) => void;
}

export default function ProjectList({ projects, selectedId, onSelect }: ProjectListProps) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white mb-2 px-2 border-l-4 border-emerald-500">
        Projelerim
      </h2>

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelect(project)}
            className={`cursor-pointer text-left p-5 rounded-xl border transition-all duration-300 group
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
