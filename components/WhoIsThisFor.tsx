import { Car, Wrench, Cpu, Filter } from "lucide-react";
 
const industries = [
  {
    icon: Car,
    title: "Auto Parts",
    description: "Perfect for automotive retailers selling car parts and accessories"
  },
  {
    icon: Wrench,
    title: "Hardware",
    description: "Ideal for hardware stores with complex product catalogs"
  },
  {
    icon: Cpu,
    title: "Electronics",
    description: "Great for electronics retailers with technical specifications"
  },
  {
    icon: Filter,
    title: "Any Filtered Search Industry",
    description: "Suitable for any industry where filtered search is beneficial"
  }
];
 
const WhoIsThisFor = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Who Is This App For?
          </h2>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary/70" />
          <p className="mt-6 text-lg text-muted-foreground">
            This app is perfect for Shopify stores in the following industries
          </p>
        </div>
       
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => {
              const backgroundColors = [
                "bg-purple-100/60 border border-purple-200/50",
                "bg-orange-100/60 border border-orange-200/50",
                "bg-pink-100/60 border border-pink-200/50",
                "bg-green-100/60 border border-green-200/50"
              ];
              const iconColors = [
                "text-purple-600",
                "text-orange-600",
                "text-pink-600",
                "text-green-600"
              ];
              const iconBackgrounds = [
                "bg-purple-200/50",
                "bg-orange-200/50",
                "bg-pink-200/50",
                "bg-green-200/50"
              ];
             
              return (
                <div
                  key={index}
                  className={`${backgroundColors[index]} rounded-3xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group backdrop-blur-sm`}
                >
                  <div className="mx-auto mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${iconBackgrounds[index]} group-hover:scale-110 transition-transform duration-300`}>
                      <industry.icon className={`w-8 h-8 ${iconColors[index]}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {industry.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default WhoIsThisFor;