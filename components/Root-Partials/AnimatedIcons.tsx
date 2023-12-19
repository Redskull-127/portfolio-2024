"use client";
import Link from "next/link";
import { LottieAnimationPlayer } from "@/lib/lottie/player";

import GmailJson from "@/public/static/lottie/gmail.json";
import GitHubJson from "@/public/static/lottie/github.json";
import LinkedInJson from "@/public/static/lottie/linkedin.json";
import XJson from "@/public/static/lottie/x.json";

export function Gmail() {
  return (
    <Link aria-label="Send mail to me" href={'mailto:redskull@duck.com'} target="_blank" className="flex w-full justify-evenly">
      <LottieAnimationPlayer JSON={GmailJson} classes="h-16" />
    </Link>
  );
}

export function GitHub() {
    return (
        <Link aria-label="Meer Tarbani's Github" href={'https://github.com/redskull-127'} target="_blank" className="flex w-full justify-evenly">
        <LottieAnimationPlayer JSON={GitHubJson} classes="h-16" />
        </Link>
    );
}

export function LinkedIn() {
    return (
        <Link aria-label="Meer Tarbani's LinkedIn" href={'https://www.linkedin.com/in/meertarbani'} target="_blank" className="flex w-full justify-evenly">
        <LottieAnimationPlayer JSON={LinkedInJson} classes="h-16" />
        </Link>
    );
}

export function X() {
    return (
        <Link aria-label="Meer Tarbani's X (Twitter)" href={'https://twitter.com/meertarbani'} target="_blank" className="flex w-full justify-evenly">
        <LottieAnimationPlayer JSON={XJson} classes="h-16" />
        </Link>
    );
}