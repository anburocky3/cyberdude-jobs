## CyberDude Jobs

[![Stars](https://img.shields.io/github/stars/anburocky3/cyberdude-jobs)](https://github.com/anburocky3/cyberdude-jobs)
[![Forks](https://img.shields.io/github/forks/anburocky3/cyberdude-jobs)](https://github.com/anburocky3/cyberdude-jobs)
[![GitHub license](https://img.shields.io/github/license/anburocky3/cyberdude-jobs)](https://github.com/anburocky3/cyberdude-jobs)
![Anbuselvan Rocky Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fanburocky3%2Fcyberdude-jobs)
[![Support Server](https://img.shields.io/discord/742347296091537448.svg?label=Discord&logo=Discord&colorB=7289da)](https://discord.gg/6ktMR65YMy)
[![Cyberdude youtube](https://img.shields.io/youtube/channel/subscribers/UCteUj8bL1ppZcS70UCWrVfw?style=social)](https://www.youtube.com/c/cyberdudenetworks) ![Vercel Deploy](https://deploy-badge.vercel.app/vercel/cyberdude-jobs?style=plastic&name=Live%3A)

A simple place to discover open roles at CyberDude Networks and apply in a few easy steps.

### What you can do

- **Browse roles**: Full‑time jobs and internships with clear descriptions and perks.
- **Read details**: Responsibilities, qualifications, and what you’ll get from the role.
- **Apply online**: Complete a short 3‑step form and submit your application.
- **Share with friends**: Quick buttons for WhatsApp, LinkedIn, Facebook, X, or copy the link.

### Screenshot

![CyberDude Jobs](/public/cyberdude-jobs-banner.png)
![CyberDude Jobs homepage](/screenshots/1.png)
![CyberDude Jobs detail](/screenshots/2.png)

### Admin Accounts (Local-only)

To create local admin users without committing credentials, use one of these approaches:

1. admin.local.example.ts → admin.ts (recommended)

- Copy `src/data/admin.local.example.ts` to `src/data/admin.ts` (this file is gitignored).
- Add your local admins:
  - `email` (required), `password` (required, plaintext), `name` (optional), `isActive` (optional).
- Run seeding:

```bash
npm run db:seed
npm run db:seed:admins
node scripts/generate-icons.mjs # to generate PWA icons
```

Notes

- Passwords in `src/data/admin.ts` are hashed during seeding.
- `src/data/admin.ts` is ignored by Git (see `.gitignore`).

### How to use (for applicants)

1. Open the site and pick a role that interests you.
2. Read the overview and make sure you meet the eligibility.
3. Click Apply and complete the Basic, Skills, and Motivation steps.
4. Upload your resume and submit. You’ll see a success message when it’s done.

### Notes

- Some roles have an application deadline. Apply before the date shown.
- Internship postings highlight learning benefits and mentorship.
- You can share any job directly from the job page.

### Contributing

Have a suggestion or spot an issue? Open a discussion or pull request.

### Author

- Anbuselvan Annamalai — https://anbuselvan-annamalai.com
- CyberDude Networks Pvt. Ltd. — https://cyberdudenetworks.com

### License

This project is licensed under the [MIT License](LICENSE).
