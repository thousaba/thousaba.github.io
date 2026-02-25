import { useNavigate } from 'react-router-dom';
import CircularGallery from '../components/CircularGallery'
import { GallerySkeleton } from '../components/Skeleton';
import { useEffect, useState } from 'react';


export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  const myCards = [
    { image: "src/assets/publications.jpg", text: 'Projects', link: '/projects' },
    { image: "src/assets/blog.jpg", text: 'Blog', link: '/blog' },
    { image: "src/assets/contact.jpg", text: 'Contact', link: '/contact' },
  ]

  const handleCardClick = (clickedItem: any) => {
    navigate(clickedItem.link); 
  };

  return (
    <div className="w-screen h-screen bg-transparent relative">
      {isLoading ? <GallerySkeleton /> : <CircularGallery items={myCards} bend={3} onItemClick={handleCardClick} />} 
    </div>
  )
}