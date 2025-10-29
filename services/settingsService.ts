// Client calls Next.js API routes which use server-side Supabase with service role key.

export interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  socialTwitter: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialInstagram: string;
  
  // SEO Settings
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  
  // Comments Settings
  enableComments: boolean;
  moderateComments: boolean;
  allowAnonymousComments: boolean;
  
  // Email Settings
  enableNewsletter: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  
  // Analytics Settings
  enableAnalytics: boolean;
  googleAnalyticsId: string;
}

export class SettingsService {
  // Default settings fallback
  private static defaultSettings: SiteSettings = {
    // General Settings
    siteName: 'Make Model Year',
    siteDescription: 'Your trusted source for automotive information',
    siteUrl: 'https://makemodelyear.in',
    contactEmail: 'admin@makemodelyear.in',
    socialTwitter: '',
    socialFacebook: '',
    socialLinkedin: '',
    socialInstagram: '',
    
    // SEO Settings
    defaultMetaTitle: 'Make Model Year - Automotive Information',
    defaultMetaDescription: 'Your trusted source for automotive information and reviews',
    defaultOgImage: '',
    
    // Comments Settings
    enableComments: true,
    moderateComments: true,
    allowAnonymousComments: false,
    
    // Email Settings
    enableNewsletter: true,
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    
    // Analytics Settings
    enableAnalytics: true,
    googleAnalyticsId: '',
  };

  // Load settings from database
  static async load(): Promise<SiteSettings> {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load settings');
      const json = await res.json();
      return json.settings ?? this.defaultSettings;
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      console.log('🔄 Falling back to default settings');
      return this.defaultSettings;
    }
  }

  // Save settings to database
  static async save(settings: SiteSettings): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return true;
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      throw error;
    }
  }

  // Get a specific setting by key
  static async getSetting(key: string): Promise<string> {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (!res.ok) return '';
      const json = await res.json();
      // naive lookup from returned object
      return json?.settings?.[key] ?? '';
    } catch (error) {
      console.error('❌ Error getting setting:', error);
      return '';
    }
  }

  // Update a specific setting
  static async updateSetting(key: string, value: string, category: string = 'general'): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value, category }),
      });
      return res.ok;
    } catch (error) {
      console.error('❌ Error updating setting:', error);
      return false;
    }
  }
}
