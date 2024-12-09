"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface AddressProps {
  address: string;
  truncateLength?: number;
}

export default function Address({ address, truncateLength = 4 }: AddressProps) {
  const [isCopied, setIsCopied] = useState(false);

  const truncatedAddress = `${address.slice(
    0,
    truncateLength
  )}...${address.slice(-truncateLength)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      toast.success("Address successfully copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
      toast.error("Unable to copy the address. Please try again.");
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-secondary px-2 py-1 rounded-md">
      <span className="font-mono text-sm">{truncatedAddress}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="h-8 w-8"
        aria-label="Copy address"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
