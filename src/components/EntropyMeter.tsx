
"use client"

import React from 'react';
import { calculateEntropy, getStrengthLabel } from '@/lib/crypto-utils';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EntropyMeterProps {
  password: string;
}

export function EntropyMeter({ password }: EntropyMeterProps) {
  const entropy = calculateEntropy(password);
  const { label, color, text } = getStrengthLabel(entropy);
  
  // Normalize entropy to a percentage (128 bits is considered highly secure)
  const percentage = Math.min(100, (entropy / 128) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider">
        <span className="text-muted-foreground">Strength Assessment</span>
        <span className={cn("transition-colors duration-500", text)}>{label}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full entropy-meter-transition", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>{entropy} bits of entropy</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 text-primary cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="p-3 bg-card border-accent/20">
            <div className="space-y-2 max-w-[220px]">
              <p className="font-bold text-[10px] uppercase tracking-wider text-primary">Cryptographic Entropy</p>
              <p className="text-[10px] leading-relaxed text-foreground">
                Entropy measures the unpredictability of a password. 
                Higher bit counts mean more possible combinations, making it exponentially harder for attackers to guess or brute-force your credentials.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
