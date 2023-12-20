import CommandBar, { GlobalCommandBarProvider } from "./commandbar";

export default function CommandProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>
    <GlobalCommandBarProvider>
        <CommandBar />
        {children}
    </GlobalCommandBarProvider>
    </>
}
