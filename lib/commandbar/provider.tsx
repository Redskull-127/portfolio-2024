import CommandBar, { GlobalCommandBarProvider } from "./commandbar";
import { Children } from "../types/children";
export default function CommandProvider({ children }: Children) {
  return (
    <>
      <GlobalCommandBarProvider>
        <CommandBar />
        {children}
      </GlobalCommandBarProvider>
    </>
  );
}
