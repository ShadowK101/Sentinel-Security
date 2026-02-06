# Sentinel | Professional Password Manager

Sentinel is a military-grade password generation and secure vault application built with Next.js 15, Firebase, and GenAI.

## Features

- **Credential Engine**: High-entropy password generation with customizable parameters.
- **Encrypted Cloud Vault**: Secure storage for your credentials using Firebase Firestore.
- **Authentication**: Professional Google Sign-In integration.
- **Real-time Security Feed**: Live monitoring of encryption status and system integrity.
- **QR Code Sharing**: Securely transfer credentials to mobile devices via generated QR codes.
- **Passphrase Generation**: AI-powered word-sequence generation for memorable but secure access.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Shadcn/UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Provider)
- **AI**: Genkit with Google Gemini
- **Icons**: Lucide React

## Deployment (Vercel)

If you are deploying to Vercel via GitHub:
1. Ensure you have exported/downloaded the latest code from this Studio.
2. Commit and push the changes to your `main` branch.
3. In Vercel, ensure your **Build Command** is `npm run build`.
4. Add your Firebase environment variables to Vercel's **Environment Variables** settings.
5. **CRITICAL**: Add your Vercel deployment URL (e.g., `sentinel-security.vercel.app`) to your Firebase Console under **Authentication > Settings > Authorized domains**.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure your Firebase environment variables in `.env`.
4. Run the development server: `npm run dev`

## Security

Sentinel uses `crypto.getRandomValues()` for all cryptographic operations. Sensitive data is encrypted before being stored in the cloud vault.
