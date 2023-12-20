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
import Actions from "./actions";

interface CommandBarState {
  shouldShow: boolean;
  setShouldShow: Dispatch<SetStateAction<boolean>>;
}

export default function CommandBar() {
  const { shouldShow, setShouldShow } = useCommandBarContext();

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
              // onChange={(e) => {}}
            />
            <div className="w-full h-fit flex flex-col gap-5">
              <Actions />
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
