"use client"

import React, { useState } from 'react';
import { Shield, Key, Trash2, Eye, EyeOff, Lock, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { simpleDecrypt } from '@/lib/crypto-utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useCollection, deleteDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

export function Vault() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const credentialsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'vaults', 'default', 'credentials');
  }, [firestore, user?.uid]);

  const { data: entries, isLoading } = useCollection(credentialsQuery);

  const deleteEntry = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'vaults', 'default', 'credentials', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Entry deleted", description: "The credential has been removed from your vault." });
  };

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const filteredEntries = (entries || []).filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.username && e.username.toLowerCase().includes(search.toLowerCase()))
  );

  if (!user) {
    return (
      <Card className="border-dashed bg-card/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold mb-2">Vault is Locked</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Sign in with Google to enable your secure encrypted cloud vault and securely store generated passwords.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search credentials..." 
            className="pl-10 h-11 bg-secondary/30 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading && !entries ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 w-full bg-secondary/20 animate-pulse rounded-xl border border-border/50" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card/10 border-border/50">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-muted-foreground opacity-50" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Your vault is empty</h4>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
              {search ? "No results match your search." : "Generated passwords you save will appear here."}
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <Card key={entry.id} className="overflow-hidden border-accent/10 group bg-card/40 hover:bg-card/60 transition-colors">
              <div className="flex items-center p-5 gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-bold truncate text-white">{entry.name}</h4>
                    <Badge variant="secondary" className="text-[9px] uppercase font-black px-1.5 h-4 bg-primary/20 text-primary">Cloud</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground truncate opacity-70">
                      {entry.username}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      {revealedIds.has(entry.id) ? (
                        <span className="text-primary font-bold animate-in fade-in slide-in-from-left-1">
                          {simpleDecrypt(entry.password, user.uid)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground tracking-[0.3em] text-xs">••••••••••••••••</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => toggleReveal(entry.id)}>
                    {revealedIds.has(entry.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}