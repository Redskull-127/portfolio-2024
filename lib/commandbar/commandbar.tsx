"use client";

import { useRouter } from "next/navigation";
import {
  SetStateAction,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  useState,
} from "react";

import { Home, FolderGit2, SunMoon } from "lucide-react";
import { AnimatedList } from "react-animated-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/Theme/ThemeToggler";

interface CommandBarState {
  shouldShow: boolean;
  setShouldShow: Dispatch<SetStateAction<boolean>>;
}

export default function CommandBar() {
  const {shouldShow,setShouldShow} = useCommandBarContext()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        console.log(shouldShow);
        e.preventDefault();
        e.stopPropagation();
        setShouldShow(!shouldShow)
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldShow, setShouldShow]);

  return (
    <Dialog
      open={shouldShow}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setShouldShow(false); 
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Command Bar</DialogTitle>
          <DialogDescription className="w-full max-h-96 overflow-hidden overflow-y-scroll">
            <Input
              type="search"
              className="my-5 active:outline-0"
              placeholder="search"
              // onChange={(e) => {}}
            />
            <div className="w-full h-fit flex flex-col gap-3 ">
              <Actions />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Actions() {
  const router = useRouter();
  const action = [
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
    {
      id: "themeAction",
      name: "Theme",
      shortcut: ["t"],
      keywords: "theme",
      section: "Personalization",
      perform: () => {console.log("theme toggled")},
      icon: <SunMoon className="w-6 h-6 mx-3" />,
      subtitle: "Toggle between light and dark mode.",
    }
  ];
  return (
    <>
      <AnimatedList animation={"fade"}>
        {action &&
          action.map((project, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between gap-5 w-full h-full"
            >
              <div
                onClick={() => project.perform()}
                className="flex flex-col cursor-pointer"
                >
                
                <span className="inline-flex gap-2 text-lg font-bold">{project.icon} {project.name}</span>
                <span className="text-sm">{project.subtitle}</span>
              </div>
              <pre className="flex justify-center items-center p-2 bg-slate-400">
                <code>{project.shortcut}</code>
              </pre>
            </div>
          ))}
      </AnimatedList>
    </>
  );
}

const CommandBarStateManagement = createContext<CommandBarState>({
  shouldShow: false,
  setShouldShow: (): boolean => false || true,
});

export const GlobalCommandBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  return (
    <CommandBarStateManagement.Provider value={{ shouldShow, setShouldShow }}>
      {children}
    </CommandBarStateManagement.Provider>
  );
};

export const useCommandBarContext = () => useContext(CommandBarStateManagement);