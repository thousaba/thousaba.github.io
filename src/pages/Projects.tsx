import { useState, useEffect } from "react";
import { ProjectsSkeleton } from "../components/Skeleton";
import type { Project } from "../components/projects/types";
import ProjectList from "../components/projects/ProjectList";
import ProjectDetail from "../components/projects/ProjectDetail";
import ImageLightbox from "../components/projects/ImageLightbox";

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
  {
    id: 3,
    title: "E-Commerce",
    category: "Web Development",
    description: "A modern e-commerce web application built with React, TypeScript, and Redux Toolkit. The app fetches product data from the Fake Store API and provides a full shopping experience including product browsing, search, product details, and a shopping cart.",
    techStack: ["React", "Redux Toolkit", "Vite", "Axios"],
    status: "Tamamlandı",
    images: [
      "/e-commerce/commerce-1.png",
      "/e-commerce/commerce-2.png",
      "/e-commerce/commerce-3.png",
      "/e-commerce/commerce-4.png"
    ],
    repoUrl: "https://github.com/thousaba/e-commerce"
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project>(projectsData[1]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

  if (isLoading) return <ProjectsSkeleton />;

  const handleNext = () => {
    if (!selectedProject.images || !selectedImage) return;
    const i = selectedProject.images.indexOf(selectedImage);
    setSelectedImage(selectedProject.images[(i + 1) % selectedProject.images.length]);
  };

  const handlePrev = () => {
    if (!selectedProject.images || !selectedImage) return;
    const i = selectedProject.images.indexOf(selectedImage);
    setSelectedImage(selectedProject.images[(i - 1 + selectedProject.images.length) % selectedProject.images.length]);
  };

  return (
    <>
      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto min-h-[85vh] flex flex-col md:flex-row gap-8 relative z-10">
        <ProjectList
          projects={projectsData}
          selectedId={selectedProject.id}
          onSelect={setSelectedProject}
        />
        <ProjectDetail
          project={selectedProject}
          onImageClick={setSelectedImage}
        />
      </div>

      {selectedImage && selectedProject.images && (
        <ImageLightbox
          images={selectedProject.images}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
