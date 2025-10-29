import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type DbSetting = {
  key: string;
  value: any;
  category?: string;
  data_type?: string;
  is_active?: boolean;
};

// Map DB key/value pairs into SiteSettings shape
function mapDbToSiteSettings(rows: DbSetting[]) {
  const defaults = {
    siteName: 'Make Model Year',
    siteDescription: 'Your trusted source for automotive information',
    siteUrl: 'https://makemodelyear.in',
    contactEmail: 'admin@makemodelyear.in',
    socialTwitter: '',
    socialFacebook: '',
    socialLinkedin: '',
    socialInstagram: '',
    defaultMetaTitle: 'Make Model Year - Automotive Information',
    defaultMetaDescription: 'Your trusted source for automotive information and reviews',
    defaultOgImage: '',
    enableComments: true,
    moderateComments: true,
    allowAnonymousComments: false,
    enableNewsletter: true,
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    enableAnalytics: true,
    googleAnalyticsId: '',
  };

  const out = { ...defaults } as any;
  for (const r of rows) {
    const v = r.value;
    switch (r.key) {
      case 'site_name': out.siteName = v ?? out.siteName; break;
      case 'site_description': out.siteDescription = v ?? out.siteDescription; break;
      case 'site_url': out.siteUrl = v ?? out.siteUrl; break;
      case 'contact_email': out.contactEmail = v ?? out.contactEmail; break;
      case 'social_twitter': out.socialTwitter = v ?? out.socialTwitter; break;
      case 'social_facebook': out.socialFacebook = v ?? out.socialFacebook; break;
      case 'social_linkedin': out.socialLinkedin = v ?? out.socialLinkedin; break;
      case 'social_instagram': out.socialInstagram = v ?? out.socialInstagram; break;
      case 'default_meta_title': out.defaultMetaTitle = v ?? out.defaultMetaTitle; break;
      case 'default_meta_description': out.defaultMetaDescription = v ?? out.defaultMetaDescription; break;
      case 'default_og_image': out.defaultOgImage = v ?? out.defaultOgImage; break;
      case 'enable_comments': out.enableComments = v === 'true' || v === true; break;
      case 'moderate_comments': out.moderateComments = v === 'true' || v === true; break;
      case 'allow_anonymous_comments': out.allowAnonymousComments = v === 'true' || v === true; break;
      case 'enable_newsletter': out.enableNewsletter = v === 'true' || v === true; break;
      case 'smtp_host': out.smtpHost = v ?? out.smtpHost; break;
      case 'smtp_port': out.smtpPort = v ?? out.smtpPort; break;
      case 'smtp_username': out.smtpUsername = v ?? out.smtpUsername; break;
      case 'enable_analytics': out.enableAnalytics = v === 'true' || v === true; break;
      case 'google_analytics_id': out.googleAnalyticsId = v ?? out.googleAnalyticsId; break;
    }
  }
  return out;
}

function mapSiteSettingsToDb(settings: any): DbSetting[] {
  return [
    { key: 'site_name', value: settings.siteName, category: 'general', data_type: 'string' },
    { key: 'site_description', value: settings.siteDescription, category: 'general', data_type: 'string' },
    { key: 'site_url', value: settings.siteUrl, category: 'general', data_type: 'string' },
    { key: 'contact_email', value: settings.contactEmail, category: 'general', data_type: 'string' },
    { key: 'social_twitter', value: settings.socialTwitter, category: 'general', data_type: 'string' },
    { key: 'social_facebook', value: settings.socialFacebook, category: 'general', data_type: 'string' },
    { key: 'social_linkedin', value: settings.socialLinkedin, category: 'general', data_type: 'string' },
    { key: 'social_instagram', value: settings.socialInstagram, category: 'general', data_type: 'string' },
    { key: 'default_meta_title', value: settings.defaultMetaTitle, category: 'seo', data_type: 'string' },
    { key: 'default_meta_description', value: settings.defaultMetaDescription, category: 'seo', data_type: 'string' },
    { key: 'default_og_image', value: settings.defaultOgImage, category: 'seo', data_type: 'string' },
    { key: 'enable_comments', value: String(settings.enableComments), category: 'comments', data_type: 'boolean' },
    { key: 'moderate_comments', value: String(settings.moderateComments), category: 'comments', data_type: 'boolean' },
    { key: 'allow_anonymous_comments', value: String(settings.allowAnonymousComments), category: 'comments', data_type: 'boolean' },
    { key: 'enable_newsletter', value: String(settings.enableNewsletter), category: 'email', data_type: 'boolean' },
    { key: 'smtp_host', value: settings.smtpHost, category: 'email', data_type: 'string' },
    { key: 'smtp_port', value: settings.smtpPort, category: 'email', data_type: 'string' },
    { key: 'smtp_username', value: settings.smtpUsername, category: 'email', data_type: 'string' },
    { key: 'enable_analytics', value: String(settings.enableAnalytics), category: 'analytics', data_type: 'boolean' },
    { key: 'google_analytics_id', value: settings.googleAnalyticsId, category: 'analytics', data_type: 'string' },
  ];
}

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in server environment' },
        { status: 500 },
      );
    }
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('settings')
      .select('key, value, is_active');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const settings = mapDbToSiteSettings((data || []) as DbSetting[]);
    return NextResponse.json({ settings });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in server environment' },
        { status: 500 },
      );
    }
    const supabase = supabaseAdmin();
    const rows = mapSiteSettingsToDb(body);
    const nowIso = new Date().toISOString();

    // Some databases may not have a UNIQUE constraint on `key`, which makes
    // ON CONFLICT unusable. Perform an update-then-insert per row to be robust.
    for (const r of rows) {
      const { data: updated, error: updateError } = await supabase
        .from('settings')
        .update({
          value: r.value,
          category: r.category,
          data_type: r.data_type,
          is_active: true,
          updated_at: nowIso,
        })
        .eq('key', r.key)
        .select('key');

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      if (!updated || updated.length === 0) {
        const { error: insertError } = await supabase
          .from('settings')
          .insert({
            key: r.key,
            value: r.value,
            category: r.category,
            data_type: r.data_type,
            is_active: true,
            created_at: nowIso,
            updated_at: nowIso,
          });
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


