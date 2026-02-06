export function calculateEntropy(password: string): number {
  if (!password) return 0;
  
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;

  return Math.floor(password.length * Math.log2(charsetSize));
}

export function getStrengthLabel(entropy: number) {
  if (entropy === 0) return { label: 'None', color: 'bg-muted', text: 'text-muted-foreground' };
  if (entropy < 40) return { label: 'Very Weak', color: 'bg-red-500', text: 'text-red-500' };
  if (entropy < 60) return { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500' };
  if (entropy < 80) return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
  return { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
}

// Simple XOR encryption for "local storage" simulation as per proposal
// In a real app, use Web Crypto API for AES-GCM
export function simpleEncrypt(text: string, key: string): string {
  const textChars = text.split('').map(c => c.charCodeAt(0));
  const keyChars = key.split('').map(c => c.charCodeAt(0));
  const encrypted = textChars.map((c, i) => c ^ keyChars[i % keyChars.length]);
  return btoa(String.fromCharCode(...encrypted));
}

export function simpleDecrypt(encoded: string, key: string): string {
  const decoded = atob(encoded).split('').map(c => c.charCodeAt(0));
  const keyChars = key.split('').map(c => c.charCodeAt(0));
  const decrypted = decoded.map((c, i) => c ^ keyChars[i % keyChars.length]);
  return String.fromCharCode(...decrypted);
}