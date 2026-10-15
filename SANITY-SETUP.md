# Sanity setup (do these once)

1. `npm install`
2. Copy `.env.example` to `.env.local`. The project ID `1dwd2ifa` and dataset `production` are already filled in.
3. **CORS** (needed for the Studio to log in): sanity.io/manage > your project > API > CORS origins > Add origin.
   Add `http://localhost:3000` and your Vercel URL (later, your real domain). Tick "Allow credentials".
4. **Seed token**: same page > API > Tokens > Add API token > permission **Editor**. Paste it into `SANITY_API_WRITE_TOKEN` in `.env.local`.
5. `npm run seed` loads the demo products, categories, pages, FAQs and home content (and uploads the images). Safe to re-run, but it overwrites edits to the seeded items.
6. `npm run dev`, then open http://localhost:3000/studio and log in.
7. **Auto-refresh** (after deploying): manage > API > Webhooks > Create webhook.
   URL `https://YOUR-SITE/api/revalidate`, dataset `production`, trigger on Create, Update and Delete,
   secret = the same value as `SANITY_REVALIDATE_SECRET`. Without it the site still refreshes, but only about once an hour.
8. **Vercel**: add these environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET`.
   Do not add the write token to Vercel.
9. **Client access**: manage > Members > Invite. The Editor role is right for him.
