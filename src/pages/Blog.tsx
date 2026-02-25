import { useState, useEffect } from 'react';
import { BlogSkeleton } from '../components/Skeleton';
import {
  File, FileHighlight, FileIcon, FileLabel, Files, FilesHighlight,
  Folder, FolderContent, FolderHeader, FolderHighlight, FolderIcon,
  FolderItem, FolderTrigger,
} from '@/components/animate-ui/primitives/radix/files';
import {
  FolderOpenIcon, FolderIcon as LucideFolderIcon, 
  Film, Tv, Terminal, X
} from 'lucide-react';
import DecryptedText from '../components/DecryptedText';
import ReactMarkdown from 'react-markdown';
import { FaSpotify } from 'react-icons/fa';
import { SiLetterboxd } from 'react-icons/si';

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <BlogSkeleton />;

  // Dosyaya tıklandığında ne olacağını belirleyen fonksiyon
  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName);
    setContent(`> ${fileName}.md yükleniyor...`);

    // Public klasöründeki dosyayı çekiyoruz
    fetch(`/content/${fileName}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Dosya bulunamadı");
        return res.text();
      })
      .then((text) => setContent(text))
      .catch(() => setContent(`### ⚠️ Hata\n\n\`/public/content/${fileName}.md\` bulunamadı.`));
  };

  // Sağ paneli (terminali) kapatan fonksiyon
  const handleClose = () => {
    setActiveFile(null);
    setContent("");
  };

  return (
    <div className="pt-36 pb-12 px-8 max-w-7xl mx-auto text-white min-h-full flex flex-col justify-start">
      
      <header className="mb-12 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
          <DecryptedText 
            text="Cinephile & Archives" 
            animateOn="view" 
            revealDirection="start" 
          />
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl">
          My personal repository of reviews, thoughts, and deep dives. Explore the directories below.
        </p>
      </header>

      {/* PANALLERİ YAN YANA GETİREN ANA KONTEYNER */}
      <div className="flex flex-row gap-6 h-[650px] w-full justify-center">
        
        {/* SOL PANEL: DOSYA AĞACI (Seçim yoksa ortada büyük, varsa solda dar) */}
        <div className={`relative border border-white/20 rounded-xl bg-gray-900 overflow-hidden shadow-2xl flex flex-col transition-all duration-500 ease-in-out ${activeFile ? 'w-1/3' : 'w-full max-w-3xl'}`}>
          <div className="w-full h-8 bg-gray-800 flex items-center px-4 gap-2 border-b border-white/20 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs font-mono text-slate-400">~/archives/root</span>
          </div>

          <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
            <Files className="p-2" defaultOpen={['movies-dir', 'series-dir']}>
              <FilesHighlight className="bg-gray-950 rounded-md">
                
                {/* 1. KLASÖR: MOVIES 🎬 */}
                <FolderItem value="movies-dir">
                  <FolderHeader>
                    <FolderTrigger className="w-full text-start group cursor-pointer">
                      <FolderHighlight>
                        <Folder className="flex items-center gap-2 p-2 group-hover:text-blue-400 transition-colors">
                          <FolderIcon
                            closeIcon={<LucideFolderIcon className="size-5 text-blue-500" />}
                            openIcon={<FolderOpenIcon className="size-5 text-blue-400" />}
                          />
                          <FileLabel className="text-lg font-semibold">Movies</FileLabel>
                        </Folder>
                      </FolderHighlight>
                    </FolderTrigger>
                  </FolderHeader>

                  <FolderContent>
                    <FileHighlight>
                      <a
                        href="https://letterboxd.com/thousaba/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 p-2 hover:text-blue-400 transition-colors"
                      >
                        <SiLetterboxd className="size-7 text-blue-500" />
                        <span className="flex-text-md font-medium tracking-wide">
                          Letterboxd Profilim
                        </span>
                      </a>
                    </FileHighlight>
                  </FolderContent>

                  <div className="relative ml-8 before:absolute before:-left-3 before:inset-y-0 before:w-px before:h-full before:bg-white/20">
                    <FolderContent>
                      <FileHighlight>
                        <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleFileClick('Interstellar')}>
                          <FileIcon><Film className="size-4 text-slate-400" /></FileIcon>
                          <FileLabel className="text-md">Interstellar.md</FileLabel>
                        </File>
                      </FileHighlight>
                      <FileHighlight>
                        <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleFileClick('Nocturnal-Animals')}>
                          <FileIcon><Film className="size-4 text-slate-400" /></FileIcon>
                          <FileLabel className="text-md">Nocturnal Animals.md</FileLabel>
                        </File>
                      </FileHighlight>
                    </FolderContent>
                  </div>
                </FolderItem>

                {/* 2. KLASÖR: SERIES 📺 */}
                <FolderItem value="series-dir">
                  <FolderHeader>
                    <FolderTrigger className="w-full text-start group mt-2 cursor-pointer">
                      <FolderHighlight>
                        <Folder className="flex items-center gap-2 p-2 group-hover:text-purple-400 transition-colors">
                          <FolderIcon
                            closeIcon={<LucideFolderIcon className="size-5 text-purple-500" />}
                            openIcon={<FolderOpenIcon className="size-5 text-purple-400" />}
                          />
                          <FileLabel className="text-lg font-semibold">Series</FileLabel>
                        </Folder>
                      </FolderHighlight>
                    </FolderTrigger>
                  </FolderHeader>

                  <div className="relative ml-8 before:absolute before:-left-3 before:inset-y-0 before:w-px before:h-full before:bg-white/20">
                    <FolderContent>
                      <FileHighlight>
                        <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => handleFileClick('breaking-bad')}>
                          <FileIcon><Tv className="size-4 text-slate-400" /></FileIcon>
                          <FileLabel className="text-md">Breaking Bad.md</FileLabel>
                        </File>
                      </FileHighlight>
                      <FileHighlight>
                        <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => handleFileClick('true-detective-s1')}>
                          <FileIcon><Tv className="size-4 text-slate-400" /></FileIcon>
                          <FileLabel className="text-md">True Detective S1.md</FileLabel>
                        </File>
                      </FileHighlight>
                    </FolderContent>
                  </div>
                </FolderItem>

                {/* 3. KLASÖR: MUSIC 🎸 */}
                <FolderItem value="music-dir">
                  <FolderHeader>
                    <FolderTrigger className="w-full text-start group mt-2 cursor-pointer">
                      <FolderHighlight>
                        <Folder className="flex items-center gap-2 p-2 group-hover:text-green-400 transition-colors">
                          <FolderIcon
                            closeIcon={<LucideFolderIcon className="size-5 text-green-500" />}
                            openIcon={<FolderOpenIcon className="size-5 text-green-400" />}
                          />
                          <FileLabel className="text-lg font-semibold">Music & Vibes</FileLabel>
                        </Folder>
                      </FolderHighlight>
                    </FolderTrigger>
                  </FolderHeader>

                  <div className="relative ml-8 before:absolute before:-left-3 before:inset-y-0 before:w-px before:h-full before:bg-white/20">
                    <FolderContent>
                      <FileHighlight>
                        <a
                          href="https://open.spotify.com/user/tevfikt?si=Jz7-OZb9TvS3wPj98HUszg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-row items-center gap-2 p-2 hover:text-green-400 transition-colors"
                        >
                          <FaSpotify className="size-7 text-green-500" />
                          <span className="flex-text-md font-medium tracking-wide">
                          Spotify Profilim
                          </span>
                        </a>
                      </FileHighlight>
                    </FolderContent>
                  </div>
                </FolderItem>

              </FilesHighlight>
            </Files>
          </div>
        </div>

        {/* SAĞ PANEL: SADECE BİR DOSYA SEÇİLİYSE RENDER EDİLİR */}
        {activeFile && (
          <div className="w-2/3 relative border border-white/20 rounded-xl bg-gray-900 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
            {/* Üst Çubuk ve Kapatma Butonu */}
            <div className="w-full h-10 bg-gray-800 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-300">
                  cat content/{activeFile}.md
                </span>
              </div>
              
              {/* ÇARPI (KAPATMA) BUTONU */}
              <button 
                onClick={handleClose} 
                className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Terminali Kapat"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="prose prose-invert prose-blue max-w-none">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}