import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Project = {
  id: string;
  name: string;
  description: string;
  logo?: React.ReactNode; // Custom logo node
  url?: string;
};

const sampleProjects: Project[] = [
  {
    id: "p1", 
    name: "Development of electronics board",
    description: "Custom PCB design and embedded systems development.",
    logo: <img src="/home_page/logo.png" alt="Electronics project" className="w-full h-full object-contain" />
  },
  {
    id: "p2",
    name: "SignalForge", 
    description: "Low-latency data pipelines and analytics.",
    logo: <img src="/home_page/logo.png" alt="SignalForge project" className="w-full h-full object-contain" />
  },
  { 
    id: "p3", 
    name: "EdgeSketch", 
    description: "Edge AI experiments and demos.",
    logo: <img src="/home_page/logo.png" alt="EdgeSketch project" className="w-full h-full object-contain" />
  },
  { 
    id: "p4", 
    name: "NimbusUI", 
    description: "Component library and design tokens.",
    logo: <img src="/home_page/logo.png" alt="NimbusUI project" className="w-full h-full object-contain" />
  },
];

function LogoBadge({ label }: { label: string }) {
  return (
    <div className="size-14 shrink-0 rounded-lg bg-gradient-to-br from-primary/80 to-accent/70 shadow-md grid place-items-center text-primary-foreground font-semibold">
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ProjectsCarousel({ projects = sampleProjects }: { projects?: Project[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: false
  });

  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(scrollNext, 4000);
    return () => clearInterval(id);
  }, [emblaApi, scrollNext]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {projects.map((p) => (
            <div key={p.id} className="embla__slide flex-[0_0_280px] min-w-0 px-3">
              <Card className="h-full bg-card/70 backdrop-blur border-border/60 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="size-16 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                      {p.logo || <LogoBadge label={p.name} />}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsCarousel;
