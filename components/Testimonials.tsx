"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
 
const testimonials = [
  {
    id: 1,
    rating: 5,
    review: "We have been using this Auto Parts Search plugin for more than half a year. At the beginning, we also encountered some problems due to various reasons, but the Metizsoft team helped me deal with it very patiently and well. Even in order to adapt to the visual style of the website, we needed to make some small parameter changes in the visual synchronization of the plugin. The Metizsoft team helped us...",
    company: "Coverado",
    role: "Store Owner",
    location: "China",
    initials: "CO",
    duration: "8 months using the app",
    date: "June 21, 2022"
  },
  {
    id: 2,
    rating: 5,
    review: "I couldn't recommend the team at Advance Auto Parts Search enough! We set up on their system and encountered some errors, and Komal and Manthan have gone above and beyond to ensure we have the functionality required for us to make the most of the system. Thanks for your help and hard work in getting us set up – highly recommend them",
    company: "New Motorcycle Performance Store",
    role: "Store Manager",
    location: "United Kingdom",
    initials: "NM",
    duration: "8 months using the app",
    date: "March 10, 2023"
  }
];
 
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
 
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
 
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What <span className="text-accent">Our Customers</span> Say
          </h2>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary/70" />
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join thousands of satisfied customers who trust Metizsoft
          </p>
        </div>
       
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              disabled={testimonials.length <= 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
           
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              disabled={testimonials.length <= 1}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
 
            {/* Testimonials Carousel */}
            <div className="flex justify-center items-center gap-6 overflow-hidden py-8">
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % testimonials.length;
                const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
               
                return (
                  <Card
                    key={testimonial.id}
                    className={`transition-all duration-500 w-80 h-[450px] m-0 ${
                      isActive
                        ? 'bg-primary text-white shadow-2xl z-10'
                        : isNext || isPrev
                        ? 'bg-white text-gray-900 shadow-lg opacity-70'
                        : 'hidden'
                    } rounded-2xl border-0`}
                  >
                    <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                      {/* Profile Photo */}
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border-4 aspect-square ${
                        isActive ? 'bg-white text-primary border-white' : 'text-white border-white/20'
                      }`} style={{
                        borderRadius: '50%',
                        background: isActive ? 'white' : 'linear-gradient(135deg, #9333ea, #7c3aed)'
                      }}>
                        <span className={`text-xl font-bold ${
                          isActive ? 'text-primary' : 'text-white'
                        }`}>
                          {testimonial.initials}
                        </span>
                      </div>
 
                      {/* Star Rating */}
                      <div className="flex items-center justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${
                            isActive ? 'fill-yellow-300 text-yellow-300' : 'fill-yellow-400 text-yellow-400'
                          }`} />
                        ))}
                      </div>
 
                      {/* Company Info */}
                      <div className="mb-6">
                        <div className={`font-bold text-lg mb-1 ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}>
                          {testimonial.company}
                        </div>
                        <div className={`text-sm ${
                          isActive ? 'text-white/80' : 'text-gray-600'
                        }`}>
                          {testimonial.role}
                        </div>
                        <div className={`text-sm ${
                          isActive ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {testimonial.location}
                        </div>
                      </div>
 
                      {/* Review Text */}
                      <blockquote className={`text-sm leading-relaxed italic ${
                        isActive ? 'text-white/90' : 'text-gray-700'
                      }`}>
                        "{testimonial.review.length > 150 ? testimonial.review.substring(0, 150) + '...' : testimonial.review}"
                      </blockquote>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
 
            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default Testimonials;