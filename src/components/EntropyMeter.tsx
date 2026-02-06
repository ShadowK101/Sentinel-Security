"use client"

import React from 'react';
import { calculateEntropy, getStrengthLabel } from '@/lib/crypto-utils';
import { cn } from '@/lib/utils';

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
      <div className="text-[10px] text-muted-foreground text-right">
        {entropy} bits of entropy
      </div>
    </div>
  );
}