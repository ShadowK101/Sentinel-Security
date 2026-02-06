import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="container max-w-3xl mx-auto space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: January 2026</p>
        </div>

        <div className="space-y-8 bg-card/50 border border-border/40 p-8 rounded-2xl backdrop-blur-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using Sentinel (the "Service"), you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Sentinel Security. If you do not agree to these terms, you must not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">2. Security Responsibility</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sentinel provides cryptographic tools for password generation and storage. The security of your data depends significantly on your own practices, including the strength of your master credentials and the security of your linked Google account. You are solely responsible for maintaining the confidentiality of your credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">3. Data Privacy & Encryption</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We take your privacy seriously. All sensitive data is encrypted locally before storage. Sentinel staff do not have access to your raw passwords. Your data is stored securely using industry-standard protocols via Firebase Firestore. We do not sell or share your personal data with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">4. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sentinel is provided "as is" without any warranties, express or implied. We are not responsible for any loss of data, unauthorized access, or security breaches resulting from the use or misuse of this software. We do not guarantee 100% uptime.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">5. Compliance & Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users are responsible for ensuring their use of Sentinel complies with all local and international laws regarding cryptography and data management. You agree not to use the Service for any illegal or unauthorized purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-primary">6. Updates to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update these terms from time to time. Your continued use of the application after such changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>

        <div className="flex justify-center pt-8">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Console
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}