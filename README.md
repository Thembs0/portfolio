# Thembinkosi Ndlovu - Portfolio

A responsive, monochrome portfolio and lightweight admin workspace built with React, TypeScript, Vite, Supabase and Netlify.

## Features

- Public portfolio with services, skills, professional background and contact form.
- Project detail pages with cover image, gallery, technology tags, GitHub and live links.
- Private admin sign-in.
- Admin project creation, editing, draft/publish controls and screenshot uploads.
- Contact enquiry inbox with status tracking.
- Consultation request inbox with status tracking.
- Supabase Row Level Security policies and a public screenshot bucket.
- Netlify single-page application routing.

## Before launch

This repository is a working starter application, not a pre-configured live service. You must connect your own Supabase project, set the environment variables, create your administrator account, add your own project data and verify forms before publishing.

1. Install Node.js LTS and Git.
2. Create a Supabase project at https://supabase.com.
3. In Supabase → SQL Editor, run `supabase/schema.sql`.
4. In Supabase → Authentication → Users, create your administrator account using an email you control. Disable public sign-ups if you don't need them. Only you should have an account.
5. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon/publishable key.
6. Install and run locally:

   ```bash
   npm install
   npm run dev
   ```

7. Open the local URL Vite prints. Go to `/admin`, sign in, create projects, upload screenshots and publish them.
8. Add your preferred CV to `public/Thembinkosi-Ndlovu-CV.pdf`. Do not publish a CV containing private information you do not want public.
9. Review every public detail and replace/remove sample project entries in `src/lib/types.ts`. The starter projects are unpublished and are not claims of completed work.
10. Test contact and booking submissions, then confirm the records appear only in the authenticated admin panel.

## Deploy to GitHub and Netlify

1. Create an empty GitHub repository.
2. Commit and push this folder:

   ```bash
   git init
   git add .
   git commit -m "Build portfolio website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

3. In Netlify, choose **Add new site → Import an existing project**, connect GitHub and select the repository.
4. Set build command `npm run build` and publish directory `dist` (also configured in `netlify.toml`).
5. In Netlify site environment variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Trigger a new deploy after setting variables.
7. In Supabase Authentication URL Configuration, set the production Site URL to your Netlify URL and add the local and production URLs to Redirect URLs if needed.

## Security notes

- The Supabase anon key is intended for browser use; Row Level Security policies are essential.
- Never put the Supabase service-role key in `.env`, frontend code, GitHub, or Netlify's `VITE_*` variables.
- The schema policies permit any authenticated account to manage the admin tables. For a single-admin portfolio, keep account creation disabled after creating your own account and never share credentials. For a multi-admin production system, introduce an explicit admin-role table/policy before adding other users.
- Public forms are protected by database length checks, but production sites should also add server-side rate limiting, bot protection (for example, a CAPTCHA/Turnstile flow), and email notifications.
- The contact form stores messages in Supabase; it does not automatically send an email notification in this starter.
- Booking submissions are requests only. They are not confirmed appointments and there is no calendar integration.
- Public image URLs mean anyone with a URL can view published project images. Do not upload confidential screenshots, customer data or credentials.
- Consider image optimisation before uploading large screenshots.

## Updating your CV

The public CV link expects `public/Thembinkosi-Ndlovu-CV.pdf`. Use a version that is suitable for public distribution and remove any information you do not want indexed or shared.

## Tech stack

TypeScript · React · Vite · React Router · Supabase · Netlify · GitHub · Lucide icons
