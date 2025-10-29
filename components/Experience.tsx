import { Star, Quote, Users, Globe } from "lucide-react";
 
const stats = [
  {
    icon: Users,
    number: "240+",
    label: "Professionals"
  },
  {
    icon: Quote,
    number: "15+",
    label: "Years of Experience"
  },
  {
    icon: Star,
    number: "2000+",
    label: "Projects"
  },
  {
    icon: Globe,
    number: "46+",
    label: "Countries Globally"
  }
];
 
const Experience = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0" style={{ backgroundColor: '#0b37c7' }}></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl"></div>
     
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 shadow-lg border border-white/10">
                    <IconComponent className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-sm">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-white/90 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
 
export default Experience;