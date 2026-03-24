import {
  File, FileHighlight, FileIcon, FileLabel, Files, FilesHighlight,
  Folder, FolderContent, FolderHeader, FolderHighlight, FolderIcon,
  FolderItem, FolderTrigger,
} from '@/components/animate-ui/primitives/radix/files';
import {
  FolderOpenIcon, FolderIcon as LucideFolderIcon,
  Film, Tv,
} from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { SiLetterboxd } from 'react-icons/si';

interface FileTreePanelProps {
  activeFile: string | null;
  onFileClick: (fileName: string) => void;
}

export default function FileTreePanel({ activeFile, onFileClick }: FileTreePanelProps) {
  return (
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

            {/* MOVIES */}
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
                    <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onFileClick('Interstellar')}>
                      <FileIcon><Film className="size-4 text-slate-400" /></FileIcon>
                      <FileLabel className="text-md">Interstellar</FileLabel>
                    </File>
                  </FileHighlight>
                  <FileHighlight>
                    <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onFileClick('sunset-limited')}>
                      <FileIcon><Film className="size-4 text-slate-400" /></FileIcon>
                      <FileLabel className="text-md">Sunset Limited</FileLabel>
                    </File>
                  </FileHighlight>
                </FolderContent>
              </div>
            </FolderItem>

            {/* SERIES */}
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
                    <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => onFileClick('breaking-bad')}>
                      <FileIcon><Tv className="size-4 text-slate-400" /></FileIcon>
                      <FileLabel className="text-md">Breaking Bad.md</FileLabel>
                    </File>
                  </FileHighlight>
                  <FileHighlight>
                    <File className="flex items-center gap-2 p-2 cursor-pointer hover:text-purple-300 transition-colors" onClick={() => onFileClick('true-detective-s1')}>
                      <FileIcon><Tv className="size-4 text-slate-400" /></FileIcon>
                      <FileLabel className="text-md">True Detective S1.md</FileLabel>
                    </File>
                  </FileHighlight>
                </FolderContent>
              </div>
            </FolderItem>

            {/* MUSIC */}
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
  );
}
