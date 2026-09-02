"use client";

import { CircleCheck, X } from "lucide-react";

export default function SuccessDialog({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-green-deep/50" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-md card-surface islamic-pattern-light p-8 text-center">
        <button className="absolute top-3 right-3 p-2" aria-label="Close dialog" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        <CircleCheck className="w-16 h-16 text-gold mx-auto animate-check" />
        <h2 className="mt-4 text-2xl font-bold text-green-deep">{title}</h2>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  );
}
