import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Aurora from './components/Aurora'; 
import HomePage from './pages/HomePage'; 
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import { AvatarGroup } from './components/animate-ui/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from "./components/avatar";
import  LoadingScreen  from './components/LoadingScreen';
import NotFound from './components/NotFound';


const AVATARS = [
  { src: "public/images/thousaba.jpg", fallback: "TT" },
]


function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    },1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }



  return (
    <HashRouter>
      <div className="relative w-screen h-screen overflow-hidden">        
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Aurora />
        </div>
        <div className="absolute top-8 left-8 z-[60]">
          <Link to="/" className="flex flex-row items-center gap-4 group cursor-pointer">
            <AvatarGroup className="h-16 -space-x-5">
              {AVATARS.map((avatar, index) => (
                <Avatar key={index} className="w-16 h-16 border-2 border-black group-hover:scale-110 group-hover:z-10 transition-transform duration-300 shadow-lg">
                  <AvatarImage src={avatar.src} />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <span className="font-['Dancing_Script'] text-5xl text-white drop-shadow-lg whitespace-nowrap group-hover:text-slate-300 transition-colors duration-300">
              Tevfik Türkoğlu
            </span>
          </Link>
        </div>

        <div className="relative z-10 w-full h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App;