import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917600558179';

// Formats the raw number (e.g. 917600558179) as +91 76005 58179 for display
export function formatPhoneDisplay(raw: string = WHATSAPP_NUMBER): string {
  const digits = raw.replace(/\D/g, '');
  // Handle with country code 91 prefix (12 digits) or without (10 digits)
  const local = digits.length === 12 ? digits.slice(2) : digits.slice(-10);
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}
