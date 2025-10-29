"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Car, TrendingUp, Sparkles, Wrench, Store, Star, PlayCircle } from "lucide-react";
import Image from "next/image";
 
const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Clean background */}
     
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-[1.6]" style={{ color: '#1c154c' }}>
              <span style={{ color: '#f97316' }}>Find the Right Parts</span> in Seconds with <span style={{ color: '#f97316' }}>Shopify Fitment App</span>
            </h1>
 
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Easily manage vehicle fitment data with bulk CSV import
            </p>
 
            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md mx-auto lg:mx-0">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={() => window.open('https://apps.shopify.com/make-model-year', '_blank')}
              >
                Try it on Shopify
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={() => window.open('https://mmy-app.myshopify.com/', '_blank')}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                View demo store
              </Button>
            </div>
 
            {/* Small stats row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-gray-600">
              <div className="inline-flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-500" />
                <span className="text-sm">1000+ Active Stores</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm">Free Setup</span>
              </div>
            </div>
          </div>
 
          {/* Right Content - Laptop mockup */}
          <div className="relative">
            <div className="relative">
              {/* Clean laptop mockup frame */}
              <div className="relative bg-gray-200 rounded-lg p-3 shadow-2xl">
                <Image
                  src="/assets/bulk-csv-import.png"
                  alt="Bulk CSV import screen for vehicle fitment data"
                  className="w-full rounded-md object-contain"
                  width={1200}
                  height={800}
                />
                {/* Laptop bottom */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default Hero;