"use client";

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export function ShareButton() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={async () => {
        if (typeof window !== 'undefined') {
          if ('share' in navigator) {
            try {
              await (navigator as any).share({ 
                title: document.title, 
                url: window.location.href 
              });
            } catch (err) {
              console.log('Error sharing:', err);
            }
          } else if ('clipboard' in navigator) {
            try {
              await (navigator as any).clipboard.writeText(window.location.href);
              // You could add a toast notification here
            } catch (err) {
              console.log('Error copying to clipboard:', err);
            }
          }
        }
      }}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share Article
    </Button>
  );
}
