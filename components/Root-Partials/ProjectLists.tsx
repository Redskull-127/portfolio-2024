'use client'
import Link from "next/link";

import { GitHubType } from "@/lib/server/functions/github";
import { Github, Link as LinkIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ProjectLists(props: GitHubType) {
    return <div className="flex justify-between w-full border-b-2 py-2">
        <div className="flex flex-col justify-center items-start gap-2 w-1/2">
            <h1 className="inline-flex w-fit text-md font-semibold">{props.name}</h1>
            <p className="text-sm text-foreground w-fit whitespace-nowrap text-ellipsis overflow-hidden">{props.description}</p>
        </div>
        <div className="flex flex-row-reverse gap-2 max-md:items-end">
            {props.homepage != null ? <Link href={props.homepage} aria-label={props.name} target="_blank">
                <Button variant={"default"} size={'icon'}>
                    <LinkIcon size={24} />
                </Button>
            </Link> : null}
            <Link href={props.html_url} aria-label={props.name} target="_blank">
                <Button variant={"default"} size={'icon'}>
                    <Github size={24} />
                </Button>
            </Link>
        </div>
    </div>
}