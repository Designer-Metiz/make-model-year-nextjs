-- Add seo_schema column to blog_posts for storing JSON-LD or other schema markup
-- Uses TEXT to allow multiple blocks; client should store valid JSON-LD strings

alter table if exists public.blog_posts
add column if not exists seo_schema text;

-- Optional: backfill example FAQ JSON-LD for testing on the most recent post
-- NOTE: Remove or customize in production as needed
with latest as (
  select id from public.blog_posts order by created_at desc limit 1
)
update public.blog_posts p
set seo_schema = $$
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is the main purpose of a store locator app?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "To help customers quickly find nearby outlets with accurate directions and details, improving convenience and driving more store visits."
    }
  },{
    "@type": "Question",
    "name": "How does the Shopify store locator plugin help?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "It allows businesses to display all store locations on one map, making it easy for shoppers to find the closest branch."
    }
  }]
}
$$
from latest
where p.id = latest.id;


