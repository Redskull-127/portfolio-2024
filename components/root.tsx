import {
  AllPages,
  Footer,
  HeroCard,
  Introduction,
  Projects,
  QuickLinks,
  Settings,
  Skills,
  SpotifyCard,
} from "./Root-Partials";

export default function RootComponent() {
  return (
    <>
      <HeroCard />
      <div className="max-md:w-full max-md:gap-5 max-md:max-h-fit w-[45%] max-h-80 flex flex-col justify-between items-center">
        <Introduction />
        <QuickLinks />
      </div>
      <SpotifyCard />
      <div className="flex flex-col max-md:h-fit max-md:w-full w-[45%] gap-3">
        <Skills />
        <Settings />
      </div>
      <Projects />
      <AllPages />
      <Footer />
    </>
  );
}
