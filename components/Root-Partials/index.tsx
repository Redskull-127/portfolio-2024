import Image from "next/image";
import Link from "next/link";

import { SpotifySelfApi, SpotifyType } from "@/lib/server/functions/spotify";
import { Icons } from "../icons/icons";
import { GitHub, Gmail, LinkedIn, X } from "../icons/AnimatedIcons";

import SkillsJson from "@/lib/static/skills.json";
import SkillModel from "./skill/SkillModel";

import { Settings as Controls } from "@/lib/client/functions/settings";
import { GitHubAPI, GitHubType } from "@/lib/server/functions/github";
import { ProjectLists } from "./project/ProjectLists";
import SpotifyComponent from "./spotify/SpotifyComponent";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export function HeroCard() {
  return (
    <div className="max-xl:w-full flex flex-col justify-center items-center h-80 shadow-lg shadow-[#248F68] rounded-2xl min-w-[25%] gap-5 bg-[#248F68] text-white">
      <Suspense
        fallback={<Skeleton className="w-[128px] h-[128px] rounded-full" />}
      >
        <div className="h-[128px] w-[128px] rounded-full bg-gradient-to-b from-[#feeeb8] to-[#fde89b]">
          <Image
            src="/static/svg/hero.png"
            width={128}
            className="animate-fade-in transform absolute"
            height={128}
            quality={100}
            alt="Meer Tarbani"
          />
        </div>
      </Suspense>
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="max-xl:text-3xl text-4xl font-semibold font-sans">
          Meer Tarbani
        </h1>
        <span className="text-sm">Full Stack Web Developer</span>
      </div>
    </div>
  );
}

export function Introduction() {
  return (
    <div className="flex flex-col h-fit w-full bg-muted text-muted-foreground rounded-2xl p-6 gap-2">
      <h1 className="text-2xl font-semibold">Introduction</h1>
      <p className="text-foreground font-medium">
        Hey, I&apos;m Meer. GDSC Lead &apos;22, Organizer of Hack For India &
        GDSC WoW &apos;22, Ex Flipkart SCOA Intern & Gao Tech Support Intern!
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
    <div className="flex flex-col h-auto w-full bg-ternary-foreground text-ternary rounded-2xl px-6 py-3 gap-3 justify-evenly">
      <h1 className="text-2xl font-semibold">Quick Links</h1>
      <div className="w-full flex justify-between gap-5">
        <GitHub />
        <Gmail />
        <LinkedIn />
        <X />
      </div>
    </div>
  );
}

export async function SpotifyCard() {
  const data: SpotifyType | Error | undefined = await SpotifySelfApi();
  if (data instanceof Error) {
    console.error(data);
    return null;
  }
  
  if (data) {
    return <SpotifyComponent {...data} />;
  }
}

export function Skills() {
  return (
    <div className=" flex flex-col h-fit rounded-2xl bg-ternary-foreground p-6">
      <h1 className="text-3xl font-semibold text-ternary">Skills</h1>
      <div className="flex flex-wrap py-3">
        {SkillsJson.map((skill, index) => (
          <SkillModel key={index} skill={skill.skill} />
        ))}
      </div>
    </div>
  );
}

export function Settings() {
  return <Controls />;
}

export async function Projects() {
  const data: GitHubType[] | Error = await GitHubAPI();
  if (data instanceof Error) {
    console.error(data);
    return null;
  }
  return (
    <div className="max-xl:w-full flex flex-col bg-ternary-foreground w-1/3 h-[21.2rem] rounded-2xl pt-6 px-6 gap-5">
      <h1 className="flex text-3xl font-semibold text-ternary items-center gap-1">
        Projects 
      </h1>
      <div className="flex flex-col gap-3 overflow-hidden overflow-y-scroll">
        {data.map((project, index) => {
          return <ProjectLists key={index} {...project} />;
        })}
      </div>
    </div>
  );
}

export function AllPages() {
  const Pages = [
    {
      name: "Blogs",
      href: "/blogs",
      implemented: true,
    },
    {
      name: "Chat",
      href: "/chat",
      implemented: true,
    },
    {
      name: "Events",
      href: "/events",
      implemented: true,
    },
    {
      name: "Projects",
      href: "/projects",
      implemented: true,
    },
    {
      name: "Credits",
      href: "/credits",
      implemented: true,
    },
  ];
  return (
    <div className="max-xl:w-full flex flex-col bg-ternary-foreground w-[16.7%] h-[21.2rem] rounded-2xl pt-6 px-6 gap-5">
      <h1 className="text-3xl font-semibold text-ternary">Pages</h1>
      <div className="flex flex-col gap-1 overflow-hidden overflow-y-scroll">
        {Pages.map((page, index) => {
          return (
            <div key={index} className="w-full border-b-2 flex p-2">
              <Link
                href={page.implemented === true ? page.href : "/"}
                passHref={true}
                className="flex text-foreground font-medium hover:text-ternary transition-all duration-300"
              >
                {page.name}
                <Icons.ArrowUpRight className="h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
