import { ProjectDialog } from '@/components/Dialogs/ProjectDialog';
import { GitHubAPI, GitHubType } from '@/lib/server/functions/github';

export const revalidate = 0;

export default async function Home() {
  const data: GitHubType[] | Error = await GitHubAPI();
  if (data instanceof Error || data === null) {
    console.error(data);
    return null;
  }
  return <ProjectDialog projects={data} />;
}
