import { useState, useEffect } from 'react';
import { BlogSkeleton } from '../components/Skeleton';
import DecryptedText from '../components/DecryptedText';
import FileTreePanel from '../components/blog/FileTreePanel';
import ContentViewer from '../components/blog/ContentViewer';
import { postDates } from '../data/posts';

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <BlogSkeleton />;

  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName);
    setContent(`> ${fileName}.md yükleniyor...`);

    fetch(`/content/${fileName}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Dosya bulunamadı");
        return res.text();
      })
      .then((text) => setContent(text))
      .catch(() => setContent(`### ⚠️ Hata\n\n\`/public/content/${fileName}.md\` bulunamadı.`));
  };

  const handleClose = () => {
    setActiveFile(null);
    setContent("");
  };

  return (
    <div className="pt-24 md:pt-36 pb-12 px-4 md:px-8 max-w-7xl mx-auto text-white min-h-full flex flex-col justify-start">

      <header className="mb-8 md:mb-12 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
          <DecryptedText
            text="Cinephile & Archives"
            animateOn="view"
            revealDirection="start"
          />
        </h1>
        <p className="text-base md:text-xl text-slate-300 max-w-2xl">
          My personal repository of reviews, thoughts, and deep dives. Explore the directories below.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full justify-center md:h-162.5">
        <FileTreePanel activeFile={activeFile} onFileClick={handleFileClick} />
        {activeFile && (
          <ContentViewer
            activeFile={activeFile}
            content={content}
            date={postDates[activeFile]}
            onClose={handleClose}
          />
        )}
      </div>

    </div>
  );
}
