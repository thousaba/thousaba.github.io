import { useState, useEffect } from "react";
import { ProjectsSkeleton } from "../components/Skeleton";
import type { Project } from "../components/projects/types";
import ProjectList from "../components/projects/ProjectList";
import ProjectDetail from "../components/projects/ProjectDetail";
import ImageLightbox from "../components/projects/ImageLightbox";
import { projectsData } from "../data/ProjectList";


export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project>(projectsData[0]);
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
      <div className="pt-20 md:pt-32 pb-12 px-4 max-w-7xl mx-auto min-h-[85vh] flex flex-col md:flex-row gap-4 md:gap-8 relative z-10">
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

      {selectedImage && (
        <ImageLightbox
          images={selectedProject.images ?? [selectedImage]}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
