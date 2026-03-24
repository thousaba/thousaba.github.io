import { useState, useEffect } from 'react';
import { BlogSkeleton } from '../components/Skeleton';
import DecryptedText from '../components/DecryptedText';
import FileTreePanel from '../components/blog/FileTreePanel';
import ContentViewer from '../components/blog/ContentViewer';

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

      <div className="flex flex-row gap-6 h-650px w-full justify-center">
        <FileTreePanel activeFile={activeFile} onFileClick={handleFileClick} />
        {activeFile && (
          <ContentViewer
            activeFile={activeFile}
            content={content}
            onClose={handleClose}
          />
        )}
      </div>

    </div>
  );
}
