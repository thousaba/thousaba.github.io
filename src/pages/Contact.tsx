import { PageSkeleton } from "../components/Skeleton";
import { useEffect, useState } from "react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import DecryptedText from "../components/DecryptedText";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <PageSkeleton />; 
    return (
        
        <div className="pt-36 pb-12 px-8 max-w-2xl mx-auto text-white flex flex-col justify-start min-h-full">
            <header>
              <h1 className="text-5xl font-bold mb-6 drop-shadow-md">  
                <DecryptedText 
                  text="Contact" 
                  animateOn="view" 
                  revealDirection="start" 
                />
              </h1>
              <p className="text-xl text-slate-200 leading-relaxed mb-8">Hello I am Tevfik Türkoğlu<br></br> 
                Welcome to my personal website, where you can explore the projects I am currently developing and find insights regarding my professional and personal interests!</p>
            </header>

            {/* İkonların olduğu link barı */}
            <div className="flex items-center gap-6 mt-4">
                {/* GitHub */}
                <a 
                    href="https://github.com/thousaba" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300"
                >
                    <FaGithub size={36} />
                </a>

                {/* X (Twitter) */}
                <a 
                    href="https://x.com/thousaba" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300"
                >
                    <FaXTwitter size={36} />
                </a>

                {/* Gmail */}
                <a 
                    href="mailto:thousaba@gmail.com" 
                    className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300"
                >
                    <SiGmail size={36} />
                </a>
            </div>
        </div>
    )
}