import Link from 'next/link';
import { Icons } from '../icons/icons';
import { Discord, GitHub, Gmail, LinkedIn, X } from '../icons/AnimatedIcons';
import SkillModel from './skill/SkillModel';
import { Settings as Controls } from '@/lib/client/functions/settings';
import { GitHubAPI, GitHubType } from '@/lib/server/functions/github';
import { ProjectLists } from './project/ProjectLists';
import SpotifyComponent, {
  SpotifyComponentStatus,
} from './spotify/SpotifyComponent';
import Avatar3D from './3D-avatar';
import { getTotalVisits } from '@/lib/server/google/apis/search-analytics';
import { siteConfig } from '@/site-config';
import { SpotifySelfApi, SpotifyType } from '@/lib/server/functions/spotify';

export function HeroCard() {
  return (
    <div className="max-xl:w-full xl:min-w-[25%] flex flex-col justify-end items-center h-80 shadow-lg shadow-[#248F68] rounded-2xl gap-5 bg-[#248F68] text-white">
      <Avatar3D />
      <div className="flex flex-col gap-2 justify-center items-center mb-14">
        <h1 className="max-xl:text-3xl text-4xl font-semibold font-sans">
          {siteConfig.about.name}
        </h1>
        <span className="text-sm font-medium">{siteConfig.about.title}</span>
      </div>
    </div>
  );
}

export function Introduction() {
  return (
    <div
      id="introduction"
      className="flex flex-col w-full h-fit bg-muted text-muted-foreground rounded-2xl p-6 gap-2"
    >
      <h1 className="text-2xl font-semibold">Introduction</h1>
      <p className="text-foreground font-medium">
        {siteConfig.about.description}
      </p>
      <div className="w-full flex flex-row-reverse max-xl:justify-center">
        <a
          href="https://www.google.com/search?q=who+is+meer+tarbani"
          target="_blank"
          aria-label="Click here to Know More"
          className="flex items-center gap-1 text-foreground font-medium hover:text-ternary transition-all duration-300"
        >
          Know more <Icons.ChevronRight />
        </a>
      </div>
    </div>
  );
}

export function QuickLinks() {
  return (
    <div
      id="quick-links"
      className="flex flex-col w-full h-fit bg-ternary-foreground text-ternary rounded-2xl px-6 py-3 gap-3 justify-evenly"
    >
      <h1 className="text-2xl font-semibold">Quick Links</h1>
      <div className="w-full flex justify-between gap-5">
        <GitHub />
        <Gmail />
        <LinkedIn />
        <X />
        <Discord />
      </div>
    </div>
  );
}

export async function SpotifyCard() {
  const data: SpotifyType | undefined = await SpotifySelfApi('shuffle');
  if (!data)
    return (
      <SpotifyComponentStatus status="error" error={'Something went wrong!'} />
    );
  if (data) {
    return <SpotifyComponent props={data} />;
  }
}

export function Skills() {
  return (
    <div
      id="skills"
      className="flex flex-col max-h-44 rounded-2xl bg-ternary-foreground p-6"
    >
      <h1 className="text-3xl font-semibold text-ternary">Skills</h1>
      <div className="inline-flex lg:flex-wrap py-[0.6rem] overflow-x-scroll xl:overflow-hidden">
        {siteConfig.components.skills.map((skill, index) => (
          <SkillModel key={index} skill={skill.skill} />
        ))}
      </div>
    </div>
  );
}

export async function Settings() {
  const totalViews = (await getTotalVisits()) ?? 0;
  return <Controls totalViews={totalViews} />;
}

export async function Projects() {
  const data: GitHubType[] | Error = await GitHubAPI();
  if (data instanceof Error) {
    console.error(data);
    return null;
  }
  return (
    <div
      id="projects"
      className="max-xl:w-full flex flex-col bg-ternary-foreground w-1/3 max-h-[21.2rem] rounded-2xl pt-6 px-6 gap-5"
    >
      <h1 className="flex text-3xl font-semibold text-ternary items-center gap-1">
        Projects
      </h1>
      <div className="flex flex-col gap-3 overflow-hidden overflow-y-scroll">
        {data.map((project, index) => (
          <ProjectLists key={index} {...project} />
        ))}
      </div>
    </div>
  );
}

export function AllPages() {
  const pages = [
    { name: 'Blogs', href: '/blogs', implemented: true },
    { name: 'Chat', href: '/chat', implemented: true, id: 'chat' },
    { name: 'Events', href: '/events', implemented: true },
    { name: 'Experience', href: '/experience', implemented: true },
    { name: 'Projects', href: '/projects', implemented: true },
    { name: 'Credits', href: '/credits', implemented: true },
  ];

  return (
    <div
      id="pages"
      className="max-xl:w-full flex flex-col bg-ternary-foreground 2xl:w-[16.7%] xl:w-[16%] h-[21.2rem] rounded-2xl pt-6 px-6 gap-5"
    >
      <h1 className="text-3xl font-semibold text-ternary">Pages</h1>
      <div className="flex flex-col gap-1 overflow-hidden overflow-y-scroll">
        {pages.map((page, index) => (
          <div id={page.id} key={index} className="w-full border-b-2 flex p-2">
            <Link
              href={page.implemented ? page.href : '/'}
              passHref
              className="flex text-foreground font-medium hover:text-ternary transition-all duration-300"
            >
              {page.name}
              <Icons.ArrowUpRight className="h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
