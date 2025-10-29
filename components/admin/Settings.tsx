"use client";
import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Database, Shield, BarChart3, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SettingsService, type SiteSettings } from '@/services/settingsService';

// SiteSettings interface is now imported from settingsService

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    // General Settings
    siteName: 'Store Locator',
    siteDescription: 'Metizsoft\'s Shopify store locator app helps businesses connect with customers faster. Display all locations in one place, improve accessibility, and drive more store visits.',
    siteUrl: 'https://storelocator.in/',
    contactEmail: 'hello@metizsoft.com',
    socialTwitter: 'https://twitter.com/username',
    socialFacebook: 'https://facebook.com/page',
    socialLinkedin: 'https://linkedin.com/company/name',
    socialInstagram: 'https://instagram.com/username',
    
    // SEO Settings
    defaultMetaTitle: 'My Blog - Latest Insights & Tips',
    defaultMetaDescription: 'Discover the latest insights, tips, and expert advice on our blog.',
    defaultOgImage: 'https://yoursite.com/og-image.jpg',
    
    // Comments Settings
    enableComments: true,
    moderateComments: true,
    allowAnonymousComments: false,
    
    // Email Settings
    enableNewsletter: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'your-email@gmail.com',
    
    // Analytics Settings
    enableAnalytics: true,
    googleAnalyticsId: 'GA-XXXXXXXXX-X',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        console.log('📋 Loading settings from database...');
        const loadedSettings = await SettingsService.load();
        setSettings(loadedSettings);
        console.log('✅ Settings loaded successfully');
      } catch (error) {
        console.error('❌ Error loading settings:', error);
        toast({
          title: 'Failed to load settings',
          description: 'Using default settings. Some features may not work properly.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving settings to database...', settings);
      
      const success = await SettingsService.save(settings);
      
      if (success) {
        toast({ 
          title: 'Settings saved', 
          description: 'Your site settings have been updated successfully in the database.' 
        });
        console.log('✅ Settings saved successfully');
      } else {
        throw new Error('Save operation failed');
      }
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      toast({ 
        title: 'Failed to save settings', 
        description: 'There was an error saving your settings to the database. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View Site
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Settings</h1>
        <p className="text-gray-600">Configure your blog settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Globe className="h-5 w-5" />
                  Site Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting('siteUrl', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-900">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="socialTwitter">Twitter</Label>
                  <Input
                    id="socialTwitter"
                    value={settings.socialTwitter}
                    onChange={(e) => updateSetting('socialTwitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="socialFacebook">Facebook</Label>
                  <Input
                    id="socialFacebook"
                    value={settings.socialFacebook}
                    onChange={(e) => updateSetting('socialFacebook', e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
                <div>
                  <Label htmlFor="socialLinkedin">LinkedIn</Label>
                  <Input
                    id="socialLinkedin"
                    value={settings.socialLinkedin}
                    onChange={(e) => updateSetting('socialLinkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/name"
                  />
                </div>
                <div>
                  <Label htmlFor="socialInstagram">Instagram</Label>
                  <Input
                    id="socialInstagram"
                    value={settings.socialInstagram}
                    onChange={(e) => updateSetting('socialInstagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Globe className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
                <Input
                  id="defaultMetaTitle"
                  value={settings.defaultMetaTitle}
                  onChange={(e) => updateSetting('defaultMetaTitle', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>
              <div>
                <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
                <Textarea
                  id="defaultMetaDescription"
                  value={settings.defaultMetaDescription}
                  onChange={(e) => updateSetting('defaultMetaDescription', e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>
              <div>
                <Label htmlFor="defaultOgImage">Default OG Image URL</Label>
                <Input
                  id="defaultOgImage"
                  value={settings.defaultOgImage}
                  onChange={(e) => updateSetting('defaultOgImage', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Shield className="h-5 w-5" />
                Comment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableComments" className="text-purple-900 font-medium">Enable Comments</Label>
                  <p className="text-sm text-gray-500">Allow visitors to comment on blog posts</p>
                </div>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => updateSetting('enableComments', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="moderateComments" className="text-purple-900 font-medium">Moderate Comments</Label>
                  <p className="text-sm text-gray-500">Require approval before comments are published</p>
                </div>
                <Switch
                  id="moderateComments"
                  checked={settings.moderateComments}
                  onCheckedChange={(checked) => updateSetting('moderateComments', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowAnonymousComments" className="text-purple-900 font-medium">Allow Anonymous Comments</Label>
                  <p className="text-sm text-gray-500">Let users comment without logging in</p>
                </div>
                <Switch
                  id="allowAnonymousComments"
                  checked={settings.allowAnonymousComments}
                  onCheckedChange={(checked) => updateSetting('allowAnonymousComments', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNewsletter" className="text-purple-900 font-medium">Enable Newsletter</Label>
                  <p className="text-sm text-gray-500">Allow visitors to subscribe to your newsletter</p>
                </div>
                <Switch
                  id="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onCheckedChange={(checked) => updateSetting('enableNewsletter', checked)}
                />
              </div>
              <div>
                <h3 className="text-purple-900 font-medium mb-4">SMTP Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => updateSetting('smtpPort', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <BarChart3 className="h-5 w-5" />
                Analytics Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAnalytics" className="text-purple-900 font-medium">Enable Analytics Tracking</Label>
                  <p className="text-sm text-gray-500">Track page views and user interactions</p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => updateSetting('enableAnalytics', checked)}
                />
              </div>
              <div>
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                  placeholder="GA-XXXXXXXXX-X"
                />
                <p className="text-sm text-gray-500 mt-1">Enter your Google Analytics tracking ID</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
