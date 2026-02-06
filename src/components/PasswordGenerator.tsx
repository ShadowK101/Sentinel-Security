"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  Copy, 
  ShieldCheck, 
  Settings2, 
  Save, 
  Zap, 
  BookOpen, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EntropyMeter } from '@/components/EntropyMeter';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { simpleEncrypt } from '@/lib/crypto-utils';
import { generatePassphrase } from '@/ai/flows/passphrase-generation';

interface PasswordGeneratorProps {
  userUid: string | null;
  onVaultUpdate: () => void;
}

export default function PasswordGenerator({ userUid, onVaultUpdate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false
  });
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [isGenerating, setIsGenerating] = useState(false);
  const [vaultLabel, setVaultLabel] = useState('');
  const { toast } = useToast();

  const generate = useCallback(async () => {
    setIsGenerating(true);
    if (mode === 'password') {
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
    } else {
      try {
        const result = await generatePassphrase({ numWords: Math.floor(length / 4) || 3 });
        setPassword(result.passphrase);
      } catch (err) {
        toast({ 
          variant: "destructive", 
          title: "Generation Error", 
          description: "Failed to generate passphrase using AI." 
        });
      }
    }
    setIsGenerating(false);
  }, [length, options, mode, toast]);

  useEffect(() => {
    generate();
  }, []);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({ 
      title: "Copied to clipboard", 
      description: "Credential will be cleared in 30 seconds." 
    });
    
    // Auto-clear logic as per proposal
    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 30000);
  };

  const saveToVault = () => {
    if (!userUid || !password || !vaultLabel) return;
    
    const saved = localStorage.getItem(`sentinel_vault_${userUid}`);
    const entries = saved ? JSON.parse(saved) : [];
    
    const newEntry = {
      id: crypto.randomUUID(),
      label: vaultLabel,
      encryptedValue: simpleEncrypt(password, userUid),
      createdAt: Date.now()
    };
    
    localStorage.setItem(`sentinel_vault_${userUid}`, JSON.stringify([newEntry, ...entries]));
    setVaultLabel('');
    toast({ title: "Saved to Vault", description: "The credential has been securely stored locally." });
    onVaultUpdate();
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
                <Button variant="primary" size="icon" className="h-14 w-14" onClick={copyToClipboard}>
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
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Zap className="h-4 w-4" /> Random Password
              </TabsTrigger>
              <TabsTrigger value="passphrase" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> AI Passphrase
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-6">
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
                  Exclude ambiguous characters (I, l, 1, O, 0)
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="passphrase" className="space-y-6">
              <div className="bg-secondary/30 p-4 rounded-lg border border-primary/20">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Passphrases use multiple random words from a secure dictionary. They are often more secure against brute-force attacks while being significantly easier for humans to remember.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Word Count: {Math.floor(length / 4) || 3}</Label>
                <Slider 
                  value={[length]} 
                  onValueChange={([v]) => setLength(v)} 
                  min={12} 
                  max={40} 
                  step={4} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Vault Actions</h3>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
             <Input 
                placeholder="Entry label (e.g., Google Account)" 
                value={vaultLabel} 
                onChange={(e) => setVaultLabel(e.target.value)}
                disabled={!userUid}
             />
          </div>
          <Button 
            disabled={!userUid || !password || !vaultLabel} 
            className="gap-2"
            onClick={saveToVault}
          >
            <Save className="h-4 w-4" /> Save to Vault
          </Button>
        </div>
        {!userUid && (
          <p className="text-[10px] text-muted-foreground text-center">
            Sign in with Google to enable the secure local vault feature.
          </p>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}