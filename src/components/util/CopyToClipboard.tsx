"use client";
import { Check, Copy } from "lucide-react";
import React, { useState, useRef } from "react";
import { cn } from "~/lib/utils";

export default function CopyToClipboard({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  const [showButton, setShowButton] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => setShowButton(true);
  const handleMouseLeave = () => setShowButton(false);

  const copyToClipboard = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <div
      className="inline-flex gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span className="w-4 h-4 relative top-[1px] hidden lg:block">
        <button
          ref={buttonRef}
          onClick={() => !isCopied && copyToClipboard()}
          className={cn(
            "cursor-pointer transition-all duration-300 ease-in-out",
            showButton ? "opacity-100" : "opacity-0",
          )}
          title={isCopied ? "Copied!" : "Copy to clipboard"}
        >
          {showButton && isCopied ? (
            <Check className="text-green-600 w-3" />
          ) : (
            <Copy className="text-slate-500 w-3" />
          )}
        </button>
      </span>
    </div>
  );
}
