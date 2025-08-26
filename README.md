## Chore Scheduler

A simple web app to manage, organize, and schedule chores.

Built with TypeScript, React, and Next.js.

This app uses Postgres (Supabase provider) with the Drizzle ORM for database management. Authentication relies on NextAuth, which implements OAuth with Google's identity services. For email sending, `nodemailer` is used, connecting to Brevo for SMTP transactional email relays.

### Running locally

**Setup**

A few steps are needed to setup before the app can be started:
1. Setup a Postgres database
2. Setup a Google Cloud project and create a OAuth Client
3. Setup a SMTP relay server, either through an external provider or with your own self-hosted setup
4. Configure all the secrets in the environment variable
5. Install packages (`pnpm install`)
6. Push the schema to your database (`pnpm db-push`)

**Local Development**

After you've followed all those steps, you can now start the server for local development
```
pnpm dev
```

### Deployment

For a quick deployment, you can link the repo to Vercel to deploy your website using their services.

If you want to self-host the service, see the [Next.js guide on deployment](https://nextjs.org/docs/pages/getting-started/deploying).

