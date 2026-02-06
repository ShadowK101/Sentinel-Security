"use client"

import React, { useState, useEffect } from 'react';
import { Shield, Key, Trash2, Eye, EyeOff, Lock, Unlock, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { simpleEncrypt, simpleDecrypt } from '@/lib/crypto-utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VaultEntry {
  id: string;
  label: string;
  encryptedValue: string;
  createdAt: number;
}

interface VaultProps {
  userUid: string | null;
}

export function Vault({ userUid }: VaultProps) {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(`sentinel_vault_${userUid}`);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse vault entries");
      }
    }
  }, [userUid]);

  const saveVault = (newEntries: VaultEntry[]) => {
    localStorage.setItem(`sentinel_vault_${userUid}`, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    saveVault(entries.filter(e => e.id !== id));
    toast({ title: "Entry deleted", description: "The credential has been removed from your local vault." });
  };

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const filteredEntries = entries.filter(e => 
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!userUid) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2">Vault is Locked</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sign in with Google to enable your local encrypted vault and securely store generated passwords.
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
        {filteredEntries.length === 0 ? (
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
                    <h4 className="font-medium truncate">{entry.label}</h4>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">Local</Badge>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    {revealedIds.has(entry.id) ? (
                      <span className="text-foreground animate-in fade-in slide-in-from-left-1">
                        {simpleDecrypt(entry.encryptedValue, userUid)}
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