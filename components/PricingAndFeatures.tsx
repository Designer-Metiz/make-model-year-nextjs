"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import type { CarouselApi } from "@/components/ui/carousel";
// Defer loading of the carousel (and Embla) to when the section is in view
const Carousel = dynamic(() => import("@/components/ui/carousel").then((m) => m.Carousel), { ssr: false });
const CarouselContent = dynamic(() => import("@/components/ui/carousel").then((m) => m.CarouselContent), {
  ssr: false,
});
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then((m) => m.CarouselItem), { ssr: false });
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then((m) => m.CarouselNext), { ssr: false });
const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then((m) => m.CarouselPrevious), {
  ssr: false,
});
import { Check } from "lucide-react";
import Image from "next/image";
 
const pricingFeatures = [
  "Make, Model, Year Search",
  "Bulk Product Upload",
  "Customizable Attributes",
  "Multi-Product Assignment",
  "Shopify Admin Integration",
  "3-Day Free Trial",
  "No Hidden Fees"
];
 
const carouselFeatures = [
  {
    id: 1,
    title: "Fully Responsive All Devices",
    description: "Perfect experience across desktop, tablet, and mobile devices",
    image: "/assets/Fully-Responsive-All-Devices.png",
    alt: "Auto parts store with Make Model Year search widget"
  },
  {
    id: 2,
    title: "Tag Lists",
    description: "Easy to add tag lists for cars/auto parts",
    image: "/assets/tag-list.png",
    alt: "Product page showing vehicle compatibility info"
  },
  {
    id: 3,
    title: "Settings",
    description: "Easy to design search box and set background color, text, font etc.",
    image: "/assets/Settings.png",
    alt: "Shopify admin showing makemodelyear settings"
  },
  {
    id: 4,
    title: "Bulk CSV",
    description: "Easy to import attribute values using CSV file",
    image: "/assets/Bulk-CSV.png",
    alt: "Bulk CSV import screen for vehicle fitment data"
  },
  {
    id: 5,
    title: "Searchbox",
    description: "Easy to search products by attributes/fields",
    image: "/assets/Search.png",
    alt: "Demo store homepage with fitment search in header"
  },
  {
    id: 6,
    title: "Attributes",
    description: "Easy to create and edit attributes",
    image: "/assets/Attributes.png",
    alt: "App dashboard with Make, Model, Year attributes."
  }
];
 
function LazyCarousel({ setApi }: { setApi: (api: CarouselApi) => void }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(mountRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={mountRef}>
      {isInView ? (
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {carouselFeatures.map((feature) => (
              <CarouselItem key={feature.id}>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={feature.image}
                        alt={feature.alt}
                        className="w-full h-full object-cover"
                        width={1200}
                        height={675}
                        sizes="(min-width: 1280px) 900px, (min-width: 1024px) 720px, 95vw"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        // Lightweight fallback (first slide) until the carousel is needed
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={carouselFeatures[0].image}
                alt={carouselFeatures[0].alt}
                className="w-full h-full object-cover"
                width={1200}
                height={675}
                sizes="(min-width: 1280px) 900px, (min-width: 1024px) 720px, 95vw"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">{carouselFeatures[0].title}</h3>
              <p className="text-muted-foreground">{carouselFeatures[0].description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const PricingAndFeatures = () => {
  const [api, setApi] = useState<CarouselApi>();
 
  useEffect(() => {
    if (!api) return;
 
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
 
    return () => clearInterval(interval);
  }, [api]);
 
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Pricing & Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to enhance your Shopify store with powerful auto parts search
          </p>
        </div>
 
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start min-h-[500px]">
            {/* Pricing Section - 40% */}
            <div className="lg:col-span-2 w-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Our Pricing
                </h3>
                <p className="mt-3 text-muted-foreground">
                  One price, all features included. No surprises.
                </p>
              </div>
              <Card className="relative overflow-hidden border-0 shadow-2xl" style={{background: '#1c154c'}}>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    Most Popular
                  </div>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-white">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-bold">$9.99</span>
                      <span className="text-lg font-normal text-white/80">/month</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-xl font-semibold text-white mt-4">
                    Standard Package
                  </CardDescription>
                  <p className="text-white/90 text-sm mt-2">
                    Everything you need to get started
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-5">
                    {pricingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white text-base font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6">
                    <Button
                      size="lg"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold"
                      onClick={() => window.open('https://apps.shopify.com/make-model-year', '_blank')}
                    >
                      Choose Our Plan
                    </Button>
                  </div>
                  <p className="text-center text-xs text-white/70">
                    No credit card required for trial
                  </p>
                </CardContent>
              </Card>
            </div>
 
            {/* Features Carousel Section - 60% */}
            <div className="lg:col-span-3 w-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Product Features
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Discover all the capabilities of our Auto Parts Search solution
                </p>
              </div>
              <LazyCarousel setApi={setApi} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default PricingAndFeatures;