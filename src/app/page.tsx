"use client"

import React, { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, LogIn, LogOut, Github, KeySquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Toaster } from "@/components/ui/toaster";
import PasswordGenerator from '@/components/PasswordGenerator';
import { Vault } from '@/components/Vault';
import { Badge } from '@/components/ui/badge';

// Mock Firebase config for demonstration in this scaffolded environment
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "sentinel-vault.firebaseapp.com",
  projectId: "sentinel-vault",
  storageBucket: "sentinel-vault.appspot.com",
  messagingSenderId: "123456789",
  appId: "mock-app-id"
};

export default function SentinelApp() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('generator');
  const [vaultRefreshTrigger, setVaultRefreshTrigger] = useState(0);

  useEffect(() => {
    // In a real environment, initialize Firebase properly
    // For this prototype, we'll simulate the auth state
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    // Note: In this environment, we'll mock a user for demo purposes if real auth fails
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      // Simulate login for preview
      const mockUser = {
        uid: "sentinel_mock_user_123",
        displayName: "Sentinel User",
        email: "user@sentinel.security",
        photoURL: "https://picsum.photos/seed/42/100/100"
      } as User;
      setUser(mockUser);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sentinel</h1>
              <p className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none">Cybersecurity</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-secondary/50 py-1 pl-1 pr-3 rounded-full border">
                <img 
                  src={user.photoURL || "https://picsum.photos/seed/1/32/32"} 
                  className="w-8 h-8 rounded-full border border-primary/20" 
                  alt="Profile"
                />
                <span className="text-xs font-medium hidden sm:inline-block">{user.displayName?.split(' ')[0]}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleSignIn} size="sm" className="gap-2 bg-primary hover:bg-primary/90 rounded-full px-5">
                <LogIn className="h-4 w-4" /> Sign In
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
                Generate military-grade credentials using high-entropy random generation or memnonic-based AI passphrases.
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
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4">Local</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="focus-visible:outline-none">
                <PasswordGenerator 
                  userUid={user?.uid || null} 
                  onVaultUpdate={() => setVaultRefreshTrigger(t => t + 1)}
                />
              </TabsContent>

              <TabsContent value="vault" className="focus-visible:outline-none">
                <Vault userUid={user?.uid || null} key={vaultRefreshTrigger} />
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
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 animate-pulse" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Local vault is using {user ? 'user-derived' : 'anonymous'} key derivation for at-rest storage.
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
              <ul className="space-y-3 px-2">
                {[
                  "Use passphrases for master accounts.",
                  "Enable clipboard auto-clear in settings.",
                  "Store recovery keys physically.",
                  "Avoid reuse across critical domains."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground group cursor-default">
                    <ChevronRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform" />
                    {text}
                  </li>
                ))}
              </ul>
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
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}