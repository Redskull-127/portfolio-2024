"use client";

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  KBarProvider,
  ActionImpl,
  Action,
} from "kbar";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function KBarProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const action: Action[] = [
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["h"],
      keywords: "back",
      section: "Navigation",
      perform: () => router.push("/"),
      icon: <Home className="w-6 h-6 mx-3" />,
      subtitle: "Subtitles can help add more context.",
    },
  ];
  return (
    <KBarProvider actions={action}>
      <KBarPortal>
          <KBarPositioner className=" fixed flex justify-center w-full inset-0 p-8 box-border" style={{
            zIndex: 100000,
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 100+'%',
            height: 100+'%',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            inset: 0,
            padding: 8,
            boxSizing: "border-box",
          }}>
            <KBarAnimator>
                <div style={{
                    backgroundColor: "red",
                    height: 200+'px',
                    width: 200+'px',
                }}>

                    <KBarSearch />
                </div>
            </KBarAnimator>
          </KBarPositioner>
        
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
