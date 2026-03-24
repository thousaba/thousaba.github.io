import type { Project } from './types';

interface ProjectDetailProps {
  project: Project;
  onImageClick: (img: string) => void;
}

export default function ProjectDetail({ project, onImageClick }: ProjectDetailProps) {
  return (
    <div className="w-full md:w-2/3">
      <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-800px">

        <div key={project.id} className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6 shrink-0">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded text-xs font-mono font-bold tracking-wider uppercase">
                  {project.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider
                  ${project.status === 'Devam Ediyor' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50' :
                    project.status === 'Tamamlandı' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                    'bg-gray-800 text-gray-400 border-gray-700'}
                `}>
                  {project.status}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-2 lg:mt-0">
              {project.downloadUrl && (
                <a href={project.downloadUrl} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                  <span>APK İndir</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-bold border border-gray-700 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              )}
            </div>
          </div>

          <hr className="border-gray-800 mb-6 shrink-0" />

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-gray-300 leading-relaxed text-lg mb-8">
              {project.description}
            </p>

            {/* Galeri */}
            {project.images && project.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Ekran Görüntüleri</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => onImageClick(img)}
                      className="group relative aspect-9/16 rounded-lg overflow-hidden border border-gray-800 bg-gray-950 cursor-zoom-in outline-offset-2 focus-visible:outline-emerald-500"
                    >
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8 bg-black/50 rounded-full p-1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div className="mt-auto pb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Kullanılan Teknolojiler
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-gray-800 text-emerald-400 rounded border border-gray-700 text-sm font-bold font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
