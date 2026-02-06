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
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2">Vault is Locked</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sign in with Google to enable your secure encrypted cloud vault and securely store generated passwords.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search vault..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full bg-secondary/50 animate-pulse rounded-lg border border-border" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card/50">
            <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No entries found in your vault.</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <Card key={entry.id} className="overflow-hidden border-accent/20 group">
              <div className="flex items-center p-4 gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{entry.name}</h4>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">Cloud</Badge>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    {revealedIds.has(entry.id) ? (
                      <span className="text-foreground animate-in fade-in slide-in-from-left-1">
                        {simpleDecrypt(entry.password, user.uid)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground tracking-widest">••••••••••••••••</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => toggleReveal(entry.id)}>
                    {revealedIds.has(entry.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteEntry(entry.id)}>
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
