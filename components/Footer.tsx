import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
 
const Footer = () => {
  return (
    <footer className="text-white border-t border-slate-800" style={{ backgroundColor: '#1c154c' }}>
      <div className="container mx-auto px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 items-start">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-3 text-white">About the App</h3>
            <p className="text-white text-base leading-relaxed max-w-xl">
              MSPL AutoPartsFinderPro by Metizsoft helps Shopify merchants streamline the product search experience,
              allowing customers to find the exact parts they need quickly and efficiently.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white hover:text-gray-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <Link href="/#features" className="text-white hover:text-gray-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-white hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://apps.shopify.com/make-model-year"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  View on Shopify App Store
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white mb-4 uppercase">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white hover:text-gray-300 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-white hover:text-gray-300 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                  Installation Guide
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white hover:text-gray-300 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
       
        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold tracking-wide text-white mb-3 uppercase">Stay Updated</h3>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 p-1 pl-4 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 border-0 bg-transparent text-white placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="h-9 px-4 rounded-full text-white hover:opacity-90 bg-accent">
                  Subscribe
                </Button>
              </div>
            </div>
           
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-white hover:text-gray-300 hover:border-slate-500 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-white hover:text-gray-300 hover:border-slate-500 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-white hover:text-gray-300 hover:border-slate-500 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
         
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex gap-6">
                <a href="#" className="text-sm text-white hover:text-gray-300 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-white hover:text-gray-300 transition-colors">
                  Terms of Service
                </a>
              </div>
              <p className="text-sm text-white">
                © 2025 Metizsoft. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;