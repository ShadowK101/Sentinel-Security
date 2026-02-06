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

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure your Firebase environment variables in `.env`.
4. Run the development server: `npm run dev`

## Security

Sentinel uses `crypto.getRandomValues()` for all cryptographic operations. Sensitive data is encrypted before being stored in the cloud vault.
