# FlipEarn

FlipEarn is a full-stack marketplace for buying and selling social media accounts. It includes a buyer-seller chat flow, admin review tooling, and payment-backed transactions with automated credential delivery.

## Highlights

- Marketplace for social profiles with listings, filters, and featured slots
- Buyer-seller chat and order history
- Credential submission, verification, and post-sale updates
- Stripe Checkout for purchases and payouts tracking
- Admin dashboard for listings, credentials, transactions, and withdrawals

## Tech Stack

**Frontend**

- React 19, Vite 7
- React Router, Redux Toolkit
- Tailwind CSS 4
- Clerk auth, Axios, React Hot Toast, Lucide

**Backend**

- Node.js, Express 5
- Prisma ORM with PostgreSQL (Neon serverless adapter)
- Inngest for background events
- Stripe payments, ImageKit uploads, Multer
- Nodemailer (Brevo SMTP), CORS

## Monorepo Structure

- `client/` React + Vite application
- `server/` Express API, Prisma schema, and background jobs

## Environment Variables

**Client**

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_BASEURL` (API base URL)

**Server**

- `DATABASE_URL`
- `DIRECT_URL`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SMTP_USER`
- `SMTP_PASS`
- `SENDER_EMAIL`
- `ADMIN_EMAILS` (comma-separated admin emails)

Note: Clerk requires its own server-side keys for auth; configure those per Clerk docs.

## Getting Started

1. Install dependencies
   - `cd client; npm install`
   - `cd ../server; npm install`
2. Configure environment variables for both apps.
3. Start the apps in separate terminals:
   - `cd client; npm run dev`
   - `cd server; npm run server`

## Screenshots / Demo

- Marketplace
  <img width="1622" height="1082" alt="marketplace" src="https://github.com/user-attachments/assets/07d8035f-20e7-4434-ab97-194db30b7c1d" />

- Messages
  <img width="826" height="745" alt="message" src="https://github.com/user-attachments/assets/8b868731-f923-4f1a-a70a-6509948a15de" />

- My Listings
  <img width="1600" height="856" alt="mylistings" src="https://github.com/user-attachments/assets/01171a0f-1f8b-47d8-b83a-5cc489ee908e" />

- Orders
  <img width="1661" height="297" alt="orders" src="https://github.com/user-attachments/assets/91b4cdb4-36cb-4190-8d49-e89b629d6661" />

- Pricing
  <img width="947" height="748" alt="pricing" src="https://github.com/user-attachments/assets/20061af9-b404-455e-ba6a-bfc566df64f7" />


## Production Setup

- Hosting: deploy `client/` and `server/` separately (Vercel configs included)
- Set all environment variables in the hosting provider
- Stripe webhook: point to `POST /api/stripe` and use the same `STRIPE_WEBHOOK_SECRET` as in the server environment
- Ensure CORS and Clerk settings match your production domains

## Deployment

Both `client/` and `server/` include `vercel.json` for Vercel hosting. Update environment variables in the Vercel dashboard.
