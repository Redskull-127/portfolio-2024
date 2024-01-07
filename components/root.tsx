import {
  AllPages,
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
      <div className="max-xl:w-full max-xl:gap-5 max-xl:max-h-fit w-[45%] max-h-80 flex flex-col justify-between items-center">
        <Introduction />
        <QuickLinks />
      </div>
      <SpotifyCard />
      <div className="flex flex-col max-xl:h-fit max-xl:w-full w-[45%] gap-3">
        <Skills />
        <Settings />
      </div>
      <Projects />
      <AllPages />
    </>
  );
}
