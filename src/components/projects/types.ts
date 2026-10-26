export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  topics: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  images?: string[];
  downloadUrl?: string;
  repoUrl?: string;
  readmeUrl?: string;
}
