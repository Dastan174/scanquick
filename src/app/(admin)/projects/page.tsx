import ProjectsList from '@/widgets/projectsList/ProjectsList';
import { listMyProjects } from '@/shared/lib/supabase/projects';

export default async function ProjectsPage() {
  const projects = await listMyProjects();
  return <ProjectsList projects={projects} />;
}
