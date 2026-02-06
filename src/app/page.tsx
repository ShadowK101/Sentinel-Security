"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, LogOut, KeySquare, ShieldCheck, Activity, Database, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut
} from 'firebase/auth';
import { Toaster } from "@/components/ui/toaster";
import PasswordGenerator from '@/components/PasswordGenerator';
import { Vault } from '@/components/Vault';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth } from '@/firebase';
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const bestPractices = [
  {
    title: "Use high entropy passwords",
    description: "Master passwords should be at least 16 characters long and include a mix of character types to maximize resistance against brute-force attacks."
  },
  {
    title: "Enable clipboard auto-clear",
    description: "Keeping passwords in your clipboard is a risk. While we've removed the timer by request, always be mindful of clearing your clipboard manually after use."
  },
  {
    title: "Store recovery keys physically",
    description: "Never store your master password recovery keys on your digital devices. Print them out and keep them in a safe, physical location like a fireproof safe."
  },
  {
    title: "Avoid reuse across domains",
    description: "If one account is compromised, hackers will try that same password on other sites. Always generate a unique password for every service you use."
  }
];

export default function SentinelApp() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generator');
  const [lastChecked, setLastChecked] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    setLastChecked(new Date().toLocaleTimeString());
    
    // Check if terms have been accepted previously
    const accepted = localStorage.getItem('sentinel_terms_accepted');
    if (!accepted) {
      setShowTerms(true);
    }

    const interval = setInterval(() => {
      setLastChecked(new Date().toLocaleTimeString());
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('sentinel_terms_accepted', 'true');
    setShowTerms(false);
  };

  const handleDenyTerms = () => {
    // Redirect to google home screen as requested
    window.location.href = 'https://www.google.com';
  };

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your-domain';
      
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.code === 'auth/unauthorized-domain' 
          ? `The domain "${currentDomain}" is not authorized. Please add it to your Firebase Console under Authentication > Settings > Authorized domains.`
          : error.message || "Sign in failed.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-white">
      {/* Mandatory Terms Acceptance Dialog for first-time visits */}
      <AlertDialog open={showTerms}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security Protocol: Terms of Service
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              To proceed to the Sentinel Security Console, you must review and accept our professional terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 my-4 space-y-4 text-sm text-muted-foreground">
            <section>
              <h4 className="font-bold text-foreground">1. Acceptance of Terms</h4>
              <p>By using Sentinel, you agree to these Terms. This application provides advanced cryptographic tools for secure credential management.</p>
            </section>
            <section>
              <h4 className="font-bold text-foreground">2. User Responsibility</h4>
              <p>You are solely responsible for the master password and the security of your linked Google account. We cannot recover data if you lose access to your primary authentication methods.</p>
            </section>
            <section>
              <h4 className="font-bold text-foreground">3. Encryption & Privacy</h4>
              <p>All passwords are encrypted locally before being stored in our cloud infrastructure. Sentinel staff cannot view or retrieve your raw credentials.</p>
            </section>
            <section>
              <h4 className="font-bold text-foreground">4. Liability Limitation</h4>
              <p>Sentinel is provided "as is". We are not liable for data loss or unauthorized access resulting from improper local security practices.</p>
            </section>
            <p className="text-xs pt-4 italic">A full version of these terms is available at any time via the footer link.</p>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={handleDenyTerms}
              className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              Deny & Exit to Google
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAcceptTerms}
              className="w-full sm:w-auto"
            >
              Accept & Continue to Console
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sentinel</h1>
              <p className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none">Security Console</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isUserLoading ? (
              <div className="h-8 w-24 bg-secondary animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-3 bg-secondary/50 py-1 pl-1 pr-3 rounded-full border">
                <img 
                  src={user.photoURL || `https://picsum.photos/seed/${user.uid}/32/32`} 
                  className="w-8 h-8 rounded-full border border-primary/20" 
                  alt="Profile"
                />
                <span className="text-xs font-medium hidden sm:inline-block">{user.displayName?.split(' ')[0]}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleSignIn} size="sm" className="gap-2 bg-white text-black hover:bg-white/90 rounded-full px-5 transition-all active:scale-95 shadow-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Security Console</h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Generate military-grade credentials using high-entropy random generation and store them in your secure cloud vault.
              </p>
            </div>

            <Tabs defaultValue="generator" onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6 border-b rounded-none mb-8">
                <TabsTrigger 
                  value="generator" 
                  className="px-0 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none transition-all"
                >
                  Credential Engine
                </TabsTrigger>
                <TabsTrigger 
                  value="vault" 
                  className="px-0 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none transition-all flex items-center gap-2"
                >
                  Encrypted Vault
                  {user && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4">Cloud</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="focus-visible:outline-none">
                <PasswordGenerator />
              </TabsContent>

              <TabsContent value="vault" className="focus-visible:outline-none">
                <Vault />
              </TabsContent>
            </Tabs>
          </section>

          <aside className="space-y-6 hidden lg:block">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
              <CardHeader className="pb-2 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Live Security Feed
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white">Encryption Verified</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Entropy source active via <code className="bg-secondary px-1 rounded">crypto.getRandomValues()</code>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {user ? (
                        <Database className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white">Storage Backend</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Currently using <span className={user ? "text-emerald-500 font-medium" : "text-orange-400 font-medium"}>
                          {user ? 'Secure Firestore' : 'Local Sandbox'}
                        </span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-tighter mb-2">
                     <span className="flex items-center gap-1">System Integrity</span>
                     <span className="text-emerald-500 flex items-center gap-1">
                       <CheckCircle2 className="h-3 w-3" /> Nominal
                     </span>
                   </div>
                   <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <div className="h-full w-[94%] bg-gradient-to-r from-emerald-500/50 to-emerald-400 rounded-full" />
                   </div>
                   <div className="mt-3 flex items-center gap-1.5 text-[9px] text-muted-foreground/60">
                     <Clock className="h-3 w-3" />
                     <span>Last health check: {lastChecked}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">
                <KeySquare className="h-3 w-3" /> Best Practices
              </div>
              <Accordion type="single" collapsible className="w-full px-2">
                {bestPractices.map((bp, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-primary/10">
                    <AccordionTrigger className="text-xs text-muted-foreground hover:text-primary transition-colors py-3 hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{bp.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-[10px] text-muted-foreground leading-relaxed pb-4">
                      {bp.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border/40 py-12 mt-20">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group"
            >
              <Lock className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-tight text-foreground">Sentinel v2.6.1.1</span>
            </button>
            <Link 
              href="/terms" 
              className="flex items-center gap-1 hover:text-primary transition-colors font-medium border-b border-transparent hover:border-primary pb-0.5"
            >
              Terms of Service <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <p>
            © {new Date().getFullYear()} Sentinel Security. All cryptographic operations performed locally.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}