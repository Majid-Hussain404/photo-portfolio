# Frames by Majid

A photography portfolio built with Next.js.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Owner sign-in

The `/login` page uses Supabase email/password authentication. Only the email
configured as `site.email` in `lib/site.ts` is authorized to access `/admin`.
Visitors cannot sign up. The first owner account can be initialized from
`/login` using a private setup code and receives an invitation at the configured
owner email.

1. Create a Supabase project and enable the Email provider.
2. In Supabase Authentication settings, turn off public sign-ups.
3. Copy `.env.example` to `.env.local`, then set
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the
   Supabase project API settings. Set `SUPABASE_SERVICE_ROLE_KEY` from the
   project API settings and make a long, random `OWNER_SETUP_CODE`. The
   service-role key and setup code are server-only secrets: never prefix them
   with `NEXT_PUBLIC_`, expose them in the browser, or commit `.env.local`.
4. Add `http://localhost:3000/auth/callback` to the Supabase redirect URL
   allowlist. Add the production callback URL after deployment.
5. Restart the dev server after changing environment variables.

6. Open `/login`, choose “First time? Set up the owner account”, enter the
   email configured in `lib/site.ts` and the private setup code. The website
   sends an invitation only to that email. If Supabase says the account already
   exists, it sends a password setup/reset link instead. Follow the email link
   to set your password. After setup, remove `OWNER_SETUP_CODE` and
   `SUPABASE_SERVICE_ROLE_KEY` from the deployment environment and restart or
   redeploy; password login and reset do not need either secret.

For production password-reset email delivery, configure a trusted SMTP
provider in Supabase. The login form sends reset links to the owner email only.

Visitors can browse the public portfolio. The `/admin` dashboard requires a
valid Supabase session for the owner email. The existing photo-management
controls are still previews and do not persist uploads yet.

## Photo collections

Add photographs to their matching folders under `public/photos/`, then run:

```bash
npm run photos
```

The generated photo list is consumed by the public portfolio pages.
