# Setup checklist

## 1. Supabase backend
- [ ] Create a Supabase project.
- [ ] Run `supabase/schema.sql` in SQL Editor.
- [ ] Create your admin user in Authentication → Users.
- [ ] Disable public signups in Authentication settings.
- [ ] Copy Project URL and anon/publishable key.

## 2. Local app
- [ ] Copy `.env.example` to `.env.local`.
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [ ] Run `npm install`, then `npm run dev`.
- [ ] Visit `/admin` and sign in.
- [ ] Add projects and screenshots; leave projects unpublished until reviewed.
- [ ] Add your chosen CV as `public/Thembinkosi-Ndlovu-CV.pdf`.
- [ ] Test a contact enquiry and booking request, then inspect both in Admin.

## 3. Content and launch
- [ ] Replace starter project data in `src/lib/types.ts` with verified content or remove it.
- [ ] Confirm all repository/live URLs are correct and public.
- [ ] Remove any confidential, client-owned or personally identifying screenshots.
- [ ] Review mobile layout, keyboard navigation and contrast.
- [ ] Push the project to GitHub.
- [ ] Import the repository into Netlify and add the two environment variables.
- [ ] Set the production URL in Supabase Auth settings.
- [ ] Submit a final test message and booking request on the deployed site.

## Important
Forms save to Supabase only after the backend is configured. This starter does not send email alerts, provide calendar sync, or automatically confirm meetings. Add a notification function and rate limiting before relying on the site for time-sensitive enquiries.
