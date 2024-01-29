"use client";

// import styles from "@/lib/static/command.module.css";
import { cn } from "../utils";
import { ActionType } from "./commandbar";


export function ListGenerator(project: ActionType) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-5 w-full bg-slate-800 rounded-lg transition duration-200 ease-in-out ",
        // styles.dialog_item
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
            style={{
              backgroundColor: "#1F2937",
              borderRadius: "5px",
            }}
            className="text-sm font-bold p-2"
          >
            {key}
          </span>
        ))}
      </pre>
    </div>
  );
}
