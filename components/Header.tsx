"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b border-border backdrop-blur-sm bg-background/95">
      <div className="container flex h-20 max-w-screen-xl items-center justify-between px-6 mx-auto">
        <div className="flex items-center">
          <a className="flex items-center space-x-3" href="/">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary overflow-hidden" style={{ backgroundColor: '#0b37c7' }}>
              <Image
                src="/assets/new-logo.png"
                alt="MSPL Make Model Year logo"
                className="w-full h-full object-contain p-1.5"
                draggable={false}
                width={40}
                height={40}
              />
            </div>
            <span className="font-semibold text-lg text-primary" style={{ color: '#1c154c' }}>
              MSPL Make Model Year
            </span>
          </a>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium flex-1 justify-center">
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/#features">
            Features
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/#how-it-works">
            How It Works
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/#pricing">
            Pricing
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/#testimonials">
            Testimonials
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/#faq">
            FAQ
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/blog">
            Blog
          </Link>
          <Link className="transition-colors hover:text-primary text-foreground/80" href="/contact">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* <Button 
            variant="ghost" 
            className="text-foreground/80 hover:text-primary"
            onClick={() => window.open('https://apps.shopify.com/make-model-year', '_blank')}
          >
            Sign up
          </Button> */}
          <Button 
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-6"
            onClick={() => window.open('https://apps.shopify.com/make-model-year', '_blank')}
          >
            Buy now!
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;