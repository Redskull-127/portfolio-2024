import {
  AllPages,
  HeroCard,
  Introduction,
  Projects,
  QuickLinks,
  Settings,
  Skills,
  SpotifyCard,
} from './Root-Partials';
import IntroProvider from './intro';

export default function RootComponent() {
  return (
    <>
      <HeroCard />
      <div className="flex flex-col gap-5 max-xl:w-full xl:w-[45%] h-fit">
        <Introduction />
        <QuickLinks />
      </div>
      <SpotifyCard />
      <div className="flex flex-col gap-3 max-xl:w-full xl:w-[45%] h-fit">
        <Skills />
        <Settings />
      </div>
      <Projects />
      <AllPages />
      <IntroProvider />
    </>
  );
}
