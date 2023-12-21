import Image from "next/image";
import Link from "next/link";

import { Spotify, SpotifyType } from "@/lib/server/functions/spotify";

import { Icons } from "../icons";
import { GitHub, Gmail, LinkedIn, X } from "./AnimatedIcons";
import AudioButton from "./Audio";

import SkillsJson from "@/lib/static/skills.json";
import SkillModel from "./SkillModel";

import { Support } from "@/lib/client/functions/support";
import { GitHubAPI, GitHubType } from "@/lib/server/functions/github";
import { ProjectLists } from "./ProjectLists";
import { ProjectDialog } from "../Dialogs/ProjectDialog";
import SpotifyImage from "./Spotify-image";

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
        <span className="text-sm">Multi-Disciplinary Developer</span>
      </div>
    </div>
  );
}

export function Introduction() {
  return (
    <div className="flex flex-col h-fit w-full bg-muted text-muted-foreground rounded-2xl p-6 gap-2">
      <h1 className="text-2xl font-semibold">Introduction</h1>
      <p className="text-foreground font-medium">
        Hey, I&apos;m Meer. GDSC Lead at Silver Oak University Organizer of GDSC
        WoW Gujarat, Ex Flipkart SCOA Intern & Gao Tech Support Intern!
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
  const data: SpotifyType | Error = await Spotify();

  if (data instanceof Error) {
    console.error(data);
    return null;
  }
  if (!data)
    return (
      <div className="flex w-full justify-center">
        <h1 className="text-2xl font-semibold text-ternary">Loading...</h1>
      </div>
    );
  return (
    <div className="max-md:w-full max-md:h-fit flex flex-col justify-between h-80 rounded-2xl w-[25%] gap-5 bg-ternary-foreground p-6">
      <Link
        href={
          "https://open.spotify.com/user/to6rms2g0fzerpkwox1k4v33w?si=073ce2543fff42db"
        }
        target="_blank"
        className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground"
      >
        Spotify <Icons.ArrowUpRight />
      </Link>
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <SpotifyImage url={String(data.images[1].url)} />
        <h1 className="text-lg font-semibold text-center overflow-hidden w-full h-14 truncate">
          {data.name} - <span className="text-opacity-50">{data?.artist}</span>
        </h1>
      </div>
      <div className="w-full flex justify-center">
        <AudioButton AudioSRC={data.preview_url} name={data.name} />
      </div>
    </div>
  );
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
    },
    {
      name: "Blogs",
      href: "/blogs",
    },
    {
      name: "Events",
      href: "/events",
    },
    {
      name: "Projects",
      href: "/projects",
    },
  ];
  return (
    <div className="max-md:w-full flex flex-col bg-ternary-foreground w-[16.7%] h-[21.2rem] rounded-2xl pt-6 px-6 gap-5">
      <h1 className="text-3xl font-semibold text-ternary">Pages</h1>
      <div className="flex flex-col gap-3 overflow-hidden overflow-y-scroll">
        {Pages.map((page, index) => {
          return (
            <div key={index} className="w-full border-b-2 flex p-2">
              <Link
                href={page.href}
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
