"use client"

import React, { useState } from 'react';
import { Shield, Lock, LogOut, KeySquare, ShieldCheck } from 'lucide-react';
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
  const [activeTab, setActiveTab] = useState('generator');

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sentinel</h1>
              <p className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none">Password Generator</p>
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
              <Button onClick={handleSignIn} size="sm" className="gap-2 bg-primary hover:bg-primary/90 rounded-full px-5 transition-all active:scale-95">
                <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff"/>
                </svg>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
          
          {/* Main Workspace */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Security Console</h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Generate military-grade credentials using high-entropy random generation and store them in your secure cloud vault.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          {/* Sidebar Info */}
          <aside className="space-y-6 hidden lg:block">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Live Security Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 animate-pulse" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Encryption engine is active. Entropy source verified via browser <code className="text-[10px] bg-secondary px-1 rounded">crypto.getRandomValues()</code>.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 animate-pulse ${user ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Vault is using {user ? 'secure Firestore' : 'local anonymous'} storage for at-rest data.
                  </p>
                </div>
                <div className="pt-4 border-t border-primary/10">
                   <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-tighter mb-2">
                     <span>System Status</span>
                     <span className="text-emerald-500">Nominal</span>
                   </div>
                   <div className="h-1 w-full bg-secondary rounded-full">
                     <div className="h-full w-4/5 bg-emerald-500/50 rounded-full" />
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
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <Lock className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">Sentinel v2.4</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sentinel Security. All cryptographic operations performed locally.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
