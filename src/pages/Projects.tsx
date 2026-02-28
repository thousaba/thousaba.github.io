import { useState, useEffect } from "react";
import { ProjectsSkeleton } from "../components/Skeleton";


// 1. Tip Tanımları
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  status: 'Tamamlandı' | 'Devam Ediyor' | 'Plan Aşamasında';
  images?: string[]; 
  downloadUrl?: string;
  repoUrl?: string;
}

// 2. Veriler
const projectsData: Project[] = [
  {
    id: 1,
    title: "Football Card",
    category: "Mobile Game for Android",
    description: "Arkadaş ortamlarının vazgeçilmezi olmaya aday, React Native ile geliştirilmiş bir futbol kartı oyunu. Birbirinden eğlenceli modlarıyla, futbol temalı kartlarla rakiplerinizi alt edin! İster klasik Pisti modunda, ister Uno modunda oynayın. Hatta hafıza kartlarıyla beyin jimnastiği yapabileceğiniz Memory modu bile var!",
    techStack: ["React Native", "TypeScript", "Kotlin"],
    status: "Tamamlandı",
    images: [
      "/FutCard/main-page.jpg", 
      "/FutCard/how-to-play.jpg", 
      "/FutCard/options.jpg",
      "/FutCard/store.jpg",
      "/FutCard/pisti-mode.jpg",
      "/FutCard/blind-mode.jpg",
      "/FutCard/uno-mode.jpg",
      "/FutCard/memory-mode-1.jpg",
      "/FutCard/memory-mode-2.jpg"
    ],
    downloadUrl: "https://github.com/thousaba/FootballCard/releases/download/v1.0.0/app-release.apk",
    repoUrl: "https://github.com/thousaba/FootballCard"
  },
  {
    id: 2,
    title: "Portfolio V2",
    category: "Web Development",
    description: "Şu an incelediğin, modern web teknolojileri ve 'clean UI' prensipleriyle tasarlanmış kişisel web sitesi.",
    techStack: ["React", "Tailwind CSS", "Vite"],
    status: "Tamamlandı"
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project>(projectsData[1]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hangi resmin büyütüldüğünü tutar.
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);
  
  // Modal açıkken arka planın kaydırılmasını (scroll) engelle
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Component unmount olursa scroll'u geri aç
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedImage]);

  if (isLoading) return <ProjectsSkeleton />;

  // Sonraki resme geçiş
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Tıklayınca modal kapanmasın diye
    if (!selectedProject.images || !selectedImage) return;
    
    const currentIndex = selectedProject.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % selectedProject.images.length; // Sona geldiyse başa dön
    setSelectedImage(selectedProject.images[nextIndex]);
  };

  // Önceki resme geçiş
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject.images || !selectedImage) return;

    const currentIndex = selectedProject.images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + selectedProject.images.length) % selectedProject.images.length; // Başa geldiyse sona dön
    setSelectedImage(selectedProject.images[prevIndex]);
  };

  return (
    <>
    <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto min-h-[85vh] flex flex-col md:flex-row gap-8 relative z-10">
      
      {/* --- SOL TARAF (LİSTE) --- */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2 px-2 border-l-4 border-emerald-500">
          Projelerim
        </h2>
        
        <div className="flex flex-col gap-3">
          {projectsData.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 group
                ${
                  selectedProject.id === project.id
                    ? "bg-gray-800 border-emerald-500/50 text-white shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/50" 
                    : "bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200 hover:border-gray-700" 
                }
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg tracking-tight">{project.title}</span>
                {selectedProject.id === project.id && (
                  <span className="text-emerald-400 animate-pulse">●</span>
                )}
              </div>
              <p className={`text-sm font-medium transition-colors ${selectedProject.id === project.id ? 'text-emerald-400/80' : 'text-gray-600 group-hover:text-gray-500'}`}>
                {project.category}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* --- SAĞ TARAF (DETAY & MEDYA) --- */}
      <div className="w-full md:w-2/3">
        <div className="h-full bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[800px]">
            
            {/* Animasyon konteyneri */}
            <div key={selectedProject.id} className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col overflow-hidden">
                
                {/* HEADER KISMI AYNI KALIYOR... */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6 shrink-0">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter">
                            {selectedProject.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded text-xs font-mono font-bold tracking-wider uppercase">
                                {selectedProject.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider
                                ${selectedProject.status === 'Devam Ediyor' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50' : 
                                  selectedProject.status === 'Tamamlandı' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                  'bg-gray-800 text-gray-400 border-gray-700'}
                            `}>
                                {selectedProject.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-2 lg:mt-0">
                        {selectedProject.downloadUrl && (
                             <a href={selectedProject.downloadUrl} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                                <span>APK İndir</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                             </a>
                        )}
                        {selectedProject.repoUrl && (
                             <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-bold border border-gray-700 transition-all active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                             </a>
                        )}
                    </div>
                </div>
                <hr className="border-gray-800 mb-6 shrink-0" />

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-gray-300 leading-relaxed text-lg mb-8">
                        {selectedProject.description}
                    </p>

                    {/* --- RESİM GALERİSİ --- */}
                    {selectedProject.images && selectedProject.images.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Ekran Görüntüleri</h3>
                            {/* Grid yapısı: Mobil 2, PC 3 sütun - Daha küçük önizlemeler */}
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {selectedProject.images.map((img, index) => (
              
                                    <button 
                                        key={index} 
                                        onClick={() => setSelectedImage(img)}
                                        className="group relative aspect-[9/16] rounded-lg overflow-hidden border border-gray-800 bg-gray-950 cursor-zoom-in outline-offset-2 focus-visible:outline-emerald-500"
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${selectedProject.title} screenshot ${index + 1}`} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        {/* Hover efekti ve büyüteç ikonu */}
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

                    <div className="mt-auto pb-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                            Kullanılan Teknolojiler
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedProject.techStack.map((tech) => (
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
    </div>

    {/* --- MODAL (LIGHTBOX) --- */}
    {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            {/* KAPAT BUTONU (Sağ Üst) */}
            <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-[120] text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* --- SOL OK (Önceki) --- */}
            <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-8 z-[110] p-3 rounded-full bg-black/50 hover:bg-emerald-600/80 text-white transition-all group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* BÜYÜK RESİM */}
            <img 
                src={selectedImage} 
                alt="Full screen preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300 select-none"
                onClick={(e) => e.stopPropagation()} 
            />

            {/* --- SAĞ OK (Sonraki) --- */}
            <button 
                onClick={handleNext}
                className="absolute right-4 md:right-8 z-[110] p-3 rounded-full bg-black/50 hover:bg-emerald-600/80 text-white transition-all group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            
            {/* Resim Sayacı (1/5 gibi gösterir) */}
            {selectedProject.images && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-1 rounded-full text-sm font-mono">
                    {selectedProject.images.indexOf(selectedImage) + 1} / {selectedProject.images.length}
                </div>
            )}
        </div>
    )}
    </>
  );
}