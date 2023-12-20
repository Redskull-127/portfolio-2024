"use client";

import { FolderGit2, Home, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatedList } from "react-animated-list";
import styles from "@/lib/static/command.module.css";
import { cn } from "../utils";

export type ActionType = {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  section: string;
  perform: () => void;
  icon: JSX.Element;
  subtitle: string;
};

export default function Actions() {
  const router = useRouter();
  const action: ActionType[] = [
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["h"],
      keywords: "back",
      section: "Navigation",
      perform: () => router.push("/"),
      icon: <Home className="w-6 h-6 mx-3" />,
      subtitle: "Go to home.",
    },
    {
      id: "projectsAction",
      name: "Projects",
      shortcut: ["p"],
      keywords: "projects",
      section: "Navigation",
      perform: () => router.push("/projects"),
      icon: <FolderGit2 className="w-6 h-6 mx-3" />,
      subtitle: "Go to project section.",
    },
  ];
  return (
    <>
      <AnimatedList animation={"fade"}>
        {action &&
          action.map((project, index) => (
            <ListGenerator {...project} key={index} />
          ))}
      </AnimatedList>
    </>
  );
}

function ListGenerator(project: ActionType) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-5 w-full bg-slate-800 rounded-lg transition duration-200 ease-in-out ",
        styles.dialog_item
      )}
    >
      <div
        onClick={() => project.perform()}
        className={"flex flex-col cursor-pointer w-full p-2"}
      >
        <span className="inline-flex gap-2 text-lg font-bold">
          {project.icon} {project.name}
        </span>
        <span className="text-sm">{project.subtitle}</span>
      </div>
      <pre className="flex justify-center items-center p-2 bg-slate-400">
        <code>{project.shortcut}</code>
      </pre>
    </div>
  );
}
