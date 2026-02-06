"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Settings2, 
  Save, 
  Zap, 
  Info,
  Lock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EntropyMeter } from '@/components/EntropyMeter';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { simpleEncrypt } from '@/lib/crypto-utils';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PasswordGenerator() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Vault Action States
  const [vaultLabel, setVaultLabel] = useState('');
  const [vaultUsername, setVaultUsername] = useState('');
  const [vaultPassword, setVaultPassword] = useState('');
  
  const { toast } = useToast();

  const generate = useCallback(async () => {
    setIsGenerating(true);
    let charset = '';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (options.excludeAmbiguous) {
      charset = charset.replace(/[Il1O0]/g, '');
    }

    if (!charset) {
      setPassword('');
      setVaultPassword('');
      setIsGenerating(false);
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    // Automatically update the vault password field with the generated one
    setVaultPassword(result);
    setIsGenerating(false);
  }, [length, options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to Clipboard",
      description: "Password has been copied to your clipboard safely.",
    });
  };

  const saveToVault = () => {
    if (!user || !vaultPassword || !vaultLabel || !firestore) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a name and a password to save.",
      });
      return;
    }
    
    const credentialsRef = collection(firestore, 'users', user.uid, 'vaults', 'default', 'credentials');
    
    const newCredential = {
      name: vaultLabel,
      username: vaultUsername || 'No Username',
      password: simpleEncrypt(vaultPassword, user.uid),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      vaultId: 'default'
    };
    
    addDocumentNonBlocking(credentialsRef, newCredential);
    
    // Clear the specific fields after saving
    setVaultLabel('');
    toast({ 
      title: "Saved to Vault", 
      description: `"${vaultLabel}" has been securely stored in your cloud vault.` 
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative bg-card border-none shadow-2xl">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input 
                value={password} 
                readOnly 
                className="h-14 text-xl font-mono text-center tracking-wider bg-secondary border-none" 
              />
              <div className="flex gap-1 shrink-0">
                <Button variant="secondary" size="icon" className="h-14 w-14" onClick={generate} disabled={isGenerating}>
                  <RefreshCw className={cn("h-5 w-5", isGenerating && "animate-spin")} />
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14" onClick={copyToClipboard}>
                  <Copy className="h-5 w-5" />
                </Button>
                <QRCodeDisplay data={password} />
              </div>
            </div>
            
            <div className="mt-6">
              <EntropyMeter password={password} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Generator Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Password Length: {length}</Label>
              </div>
              <Slider 
                value={[length]} 
                onValueChange={([v]) => setLength(v)} 
                min={8} 
                max={64} 
                step={1} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Uppercase Letters</Label>
                  <p className="text-[10px] text-muted-foreground">(A-Z)</p>
                </div>
                <Switch checked={options.uppercase} onCheckedChange={(v) => setOptions(prev => ({ ...prev, uppercase: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lowercase Letters</Label>
                  <p className="text-[10px] text-muted-foreground">(a-z)</p>
                </div>
                <Switch checked={options.lowercase} onCheckedChange={(v) => setOptions(prev => ({ ...prev, lowercase: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Numbers</Label>
                  <p className="text-[10px] text-muted-foreground">(0-9)</p>
                </div>
                <Switch checked={options.numbers} onCheckedChange={(v) => setOptions(prev => ({ ...prev, numbers: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Special Characters</Label>
                  <p className="text-[10px] text-muted-foreground">(!@#$...)</p>
                </div>
                <Switch checked={options.symbols} onCheckedChange={(v) => setOptions(prev => ({ ...prev, symbols: v }))} />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t">
              <Switch 
                id="ambiguous" 
                checked={options.excludeAmbiguous} 
                onCheckedChange={(v) => setOptions(prev => ({ ...prev, excludeAmbiguous: v }))} 
              />
              <Label htmlFor="ambiguous" className="text-xs cursor-pointer flex items-center gap-1">
                Exclude ambiguous characters
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-3 bg-card border-accent/20">
                    <div className="space-y-2 max-w-[200px]">
                      <p className="font-bold text-[10px] uppercase tracking-wider text-primary">Readability Boost</p>
                      <p className="text-[10px] leading-relaxed text-foreground">
                        Some characters look almost identical (e.g., lowercase 'l' and number '1'). 
                        Enabling this removes: <code className="bg-secondary px-1 rounded">I, l, 1, O, 0</code> to prevent typing errors.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border rounded-xl p-6 space-y-5 shadow-inner shadow-black/20">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Vault Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Entry Name</Label>
            <Input 
              placeholder="e.g., Gmail, Banking, Work" 
              value={vaultLabel} 
              onChange={(e) => setVaultLabel(e.target.value)}
              disabled={!user}
              className="bg-secondary/50 focus-visible:ring-primary/50"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Username / Email</Label>
              <Input 
                placeholder="Username" 
                value={vaultUsername} 
                onChange={(e) => setVaultUsername(e.target.value)}
                disabled={!user}
                className="bg-secondary/50 focus-visible:ring-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Password to Save</Label>
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="Password" 
                  value={vaultPassword} 
                  onChange={(e) => setVaultPassword(e.target.value)}
                  disabled={!user}
                  className="bg-secondary/50 pr-10 font-mono focus-visible:ring-primary/50"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <Button 
          disabled={!user || !vaultPassword || !vaultLabel} 
          className="w-full gap-2 h-12 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
          onClick={saveToVault}
        >
          <Save className="h-4 w-4" /> Save Entry to Vault
        </Button>
        
        {!user && (
          <p className="text-[10px] text-muted-foreground text-center animate-pulse">
            Sign in with Google to enable the secure cloud vault feature.
          </p>
        )}
      </div>
    </div>
  );
}
