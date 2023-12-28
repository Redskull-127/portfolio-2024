"use client";
import { useState, useRef, useEffect } from "react";

import { GitHubType } from "@/lib/server/functions/github";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { ProjectLists } from "../Root-Partials/ProjectLists";
import { useRouter } from "next/navigation";
import { ProjectSignal } from "@/lib/signals/signal";

type PropsType = {
  projects: GitHubType[];
};

export function ProjectDialog(props: PropsType) {
  const [providerList, setProviderList] = useState(props.projects);
  const [filteredList, setFilteredList] = useState(props.projects);
  const dialogeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (document.getElementById("project-btn") !== null) {
      ProjectSignal.value = document.getElementById(
        "project-btn"
      ) as HTMLButtonElement;
    }
  }, []);

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.replace("/");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          id="project-btn"
          ref={dialogeRef}
          variant={"ghost"}
          size={"icon"}
        >
          <Icons.Search />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Projects</DialogTitle>
          <DialogDescription className="max-h-96 overflow-hidden overflow-y-scroll">
            <Input
              type="search"
              className="my-5 active:outline-0"
              placeholder="search"
              onChange={(e) => {
                const query = e.target.value;
                if (query === "") {
                  setFilteredList(providerList);
                } else {
                  setFilteredList(
                    providerList.filter((item: any) => {
                      return item.name
                        .toLowerCase()
                        .includes(query.toLowerCase());
                    })
                  );
                }
              }}
            />
            <div className="flex flex-col gap-3 ">
              {filteredList &&
                filteredList.map((project, index) => (
                  <ProjectLists key={index} {...project} />
                ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
