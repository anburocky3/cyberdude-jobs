## CyberDude Jobs

Modern job listings app with detailed job pages, LinkedIn login, and application flow.

### Features

- **Job listings**: Full-time and internship sections with skills, openings, posted date, application deadline, and eligibility.
- **Job details**: Overview, responsibilities, minimum/preferred qualifications, perks, skills, sidebar facts, and Apply/Expired logic.
- **Apply with LinkedIn**: NextAuth integration for sign-in and a protected `/api/apply` endpoint.
- **Share jobs**: Web Share API with WhatsApp, LinkedIn, Facebook, X, plus a Copy Link fallback (Instagram).
- **Central data**: Roles are defined in `src/data/jobs.ts` with fields like `postedDate`, `whoCanApply`, `applicationDeadline`, `openings`, etc.

### Tech Stack

- Next.js App Router, React 19
- NextAuth (LinkedIn provider)
- Tailwind CSS (utility classes)
- lucide-react icons

### Getting Started

1. Create `.env.local`

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-strong-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

2. Install and run

```
npm i
npm run dev
```

3. Open the app

- Visit `/` to browse roles; click a job to view details and apply.

### Important Routes

- `/` home and listings
- `/jobs/[slug]` job detail
- `/api/auth/*` NextAuth routes
- `/api/apply` protected apply endpoint (POST `{ jobId }`)

### Authentication Notes

- Server-side can read secrets via `process.env.*`.
- Client-side environment variables must be prefixed with `NEXT_PUBLIC_`.
- The session provider is mounted in `src/app/providers.tsx`.

### Troubleshooting

- 405 or JSON parse error on `/api/auth/session`:

  - Ensure `src/auth.ts` exports `GET` and `POST` from NextAuth and `src/app/api/auth/[...nextauth]/route.ts` re-exports them:
    - `src/auth.ts` should have: `export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({...})`
    - `src/app/api/auth/[...nextauth]/route.ts`: `export { GET, POST } from "@/auth";`
  - Verify `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`; restart the dev server.

- Hydration mismatch on share links:
  - `src/components/ShareJob.tsx` defers reading `window.location` until mount to avoid SSR/CSR differences.

### Author

- Anbuselvan Annamalai - https://anbuselvan-annamalai.com
- CyberDude Networks Pvt. Ltd. — https://cyberdudenetworks.com

### License

This project is licensed under the [MIT License](LICENSE). See `LICENSE` for details.
