import type { Project } from "../components/projects/types";

export const projectsData: Project[] = [
  
  {
    id: 1,
    title: "Portfolio",
    category: "Web Development",
    description: "The personal website you're currently viewing, designed with modern web technologies and 'clean UI' principles.",
    topics: ["React", "Tailwind CSS", "Vite"],
    status: "Completed"
  },
  {
    id: 2,
    title: "Football Card",
    category: "Mobile Game for Android",
    description: "A football card game built with React Native, aiming to become a staple for hanging out with friends. Beat your opponents with football-themed cards across a variety of fun modes! Play the classic Pisti mode or the Uno mode. There's even a Memory mode for a bit of brain exercise with matching cards!",
    topics: ["React Native", "TypeScript", "Kotlin"],
    status: "Completed",
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
    topics: ["React", "Redux Toolkit", "Vite", "Axios"],
    status: "Completed",
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
    description: "Detection engineering lab: MITRE ATT&CK detections built and validated on real telemetry across Splunk (RBA) and Microsoft Sentinel (KQL), with writeups.",
    topics: ["Detection Engineering", "Log Analysis", "Splunk", "Sentinel", "React", "TypeScript", "Windows", "Regex",],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/wazuh-project",
    readmeUrl: "/Sentryfy-docs.md"
  },
  {
    id: 5,
    title: "SignalParse",
    category: "Cybersecurity",
    description: "SignalParse is a CLI tool that streams Apache and Nginx access logs, parses them into structured events, and detects common web attacks (SQL Injection, XSS, brute force, path traversal) using a modular signature engine â€” all with constant memory usage, regardless of file size.",
    topics: ["TypeScript", "Node.js", "Commander", "Regex"],
    status: "Completed",
    repoUrl: "https://github.com/thousaba/SignalParse",
    readmeUrl: "/SignalParse.md"
  },
  {
    id: 6,
    title: "NetScanner",
    category: "Cybersecurity",
    description: "A lightweight, terminal-based local network discovery tool built with Python & Scapy. Finds devices on your LAN, identifies open ports, grabs service banners, guesses operating systems via TTL fingerprinting, and resolves vendor names from MAC addresses â€” all from a single command. ",
    topics: ["Python", "Scapy", "Rich"],
    status: "Completed",
    repoUrl: "https://github.com/thousaba/NetScanner",
    readmeUrl: "/NetScanner.md"
  },
  {
    id: 7,
    title: "Beacon Hunter",
    category: "Cybersecurity",
    description: "`beacon-hunter` is an offline PCAP/PCAPNG analysis prototype that ranks network traffic patterns for review. It looks for repeated timing and payload-size patterns that can occur in C2 beaconing. A result is a **heuristic investigation lead**, not proof of malware or a calibrated probability.",
    topics: ["Python", "Beacon", "C2", "Jitter", "PCAP Analyzer"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/beacon_hunter",
    readmeUrl: "/BeaconHunter.md"
  },
  {
    id: 8,
    title: "Network Lab",
    category: "Cybersecurity",
    description: "Real-time Suricata IDS network traffic monitoring dashboard and threat alerting system integrated with Python, React, TypeScript, and Telegram Bot API ",
    topics: ["Suricata", "Splunk", "Zeek", "Python", "React", "TypeScript", "Wireshark", "Network"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/network_lab",
    readmeUrl: "/NetworkLab.md"
  },
  {
    id: 9,
    title: "Windows Event Normalizer",
    category: "Cybersecurity",
    description: "Normalizes Windows Security & Sysmon events (EVTX) into Microsoft Defender and ASIM schemas â€” driven by declarative JSON mappings, not code ",
    topics: ["Python", "EVTX", "JSON", "Regex", "SPL", "KQL", "ASIM"],
    status: "Completed",
    repoUrl: "https://github.com/thousaba/windows-event-normalizer",
    readmeUrl: "/WindowsEventNormalizer.md"
  },
  {
    id: 10,
    title: "Windows API Lab",
    category: "Cybersecurity",
    description: "Hands-on Windows API labs exploring process handles, access rights, virtual memory, and Windows internals from a detection engineering perspective.",
    topics: ["C", "Windows API", "Windows Internals", "Malware Analysis",  "Assembly", "x64dbg", "Reverse Engineering"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/windows_api_lab",
    readmeUrl: "/windows_api_lab.md"
  },
  {
    id: 11,
    title: "WAF Detection Lab",
    category: "Cybersecurity",
    description: "WAF (ModSecurity+CRS) + Splunk detection lab against a deliberately vulnerable internal app â€” coverage testing, blind-spot analysis, and alerting.",
    topics: ["Python", "Network Security", "Burp Suite", "WAF","CRS","ModSecurity", "SQL Injection", "XSS", "Path Traversal","IDOR","Splunk","Flask"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/waf_detection_lab",
    readmeUrl: "/waf-detection-lab.md"
  },
  {
    id: 12,
    title: "PE Info Parser",
    category: "Cybersecurity",
    description: "A small, dependency-free C tool for the first pass of static PE (Windows executable) triage. pe-info-parser.c is a single file that parses the PE structures by hand â€” no windows.h, no third-party libraries â€” so it builds with any C99 compiler on Windows or Linux",
    topics: ["C", "Binary Analysis", "Malware Analysis", "PE Parser", "PE Analysis", "Reverse Engineering"],
    status: "Completed",
    repoUrl: "https://github.com/thousaba/pe-info-parser",
    readmeUrl: "/pe-info-parser.md"
  },
  {
    id: 13,
    title: "Security Team Dashboard",
    category: "Web Development",
    description: "Security team management panel built with Laravel API and React: role-based access, user management, notifications and real-time group chat (Laravel Reverb WebSockets).",
    topics: ["PHP", "Laravel", "React", "JavaScript", "Laravel-Reverb", "WebSocket", "PostgreSQL", "CSS", "Artisan"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/security-team-dashboard",
    readmeUrl: "/sec-team-dashboard.md"
  },
  {
    id: 14,
    title: "DLL Watch",
    category: "Cybersecurity",
    description: "DLL Watch is a Windows command-line tool written in C for inspecting processes, listing loaded modules, and monitoring successful DLL load events in real time through ETW.",
    topics: ["C", "DLL", "Process Monitoring", "Windows", "Threat Hunting"],
    status: "In Progress",
    repoUrl: "https://github.com/thousaba/dll-watch",
    readmeUrl: "/dll-watch.md"
  },
];
