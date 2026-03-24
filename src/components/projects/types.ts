export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  status: 'Tamamlandı' | 'Devam Ediyor' | 'Plan Aşamasında';
  images?: string[];
  downloadUrl?: string;
  repoUrl?: string;
}
