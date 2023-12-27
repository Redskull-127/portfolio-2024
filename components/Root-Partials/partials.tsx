import Image from "next/image";
import Link from "next/link";

import { Spotify, SpotifyType } from "@/lib/server/functions/spotify";

import { Icons } from "../icons";
import { GitHub, Gmail, LinkedIn, X } from "./AnimatedIcons";

import SkillsJson from "@/lib/static/skills.json";
import SkillModel from "./SkillModel";

import { Support } from "@/lib/client/functions/support";
import { GitHubAPI, GitHubType } from "@/lib/server/functions/github";
import { ProjectLists } from "./ProjectLists";
import { ProjectDialog } from "../Dialogs/ProjectDialog";
import SpotifyComponent from "./SpotifyComponent";

export function HeroCard() {
  return (
    <div className="max-md:w-full flex flex-col justify-center items-center h-80 shadow-lg shadow-[#248F68] rounded-2xl min-w-[25%] gap-5 bg-[#248F68] text-white">
      <Image
        src="/static/svg/hero.svg"
        width={128}
        height={128}
        alt="Meer Tarbani"
      />
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="max-md:text-3xl text-4xl font-semibold font-sans">
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
        Hey, I&apos;m Meer. GDSC Lead &apos;22, Organizer of Hack For India & GDSC
        WoW &apos;22, Ex Flipkart SCOA Intern & Gao Tech Support Intern!
      </p>
      <div className="w-full flex flex-row-reverse max-md:justify-center">
        <button
          aria-label="Click here to Know More"
          className="hover:text-white transition-all duration-300 flex justify-center items-center gap-1 bg-muted-foreground text-foreground py-1 px-4 rounded-lg font-medium active:scale-95"
        >
          Know more <Icons.ChevronRight />
        </button>
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
    const data : SpotifyType | undefined = await Spotify();
    if (data) {
      return <SpotifyComponent {...data} />
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
  return <Support />;
}

export async function Projects() {
  const data: GitHubType[] | Error = await GitHubAPI();
  if (data instanceof Error) {
    console.error(data);
    return null;
  }
  return (
    <div className="max-md:w-full flex flex-col bg-ternary-foreground w-1/3 h-[21.2rem] rounded-2xl pt-6 px-6 gap-5">
      <h1 className="flex text-3xl font-semibold text-ternary items-center gap-1">
        Projects <ProjectDialog projects={data} />
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
      name: "About",
      href: "/about",
      implemented: false,
    },
    {
      name: "Blogs",
      href: "/blogs",
      implemented: false,
    },
    {
      name: "Chat",
      href: "/chat",
      implemented: true,
    },
    {
      name: "Events",
      href: "/events",
      implemented: false,
    },
    {
      name: "Projects",
      href: "/projects",
      implemented: true,
    },
  ];
  return (
    <div className="max-md:w-full flex flex-col bg-ternary-foreground w-[16.7%] h-[21.2rem] rounded-2xl pt-6 px-6 gap-5">
      <h1 className="text-3xl font-semibold text-ternary">Pages</h1>
      <div className="flex flex-col gap-1 overflow-hidden overflow-y-scroll">
        {Pages.map((page, index) => {
          return (
            <div key={index} className="w-full border-b-2 flex p-2">
              <Link
                href={page.implemented === true ? page.href : '/'}
                passHref={true}
                className="flex text-foreground font-medium hover:text-black transition-all duration-300"
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

export function Footer() {
  return (
    <footer className="w-full h-fit text-center">
      <p className="font-medium">
        Developed by <Link href={"/"}>Meer Tarbani</Link> and Designed by{" "}
        <Link href={"https://vikasassudani.in"} target="_blank">
          Vikas Assudani
        </Link>{" "}
        💚
      </p>
    </footer>
  );
}
