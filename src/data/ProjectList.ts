import type { Project } from "../components/projects/types";

export const projectsData: Project[] = [
  
  {
    id: 1,
    title: "Portfolio V2",
    category: "Web Development",
    description: "Şu an incelediğin, modern web teknolojileri ve 'clean UI' prensipleriyle tasarlanmış kişisel web sitesi.",
    techStack: ["React", "Tailwind CSS", "Vite"],
    status: "Tamamlandı"
  },
  {
    id: 2,
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
  {
    id: 4,
    title: "Sentryfy",
    category: "Cybersecurity",
    description: "Windows agent üzerinden Wazuh ile log toplayan, özel kurallarla alert üreten, Telegram bildirimi gönderen ve canlı React dashboard'u olan bir güvenlik izleme projesi.",
    techStack: ["Wazuh", "React", "TypeScript", "Vite", "Axios", "Regex", "Telegram Bot API", "Socket.IO", "Splunk", "Sigma"],
    status: "Devam Ediyor",
    repoUrl: "https://github.com/thousaba/wazuh-project",
    readmeUrl: "/Sentryfy.md"
  },
  {
    id: 5,
    title: "SignalParse",
    category: "Cybersecurity",
    description: "SignalParse is a CLI tool that streams Apache and Nginx access logs, parses them into structured events, and detects common web attacks (SQL Injection, XSS, brute force, path traversal) using a modular signature engine — all with constant memory usage, regardless of file size.",
    techStack: ["TypeScript", "Node.js", "Commander", "Regex"],
    status: "Tamamlandı",
    repoUrl: "https://github.com/thousaba/SignalParse",
    readmeUrl: "/SignalParse.md"
  },
  
];