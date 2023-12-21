"use client";

import {
  SetStateAction,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  useState,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/Theme/ThemeToggler";
import { AnimatedList } from "react-animated-list";
import {
  FolderGit2,
  Github,
  Home,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ListGenerator } from "./actions";

interface CommandBarState {
  shouldShow: boolean;
  setShouldShow: Dispatch<SetStateAction<boolean>>;
}

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

export default function CommandBar() {
  const { shouldShow, setShouldShow } = useCommandBarContext();

  const router = useRouter();
  const action: ActionType[] = [
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["G", "H"],
      keywords: "back",
      section: "Navigation",
      perform: () => router.push("/"),
      icon: <Home className="w-6 h-6 mx-3" />,
      subtitle: "Go to home.",
    },
    {
      id: "projectsAction",
      name: "Projects",
      shortcut: ["G", "P"],
      keywords: "projects",
      section: "Navigation",
      perform: () => router.push("/projects"),
      icon: <FolderGit2 className="w-6 h-6 mx-3" />,
      subtitle: "Go to project section.",
    },
    {
      id: "mailAction",
      name: "Mail",
      shortcut: ["M"],
      keywords: "mail",
      section: "Social Media",
      perform: () => router.push("mailto:redskull@duck.com"),
      icon: <Mail className="w-6 h-6 mx-3" />,
      subtitle: "Send me a mail.",
    },
    {
      id: "githubAction",
      name: "Github",
      shortcut: ["G"],
      keywords: "github",
      section: "Social Media",
      perform: () => window.open("https://github.com/redskull-127", "_blank"),
      icon: <Github className="w-6 h-6 mx-3" />,
      subtitle: "Go to my github.",
    },
    {
      id: "linkedinAction",
      name: "Linkedin",
      shortcut: ["L"],
      keywords: "linkedin",
      section: "Social Media",
      perform: () =>
        window.open("https://www.linkedin.com/in/meertarbani/", "_blank"),
      icon: <Linkedin className="w-6 h-6 mx-3" />,
      subtitle: "Go to my linkedin.",
    },
    {
      id: "twitterAction",
      name: "Twitter",
      shortcut: ["T"],
      keywords: "twitter",
      section: "Social Media",
      perform: () => window.open("https://twitter.com/meertarbani", "_blank"),
      icon: <Twitter className="w-6 h-6 mx-3" />,
      subtitle: "Go to my twitter.",
    },
    {
      id: "exitAction",
      name: "Exit",
      shortcut: ["ESC"],
      keywords: "exit",
      section: "Navigation",
      perform: () => {},
      icon: <Home className="w-6 h-6 mx-3" />,
      subtitle: "Exit the terminal.",
    },
  ];

  const [actionList, setActionList] = useState<ActionType[]>(action);
  const [filteredList, setFilteredList] = useState<ActionType[]>(action);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        console.log(shouldShow);
        e.preventDefault();
        e.stopPropagation();
        setShouldShow(!shouldShow);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldShow, setShouldShow]);

  return (
    <Dialog
      open={shouldShow}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) {
          setShouldShow(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Command Bar</DialogTitle>
        </DialogHeader>
        <div className="w-full max-h-96 overflow-hidden overflow-y-scroll">
          <Input
            type="search"
            className="my-5 active:outline-0"
            placeholder="search"
            onChange={(e) => {
              const query = e.target.value;
              if (query === "") {
                setFilteredList(actionList);
              } else {
                setFilteredList(
                  actionList.filter((item: ActionType) => {
                    const filteredName = item.name
                      .toLowerCase()
                      .includes(query.toLowerCase());
                    const filteredKeywords = item.keywords
                      .toLowerCase()
                      .includes(query.toLowerCase());
                    const filteredShortcuts = item.shortcut
                      .join("")
                      .toLowerCase()
                      .includes(query.toLowerCase());
                    const filteredSection = item.section
                      .toLowerCase()
                      .includes(query.toLowerCase());
                    const filteredSubtitle = item.subtitle
                      .toLowerCase()
                      .includes(query.toLowerCase());
                    return (
                      filteredName ||
                      filteredKeywords ||
                      filteredShortcuts ||
                      filteredSection ||
                      filteredSubtitle
                    );
                  })
                );
              }
            }}
          />
          <div className="w-full h-fit flex flex-col gap-5">
            <AnimatedList animation={"fade"}>
              {filteredList &&
                filteredList.map((project, index) => (
                  <ListGenerator {...project} key={index} />
                ))}
            </AnimatedList>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
