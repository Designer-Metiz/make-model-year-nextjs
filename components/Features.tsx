import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload, Settings, Zap } from "lucide-react";
 
const features = [
  {
    icon: Search,
    title: "Smart Fitment Search",
    description: "Give customers a simple Make–Model–Year dropdown to instantly find compatible products.",
    bullets: [
      "Increases confidence at checkout",
      "Reduces wrong orders and returns",
      "Works on desktop & mobile"
    ],
    iconColor: "text-red-500",
    bgColor: "bg-red-50"
  },
  {
    icon: Upload,
    title: "Bulk Data Import",
    description: "Upload your full catalog via CSV for quick setup.",
    bullets: [
      "Map product SKUs with vehicle fitment data",
      "Supports large catalogs",
      "Save hours of manual entry"
    ],
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: Settings,
    title: "Seamless Shopify Integration",
    description: "Built for Shopify, works natively with your theme.",
    bullets: [
      "Installs directly in Shopify Admin",
      "Compatible with the latest Shopify 2.0 themes",
      "No coding required"
    ],
    iconColor: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    icon: Zap,
    title: "Faster Shopping Experience",
    description: "Customers reach the right product in seconds.",
    bullets: [
      "Improved navigation for large catalogs",
      "Better user experience → higher conversions",
      "Supports multiple categories and tags"
    ],
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50"
  }
];
 
const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm text-blue-600 bg-blue-50">
            Our Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: '#1c154c' }}>
            Key Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to transform your customers' search experience
          </p>
        </div>
       
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-4`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mb-4" style={{ color: '#1c154c' }}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-3 text-left">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default Features;