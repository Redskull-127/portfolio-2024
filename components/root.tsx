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
import { getTranslations } from 'next-intl/server';

export default async function RootComponent() {
  const translations = await getTranslations('HomePage');
  return (
    <>
      <HeroCard translation={translations} />
      <div className="flex flex-col gap-5 max-xl:w-full xl:w-[45%] h-fit">
        <Introduction translation={translations} />
        <QuickLinks translation={translations} />
      </div>
      <SpotifyCard translation={translations} />
      <div className="flex flex-col gap-3 max-xl:w-full xl:w-[45%] h-fit">
        <Skills translation={translations} />
        <Settings translation={translations} />
      </div>
      <Projects translation={translations} />
      <AllPages translation={translations} />
      <IntroProvider />
    </>
  );
}
