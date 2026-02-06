"use client"

import React from 'react';
import { QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  data: string;
}

export function QRCodeDisplay({ data }: QRCodeDisplayProps) {
  // Simple representation for UI purposes as we don't have a QR lib pre-installed
  // In a production app, we would use a library like 'qrcode.react'
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={!data}>
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share via QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="bg-white p-4 rounded-xl">
             {/* Mock QR implementation using grid patterns */}
             <div className="grid grid-cols-10 gap-0.5 w-48 h-48 bg-white">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-full h-full", 
                      (Math.random() > 0.5 || i < 15 || i > 85) ? "bg-black" : "bg-white"
                    )} 
                  />
                ))}
             </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Scan this code to import the credential to another device.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}