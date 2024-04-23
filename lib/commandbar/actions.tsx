"use client";

import { cn } from "../utils";
import { ActionType } from "./commandbar";

export function ListGenerator(project: ActionType) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-5 w-full bg-slate-800 rounded-lg transition duration-200 ease-in-out ",
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
      <pre className="flex justify-center items-center p-2 gap-3">
        {project.shortcut.map((key, index) => (
          <span
            key={index}
            className="text-sm font-bold p-2 bg-[#1F2937] border-[5px]"
          >
            {key}
          </span>
        ))}
      </pre>
    </div>
  );
}
