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
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  data: string;
}

export function QRCodeDisplay({ data }: QRCodeDisplayProps) {
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
          <div className="bg-white p-6 rounded-xl shadow-inner">
             {data ? (
               <QRCodeSVG 
                 value={data} 
                 size={200}
                 level="H"
                 includeMargin={false}
               />
             ) : (
               <div className="w-[200px] h-[200px] bg-secondary animate-pulse rounded-md" />
             )}
          </div>
          <p className="text-sm text-center text-muted-foreground max-w-[250px]">
            Scan this code with a mobile camera to securely transfer this credential.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
