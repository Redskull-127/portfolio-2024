"use client";
import { useState, useRef, useEffect } from "react";

import { GitHubType } from "@/lib/server/functions/github";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { ProjectLists } from "../Root-Partials/project/ProjectLists";
import { useRouter } from "next/navigation";

type PropsType = {
  projects: GitHubType[];
};

export function ProjectDialog(props: PropsType) {
  const [providerList, setProviderList] = useState(props.projects);
  const [filteredList, setFilteredList] = useState(props.projects);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.replace("/");
        }
      }}
    >
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
                    }),
                  );
                }
              }}
            />
            <div className="flex flex-col gap-3 overflow-hidden max-w-full">
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
