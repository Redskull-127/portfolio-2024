import { Icons } from '@/components/icons/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import TechnologiesJson from '@/lib/static/crumbs/technologies.json';
import FeaturesJson from '@/lib/static/crumbs/features.json';

export function GettingStarted() {
  return (
    <div>
      Hey, I&apos;m Meer. GDSC Lead &apos;22, Organizer of Hack For India & GDSC
      WoW &apos;22, Building Tempo Labs (YC) Ex Flipkart SCOA Intern & Gao Tech
      Support Intern!
    </div>
  );
}

export function Technologies() {
  const technologies = TechnologiesJson;
  return (
    <div className="flex flex-col">
      <p>The portfolio is built with modern technologies:</p>
      <div className="mt-5">
        {Object.entries(technologies).map(([category, techs]) => (
          <div key={category} className="mb-5">
            <h3 className="text-lg font-semibold">{category}:</h3>
            <ul className="list-inside mt-2 flex flex-wrap space-x-1">
              {techs.map((tech, index) => (
                <li key={tech} className="flex items-center">
                  {index === 0 && (
                    <Icons.Disc className="inline-flex w-3 h-3 mr-1" />
                  )}
                  {tech}
                  {index < techs.length - 1 ? ', ' : '.'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const features = FeaturesJson;

  return (
    <div className="flex flex-col w-full">
      <p>The portfolio comes with the following features:</p>
      <div className="h-72 w-full">
        <ScrollArea className="mt-5 size-full">
          <Accordion type="single" collapsible>
            {features.map((feature) => (
              <AccordionItem key={feature.name} value={feature.name}>
                <AccordionTrigger>
                  <h4 className="text-md font-semibold inline-flex items-center gap-1 select-none cursor-pointer">
                    <Icons.Disc className="inline-flex size-3" /> {feature.name}
                  </h4>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{feature.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
}

export function SourceCode() {
  return <div>Source Code</div>;
}
