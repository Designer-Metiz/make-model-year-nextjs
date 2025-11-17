 "use client";
 
 import { useState } from "react";
 import { z } from "zod";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
 import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
 import { toast } from "sonner";
 import { supabase } from "@/lib/supabase";
 import Header from "@/components/Header";
 import Footer from "@/components/Footer";
 
 const contactFormSchema = z.object({
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   email: z.string().email("Please enter a valid email address"),
   phone: z
     .string()
     .regex(/^[+]?[\d\s\-\(\)\.]+$/, "Please enter a valid phone number")
     .optional()
     .or(z.literal("")),
   message: z.string().min(1, "Message is required"),
 });
 
 type ContactFormData = z.infer<typeof contactFormSchema>;
 
 export default function ContactPage() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const form = useForm<ContactFormData>({
     resolver: zodResolver(contactFormSchema),
     defaultValues: {
       firstName: "",
       lastName: "",
       email: "",
       phone: "",
       message: "",
     },
   });
 
   const onSubmit = async (data: ContactFormData) => {
     setIsSubmitting(true);
     try {
       const { error } = await supabase.functions.invoke("send-contact-email", { body: data });
       if (error) throw error;
       toast.success("Message sent successfully! We'll get back to you soon.");
       form.reset();
     } catch (err) {
       toast.error("Failed to send message. Please try again.");
     } finally {
       setIsSubmitting(false);
     }
   };
 
   return (
     <div className="min-h-screen bg-gray-50">
       <Header />
       <div className="container mx-auto px-4 pt-20 pb-10">
         <div className="text-center mb-16 mt-[30px]">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Let's work together to create</h1>
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
             the life and business
           </h2>
         </div>
 
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
           <div className="bg-white rounded-2xl p-8 shadow-lg">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Send A Message</h3>
             <p className="text-gray-600 mb-8">
               Unlock your potential with expert guidance! Schedule a free consultation toward personal and business success.
             </p>
 
             <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="firstName"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                           First Name <span className="text-red-500">*</span>
                         </FormLabel>
                         <FormControl>
                           <Input {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="lastName"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                           Last Name <span className="text-red-500">*</span>
                         </FormLabel>
                         <FormControl>
                           <Input {...field} className="border-gray-300 focus:border-primary focus:ring-primary" />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                           Email Address <span className="text-red-500">*</span>
                         </FormLabel>
                         <FormControl>
                           <Input {...field} type="email" className="border-gray-300 focus:border-primary focus:ring-primary" />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                   <FormField
                     control={form.control}
                     name="phone"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                         <FormControl>
                           <Input
                             {...field}
                             type="tel"
                             inputMode="numeric"
                             pattern="^[0-9+() .-]+$"
                             className="border-gray-300 focus:border-primary focus:ring-primary"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
 
                 <FormField
                   control={form.control}
                   name="message"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1">
                         Message <span className="text-red-500">*</span>
                       </FormLabel>
                       <FormControl>
                         <Textarea {...field} rows={6} className="border-gray-300 focus:border-primary focus:ring-primary resize-none" />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
 
                 <Button
                   type="submit"
                   disabled={isSubmitting}
                   className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                 >
                   {isSubmitting ? "Sending..." : "Submit Message"}
                   <ArrowRight className="w-4 h-4" />
                 </Button>
               </form>
             </Form>
           </div>
 
           <div className="space-y-8">
             <div className="bg-white rounded-2xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
               <p className="text-gray-600 mb-6">Call us today for personalized coaching and transformative growth!</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <Phone className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <a href="tel:+919664618619" className="text-primary font-semibold text-lg hover:underline">
                     +91 96646 18619
                   </a>
                 </div>
               </div>
             </div>
 
             <div className="bg-white rounded-2xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
               <p className="text-gray-600 mb-6">Email us now for expert coaching and tailored growth solutions!</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <Mail className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <a href="mailto:hello@metizsoft.com" className="text-primary font-semibold text-lg hover:underline">
                     hello@metizsoft.com
                   </a>
                 </div>
               </div>
             </div>
 
             <div className="bg-white rounded-2xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
               <p className="text-gray-600 mb-6">Visit us for personalized coaching and guidance toward lasting success!</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <MapPin className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <p className="text-primary font-semibold text-lg">
                     Ganesh Plaza, Navrangpura,<br />
                     Ahmedabad – 380009
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
       <Footer />
     </div>
   );
 }




