import { CardDescription } from "@/components/ui/card";
import { Search, Upload, Settings, Check } from "lucide-react";

const steps = [
  {
    step: "Step 1",
    title: "Easy Installation",
    description: "MSPL AutoPartsFinderPro works with all the latest Shopify themes and is managed directly from your Shopify admin.",
    icon: Search
  },
  {
    step: "Step 2", 
    title: "Bulk Upload Your Products",
    description: "Easily upload all your product data in a single CSV file.",
    icon: Upload
  },
  {
    step: "Step 3",
    title: "Customize Your Search", 
    description: "Customize the search attributes to fit your store's needs.",
    icon: Settings
  },
  {
    step: "Step 4",
    title: "Customers Find Parts Faster",
    description: "Your customers can now easily find the exact parts they need, improving their shopping experience.",
    icon: Check
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-blue-500/70 via-purple-500 to-blue-500/70" />
          <p className="mt-6 text-lg text-muted-foreground">
            Get up and running in minutes with our simple 4-step process
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          {/* Icons row with centered dashed connector */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:block">
              <div className="h-px border-t-2 border-dashed border-blue-300/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={`icon-${index}`} className="flex items-center justify-center">
                    <div className="h-16 w-16 rounded-2xl shadow-lg flex items-center justify-center text-white z-[1] bg-gradient-to-br from-blue-600 to-purple-600 hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Titles and descriptions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {steps.map((step, index) => (
              <div key={`content-${index}`} className="space-y-4">
                <div className="text-lg font-semibold text-foreground">{step.title}</div>
                <CardDescription className="mx-auto max-w-xs leading-relaxed text-sm">
                  {step.description}
                </CardDescription>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;